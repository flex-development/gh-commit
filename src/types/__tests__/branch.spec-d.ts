/**
 * @file Type Tests - Branch
 * @module commit-action/types/tests/unit-d/Branch
 */

import type TestSubject from '../branch'

describe('unit-d:types/Branch', () => {
  it('should match [head: string]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('head').toEqualTypeOf<string>()
  })

  it('should match [name: string]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('name').toEqualTypeOf<string>()
  })

  it('should match [repository: string]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('repository')
      .toEqualTypeOf<string>()
  })
})
