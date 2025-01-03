import fastify from "fastify";
import setup from "../build/index.js";

const app = fastify({
  logger: true,
});

await setup(app, {});

export default async function handler(req, res) {
  await app.ready();
  app.server.emit("request", req, res);
}
