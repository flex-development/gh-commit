/**
 * @file Type Tests - Changes
 * @module commit-action/types/tests/unit-d/Changes
 */

import type { FileAddition, FileDeletion } from '@octokit/graphql-schema'
import type TestSubject from '../changes'

describe('unit-d:types/Changes', () => {
  it('should match [additions: FileAddition[]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('additions')
      .toEqualTypeOf<FileAddition[]>()
  })

  it('should match [deletions: FileDeletion[]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('deletions')
      .toEqualTypeOf<FileDeletion[]>()
  })
})
