'use strict'

export default async function (app, opts) {
  app.get('/', async function (request, reply) {
    return { root: true }
  });

  app.post('/analyze', async function (request, reply) {
    return "analyze page"
  });
}
