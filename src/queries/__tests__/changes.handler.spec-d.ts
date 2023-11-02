/**
 * @file Type Tests - ChangesQueryHandler
 * @module commit-action/queries/tests/unit-d/ChangesQueryHandler
 */

import type { Changes } from '#src/types'
import type { IQueryHandler } from '@nestjs/cqrs'
import type TestSubject from '../changes.handler'
import type ChangesQuery from '../changes.query'

describe('unit-d:queries/ChangesQueryHandler', () => {
  it('should implement IQueryHandler<ChangesQuery, Changes>', () => {
    expectTypeOf<TestSubject>()
      .toMatchTypeOf<IQueryHandler<ChangesQuery, Changes>>()
  })
})
