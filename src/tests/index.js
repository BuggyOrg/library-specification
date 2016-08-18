import testComponents from './components'
import testConfig from './config'
import testMeta from './meta'

export default function (serve) {
  testComponents(serve)
  testConfig(serve)
  testMeta(serve)
}
