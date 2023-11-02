/**
 * @file Unit Tests - CommitCommand
 * @module commit-action/commands/tests/unit/CommitCommand
 */

import { BranchQuery } from '#src/queries'
import { join } from '@flex-development/tutils'
import TestSubject from '../commit.command'

describe('unit:commands/CommitCommand', () => {
  describe('constructor', () => {
    let bot: { email: string; name: string }
    let headline: string
    let trailers: [string, string]
    let subject: TestSubject

    beforeAll(() => {
      bot = {
        email: '148604919+flex-development[bot]@users.noreply.github.com',
        name: 'flex-development[bot]'
      }

      subject = new TestSubject({
        files: ['CHANGELOG.md', 'package.json'],
        message: headline = 'release: 1.0.0',
        owner: 'flex-development',
        ref: 'release/1.0.0',
        repo: 'commit-action',
        trailers: trailers = [
          `Signed-off-by: ${bot.name} <${bot.email}>`,
          'Co-authored-by: unicornware<unicornware@flexdevelopment.llc>'
        ]
      })
    })

    it('should set #branch', () => {
      expect(subject).to.have.property('branch').be.instanceof(BranchQuery)
    })

    it('should set #message', () => {
      expect(subject).to.have.deep.property('message', {
        body: join(trailers, '\n') + '\n',
        headline
      })
    })
  })
})
