class SessionRevocationStoreService {
    constructor() {
        this.revokedSet = new Set();
    }
    revoke(token) {
        this.revokedSet.add(token);
    }
    isRevoked(token) {
        return this.revokedSet.has(token);
    }
}
module.exports = new SessionRevocationStoreService();