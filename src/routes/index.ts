"use strict";

import { FastifyPluginAsync } from "fastify";

const index: FastifyPluginAsync = async function (app, opts) {
  app.get(
    "/",
    {
      schema: {
        tags: ["Server Status"],
        summary: "Check if the server is alive",
        response: {
          200: {
            type: "object",
            properties: {
              app: { type: "string" },
              version: { type: "string" },
              pong: { type: "boolean" },
            },
          },
        },
      },
    },
    (request, reply) => {
      return { app: "Kalorie AI", version: "1.0.0", pong: true };
    }
  );
};

export default index;
