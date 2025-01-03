
import { db, auth } from "../lib/firebase.js";
import { UserRecord } from "firebase-admin/auth";
import { UserUpdateSchema, stripUndefinedValues } from "../schema/index.js";

import type { AppInstance } from "../types/index.js";
import type {
  FastifyReply,
  FastifyRequest,
  FastifyPluginAsync,
  HookHandlerDoneFunction,
} from "fastify";

// When using .decorate you have to specify added properties for Typescript
export interface FastifyUserRequest extends FastifyRequest {
  profile?: FirebaseFirestore.DocumentReference<
    FirebaseFirestore.DocumentData,
    FirebaseFirestore.DocumentData
  >;
  userProfile?: FirebaseFirestore.DocumentSnapshot<
    FirebaseFirestore.DocumentData,
    FirebaseFirestore.DocumentData
  >;
}

const getUserProfile = async (
  request: FastifyUserRequest,
  reply: FastifyReply,
  done: HookHandlerDoneFunction
) => {
  const user = request.user as { uid: string };

  if (!user?.uid) {
    return reply.status(401).send({
      error: "auth/invalid-credentials",
      message: "User not found",
    });
  }

  const profile = db.collection("profiles").doc(user.uid);
  const userProfile = await profile.get();

  if (!userProfile?.exists) {
    return reply.status(401).send({
      error: "auth/no-user-profile",
      message: "User profile not found",
    });
  }

  request.profile = profile;
  request.userProfile = userProfile;

  return done();
};

const users: FastifyPluginAsync = async function (app: AppInstance, opts) {
  app.get(
    "",
    {
      preHandler: getUserProfile,
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
    function (request: FastifyUserRequest, reply) {
      return reply.status(200).send(request.userProfile?.data());
    }
  );

  app.patch(
    "",
    {
      preHandler: getUserProfile,
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
          201: {
            description: "User updated successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "UserDetails#",
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
    async function (request: FastifyUserRequest, reply) {
      const requestBody = UserUpdateSchema.parse(request.body);

      await request.profile?.set({
        ...request.userProfile?.data(),
        ...stripUndefinedValues(requestBody),
        updated_at: new Date().toISOString(),
      });

      return reply.status(201).send((await request.profile?.get())?.data());
    }
  );

  app.delete(
    "",
    {
      preHandler: getUserProfile,
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
    async function (request: FastifyUserRequest, reply) {
      const user = request.user as UserRecord;

      // Delete user profile
      await request.profile?.delete();

      // Delete user tokens
      await db.collection("tokens").doc(user.uid).delete();

      // Delete user
      await auth.deleteUser(user.uid);

      return reply.status(204).send({ success: true });
    }
  );
};

export default users;
