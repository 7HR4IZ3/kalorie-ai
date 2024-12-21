'use strict'

import { test } from 'node:test'
import { equal } from 'node:assert'
import { build } from '../helper'

test('example is loaded', async (t) => {
  const app = await build(t)

  const res = await app.inject({
    url: '/example'
  })
  equal(res.payload, 'this is an example')
})

// inject callback style:
//
// test('example is loaded', (t) => {
//   t.plan(2)
//   const app = await build(t)
//
//   app.inject({
//     url: '/example'
//   }, (err, res) => {
//     t.error(err)
//     assert.equal(res.payload, 'this is an example')
//   })
// })
