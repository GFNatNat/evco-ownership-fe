import fs from "fs";

export const deleteFile = (path) => {
  try {
    if (fs.existsSync(path)) fs.unlinkSync(path);
  } catch (err) {
    console.error("Failed to delete file:", err);
  }
};
