import type { AppInstance } from "../types/index.ts";
import type { FastifyPluginAsync } from "fastify";

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
      const { uid } = request.user as { uid: string };
      if (!uid) {
        return reply.status(401).send({
          error: "auth/unauthorized",
          message: "User not found",
        });
      }

      if (uid === "user@kalorie.ai") {
        return reply.status(200).send({ email: "user@kalorie.ai" });
      }

      return reply.status(401).send({
        error: "auth/unauthorized",
        message: "Invalid authorization token",
      });
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
      return "update user page";
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
