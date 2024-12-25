import "dotenv/config";

import { AutoloadPluginOptions } from "@fastify/autoload";
import { FastifyPluginAsync } from "fastify";

export type AppOptions = {
  // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>;

// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {};

const setup: FastifyPluginAsync<AppOptions> = async (app, opts): Promise<void> => {
  // Place here your custom code!

  // Plugins
  app.register(import("./plugins/sensible.js"));
  app.register(import("./plugins/swagger.js"));

  // Routes
  app.register(import("./routes/index.js"));
  app.register(import("./routes/analyze.js"));
  app.register(import("./routes/auth.js"), { prefix: "/auth" });
  app.register(import("./routes/users.js"), { prefix: "/users" });
};

export default setup;
export { setup, options };
