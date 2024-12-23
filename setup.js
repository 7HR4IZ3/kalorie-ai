"use strict";

import "dotenv/config";
import { join } from "node:path";
import AutoLoad from "@fastify/autoload";

import { readdir } from "fs/promises";

// Pass --options via CLI arguments in command to enable these options.
const options = {};

export default async function (fastify, opts) {
  // Place here your custom code!

  // fastify.register(import('fastify-cors'))
  // fastify.register(import('fastify-helmet'))
  // fastify.register(import('fastify-rate-limit'))

  console.log(await readdir(join(import.meta.dirname)));

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: join(import.meta.dirname, "api", "plugins"),
    options: Object.assign({}, opts),
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: join(import.meta.dirname, "api", "routes"),
    options: Object.assign({}, opts),
  });
}

export { options };
