import Fastify from 'fastify'
import setup from '../app'

const app = Fastify({
  logger: true,
})

setup(app, {});

export default async function handler(req, reply) {
  await app.ready()
  app.server.emit('request', req, reply)
}

