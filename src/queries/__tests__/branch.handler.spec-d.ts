/**
 * @file Type Tests - BranchQueryHandler
 * @module gh-commit/queries/tests/unit-d/BranchQueryHandler
 */

import type { Branch } from '#src/types'
import type { Nullable } from '@flex-development/tutils'
import type { IQueryHandler } from '@nestjs/cqrs'
import type TestSubject from '../branch.handler'
import type BranchQuery from '../branch.query'

describe('unit-d:queries/BranchQueryHandler', () => {
  it('should implement IQueryHandler<BranchQuery, Nullable<Branch>>', () => {
    expectTypeOf<TestSubject>()
      .toMatchTypeOf<IQueryHandler<BranchQuery, Nullable<Branch>>>()
  })
})
