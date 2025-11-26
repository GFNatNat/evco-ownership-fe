import fs from "fs";
import path from "path";

// --- ANSI Colors for terminal ---
const COLORS = {
  reset: "\x1b[0m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  green: "\x1b[32m",
  magenta: "\x1b[35m",
  gray: "\x1b[90m",
};

// --- Prepare log file ---
const logFilePath = path.join(process.cwd(), "logs", "mongoose.log");

function writeToFile(text) {
  fs.appendFileSync(logFilePath, text + "\n", "utf8");
}

// --- Plugin function ---
export function mongooseQueryLogger(schema) {
  const ops = ["find", "findOne", "findOneAndUpdate", "updateOne", "deleteOne"];

  schema.pre(ops, function () {
    const timestamp = new Date().toISOString();
    const modelName = this.model?.modelName ?? "UnknownModel";
    const op = this.op;

    const query = JSON.stringify(this.getQuery() || {}, null, 2);
    const update = this.getUpdate
      ? JSON.stringify(this.getUpdate() || {}, null, 2)
      : null;
    const options = JSON.stringify(this.getOptions() || {}, null, 2);

    // ---- Terminal Output (colored) ----
    console.log(
      `${COLORS.cyan}[MONGOOSE]${COLORS.reset} ` +
        `${COLORS.yellow}${timestamp}${COLORS.reset} ` +
        `${COLORS.green}${modelName}.${op}${COLORS.reset}`
    );

    console.log(`${COLORS.magenta}Query:${COLORS.reset} ${query}`);
    if (update)
      console.log(`${COLORS.magenta}Update:${COLORS.reset} ${update}`);
    console.log(`${COLORS.magenta}Options:${COLORS.reset} ${options}`);
    console.log(
      COLORS.gray + "----------------------------------------" + COLORS.reset
    );

    // ---- File Output ----
    let logText = `
[${timestamp}] ${modelName}.${op}
QUERY: ${query}
${update ? `UPDATE: ${update}\n` : ""}
OPTIONS: ${options}
--------------------------------------------------
    `.trim();

    writeToFile(logText);
  });
}
