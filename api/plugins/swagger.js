"use strict";

import fp from "fastify-plugin";

const SWAGGER_OBJECT = {
  servers: [
    {
      url: "https://api.example.com/v1",
    },
  ],
  paths: {
    "/auth/register": {
      post: {
        tags: ["Authentication"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UserRegistration",
              },
            },
          },
        },
        responses: {
          201: {
            description: "User successfully registered",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UserResponse",
                },
              },
            },
          },
          400: {
            description: "Invalid input",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Authentication"],
        summary: "Login user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UserLogin",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/AuthResponse",
                },
              },
            },
          },
          401: {
            description: "Invalid credentials",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/auth/google": {
      post: {
        tags: ["Authentication"],
        summary: "Authenticate with Google",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  idToken: {
                    type: "string",
                    description: "Google OAuth ID token",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Authentication successful",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/AuthResponse",
                },
              },
            },
          },
          401: {
            description: "Invalid token",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/auth/apple": {
      post: {
        tags: ["Authentication"],
        summary: "Authenticate with Apple",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  identityToken: {
                    type: "string",
                    description: "Apple identity token",
                  },
                  authorizationCode: {
                    type: "string",
                    description: "Apple authorization code",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Authentication successful",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/AuthResponse",
                },
              },
            },
          },
          401: {
            description: "Invalid token",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/users/{userId}": {
      get: {
        tags: ["Users"],
        summary: "Get user details",
        security: [
          {
            BearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "User details retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UserResponse",
                },
              },
            },
          },
          404: {
            description: "User not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      put: {
        tags: ["Users"],
        summary: "Update user details",
        security: [
          {
            BearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UserUpdate",
              },
            },
          },
        },
        responses: {
          200: {
            description: "User updated successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UserResponse",
                },
              },
            },
          },
          404: {
            description: "User not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Users"],
        summary: "Delete user",
        security: [
          {
            BearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          204: {
            description: "User deleted successfully",
          },
          404: {
            description: "User not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/food/analyze": {
      post: {
        tags: ["Food Analysis"],
        summary: "Analyze food image for calorie information",
        security: [
          {
            BearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  image: {
                    type: "string",
                    format: "binary",
                    description: "Food image file",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Image analyzed successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/FoodAnalysis",
                },
              },
            },
          },
          400: {
            description: "Invalid image",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      UserRegistration: {
        type: "object",
        required: ["email", "password", "name"],
        properties: {
          email: {
            type: "string",
            format: "email",
          },
          password: {
            type: "string",
            minLength: 8,
          },
          name: {
            type: "string",
          },
        },
      },
      UserLogin: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: {
            type: "string",
            format: "email",
          },
          password: {
            type: "string",
          },
        },
      },
      UserUpdate: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          email: {
            type: "string",
            format: "email",
          },
        },
      },
      UserResponse: {
        type: "object",
        properties: {
          id: {
            type: "string",
          },
          email: {
            type: "string",
          },
          name: {
            type: "string",
          },
          createdAt: {
            type: "string",
            format: "date-time",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
          },
        },
      },
      AuthResponse: {
        type: "object",
        properties: {
          accessToken: {
            type: "string",
          },
          refreshToken: {
            type: "string",
          },
          user: {
            $ref: "#/components/schemas/UserResponse",
          },
        },
      },
      FoodAnalysis: {
        type: "object",
        properties: {
          foodName: {
            type: "string",
          },
          calories: {
            type: "number",
          },
          nutrients: {
            type: "object",
            properties: {
              protein: {
                type: "number",
              },
              carbohydrates: {
                type: "number",
              },
              fat: {
                type: "number",
              },
              fiber: {
                type: "number",
              },
            },
          },
          confidence: {
            type: "number",
            description: "Confidence score of the analysis (0-1)",
          },
        },
      },
      Error: {
        type: "object",
        properties: {
          code: {
            type: "string",
          },
          message: {
            type: "string",
          },
        },
      },
    },
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
}

/**
 * This plugins adds support for swagger documentation
 *
 * @see https://github.com/fastify/fastify-swagger
 */
export default fp(async function (fastify, opts) {
  fastify.register(import("@fastify/swagger"), {
    routePrefix: "/api-docs",
    swagger: {
      info: {
        title: "KalorieAI",
        description: "This is a sample Fastify application",
        version: "1.0.0",
      },
      externalDocs: {
        url: "https://fastify.dev",
        description: "Fastify documentation",
      },
      host: "localhost",
      schemes: ["http"],
      consumes: ["application/json"],
      produces: ["application/json"],
    },
  });

  fastify.register(import("@fastify/swagger-ui"), {
    routePrefix: "/documentation",
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
    uiHooks: {
      onRequest: function (request, reply, next) {
        next();
      },
      preHandler: function (request, reply, next) {
        next();
      },
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => {
      return {
        ...swaggerObject,
        ...SWAGGER_OBJECT
      };
    },
    transformSpecificationClone: true,
  });
});
