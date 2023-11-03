/**
 * @file Fixtures - INPUT_TRAILERS
 * @module fixtures/input-trailers
 */

import { join } from '@flex-development/tutils'
import BOT from './bot.fixture'

export default join([
  `Signed-off-by: ${BOT.name} <${BOT.email}>`,
  'Co-authored-by: unicornware<unicornware@flexdevelopment.llc>'
], '\n')
