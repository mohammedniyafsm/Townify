import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Townify Backend API",
      version: "1.0.0",
      description: "API documentation for Townify backend",
    },
    servers: [
      {
        url: "http://localhost:8080",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token", // 👈 match your auth cookie name
        },
      },
    },
  },

  // 🔴 THIS IS THE MOST IMPORTANT PART
  apis: [
    "./src/modules/**/*.routes.ts",
    "./src/modules/**/*.routes.js",
  ],
});
