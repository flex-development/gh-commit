/**
 * @file Unit Tests - RunnerModule
 * @module commit-action/tests/RunnerModule
 */

import pkg from '#pkg' assert { type: 'json' }
import { RunnerService } from '#src/providers'
import { Test, TestingModule } from '@nestjs/testing'
import TestSubject from '../runner.module'

describe('unit:RunnerModule', () => {
  let ref: TestingModule

  beforeAll(async ctx => {
    vi.stubEnv('INPUT_FILES', 'runner-module.txt')
    vi.stubEnv('INPUT_MESSAGE', `test: ${ctx.name}\n- ${pkg.repository}`)
    vi.stubEnv('INPUT_REF', 'test/runner-module')

    ref = await Test.createTestingModule({ imports: [TestSubject] }).compile()
    ref = await ref.init()
  })

  it('should export RunnerService', () => {
    expect(ref.get(RunnerService)).to.be.instanceof(RunnerService)
  })
})
