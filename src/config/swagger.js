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
        url: process.env.NODE_ENV === 'production'
          ? `http://56.228.4.142:3000/api/${API_VERSION}`
          : `http://localhost:3000/api/${API_VERSION}`,
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
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
      schemas: {
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            data: { type: 'object' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  path: { type: 'array', items: { type: 'string' } },
                  message: { type: 'string' },
                },
              },
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            userId: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string' },
            isActive: { type: 'boolean' },
            isVerified: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Profile: {
          type: 'object',
          properties: {
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            age: { type: 'integer' },
            college: { type: 'string' },
            qualificationYear: { type: 'integer' },
            address: { type: 'string' },
            highestQualification: { type: 'string' },
            profileImage: { type: 'string' },
          },
        },
        PublicUser: {
          type: 'object',
          properties: {
            userId: { type: 'string' },
            email: { type: 'string', format: 'email' },
            profile: { $ref: '#/components/schemas/Profile', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        AuthTokens: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
          },
        },
        Video: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            fileName: { type: 'string' },
            fileSize: { type: 'integer' },
            mimeType: { type: 'string' },
            format: { type: 'string' },
            url: { type: 'string' },
            thumbnailUrl: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            total: { type: 'integer' },
            page: { type: 'integer' },
            limit: { type: 'integer' },
            totalPages: { type: 'integer' },
          },
        },
        Qualification: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            isOther: { type: 'boolean' },
          },
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
