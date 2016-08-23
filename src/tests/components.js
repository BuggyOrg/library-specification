/* global describe, it */

import chai from 'chai'
import chaiHttp from 'chai-http'
// import _ from 'lodash'

export default function (setup) {
  chai.use(chaiHttp)
  var expect = chai.expect

  describe('Components', () => {
    it('gets the number of components', () => {
      return setup({Components: []})
        .then((app) =>
          chai.request(app)
          .get('/components/count')
        )
        .then((res) => {
          expect(res.body).to.equal(0)
        })
        .then(() => setup({Components: [{meta: 'a', value: 1, version: '0.1.0'}, {meta: 'b', value: 2, version: '1.0.0'}]}))
        .then((app) =>
          chai.request(app)
          .get('/components')
        )
        .then((res) => {
          expect(res.body).to.have.members(['a', 'b'])
        })
    })

    it('can query a specific component', () => {
      return setup({Components: [{meta: 'a', value: 1, version: '0.1.0'}, {meta: 'b', value: 2, version: '1.0.0'}]})
        .then((app) =>
          chai.request(app)
          .get('/components/get/a')
        )
        .then((res) => {
          expect(res.body.value).to.equal(1)
        })
    })

    it('can query a specific component with a given version', () => {
      return setup({Components: [{meta: 'a', value: 1, version: '0.1.0'}, {meta: 'a', value: 2, version: '0.2.0'}]})
        .then((app) =>
          chai.request(app)
          .get('/components/get/a/version/0.2.0')
        )
        .then((res) => {
          expect(res.body.value).to.equal(2)
        })
    })

    it('sends an error code if the specific component with a given version does not exist', () => {
      return setup({Components: [{meta: 'a', value: 1, version: '0.1.0'}, {meta: 'a', value: 2, version: '0.2.0'}]})
        .then((app) =>
          chai.request(app)
          .get('/components/get/a/version/0.1.2')
        )
        .then((res) => {
          expect(false).to.be.true
        })
        .catch((err) => {
          expect(err.status).to.equal(404)
        })
    })

    it('sends an error code if the component does not exist', () => {
      return setup({Components: []})
        .then((app) =>
          chai.request(app)
          .get('/components/get/b')
        )
        .then((res) => {
          expect(false).to.be.true
        })
        .catch((err) => {
          expect(err.status).to.equal(404)
        })
    })

    it('inserts new components', () => {
      return setup({Components: []})
        .then((app) => 
          chai.request(app)
            .post('/components')
            .send({meta: 'a', ports: [{}], version: '1.0.0'})
            .then((res) => {
              expect(res.status).to.equal(204)
            })
            .then(() => chai.request(app).get('/components/count'))
            .then((res) => expect(res.body).to.equal(1))
        )
    })

    it('inserting an invalid component gives a 400 status code', () => {
      return setup({Components: []})
        .then((app) =>
          chai.request(app)
            .post('/components')
            .send({meta: 'a', ports: [{}]})
            .then((res) => {
              expect.fail('Adding an invalid component should send a 400 status code.')
            })
            .catch((err) => {
              expect(err.status).to.equal(400)
            })
        )
    })

    it('it is impossible to add two components with the same name', () => {
      return setup({Components: []})
        .then((app) =>
          chai.request(app)
            .post('/components')
            .send({meta: 'a', ports: [{}], version: '1.0.0'})
            .then((res) => chai.request(app)
              .post('/components')
              .send({meta: 'a', ports: [{}], version: '1.0.0'}))
            .then((res) => {
              expect.fail('Adding a component twice should be impossible.')
            })
            .catch((err) => {
              expect(err.status).to.equal(400)
            })
        )
    })

    it('updates a component', () => {
      setup({Components: [{meta: 'b'}, {meta: 'a', value: 1, version: '0.1.0'}, {meta: 'c'}]})
        .then((app) => 
          chai.request(app)
            .post('/components')
            .send({meta: 'a', value: 2, ports: [{}], version: '0.2.0'})
            .then((res) => {
              expect(res.status).to.equal(204)
            })
            .then(() => chai.request(app).get('/components/get/a'))
            .then((res) => expect(res.body.value).to.equal(2))
        )  
    })
  })
}
