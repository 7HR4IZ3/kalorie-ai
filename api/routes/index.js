'use strict'

export default async function (app, opts) {
  app.get('/', async function (request, reply) {
    return { root: true }
  });

  app.register(import("./auth.js"), { prefix: "/auth" });
  app.register(import("./users.js"), { prefix: "/users" });

  app.post('/analyze', async function (request, reply) {
    return "analyze page"
  });
}
