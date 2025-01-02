import "dotenv/config";

import { test } from "node:test";
import * as assert from "node:assert";
import { build, TEST_VALUES, TEST_USER_DETAILS, TEST_CREDENTIALS } from "../helper.js";

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
      [process.env.CLIENT_AUTHORIZATION_HEADER as string]:
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
      [process.env.CLIENT_AUTHORIZATION_HEADER as string]:
        process.env.CLIENT_AUTHORIZATION_TOKEN,
      authorization: `Bearer ${TEST_VALUES.accessToken}`,
    },
  });

  assert.equal(res.statusCode, 200);
  assert.deepStrictEqual(
    JSON.parse(res.payload),
    {
      email: TEST_CREDENTIALS.email,
      ...TEST_USER_DETAILS
    }
  );
});
