module.exports = {
  apps: [{
    name: 'finflow-backend',
    script: 'server.js',
    instances: 'max',              // Saare CPU cores
    exec_mode: 'cluster',           // Cluster mode
    max_memory_restart: '1G',       // Memory limit
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: 'logs/err.log',
    out_file: 'logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss'
  }]
};
