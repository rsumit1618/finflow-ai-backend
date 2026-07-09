/**
 * PM2 Ecosystem File (Template)
 * 
 * Copy this file to EC2 as `ecosystem.config.cjs`
 * 
 * Usage:
 *   pm2 start ecosystem.config.cjs
 * 
 * Note: Commit this file to Git (as template).
 *       Actual config is created on EC2.
 */

module.exports = {
  apps: [{
    name: 'finflow-backend',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: 'logs/err.log',
    out_file: 'logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    autorestart: true,
    max_restarts: 10
  }]
};