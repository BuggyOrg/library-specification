/* global describe, it */

import chai from 'chai'
import chaiHttp from 'chai-http'
import chaiAsPromised from 'chai-as-promised'
// import _ from 'lodash'

export default function (serve) {
  chai.use(chaiHttp)
  chai.use(chaiAsPromised)
  var expect = chai.expect

  describe('Meta information', () => {
    it('gets meta information for a component', () => {
      return chai.request(serve({Components: [{meta: 'a', version: '1.0.0'}], meta: {a: {x: [{value: 'y', version: '1.0.0'}]}}}))
        .get('/meta/a/x')
        .then((res) => {
          expect(res.status).to.equal(200)
          expect(res.body).to.equal('y')
        })
    })

    it('uses latest meta information', () => {
      return chai.request(serve(
        {
          Components: [{meta: 'a', version: '1.0.0'}, {meta: 'a', version: '0.8.0'}],
          meta: {a: {x: [{value: 'y', version: '0.8.0'}, {value: 'z', version: '1.0.0'}]}}
        }))
        .get('/meta/a/x')
        .then((res) => {
          expect(res.status).to.equal(200)
          expect(res.body).to.equal('z')
        })
    })

    it('uses meta information from older components', () => {
      return chai.request(serve(
        {
          Components: [{meta: 'a', version: '1.0.0'}, {meta: 'a', version: '0.8.0'}],
          meta: {a: {x: [{value: 'y', version: '0.8.0'}]}}
        }))
        .get('/meta/a/x')
        .then((res) => {
          expect(res.status).to.equal(200)
          expect(res.body).to.equal('y')
        })
    })

    it('allows specific queries with version information', () => {
      return chai.request(serve(
        {
          Components: [{meta: 'a', version: '1.0.0'}, {meta: 'a', version: '0.8.0'}],
          meta: {a: {x: [{value: 'y', version: '0.8.0'}, {value: 'z', version: '1.0.0'}]}}
        }))
        .get('/meta/a/version/0.8.0/x')
        .then((res) => {
          expect(res.status).to.equal(200)
          expect(res.body).to.equal('y')
        })
    })

    it('can query all meta keys for a component', () => {
      return chai.request(serve(
        {
          Components: [{meta: 'a', version: '0.1.0'}],
          meta: {a: {x: [{value: 'y', version: '0.1.0'}], y: [{value: 'z', version: '0.1.0'}]}}
        }))
        .get('/meta/a')
        .then((res) => {
          expect(res.status).to.equal(200)
          expect(res.body).to.eql(['x', 'y'])
        })
    })

    it('queries all meta keys for a component at a specific version', () => {
      var app = serve({
        Components: [{meta: 'a', version: '1.0.0'}, {meta: 'a', version: '0.8.0'}],
        meta: {a: {x: [{value: 'y', version: '0.8.0'}], y: [{value: 'z', version: '1.0.0'}]}}
      })
      return chai.request(app)
        .get('/meta/a/version/0.8.0')
        .then((res) => {
          expect(res.status).to.equal(200)
          expect(res.body).to.eql(['x'])
        })
    })

    it('queries all meta keys for a component at a specific version and earlier', () => {
      var app = serve({
        Components: [{meta: 'a', version: '1.0.0'}, {meta: 'a', version: '0.8.0'}],
        meta: {a: {x: [{value: 'y', version: '0.8.0'}], y: [{value: 'z', version: '1.0.0'}]}}
      })
      return chai.request(app)
        .get('/meta/a/version/1.0.0')
        .then((res) => {
          expect(res.status).to.equal(200)
          expect(res.body).to.eql(['x', 'y'])
        })
    })

    it('sets meta information for a component', () => {
      var app = serve({Components: [{meta: 'a', version: '0.1.0'}], meta: {}})
      return chai.request(app)
        .post('/meta/a/x')
        .send({value: 'z'})
        .then((res) => expect(res.status).to.equal(204))
        .then(() => chai.request(app)
          .get('/meta/a/x'))
        .then((res) => {
          expect(res.status).to.equal(200)
          expect(res.body).to.equal('z')
        })
    })

    it('sets meta information for the latest version of the component', () => {
      var app = serve({Components: [{meta: 'a', version: '0.1.0'}, {meta: 'a', version: '0.2.0'}], meta: {}})
      return chai.request(app)
        .post('/meta/a/x')
        .send({value: 'z'})
        .then((res) => expect(res.status).to.equal(204))
        .then(() => chai.request(app)
          .get('/meta/a/version/0.1.0'))
        .then((res) => {
          expect(res.status).to.equal(200)
          expect(res.body).to.have.length(0)
        })
    })

    it('fails to get non-existing meta information', () => {
      return expect(chai.request(serve({Components: [{meta: 'a', version: '0.1.0'}], meta: {a: {x: [{value: 'y', version: '0.1.0'}]}}}))
        .get('/meta/a/z')
        .then((res) => {
        })).to.be.rejected
    })

    it('fails to get meta information for a non-existing component', () => {
      return expect(chai.request(serve({Components: [{meta: 'a', version: '0.1.0'}], meta: {a: {x: [{value: 'y', version: '0.1.0'}]}}}))
        .get('/meta/b/x')
        .then((res) => {
        })).to.be.rejected
    })

    it('fails to set meta information for a non-existing component', () => {
      return expect(chai.request(serve({Components: [], meta: {}}))
        .post('/meta/b/x')
        .send({value: 'z'})
        .then((res) => {
        })).to.be.rejected
    })

    it('errors if the post value is invalid', () => {
      return expect(chai.request(serve({Components: [{meta: 'a', version: '0.1.0'}], meta: {a: {x: [{value: 'y', version: '0.1.0'}]}}}))
        .post('/meta/a/x')
        .send({X: 4})
        .then((res) => {
          expect(res.status).to.equal(400)
        })).to.be.rejected
    })
  })
}
