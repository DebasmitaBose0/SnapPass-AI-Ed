import SecurityAudit from '../models/securityAudit.model.js';

class AnomalyDetectorService {
  constructor() {
    // Sliding window access logs: Map<key, Array<{ timestamp, ip, shareId, success, userAgent }>>
    this.shareAccessLogs = new Map(); // key: shareId
    this.ipAccessLogs = new Map();    // key: ip

    // Blocked lists
    this.blockedIps = new Map();    // ip -> { blockedUntil, reason, blockedAt }
    this.lockedShares = new Map();  // shareId -> { lockedUntil, reason, lockedAt }

    // Alert history buffer (max 100 items)
    this.anomalyAlerts = [];
  }

  /**
   * Check if an IP address is currently blocked.
   */
  isIpBlocked(ip) {
    if (!ip) return false;
    const block = this.blockedIps.get(ip);
    if (!block) return false;
    if (Date.now() > block.blockedUntil) {
      this.blockedIps.delete(ip);
      return false;
    }
    return true;
  }

  /**
   * Check if a share link is currently locked out due to suspicious access.
   */
  isShareLocked(shareId) {
    if (!shareId) return false;
    const lock = this.lockedShares.get(shareId);
    if (!lock) return false;
    if (Date.now() > lock.lockedUntil) {
      this.lockedShares.delete(shareId);
      return false;
    }
    return true;
  }

  /**
   * Block an IP address for a specific duration (default 15 minutes).
   */
  blockIp(ip, durationMs = 15 * 60 * 1000, reason = 'Automated suspicious access pattern') {
    const blockedUntil = Date.now() + durationMs;
    this.blockedIps.set(ip, { blockedUntil, reason, blockedAt: Date.now() });

    this.addAlert({
      type: 'IP_BLOCKED',
      target: ip,
      reason,
      severity: 'CRITICAL',
      timestamp: Date.now(),
    });

    SecurityAudit.create({
      action: 'ANOMALY_IP_BLOCKED',
      email: 'security-system',
      ip,
      status: 'FAILURE',
      severity: 'CRITICAL',
      details: `IP ${ip} blocked for ${Math.round(durationMs / 60000)}m: ${reason}`,
    }).catch(() => {});
  }

  /**
   * Lock a share link for a specific duration (default 10 minutes).
   */
  lockShare(shareId, durationMs = 10 * 60 * 1000, reason = 'Brute-force / suspicious access pattern') {
    const lockedUntil = Date.now() + durationMs;
    this.lockedShares.set(shareId, { lockedUntil, reason, lockedAt: Date.now() });

    this.addAlert({
      type: 'SHARE_LOCKED',
      target: shareId,
      reason,
      severity: 'WARNING',
      timestamp: Date.now(),
    });

    SecurityAudit.create({
      action: 'ANOMALY_SHARE_LOCKED',
      email: 'security-system',
      ip: 'system',
      status: 'FAILURE',
      severity: 'WARNING',
      details: `Share link ${shareId} locked for ${Math.round(durationMs / 60000)}m: ${reason}`,
    }).catch(() => {});
  }

  /**
   * Add a security alert entry to memory buffer.
   */
  addAlert(alert) {
    this.anomalyAlerts.unshift(alert);
    if (this.anomalyAlerts.length > 100) {
      this.anomalyAlerts.pop();
    }
  }

  /**
   * Evaluate request frequency and inter-request intervals for bot/script detection.
   */
  evaluateBotScriptFrequency(ipLogs) {
    if (ipLogs.length < 5) return { isBot: false, meanDeltaMs: 0 };
    const windowLogs = ipLogs.filter((l) => Date.now() - l.timestamp < 60000); // last 1 min
    if (windowLogs.length < 5) return { isBot: false, meanDeltaMs: 0 };

    let totalDelta = 0;
    for (let i = 1; i < windowLogs.length; i++) {
      totalDelta += windowLogs[i - 1].timestamp - windowLogs[i].timestamp;
    }
    const meanDeltaMs = totalDelta / (windowLogs.length - 1);

    // If rapid automated requests with mean interval under 250ms
    if (windowLogs.length >= 8 && meanDeltaMs < 250) {
      return { isBot: true, meanDeltaMs, requestCount: windowLogs.length };
    }
    return { isBot: false, meanDeltaMs, requestCount: windowLogs.length };
  }

  /**
   * Record access attempt and evaluate anomaly rules.
   */
  recordAccessAttempt({ shareId, ip, userAgent = '', success = true, passwordAttempted = false }) {
    const now = Date.now();

    // 1. Check existing block / lockout status
    if (this.isIpBlocked(ip)) {
      const block = this.blockedIps.get(ip);
      return {
        allowed: false,
        reason: block?.reason || 'IP address is temporarily blocked due to security violations.',
        isBlocked: true,
      };
    }

    if (shareId && this.isShareLocked(shareId)) {
      const lock = this.lockedShares.get(shareId);
      return {
        allowed: false,
        reason: lock?.reason || 'Share link is temporarily locked due to repeated failed attempts.',
        isLocked: true,
      };
    }

    // 2. Log access record into sliding window
    const entry = { timestamp: now, ip, shareId, success, userAgent, passwordAttempted };

    if (shareId) {
      if (!this.shareAccessLogs.has(shareId)) this.shareAccessLogs.set(shareId, []);
      const logs = this.shareAccessLogs.get(shareId).filter((l) => now - l.timestamp < 10 * 60 * 1000); // 10m window
      logs.unshift(entry);
      this.shareAccessLogs.set(shareId, logs);
    }

    if (ip) {
      if (!this.ipAccessLogs.has(ip)) this.ipAccessLogs.set(ip, []);
      const ipLogs = this.ipAccessLogs.get(ip).filter((l) => now - l.timestamp < 10 * 60 * 1000); // 10m window
      ipLogs.unshift(entry);
      this.ipAccessLogs.set(ip, ipLogs);
    }

    // 3. Rule Evaluation: Failed Password Attempts Surge (> 5 failures on share in 5 mins)
    if (shareId) {
      const shareLogs = this.shareAccessLogs.get(shareId) || [];
      const recentFailures = shareLogs.filter((l) => !l.success && now - l.timestamp < 5 * 60 * 1000);
      if (recentFailures.length >= 5) {
        this.lockShare(shareId, 10 * 60 * 1000, `Detected ${recentFailures.length} failed password attempts in 5 minutes.`);
        return {
          allowed: false,
          reason: 'Share link temporarily locked due to multiple failed password attempts.',
          isLocked: true,
          anomalyScore: 90,
        };
      }

      // Rule: Rapid Multi-IP Burst (> 3 distinct IPs accessing same share link in 2 mins)
      const recentMultiIp = shareLogs.filter((l) => now - l.timestamp < 2 * 60 * 1000);
      const uniqueIps = new Set(recentMultiIp.map((l) => l.ip));
      if (uniqueIps.size >= 4) {
        this.addAlert({
          type: 'MULTI_IP_BURST',
          target: shareId,
          reason: `Access attempt burst from ${uniqueIps.size} distinct IPs`,
          severity: 'WARNING',
          timestamp: now,
        });
      }
    }

    // 4. Rule Evaluation: Bot / Script Sub-second frequency (> 8 requests with delta < 250ms)
    if (ip) {
      const ipLogs = this.ipAccessLogs.get(ip) || [];
      const botCheck = this.evaluateBotScriptFrequency(ipLogs);
      if (botCheck.isBot) {
        this.blockIp(ip, 15 * 60 * 1000, `Automated script pattern detected (${botCheck.requestCount} requests, avg delta ${Math.round(botCheck.meanDeltaMs)}ms)`);
        return {
          allowed: false,
          reason: 'Access blocked due to automated script retrieval pattern.',
          isBlocked: true,
          anomalyScore: 95,
        };
      }
    }

    return {
      allowed: true,
      anomalyScore: 0,
    };
  }

  /**
   * Unblock an IP address manually.
   */
  unblockIp(ip) {
    if (!ip) return false;
    const clean = String(ip).replace(/\uFF0E/g, '.').trim();
    let hasIp = false;
    for (const key of Array.from(this.blockedIps.keys())) {
      const normalizedKey = String(key).replace(/\uFF0E/g, '.').trim();
      if (normalizedKey === clean) {
        hasIp = true;
        this.blockedIps.delete(key);
      }
    }
    if (hasIp) {
      this.addAlert({
        type: 'IP_UNBLOCKED',
        target: clean,
        reason: 'Manually unblocked by administrator',
        severity: 'INFO',
        timestamp: Date.now(),
      });
    }
    return hasIp;
  }

  /**
   * Unlock a share link manually.
   */
  unlockShare(shareId) {
    return this.lockedShares.delete(shareId);
  }

  /**
   * Get full security metrics and alert statistics.
   */
  getSecurityMetrics() {
    const now = Date.now();
    const activeBlockedIps = [];
    for (const [ip, data] of this.blockedIps.entries()) {
      if (now < data.blockedUntil) {
        activeBlockedIps.push({ ip, ...data, remainingMs: data.blockedUntil - now });
      }
    }

    const activeLockedShares = [];
    for (const [shareId, data] of this.lockedShares.entries()) {
      if (now < data.lockedUntil) {
        activeLockedShares.push({ shareId, ...data, remainingMs: data.lockedUntil - now });
      }
    }

    return {
      totalBlockedIpsCount: activeBlockedIps.length,
      totalLockedSharesCount: activeLockedShares.length,
      totalAlertsCount: this.anomalyAlerts.length,
      activeBlockedIps,
      activeLockedShares,
      recentAlerts: this.anomalyAlerts.slice(0, 20),
    };
  }
}

export const anomalyDetectorService = new AnomalyDetectorService();
export default anomalyDetectorService;
