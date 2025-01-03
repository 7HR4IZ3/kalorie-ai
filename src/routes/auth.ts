import bcrypt from "bcrypt";
import { UserLogin, UserRegistration } from "../schema/index.js";
import { auth as serverAuth, db } from "../lib/firebase.js";

import type { Algorithm } from "fast-jwt";
import type { FastifyPluginAsync } from "fastify";

const auth: FastifyPluginAsync = async function (app, opts) {
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
          // Create new user token
          const token = app.jwt.sign(
            {
              uid: user.uid,
              email: user.email,
            },
            {
              sub: requestBody.email,
              algorithm: process.env.AUTHENTICATION_JWT_ALGORITHM as Algorithm,
              iss: process.env.AUTHENTICATION_JWT_ISSUER,
              key: process.env.AUTHENTICATION_JWT_SECRET,
              aud: process.env.AUTHENTICATION_JWT_AUDIENCE,
              clockTimestamp: new Date().getTime(),
              expiresIn:
                // A full day from now
                1000 *
                60 *
                60 *
                24 *
                Number.parseInt(
                  process.env.AUTHENTICATION_JWT_EXPIRY_PERIOD || "90"
                ),
            }
          );

          // TODO: Store tokens to be used for invalidating refreshTokens
          // await db.collection("tokens").doc(user.uid).set({
          //   token: token, createdAt: user.metadata.creationTime,
          // });

          // Return user details
          return reply.status(200).send({ accessToken: token });
        }
      } catch (error: any) {
        // Errors from firebase typically hane a `code` property
        // Else it's a generic error

        console.log(error);

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

        const passwordSalt = user.passwordSalt || (await bcrypt.genSalt(10));
        const hashedPassword = await bcrypt.hash(
          requestBody.password,
          passwordSalt
        );
        serverAuth.setCustomUserClaims(user.uid, {
          passwordHash: hashedPassword,
          passwordSalt: passwordSalt,
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
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        // Create and store new user token
        const token = app.jwt.sign(
          {
            uid: user.uid,
            email: user.email,
          },
          {
            sub: requestBody.email,
            algorithm: process.env.AUTHENTICATION_JWT_ALGORITHM as Algorithm,
            iss: process.env.AUTHENTICATION_JWT_ISSUER,
            key: process.env.AUTHENTICATION_JWT_SECRET,
            aud: process.env.AUTHENTICATION_JWT_AUDIENCE,
            clockTimestamp: new Date().getTime(),
            expiresIn:
              // A full day from now
              1000 *
              60 *
              60 *
              24 *
              Number.parseInt(
                process.env.AUTHENTICATION_JWT_EXPIRY_PERIOD || "90"
              ),
          }
        );

        console.log(token);

        // await db.collection("tokens").doc(user.uid).set({
        //   token: token,
        //   createdAt: user.metadata.creationTime,
        // });

        // Return user details
        return reply.send({
          accessToken: token,
        });
      } catch (error: any) {
        console.log(error);

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
