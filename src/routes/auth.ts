import z from "zod";
import bcrypt from "bcrypt";
import { auth as serverAuth, db } from "../lib/firebase.js";

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
  if (!process.env.AUTHENTICATION_JWT_SECRET) {
    throw new Error("AUTHENTICATION_JWT_SECRET is not set");
  }

  app.register(import("@fastify/jwt"), {
    secret: process.env.AUTHENTICATION_JWT_SECRET as string,
  });

  app.post(
    "/login",
    {
      config: { requiresAuthentication: false },
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
    async function (request, reply) {
      const requestBody = UserLogin.parse(request.body as object);

      try {
        const user = await serverAuth.getUserByEmail(requestBody.email);
        if (!user) {
          return reply.status(401).send({
            error: "auth/invalid-credentials",
            message: "Invalid email address",
          });
        }

        // Retrieve stored password hash from user custom claims
        const customClaims = user.customClaims;
        if (!customClaims || !customClaims.passwordHash) {
          return reply.status(401).send({
            error: "auth/invalid-credentials",
            message: "No password set for this user",
          });
        }

        // Compare the incoming password with the hashed password
        const hashedPassword = customClaims.passwordHash;
        const passwordMatches = await bcrypt.compare(
          requestBody.password,
          hashedPassword
        );
        if (!passwordMatches) {
          return reply.status(401).send({
            error: "auth/invalid-credentials",
            message: "Invalid password",
          });
        }

        // TODO: Refresh token implementation and support

        // Check for existing token
        const userToken = await db.collection("tokens").doc(user.uid).get();
        if (userToken.exists && userToken.data()) {
          const { token } = userToken.data() as {
            [field: string]: any;
          };

          return reply.status(200).send({
            accessToken: token,
            refreshToken: userToken.data()?.refreshToken,
            expiresIn: userToken.data()?.expiresIn,
          });
        } else {
          // Create and store new user token
          const token = app.jwt.sign({
            uid: user.uid,
            alg: "RS256",
            iss: "support@kalorie.ai",
            sub: requestBody.email,
            aud: [
              "https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit",
            ],
            azp: "YOUR_CLIENT_ID",
            exp:
              new Date().getTime() +

              // A full day from now
              1000 * 60 * 60 * 24 *

              Number.parseInt(
                process.env.AUTHENTICATION_JWT_EXPIRY_PERIOD || "90"
              ),
            iat: new Date().getTime()
          });
          await db.collection("tokens").doc(user.uid).set({
            token: token,
            createdAt: user.metadata.creationTime,
          });

          // Return user details
          return reply.status(200).send({ accessToken: token });
        }
      } catch (error: any) {
        // Errors from firebase typically hane a `code` property
        // Else it's a generic error

        return reply.status(401).send({
          error: error.code || "internal-server-error",
          message: error.message || "Internal Server Error",
        });
      }
    }
  );

  app.post(
    "/register",
    {
      config: { requiresAuthentication: false },
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
        const user = await serverAuth.createUser({
          email: requestBody.email,
          password: requestBody.password,
        });

        const hashedPassword = await bcrypt.hash(
          requestBody.password,
          user.passwordSalt as string
        );
        serverAuth.setCustomUserClaims(user.uid, {
          passwordHash: hashedPassword,
        });

        // Create new user profile
        await db.collection("profiles").doc(user.uid).set({
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

        // Create and store new user token
        const token = app.jwt.sign({
          payload: { email: requestBody.email },
        });
        await db.collection("tokens").doc(user.uid).set({
          token: token,
          createdAt: user.metadata.creationTime,
        });

        // Return user details
        return reply.status(200).send({
          accessToken: token,
        });
      } catch (error: any) {
        return reply.status(400).send({
          error: error.code || "internal-server-error",
          message: error.message || "Internal Server Error",
        });
      }
    }
  );

  app.post(
    "/google",
    {
      config: { requiresAuthentication: false },
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
      config: { requiresAuthentication: false },
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
