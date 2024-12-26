import type { FastifyPluginAsync } from "fastify";

const analyze: FastifyPluginAsync = async function (app, opts) {
  app.post(
    "/analyze",
    {
      schema: {
        tags: ["Food Analysis"],
        summary: "Analyze food image for calorie information",
        body: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  image: {
                    type: "string",
                    format: "binary",
                    description: "Food image file",
                  },
                },
              },
            },
          },
        },
        response: {
          200: {
            description: "Image analyzed successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "FoodAnalysisResult#",
                },
              },
            },
          },
          400: {
            description: "Invalid image",
            content: {
              "application/json": {
                schema: {
                  $ref: "HttpError",
                },
              },
            },
          },
        },
      },
    },
    async function (request, reply) {
      return "analyze page";
    }
  );
};

export default analyze;
