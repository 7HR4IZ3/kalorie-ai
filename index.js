import Fastify from "fastify";
import setup from "./setup.js";

const app = Fastify({
  logger: true,
});

await setup(app, {});

export default async function handler(req, reply) {
  await app.ready();
  app.server.emit("request", req, reply);
}
