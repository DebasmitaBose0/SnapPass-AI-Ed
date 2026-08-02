import AuthError from "../utils/errors/AuthError.js";
import { validateSession } from "../services/session.service.js";
import SecurityAudit from "../models/securityAudit.model.js";
import { tokenRevocationStore } from "../utils/tokenRevocationStore.js";

export default async function authMiddleware(req, res, next) {
    const token = req.cookies?.token;
    if (!token) {
        await SecurityAudit.create({
            action: 'AUTH_FAILED',
            email: 'anonymous',
            ip: req.ip,
            status: 'FAILURE',
            severity: 'WARNING',
            userAgent: req.headers['user-agent'] || '',
            details: 'No token provided'
        }).catch(() => {});
        return next(new AuthError("No token provided"));
    }

    if (tokenRevocationStore.isRevoked(token)) {
        await SecurityAudit.create({
            action: 'AUTH_FAILED',
            email: 'revoked-token',
            ip: req.ip,
            status: 'FAILURE',
            severity: 'WARNING',
            details: 'Attempt to use explicitly revoked JWT token'
        }).catch(() => {});
        return next(new AuthError("Token has been revoked"));
    }

    try {
        const decoded = await validateSession(token);
        if (!decoded) {
            await SecurityAudit.create({
                action: 'AUTH_FAILED',
                email: 'revoked-session',
                ip: req.ip,
                status: 'FAILURE',
                details: 'Session has expired or has been revoked'
            }).catch(() => {});
            return next(new AuthError("Session has expired or has been revoked"));
        }
        req.user = decoded;
        next();
    } catch (error) {
        await SecurityAudit.create({
            action: 'AUTH_FAILED',
            email: 'invalid-token',
            ip: req.ip,
            status: 'FAILURE',
            details: 'Invalid token signature'
        }).catch(() => {});
        return next(new AuthError("Invalid token"));
    }
}