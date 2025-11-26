import AuditLog from "../models/AuditLog.js";
import logger from "./logger.js";

export const writeAudit = async ({
  userId,
  action,
  entityType,
  entityId,
  message,
  meta,
  ip,
}) => {
  try {
    // persist to DB
    await AuditLog.create({
      userId,
      action,
      entityType,
      entityId,
      message,
      meta,
      ip,
    });

    // also write condensed audit into audit log file (for offline analysis)
    logger.audit(
      `${action} user=${userId} entity=${entityType}:${entityId} msg=${message}`,
      { meta, ip }
    );
  } catch (err) {
    // Do not throw — auditing must not break user flow
    logger.error("Failed to write audit log", {
      err: err.message,
      userId,
      action,
    });
  }
};
