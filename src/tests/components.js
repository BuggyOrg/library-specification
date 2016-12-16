/* global describe, it */

import chai from 'chai'
import chaiHttp from 'chai-http'
// import _ from 'lodash'

export default function (setup) {
  chai.use(chaiHttp)
  var expect = chai.expect

  describe('Components', () => {
    it('gets the number of components', () => {
      return setup({components: []})
        .then((app) =>
          chai.request(app)
          .get('/components/count')
        )
        .then((res) => {
          expect(res.body).to.equal(0)
        })
        .then(() => setup({components: [
          {componentId: 'a', value: 1, ports: [{ port: 'in', kind: 'input', type: 'generic' }], version: '0.1.0'},
          {componentId: 'b', value: 2, ports: [{ port: 'in', kind: 'input', type: 'generic' }], version: '1.0.0'}
        ]}))
        .then((app) =>
          chai.request(app)
          .get('/components')
        )
        .then((res) => {
          expect(res.body).to.have.members(['a', 'b'])
        })
    })

    it('can query a specific component', () => {
      return setup({components: [
        {componentId: 'a', value: 1, ports: [{ port: 'in', kind: 'input', type: 'generic' }], version: '0.1.0'},
        {componentId: 'b', value: 2, ports: [{ port: 'in', kind: 'input', type: 'generic' }], version: '1.0.0'}
      ]})
        .then((app) =>
          chai.request(app)
          .get('/components/get/a')
        )
        .then((res) => {
          expect(res.body.value).to.equal(1)
        })
    })

    it('can query a specific component with a given version', () => {
      return setup({components: [
        {componentId: 'a', value: 1, ports: [{ port: 'in', kind: 'input', type: 'generic' }], version: '0.1.0'},
        {componentId: 'a', value: 2, ports: [{ port: 'in', kind: 'input', type: 'generic' }], version: '0.2.0'}
      ]})
        .then((app) =>
          chai.request(app)
          .get('/components/get/a/version/0.2.0')
        )
        .then((res) => {
          expect(res.body.value).to.equal(2)
        })
    })

    it('sends an error code if the specific component with a given version does not exist', () => {
      return setup({components: [
        {componentId: 'a', value: 1, ports: [{ port: 'in', kind: 'input', type: 'generic' }], version: '0.1.0'},
        {componentId: 'a', value: 2, ports: [{ port: 'in', kind: 'input', type: 'generic' }], version: '0.2.0'}
      ]})
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
      return setup({components: []})
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
      return setup({components: []})
        .then((app) =>
          chai.request(app)
            .post('/components')
            .send({componentId: 'a', ports: [{ port: 'in', kind: 'input', type: 'generic' }], version: '1.0.0'})
            .then((res) => {
              expect(res.status).to.equal(204)
            })
            .then(() => chai.request(app).get('/components/count'))
            .then((res) => expect(res.body).to.equal(1))
        )
    })

    it('inserting an invalid component gives a 400 status code', () => {
      return setup({components: []})
        .then((app) =>
          chai.request(app)
            .post('/components')
            .send({componentId: 'a'}) // no ports, no version
            .then((res) => {
              expect.fail('Adding an invalid component should send a 400 status code.')
            })
            .catch((err) => {
              expect(err.status).to.equal(400)
            })
        )
    })

    it('it is impossible to add two components with the same name', () => {
      return setup({components: []})
        .then((app) =>
          chai.request(app)
            .post('/components')
            .send({componentId: 'a', ports: [{ port: 'in', kind: 'input', type: 'generic' }], version: '1.0.0'})
            .then((res) => chai.request(app)
              .post('/components')
              .send({componentId: 'a', ports: [{ port: 'in', kind: 'input', type: 'generic' }], version: '1.0.0'}))
            .then((res) => {
              expect.fail('Adding a component twice should be impossible.')
            })
            .catch((err) => {
              expect(err.status).to.equal(409)
            })
        )
    })

    it('updates a component', () => {
      setup({components: [{componentId: 'b'}, {componentId: 'a', value: 1, version: '0.1.0'}, {componentId: 'c'}]})
        .then((app) =>
          chai.request(app)
            .post('/components')
            .send({componentId: 'a', value: 2, ports: [{ port: 'in', kind: 'input', type: 'generic' }], version: '0.2.0'})
            .then((res) => {
              expect(res.status).to.equal(204)
            })
            .then(() => chai.request(app).get('/components/get/a'))
            .then((res) => expect(res.body.value).to.equal(2))
        )
    })
  })
}
