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
      return serve({config: {c: 2}})
        .then((app) =>
          chai.request(app)
          .get('/config/c')
        )
        .then((res) => {
          expect(res.status).to.equal(200)
          expect(res.body).to.equal(2)
        })
    })

    it('sets configuration settings', () => {
      return serve({config: {}})
        .then((app) => {
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
    })

    it('errors if the post value is invalid', () => {
      return serve({config: {}})
        .then((app) => {
          return expect(chai.request(app)
            .post('/config/d')
            .send({X: 4})
            .then((res) => {
            })).to.be.rejected
        })
    })

    it('errors if the config is not defined', () => {
      return serve({config: {}})
        .then((app) => {
          return expect(chai.request(app)
            .get('/config/r')
            .then((res) => {
            })).to.be.rejected
        })
    })
  })
}
