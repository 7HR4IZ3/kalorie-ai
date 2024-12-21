'use strict'

import { test } from 'node:test'
import { deepStrictEqual } from 'node:assert'
import { build } from '../helper'

test('default root route', async (t) => {
  const app = await build(t)

  const res = await app.inject({
    url: '/'
  })
  deepStrictEqual(JSON.parse(res.payload), { root: true })
})

// inject callback style:
//
// test('default root route', (t) => {
//   t.plan(2)
//   const app = await build(t)
//
//   app.inject({
//     url: '/'
//   }, (err, res) => {
//     t.error(err)
//     assert.deepStrictEqual(JSON.parse(res.payload), { root: true })
//   })
// })
