module.exports = {
  apps : [{
    name: "gasvet",
    script: "npm",
    args: "run start",
    exec_mode : 'cluster',
    instances : 'max',
    autorestart: true,
    watch: true,
    max_memory_restart: '2G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};
