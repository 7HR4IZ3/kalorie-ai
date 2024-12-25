import type { AppInstance } from "../types/index.ts";
import type { FastifyPluginAsync } from "fastify";

const users: FastifyPluginAsync = async function (app: AppInstance, opts) {
  app.get(
    "/:userId",
    {
      schema: {
        tags: ["User Management"],
        summary: "Get user details",
        querystring: {
          type: "object",
          properties: {
            userId: {
              type: "string",
            },
          },
        },
        responses: {
          200: {
            description: "User details retrieved successfully",
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
        querystring: {
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
                $ref: "UserUpdate#",
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
        querystring: {
          type: "object",
          properties: {
            userId: {
              type: "string",
            },
          },
        },
        responses: {
          204: {
            description: "User deleted successfully",
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
