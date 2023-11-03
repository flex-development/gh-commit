/**
 * @file Integration Tests - RunnerService
 * @module commit-action/providers/tests/integration/RunnerService
 */

import INPUT_TRAILERS from '#fixtures/input-trailers.fixture'
import pkg from '#pkg' assert { type: 'json' }
import { CommitCommand, CommitCommandHandler } from '#src/commands'
import InputsModule from '#src/inputs.module'
import OctokitModule from '#src/octokit.module'
import { BranchQueryHandler, ChangesQueryHandler } from '#src/queries'
import type { Spy } from '#tests/interfaces'
import git from '#tests/utils/git.util'
import * as core from '@actions/core'
import pathe from '@flex-development/pathe'
import { join, noop } from '@flex-development/tutils'
import { CommandBus, CqrsModule } from '@nestjs/cqrs'
import { Test } from '@nestjs/testing'
import TestSubject from '../runner.service'

describe('integration:providers/RunnerService', () => {
  let file: string
  let message: string
  let ref: string
  let subject: TestSubject

  beforeAll(async ctx => {
    file = 'commit.txt'
    message = `test: ${ctx.name}\n- ${pkg.repository}`
    ref = 'test/runner-service'

    vi.stubEnv('INPUT_API', 'https://api.github.com')
    vi.stubEnv('INPUT_FILES', file)
    vi.stubEnv('INPUT_MESSAGE', message)
    vi.stubEnv('INPUT_OWNER', 'flex-development')
    vi.stubEnv('INPUT_REF', join(['refs', 'heads', ref], pathe.sep))
    vi.stubEnv('INPUT_REPO', 'commit-action')
    vi.stubEnv('INPUT_TOKEN', process.env.GITHUB_TOKEN!)
    vi.stubEnv('INPUT_TRAILERS', INPUT_TRAILERS)
    vi.stubEnv('INPUT_WORKSPACE', process.cwd())

    subject = (await (await Test.createTestingModule({
      imports: [CqrsModule, InputsModule, OctokitModule],
      providers: [
        BranchQueryHandler,
        ChangesQueryHandler,
        CommitCommandHandler,
        TestSubject
      ]
    }).compile()).init()).get(TestSubject)
  })

  describe('#run', () => {
    let execute: Spy<CommandBus['execute']>
    let setOutput: Spy<(typeof core)['setOutput']>

    afterAll(async () => {
      await git(['branch', '--delete', ref])
      await git(['push', 'origin', '--no-verify', '--delete', ref])
    })

    beforeAll(async () => {
      await git(['branch', ref])
      await git(['push', 'origin', '--no-verify', ref])
    })

    beforeEach(async () => {
      execute = vi.spyOn(CommandBus.prototype, 'execute')
      setOutput = vi.spyOn(core, 'setOutput').mockImplementationOnce(noop)

      vi
        .spyOn(ChangesQueryHandler.prototype, 'execute')
        .mockImplementationOnce(async () => ({
          additions: [
            {
              contents: Buffer.from(message).toString('base64'),
              path: file
            }
          ],
          deletions: []
        }))

      await subject.run()
    })

    it('should create commit', () => {
      expect(execute).toHaveBeenCalledOnce()
      expect(execute).toHaveBeenCalledWith(expect.any(CommitCommand))
      expect(setOutput).toHaveBeenCalledOnce()
      expect(setOutput).toHaveBeenCalledWith('sha', expect.any(String))
      expect(setOutput.mock.lastCall?.[1]).to.be.a('string').that.is.not.empty
    })
  })
})
