module.exports = {
  apps: [
    {
      name: "server_app",
      script: "./dist/app.js",
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
