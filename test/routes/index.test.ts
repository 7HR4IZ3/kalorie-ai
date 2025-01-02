import "dotenv/config";

import { test } from "node:test";
import * as assert from "node:assert";
import { build } from "../helper.js";

test("test root route", async (context) => {
  const app = await build(context);

  const res = await app.inject({
    url: "/",
  });
  assert.deepStrictEqual(JSON.parse(res.payload), {
    app: "Kalorie AI",
    version: "1.0.0",
    pong: true,
  });
});
