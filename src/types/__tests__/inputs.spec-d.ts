/**
 * @file Type Tests - Inputs
 * @module gh-commit/types/tests/unit-d/Inputs
 */

import type TestSubject from '../inputs'

describe('unit-d:types/Inputs', () => {
  it('should match [api: string]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('api').toEqualTypeOf<string>()
  })

  it('should match [files: string[]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('files')
      .toEqualTypeOf<string[]>()
  })

  it('should match [message: string]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('message')
      .toEqualTypeOf<string>()
  })

  it('should match [owner: string]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('owner').toEqualTypeOf<string>()
  })

  it('should match [ref: string]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('ref').toEqualTypeOf<string>()
  })

  it('should match [repo: string]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('repo').toEqualTypeOf<string>()
  })

  it('should match [token: string]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('token').toEqualTypeOf<string>()
  })

  it('should match [trailers: string[]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('trailers')
      .toEqualTypeOf<string[]>()
  })

  it('should match [workspace: string]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('workspace')
      .toEqualTypeOf<string>()
  })
})
