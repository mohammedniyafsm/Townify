module.exports = {
  apps: [
    {
      name: "http-server",
      script: "./apps/http-server/dist/index.js",
      instances: 1,
      autorestart: true,
    },
    {
      name: "ws-server",
      script: "./apps/ws-server/dist/index.js",
      instances: 1,
      autorestart: true,
    },
    {
      name: "notification-ws",
      script: "./apps/notification-ws/dist/index.js",
      instances: 1,
      autorestart: true,
    },
  ],
};
