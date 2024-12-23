"use strict";

import "dotenv/config";

// Pass --options via CLI arguments in command to enable these options.
const options = {};

export default async function (app, opts) {
  // Place here your custom code!

  app.register(import('./api/plugins/sensible.js'));
  app.register(import('./api/plugins/swagger.js'));
  app.register(import('./api/plugins/support.js'));

  app.register(import('./api/routes/index.js'));
  app.register(import("./auth.js"), { prefix: "/auth" });
  app.register(import("./users.js"), { prefix: "/users" });
}

export { options };
