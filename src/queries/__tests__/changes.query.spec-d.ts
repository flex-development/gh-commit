/**
 * @file Type Tests - ChangesQuery
 * @module gh-commit/queries/tests/unit-d/ChangesQuery
 */

import type TestSubject from '../changes.query'

describe('unit-d:queries/ChangesQuery', () => {
  it('should match [files: string[]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('files')
      .toEqualTypeOf<string[]>()
  })

  it('should match [workspace: string]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('workspace')
      .toEqualTypeOf<string>()
  })
})
