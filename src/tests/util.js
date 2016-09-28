import _ from 'lodash'

/**
 * Normalizes a database so that the arrays have a well-defined order.
 * @export
 * @param {object} db database object
 * @returns new normalized database object
 */
export function normalizeDb (db) {
  db = _.cloneDeep(db)
  return {
    components: _.sortBy(db.components || [], ['componentId', 'version']),
    meta: _.map(db.meta || {}, (keyValues, meta) =>
      _.map(keyValues, (values, key) => _.sortBy(values, ['version']))
    ),
    config: db.config
  }
}
