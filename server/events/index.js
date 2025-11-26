import EventEmitter from "events";
import logger from "../utils/logger.js";
import { writeAudit } from "../utils/audit.js";

const bus = new EventEmitter();

// example listener
bus.on("expense.settled", async (payload) => {
  logger.info("EVENT expense.settled", payload);
  await writeAudit({
    userId: payload.settledBy,
    action: "expense.settled",
    entityType: "Expense",
    entityId: payload.expenseId,
    message: "Expense settled",
    meta: payload,
  });
});

export default bus;
