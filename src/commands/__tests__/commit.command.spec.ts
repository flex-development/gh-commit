/**
 * @file Unit Tests - CommitCommand
 * @module commit-action/commands/tests/unit/CommitCommand
 */

import INPUT_TRAILERS from '#fixtures/input-trailers.fixture'
import { BranchQuery } from '#src/queries'
import { join, split } from '@flex-development/tutils'
import TestSubject from '../commit.command'

describe('unit:commands/CommitCommand', () => {
  describe('constructor', () => {
    let headline: string
    let trailers: [string, string]
    let subject: TestSubject

    beforeAll(() => {
      subject = new TestSubject({
        files: ['CHANGELOG.md', 'package.json'],
        message: headline = 'release: 1.0.0',
        owner: 'flex-development',
        ref: 'release/1.0.0',
        repo: 'commit-action',
        trailers: trailers = <typeof trailers>split(INPUT_TRAILERS, '\n')
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
