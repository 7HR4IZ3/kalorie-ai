import { db } from "../lib/firebase.js";
import { UserUpdateSchema, stripUndefinedValues } from "../schema/index.js";

import type { AppInstance } from "../types/index.ts";
import type { FastifyPluginAsync, FastifyRequest, FastifyReply } from "fastify";

const getUserProfile = async (request: FastifyRequest, reply: FastifyReply) => {
  const user = request.user as { uid: string };

  if (!user?.uid) {
    reply.status(401).send({
      error: "auth/invalid-credentials",
      message: "User not found",
    });
    return null;
  }

  const profile = db.collection("profiles").doc(user.uid);
  const userProfile = await profile.get();

  if (!userProfile?.exists) {
    reply.status(404).send({
      error: "auth/no-user-profile",
      message: "User profile not found",
    });
    return null;
  }

  return { profile, userProfile };
};

const users: FastifyPluginAsync = async function (app: AppInstance, opts) {
  app.get(
    "",
    {
      schema: {
        tags: ["User Management"],
        summary: "Get user details",
        response: {
          200: {
            description: "User details retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "UserDetails#",
                  id: {
                    type: "string",
                  },
                },
              },
            },
          },
          401: {
            description: "User not found",
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
      const entry = await getUserProfile(request, reply);
      if (!entry) { return; }

      reply.status(200).send(entry.userProfile.data());
    }
  );

  app.put(
    "",
    {
      schema: {
        tags: ["User Management"],
        summary: "Update user details",
        body: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "UserDetails#",
              },
            },
          },
        },
        response: {
          200: {
            description: "User updated successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "UserDetails#",
                },
              },
            },
          },
          404: {
            description: "User not found",
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
      const entry = await getUserProfile(request, reply);
      if (!entry) { return; }

      const requestBody = UserUpdateSchema.parse(request.body);

      await entry.profile.set({
        ...entry.userProfile.data(),
        ...stripUndefinedValues(requestBody)
      });
    }
  );

  app.delete(
    "",
    {
      schema: {
        tags: ["User Management"],
        summary: "Delete user",
        response: {
          204: {
            description: "User deleted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                  },
                },
              },
            },
          },
          404: {
            description: "User not found",
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
      return "delete user page";
    }
  );
};

export default users;
