import "dotenv/config";

import { test } from "node:test";
import * as assert from "node:assert";
import { build, TEST_VALUES, TEST_USER_DETAILS, TEST_CREDENTIALS } from "../helper.js";

test("test unregistered user login", async (context) => {
  const app = await build(context);

  const res = await app.inject({
    headers: {
      [process.env.CLIENT_AUTHORIZATION_HEADER as string]:
        process.env.CLIENT_AUTHORIZATION_TOKEN,
    },
    url: "/auth/login",
    method: "POST",
    body: TEST_CREDENTIALS,
  });

  assert.equal(res.statusCode, 401);
});

test("test user registration", async (context) => {
  const app = await build(context);

  const res = await app.inject({
    headers: {
      [process.env.CLIENT_AUTHORIZATION_HEADER as string]:
        process.env.CLIENT_AUTHORIZATION_TOKEN,
    },
    url: "/auth/register",
    method: "POST",
    body: {
      ...TEST_CREDENTIALS,
      ...TEST_USER_DETAILS
    },
  });

  assert.equal(res.statusCode, 200);

  const { accessToken } = JSON.parse(res.payload);
  TEST_VALUES.accessToken = accessToken;
});

test("test user login", async (context) => {
  const app = await build(context);

  const res = await app.inject({
    headers: {
      [process.env.CLIENT_AUTHORIZATION_HEADER as string]:
        process.env.CLIENT_AUTHORIZATION_TOKEN,
    },
    url: "/auth/login",
    method: "POST",
    body: TEST_CREDENTIALS,
  });

  assert.equal(res.statusCode, 200);

  const { accessToken } = JSON.parse(res.payload);
  TEST_VALUES.accessToken = accessToken;
});
