import z from "zod";
import { auth as firebaseAuth, db } from "../lib/firebase.js";

import type { FastifyPluginAsync } from "fastify";

const UserLogin = z.object({
  email: z.string().email(),
  password: z.string(),
});

const UserRegistration = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  gender: z.enum(["male", "female", "other"]),
  workout_periods: z.enum(["0-2", "3-5", "6+"]),
  tried_other_tracking_apps: z.enum(["yes", "no"]),
  height: z.number(),
  weight: z.number(),
  age: z.string().datetime(),
  goal: z.enum(["lose_weight", "gain_weight", "mantain"]),
  desited_weight: z.number(),
  goal_speed: z.number().min(0.1).max(1.5),
  current_limitation: z.array(
    z.enum([
      "consistency",
      "eating_habit",
      "support",
      "busy",
      "meal_inspiraton",
    ])
  ),
  following_a_diet: z.enum(["classic", "pescetarian", "vegan", "vegitarian"]),
  accomplishment_goal: z.array(
    z.enum(["eat_healthier", "boost_mood", "stay_motivated", "feel_better"])
  ),
});

const auth: FastifyPluginAsync = async function (app, opts) {
  app.post(
    "/login",
    {
      schema: {
        tags: ["Authentication"],
        summary: "Login user",
        body: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "UserLogin#",
              },
            },
          },
        },
        response: {
          200: {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  $ref: "AuthResponse#",
                },
              },
            },
          },
          401: {
            description: "Invalid credentials",
            content: {
              "application/json": {
                schema: {
                  $ref: "HttpError",
                },
              },
            },
          },
        },
      },
    },
    async function (request) {
      return "login page";
    }
  );

  app.post(
    "/register",
    {
      schema: {
        tags: ["Authentication"],
        summary: "Register a new user",
        body: {
          required: true,
          description: "User Registration",
          content: {
            "application/json": {
              schema: {
                $ref: "UserRegistration#",
              },
            },
          },
        },
        response: {
          200: {
            description: "User successfully registered",
            content: {
              "application/json": {
                schema: {
                  $ref: "UserDetails#",
                },
              },
            },
          },
          401: {
            description: "Invalid input",
            content: {
              "application/json": {
                schema: {
                  $ref: "HttpError",
                },
              },
            },
          },
        },
      },
    },
    async function (request, reply) {
      const requestBody = UserRegistration.parse(request.body as object);

      try {
        const userRef = await firebaseAuth.createUserWithEmailAndPassword(
          requestBody.email, requestBody.password
        );

        // Create new user profile
        const userProfile = db.collection("profiles").doc(requestBody.email);
        userProfile.set({
          name: requestBody.name,
          email: requestBody.email,
          gender: requestBody.gender,
          workout_periods: requestBody.workout_periods,
          tried_other_tracking_apps: requestBody.tried_other_tracking_apps,
          height: requestBody.height,
          weight: requestBody.weight,
          age: requestBody.age,
          goal: requestBody.goal,
          desited_weight: requestBody.desited_weight,
          goal_speed: requestBody.goal_speed,
          current_limitation: requestBody.current_limitation,
          following_a_diet: requestBody.following_a_diet,
          accomplishment_goal: requestBody.accomplishment_goal,
        });

        // Create new user token
        const token = await userRef.user?.getIdToken();

        // Return user details
        return reply.status(200).send({
          accessToken: token,
          refreshToken: token,
          user: {
            email: requestBody.email,
            name: requestBody.name,
            createdAt: userRef.user?.metadata.creationTime,
            updatedAt: userRef.user?.metadata.lastSignInTime,
          },
        });
      } catch (error: any) {
        return reply.status(400).send({
          code: error.code,
          message: error.message
        });
      }

    }
  );

  app.post(
    "/google",
    {
      schema: {
        tags: ["Authentication"],
        summary: "Authenticate with Google",
        security: [{ authToken: [] }],
        body: {
          type: "object",
          properties: {
            code: {
              type: "string",
              description: "The code returned from the Google OAuth flow",
            },
          },
          required: ["code"],
        },
        response: {
          200: {
            description: "Authentication successful",
            content: {
              "application/json": {
                schema: {
                  $ref: "AuthResponse#",
                },
              },
            },
          },
          401: {
            description: "Invalid token",
            content: {
              "application/json": {
                schema: {
                  $ref: "HttpError",
                },
              },
            },
          },
        },
      },
    },
    async function (request, reply) {}
  );

  app.post(
    "/apple",
    {
      schema: {
        tags: ["Authentication"],
        summary: "Authenticate with Apple",
        body: {
          type: "object",
          properties: {
            code: {
              type: "string",
              description: "The code returned from the Apple OAuth flow",
            },
          },
          required: ["code"],
        },
        response: {
          200: {
            description: "Authentication successful",
            content: {
              "application/json": {
                schema: {
                  $ref: "AuthResponse#",
                },
              },
            },
          },
          401: {
            description: "Invalid token",
            content: {
              "application/json": {
                schema: {
                  $ref: "HttpError",
                },
              },
            },
          },
        },
      },
    },
    async function (request, reply) {
      return "login page for apple";
    }
  );
};

export default auth;
