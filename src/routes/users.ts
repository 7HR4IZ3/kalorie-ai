import type { AppInstance } from "../types/index.ts";
import type { FastifyPluginAsync } from "fastify";

const users: FastifyPluginAsync = async function (app: AppInstance, opts) {
  app.get(
    "/:userId",
    {
      schema: {
        tags: ["User Management"],
        summary: "Get user details",
        params: {
          type: "object",
          properties: {
            userId: {
              type: "string",
            },
          },
        },
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
      // @ts-ignore
      return "user page " + request.query.userId;
    }
  );

  app.put(
    "/:userId",
    {
      schema: {
        tags: ["User Management"],
        summary: "Update user details",
        params: {
          type: "object",
          properties: {
            userId: {
              type: "string",
            },
          },
        },
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
    "/:userId",
    {
      schema: {
        tags: ["User Management"],
        summary: "Delete user",
        params: {
          type: "object",
          properties: {
            userId: {
              type: "string",
            },
          },
        },
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
