import "dotenv/config";

import cors from "@fastify/cors";
import { AutoloadPluginOptions } from "@fastify/autoload";
import { FastifyPluginAsync } from "fastify";

export type AppOptions = {
  // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>;

// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {};

const setup: FastifyPluginAsync<AppOptions> = async (app, options) => {
  if (!process.env.AUTHENTICATION_JWT_SECRET) {
    throw new Error("AUTHENTICATION_JWT_SECRET is not set");
  }

  app.register(cors, {
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    preflightContinue: true,
    credentials: true,
  });

  app.register(import("@fastify/jwt"), {
    secret: process.env.AUTHENTICATION_JWT_SECRET as string,
  });

  // Plugins
  app.register(import("./plugins/auth.js"));
  app.register(import("./plugins/swagger.js"));
  app.register(import("./plugins/sensible.js"));

  // Routes
  app.register(import("./routes/index.js"));
  app.register(import("./routes/analyze.js"));
  app.register(import("./routes/auth.js"), { prefix: "/auth" });
  app.register(import("./routes/user.js"), { prefix: "/user" });
};

export default setup;
export { setup, options };
