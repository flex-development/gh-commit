/**
 * @file Entry Point - Test Setup Files
 * @module tests/setup
 */

import INPUT_API from '#fixtures/input-api.fixture'
import INPUT_TRAILERS from '#fixtures/input-trailers.fixture'
import './chai'
import './faker'
import './matchers'
import './serializers'

beforeAll(() => {
  vi.stubEnv('INPUT_API', INPUT_API)
  vi.stubEnv('INPUT_OWNER', 'flex-development')
  vi.stubEnv('INPUT_REPO', 'gh-commit')
  vi.stubEnv('INPUT_TOKEN', import.meta.env.GITHUB_TOKEN)
  vi.stubEnv('INPUT_TRAILERS', INPUT_TRAILERS)
  vi.stubEnv('INPUT_WORKSPACE', process.cwd())
})
