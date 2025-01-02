import { test } from "node:test";
import * as assert from "node:assert";
import { build } from "../helper.js";

const TEST_CREDENTIALS = {
  email: "test@kalorie.ai",
  password: "test@kalorie.ai",
};

test("test unregistered user login", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    headers: {
      [
        process.env.CLIENT_AUTHORIZATION_HEADER ||
        "X-KALORIEAI-CLIENT-AUTHORIZATION-TOKEN"
      ]:
        process.env.CLIENT_AUTHORIZATION_TOKEN,
    },
    url: "/auth/login",
    method: "POST",
    body: TEST_CREDENTIALS,
  });

  assert.equal(res.statusCode, 401);
});
