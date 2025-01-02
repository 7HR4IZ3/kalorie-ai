// This file contains code that we reuse between our tests.
import helper from 'fastify-cli/helper.js'
import * as test from 'node:test'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { FastifyInstance } from 'fastify';

export type TestContext = {
  after: typeof test.after
};

export const TEST_VALUES = {
  accessToken: null
}

export const TEST_CREDENTIALS = {
  email: "test@kalorie.ai",
  password: "test@kalorie.ai",
};

export const TEST_USER_DETAILS = {
  name: "Test User",
  gender: "male",
  workout_periods: "0-2",
  tried_other_tracking_apps: "yes",
  height: 180,
  weight: 80,
  age: "20-30",
  goal: "lose_weight",
  desited_weight: 100,
  goal_speed: 0.5,
  current_limitation: "consistency",
  following_a_diet: "classic",
  accomplishment_goal: "eat_healthier"
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const AppPath = path.join(__dirname, '..', 'src', 'index.ts')

// Fill in this config with all the configurations
// needed for testing the application
async function config () {
  return {}
}

// Automatically build and tear down our instance
async function build (t: TestContext): Promise<FastifyInstance> {
  // you can set all the options supported by the fastify CLI command
  const argv = [AppPath]

  // fastify-plugin ensures that all decorators
  // are exposed for testing purposes, this is
  // different from the production setup
  const app = await helper.build(argv, await config())

  // Tear down our app after we are done
  t.after(() => void app.close())

  return app
}

export {
  config,
  build
}
