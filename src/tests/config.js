/* global describe, it */

import chai from 'chai'
import chaiHttp from 'chai-http'
import chaiAsPromised from 'chai-as-promised'
// import _ from 'lodash'

export default function (serve) {
  chai.use(chaiHttp)
  chai.use(chaiAsPromised)
  var expect = chai.expect

  describe('Configuration', () => {
    it('get configuration settings', () => {
      return chai.request(serve({config: {c: 2}}))
        .get('/config/c')
        .then((res) => {
          expect(res.status).to.equal(200)
          expect(res.body).to.equal(2)
        })
    })

    it('sets configuration settings', () => {
      var app = serve({config: {}})
      return chai.request(app)
        .post('/config/d')
        .send({value: 4})
        .then((res) => {
          expect(res.status).to.equal(204)
        })
        .then(() => chai.request(app).get('/config/d'))
        .then((res) => {
          expect(res.status).to.equal(200)
          expect(res.body).to.equal(4)
        })
    })

    it('errors if the post value is invalid', () => {
      var app = serve({config: {}})
      return expect(chai.request(app)
        .post('/config/d')
        .send({X: 4})
        .then((res) => {
        })).to.be.rejected
    })

    it('errors if the config is not defined', () => {
      var app = serve({config: {}})
      return expect(chai.request(app)
        .get('/config/r')
        .then((res) => {
        })).to.be.rejected
    })

    it('can export the complete DB', () => {
      return chai.request(serve({Components: [], meta: {}, config: {a: 1}}))
      .get('/export')
      .then((res) => {
        expect(res.status).to.equal(200)
        expect(res.body).to.eql({Components: [], meta: {}, config: {a: 1}})
      })
    })
  })
}
