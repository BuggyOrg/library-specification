/* global describe, it */

import chai from 'chai'
import chaiHttp from 'chai-http'

import testComponents from './components'
import testConfig from './config'
import testMeta from './meta'

import { normalizeDb } from './util'

export default function (setup) {
  chai.use(chaiHttp)
  var expect = chai.expect

  describe('The library server', () => {
    it('exposes basic information', () => {
      return setup({})
        .then((app) =>
          chai.request(app)
          .get('/info')
        )
        .then((res) => {
          expect(res.status).to.equal(200)
          expect(res.body).to.be.ok
          expect(res.body.version).to.be.defined
          expect(res.body.type).to.be.defined
        })
    })

    it('can export the complete DB', () => {
      const db = {
        Components: [{meta: 'a', version: '1.0.0'}, {meta: 'a', version: '0.8.0'}],
        meta: {a: {x: [{value: 'y', version: '0.8.0'}, {value: 'z', version: '1.0.0'}]}},
        config: { a: 1 }
      }

      return setup(db)
        .then((app) =>
          chai.request(app)
          .get('/export')
        )
        .then((res) => {
          expect(res.status).to.equal(200)
          expect(normalizeDb(res.body)).to.deep.equal(normalizeDb(db))
        })
    })
  })

  testComponents(setup)
  testConfig(setup)
  testMeta(setup)
}
