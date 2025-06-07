module.exports = {
  apps: [
    {
      name: 'server_app',
      script: './dist/server.js',
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
