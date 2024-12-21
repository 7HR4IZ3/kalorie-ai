'use strict'

import { test } from 'node:test'
import { equal } from 'node:assert'

import Fastify from 'fastify'
import Support from '../../plugins/support'

test('support works standalone', async (t) => {
  const fastify = Fastify()
  fastify.register(Support)

  await fastify.ready()
  equal(fastify.someSupport(), 'hugs')
})

// You can also use plugin with opts in fastify v2
//
// test('support works standalone', (t) => {
//   t.plan(2)
//   const fastify = Fastify()
//   fastify.register(Support)
//
//   fastify.ready((err) => {
//     t.error(err)
//     assert.equal(fastify.someSupport(), 'hugs')
//   })
// })
