import { test } from "node:test";
import * as assert from "node:assert";
import { build } from "../helper.js";

test("test unauthorized user", async (context) => {
  const app = await build(context);

  const res = await app.inject({
    url: "/user",
  });

  assert.equal(res.statusCode, 401);
  assert.deepStrictEqual(JSON.parse(res.payload), {
    error: "unauthorized",
    message: "Invalid authorization token",
  });
});

test("test unauthenticated user", async (context) => {
  const app = await build(context);

  const res = await app.inject({
    url: "/user",
    headers: {
      [
        process.env.CLIENT_AUTHORIZATION_HEADER ||
          "X-KALORIEAI-CLIENT-AUTHORIZATION-TOKEN"
      ]:
        process.env.CLIENT_AUTHORIZATION_TOKEN,
    },
  });

  assert.equal(res.statusCode, 401);
  assert.deepStrictEqual(JSON.parse(res.payload), {
    error: "unauthorized",
    message: "No authentication token",
  });
});

test("test authenticated user", async (context) => {
  const app = await build(context);

  const res = await app.inject({
    url: "/user",
    headers: {
      [
        process.env.CLIENT_AUTHORIZATION_HEADER ||
          "X-KALORIEAI-CLIENT-AUTHORIZATION-TOKEN"
      ]:
        process.env.CLIENT_AUTHORIZATION_TOKEN,
      authorization: "Bearer demo-auth-token"
    },
  });

  assert.equal(res.statusCode, 200);
  assert.deepStrictEqual(JSON.parse(res.payload), { email: "user@kalorie.ai" });
});
