import swaggerJsdoc from 'swagger-jsdoc';
import { API_VERSION } from '../constants/appConstants.js';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FinFlow AI API Documentation',
      version: '1.0.0',
      description: 'API documentation for FinFlow AI Backend',
    },
    servers: [
      {
        url: `http://localhost:3000/api/${API_VERSION}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/modules/**/*.js', './src/modules/**/routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
