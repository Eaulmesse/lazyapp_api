const auditService = require("../services/AuditService");

function list(req, res) {
    const audits = auditService.list();
    res.status(200).json(audits);
}

module.exports = {
    list,
}