import fp from "fastify-plugin";
import { auth } from "../lib/firebase.js";

export interface AuthPluginOptions {
  // Specify Auth plugin options here
}

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp<AuthPluginOptions>(async (fastify, opts) => {
  fastify.addHook("onRequest", async (request, reply) => {
    const authorizationToken = request.headers[
      (process.env.CLIENT_AUTHORIZATION_HEADER as string) ||
        "X-KALORIEAI-CLIENT-AUTHORIZATION-TOKEN"
    ] as string;

    if (!authorizationToken || authorizationToken !== process.env.CLIENT_AUTHORIZATION_TOKEN) {
      return reply.unauthorized("Invalid authorization token");
    }

    const authenticationToken = (request.headers.authorization || "").substring(7);
    if (!authenticationToken) {
      return reply.unauthorized("No authentication token");
    }

    // const user = await auth.ver(authenticationToken);
  });
});

// When using .decorate you have to specify added properties for Typescript
declare module "fastify" {
  export interface FastifyInstance {}
}
