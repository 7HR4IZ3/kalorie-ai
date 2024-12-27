import fp from "fastify-plugin";

export interface SwaggerPluginOptions {
  // Specify Swagger plugin options here
}

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
      servers: [
        { url: "http://localhost:3000/" },
        { url: "https://kalorie-ai-six.vercel.app/" },
      ],
      externalDocs: {
        url: "https://fastify.dev",
        description: "Fastify documentation",
      },
    },
  });

  fastify.register(import("@fastify/swagger-ui"), {
    routePrefix: "/documentation",
    transformSpecification: (swaggerObject) => {
      return swaggerObject;
    },
    transformSpecificationClone: true,
  });
});
