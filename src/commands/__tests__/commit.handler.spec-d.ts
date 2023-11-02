/**
 * @file Type Tests - CommitCommandHandler
 * @module commit-action/commands/tests/unit-d/CommitCommandHandler
 */

import type { ICommandHandler } from '@nestjs/cqrs'
import type CommitCommand from '../commit.command'
import type TestSubject from '../commit.handler'

describe('unit-d:commands/CommitCommandHandler', () => {
  it('should implement ICommandHandler<CommitCommand, string>', () => {
    expectTypeOf<TestSubject>()
      .toMatchTypeOf<ICommandHandler<CommitCommand, string>>()
  })
})
