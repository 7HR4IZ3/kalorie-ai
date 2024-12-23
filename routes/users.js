"use strict";

export default async function (app, opts) {
  app.get("/:userId", async function (request, reply) {
    return "user page " + request.params.userId;
  });

  app.put("/:userId", async function (request, reply) {
    return "update user page";
  });

  app.delete("/:userId", async function (request, reply) {
    return "delete user page";
  });
}
