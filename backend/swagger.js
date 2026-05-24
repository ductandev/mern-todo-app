import swaggerJsdoc from "swagger-jsdoc";
import dotenv from "dotenv";

dotenv.config();
const port = process.env.PORT || 8000;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MERN Todo API",
      version: "1.0.0",
      description: "API documentation for MERN Todo App",
    },
    servers: [{ url: `${process.env.URL}:${port}` }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./routes/*.js"],
};

export default swaggerJsdoc(options);
