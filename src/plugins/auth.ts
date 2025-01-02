import fp from "fastify-plugin";
import { auth } from "../lib/firebase.js";

export interface AuthPluginOptions {
  // Specify Auth plugin options here
}

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp<AuthPluginOptions>(async (fastify, opts) => {
  fastify.addHook("onRequest", async (request, reply) => {
    const routeConfig = request.routeOptions.config as { [key: string]: any };

    // Skip authentication for anonymous routes
    if (routeConfig.anonymous ?? false) {
      return;
    }

    if (routeConfig.requiresAuthorization ?? true) {
      const authorizationToken = request.headers[
        process.env.CLIENT_AUTHORIZATION_HEADER ||
          "x-kalorieai-client-authorization-token"
      ] as string;

      if (
        !authorizationToken ||
        authorizationToken !== process.env.CLIENT_AUTHORIZATION_TOKEN
      ) {
        return reply.status(401).send({
          error: "unauthorized",
          message: "Invalid authorization token",
        });
      }
    }

    if (routeConfig.requiresAuthentication ?? true) {
      const authenticationToken = (
        request.headers.authorization || ""
      ).substring(7);
      if (!authenticationToken) {
        return reply
          .status(401)
          .send({ error: "unauthorized", message: "No authentication token" });
      }

      try {
        // TODO: Remove this!!
        if (
          process.env.ENVIRONMENT === "development" &&
          authenticationToken === "demo-auth-token"
        ) {
          request.user = { uid: "user@kalorie.ai" };
          return;
        }

        const decodedToken = fastify.jwt.verify<{ uid: string; email: string }>(
          authenticationToken,
          {
            allowedIss: process.env.AUTHENTICATION_JWT_ISSUER,
            allowedAud: process.env.AUTHENTICATION_JWT_AUDIENCE,
            key: process.env.AUTHENTICATION_JWT_SECRET as string,
          }
        );

        if (decodedToken) {
          const user = await auth.getUser(decodedToken.uid);
          if (!user) {
            return reply.status(401).send({
              error: "unauthorized",
              message: "Invalid authentication token",
            });
          }

          request.user = user;
          return;
        }
      } catch {
        return reply.status(401).send({
          error: "unauthorized",
          message: "Invalid authentication token",
        });
      }
    }
  });
});

// When using .decorate you have to specify added properties for Typescript
declare module "fastify" {
  export interface FastifyInstance {}
}
