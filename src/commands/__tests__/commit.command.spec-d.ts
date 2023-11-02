/**
 * @file Type Tests - CommitCommand
 * @module commit-action/commands/tests/unit-d/CommitCommand
 */

import type { BranchQuery, ChangesQuery } from '#src/queries'
import type TestSubject from '../commit.command'

describe('unit-d:commands/CommitCommand', () => {
  it('should extend ChangesQuery', () => {
    expectTypeOf<TestSubject>().toMatchTypeOf<ChangesQuery>()
  })

  it('should match [branch: BranchQuery]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('branch')
      .toEqualTypeOf<BranchQuery>()
  })

  it('should match [message: { body: string; headline: string }]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('message')
      .toEqualTypeOf<{ body: string; headline: string }>()
  })
})
