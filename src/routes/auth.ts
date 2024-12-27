import type { FastifyPluginAsync } from "fastify";

const auth: FastifyPluginAsync = async function (app, opts) {
  // app.post(
  //   "/login",
  //   {
  //     schema: {
  //       tags: ["Authentication"],
  //       summary: "Login user",
  //       body: {
  //         required: true,
  //         content: {
  //           "application/json": {
  //             schema: {
  //               $ref: "UserLogin#",
  //             },
  //           },
  //         },
  //       },
  //       response: {
  //         200: {
  //           description: "Login successful",
  //           content: {
  //             "application/json": {
  //               schema: {
  //                 $ref: "AuthResponse#",
  //               },
  //             },
  //           },
  //         },
  //         401: {
  //           description: "Invalid credentials",
  //           content: {
  //             "application/json": {
  //               schema: {
  //                 $ref: "HttpError",
  //               },
  //             },
  //           },
  //         },
  //       },
  //     },
  //   },
  //   async function (request) {
  //     return "login page";
  //   }
  // );

  // app.post(
  //   "/register",
  //   {
  //     schema: {
  //       tags: ["Authentication"],
  //       summary: "Register a new user",
  //       body: {
  //         required: true,
  //         description: "User Registration",
  //         content: {
  //           "application/json": {
  //             schema: {
  //               $ref: "UserRegistration#",
  //             },
  //           },
  //         },
  //       },
  //       response: {
  //         200: {
  //           description: "User successfully registered",
  //           content: {
  //             "application/json": {
  //               schema: {
  //                 $ref: "UserDetails#",
  //               },
  //             },
  //           },
  //         },
  //         401: {
  //           description: "Invalid input",
  //           content: {
  //             "application/json": {
  //               schema: {
  //                 $ref: "HttpError",
  //               },
  //             },
  //           },
  //         },
  //       },
  //     },
  //   },
  //   async function (request, reply) {
  //     return "registration page";
  //   }
  // );

  app.post(
    "/google",
    {
      schema: {
        tags: ["Authentication"],
        summary: "Authenticate with Google",
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
    async function (request, reply) {
      return "login page for google";
    }
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
