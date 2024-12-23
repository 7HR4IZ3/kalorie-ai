"use strict";

export default async function (app, opts) {
  app.post("/login", async function (request, reply) {
    return "login page";
  });

  app.post("/register", async function (request, reply) {
    return "registration page";
  });

  app.post("/google", async function (request, reply) {
    return "login page for google";
  });

  app.post("/apple", async function (request, reply) {
    return "login page for apple";
  });
}
