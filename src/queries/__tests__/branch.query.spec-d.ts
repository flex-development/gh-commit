/**
 * @file Type Tests - BranchQuery
 * @module commit-action/queries/tests/unit-d/BranchQuery
 */

import type TestSubject from '../branch.query'

describe('unit-d:queries/BranchQuery', () => {
  it('should match [owner: string]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('owner').toEqualTypeOf<string>()
  })

  it('should match [ref: string]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('ref').toEqualTypeOf<string>()
  })

  it('should match [repo: string]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('repo').toEqualTypeOf<string>()
  })
})
