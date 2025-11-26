import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env từ root (không phải src/)
dotenv.config({ path: path.join(__dirname, "../.env") });

// Helper: nếu biến rỗng → undefined
const get = (key, fallback = undefined) => process.env[key] ?? fallback;

// Tạo object env như CommonJS cũ (fix conflict)
const env = {
  NODE_ENV: get("NODE_ENV", "development"),

  PORT: get("PORT", 5000),

  MONGO_URI: get("MONGO_URI"),

  JWT_SECRET: get("JWT_SECRET"),
  JWT_REFRESH_SECRET: get("JWT_REFRESH_SECRET"),
  ACCESS_TOKEN_EXPIRE: get("ACCESS_TOKEN_EXPIRE"),
  REFRESH_TOKEN_EXPIRE: get("REFRESH_TOKEN_EXPIRE"),

  LOG_LEVEL: get("LOG_LEVEL", "info"),
};

// Default export cho code cũ
export default env;

// Named export cho code mới
export const {
  NODE_ENV,
  PORT,
  MONGO_URI,
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  ACCESS_TOKEN_EXPIRE,
  REFRESH_TOKEN_EXPIRE,
  LOG_LEVEL,
} = env;
