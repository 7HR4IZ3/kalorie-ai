import fp from "fastify-plugin";

export interface SwaggerPluginOptions {
  // Specify Swagger plugin options here
}

const SWAGGER_OBJECT = {
  servers: [
    { url: "http://localhost:3000/" },
    { url: "https://kalorie-ai-six.vercel.app/" },
  ],
  paths: {
    "/auth/register": {
      post: {
        tags: ["Authentication"],
        summary: "Register a new user",
        description: "Register a new user",
        operationId: "registerUser",
        requestBody: {
          required: true,
          description: "User Registration",
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
        required: [
          "gender",
          "workout_periods",
          "tried_other_tracking_apps",
          "height",
          "weight",
          "age",
          "goal",
          "desited_weight",
          "goal_speed",
          "current_limitation",
          "following_a_diet",
          "accomplishment_goal",
        ],
        properties: {
          gender: {
            type: "string",
            enum: ["male", "female", "other"],
          },
          workout_periods: {
            type: "string",
            enum: ["0-2", "3-5", "6+"],
          },
          tried_other_tracking_apps: {
            type: "string",
            enum: ["yes", "no"],
          },
          height: {
            type: "number",
          },
          weight: {
            type: "number",
          },
          age: {
            type: "string",
            format: "date",
          },
          goal: {
            type: "string",
            enum: ["lose_weight", "gain_weight", "mantain"],
          },
          desited_weight: {
            type: "number",
          },
          goal_speed: {
            type: "number",
            minimum: 0.1,
            maximum: 1.5,
          },
          current_limitation: {
            type: "array",
            items: {
              type: "string",
              enum: [
                "consistency",
                "eating_habit",
                "support",
                "busy",
                "meal_inspiraton",
              ],
            },
          },
          following_a_diet: {
            type: "string",
            enum: ["classic", "pescetarian", "vegan", "vegitarian"],
          },
          accomplishment_goal: {
            type: "array",
            items: {
              type: "string",
              enum: [
                "eat_healthier",
                "boost_mood",
                "stay_motivated",
                "feel_better",
              ],
            },
          },
          referal_code: {
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
};

export default fp<SwaggerPluginOptions>(async function (fastify, opts) {
  // UserRegistration Schema
  fastify.addSchema({
    $id: "UserRegistration",
    type: "object",
    required: [
      "gender",
      "workout_periods",
      "tried_other_tracking_apps",
      "height",
      "weight",
      "age",
      "goal",
      "desited_weight",
      "goal_speed",
      "current_limitation",
      "following_a_diet",
      "accomplishment_goal",
    ],
    properties: {
      gender: {
        type: "string",
        enum: ["male", "female", "other"],
        description: "User's gender",
      },
      workout_periods: {
        type: "string",
        enum: ["0-2", "3-5", "6+"],
        description: "User's workout periods",
      },
      tried_other_tracking_apps: {
        type: "string",
        enum: ["yes", "no"],
        description: "Whether the user has tried other tracking apps",
      },
      height: {
        type: "number",
        description: "User's height",
      },
      weight: {
        type: "number",
        description: "User's weight",
      },
      age: {
        type: "string",
        format: "date",
        description: "User's age",
      },
      goal: {
        type: "string",
        enum: ["lose_weight", "gain_weight", "mantain"],
        description: "User's weight goal",
      },
      desited_weight: {
        type: "number",
        description: "User's desired weight",
      },
      goal_speed: {
        type: "number",
        minimum: 0.1,
        maximum: 1.5,
        description: "How fast the user wants to lose weight",
      },
      current_limitation: {
        type: "array",
        items: {
          type: "string",
          enum: [
            "consistency",
            "eating_habit",
            "support",
            "busy",
            "meal_inspiraton",
          ],
        },
        description: "What is currently limiting the user's progress",
      },
      following_a_diet: {
        type: "string",
        enum: ["classic", "pescetarian", "vegan", "vegitarian"],
        description: "Whether the user is following a diet",
      },
      accomplishment_goal: {
        type: "array",
        items: {
          type: "string",
          enum: [
            "eat_healthier",
            "boost_mood",
            "stay_motivated",
            "feel_better",
          ],
        },
        description: "What the user wants to achieve",
      },
      referal_code: {
        type: "string",
      },
    },
  });

  // UserLogin Schema
  fastify.addSchema({
    $id: "UserLogin",
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
  });

  // UserDetails Schema
  fastify.addSchema({
    $id: "UserDetails",
    type: "object",
    properties: {
      id: {
        type: "string",
      },
      email: {
        type: "string",
        description: "User's email",
      },
      name: {
        type: "string",
        description: "User's name",
      },
      createdAt: {
        type: "string",
        format: "date-time",
        description: "User account creation date",
      },
      updatedAt: {
        type: "string",
        format: "date-time",
        description: "Last update date",
      },
      gender: {
        type: "string",
        enum: ["male", "female", "other"],
        description: "User's gender",
      },
      workout_periods: {
        type: "string",
        enum: ["0-2", "3-5", "6+"],
        description: "How often the user does workouts",
      },
      tried_other_tracking_apps: {
        type: "string",
        enum: ["yes", "no"],
        description: "Whether the user has tried other tracking apps",
      },
      height: {
        type: "number",
        description: "User's height",
      },
      weight: {
        type: "number",
        description: "User's weight",
      },
      age: {
        type: "string",
        format: "date",
        description: "User's age",
      },
      goal: {
        type: "string",
        enum: ["lose_weight", "gain_weight", "mantain"],
        description: "User's weight goal",
      },
      desited_weight: {
        type: "number",
        description: "User's desired weight",
      },
      goal_speed: {
        type: "number",
        minimum: 0.1,
        maximum: 1.5,
        description: "How fast the user wants to lose weight",
      },
      current_limitation: {
        type: "array",
        items: {
          type: "string",
          enum: [
            "consistency",
            "eating_habit",
            "support",
            "busy",
            "meal_inspiraton",
          ],
        },
        description: "What is currently limiting the user's progress",
      },
      following_a_diet: {
        type: "string",
        enum: ["classic", "pescetarian", "vegan", "vegitarian"],
        description: "Whether the user is following a diet",
      },
      accomplishment_goal: {
        type: "array",
        items: {
          type: "string",
          enum: [
            "eat_healthier",
            "boost_mood",
            "stay_motivated",
            "feel_better",
          ],
        },
        description: "What the user wants to achieve",
      },
    },
  });

  // AuthResponse Schema
  fastify.addSchema({
    $id: "AuthResponse",
    type: "object",
    properties: {
      accessToken: {
        type: "string",
      },
      refreshToken: {
        type: "string",
      },
      user: {
        $ref: "UserDetails",
      },
    },
  });

  // FoodAnalysisResult Schema
  fastify.addSchema({
    $id: "FoodAnalysisResult",
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
          sugars: {
            type: "number",
          },
        },
      },
      confidence: {
        type: "number",
        description: "Confidence score of the analysis (0-1)",
      },
      ingredients: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: {
              type: "string",
            },
            amount: {
              type: "number",
            },
            unit: {
              type: "string",
            },
          },
        },
      },
      health_score: {
        type: "number",
        description: "Health score of the food (0-1)",
      },
      quantity: {
        type: "number",
        description: "Quantity of the food",
        default: 1,
      },
    },
  });

  fastify.register(import("@fastify/swagger"), {
    openapi: {
      info: {
        title: "KalorieAI",
        description: "This is a sample Fastify application",
        version: "1.0.0",
      },
      externalDocs: {
        url: "https://fastify.dev",
        description: "Fastify documentation",
      },
    },
  });

  fastify.register(import("@fastify/swagger-ui"), {
    routePrefix: "/documentation",
    transformSpecification: (swaggerObject, request, reply) => {
      // @ts-ignore
      delete swaggerObject["swagger"];

      return {
        ...swaggerObject,
        servers: SWAGGER_OBJECT.servers,
      };
    },
    transformSpecificationClone: true,
  });
});
