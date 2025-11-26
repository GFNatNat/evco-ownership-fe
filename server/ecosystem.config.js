module.exports = {
  apps: [
    {
      name: "ev-backend",
      script: "server.js",
      instances: "max", // Scale theo CPU
      exec_mode: "cluster", // Load balancing
      watch: false, // Tắt watch trong production
      max_memory_restart: "1G", // Restart khi vượt 1GB RAM

      env: {
        NODE_ENV: "development",
        PORT: 5000,
      },

      env_staging: {
        NODE_ENV: "staging",
        PORT: 5000,
      },

      env_production: {
        NODE_ENV: "production",
        PORT: 5000,
      },

      error_file: "./logs/pm2-error.log", // PM2 internal error log
      out_file: "./logs/pm2-out.log", // PM2 internal output log
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      merge_logs: true,
    },
  ],
};
