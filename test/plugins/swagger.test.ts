import { test } from "node:test";
import * as assert from "node:assert";
import { build } from "../helper.js";

test("test swagger server", async (context) => {
  const app = await build(context);

  const response = await app.inject({
    url: "/documentation",
  });

  assert.equal(response.statusCode, 200);
});
