/**
 * @file Unit Tests - CommitCommandHandler
 * @module gh-commit/commands/tests/unit/CommitCommandHandler
 */

import server from '#fixtures/server.fixture'
import {
  BranchQuery,
  BranchQueryHandler,
  ChangesQueryHandler
} from '#src/queries'
import type { Spy } from '#tests/interfaces'
import * as github from '@actions/github'
import { toURL } from '@flex-development/mlly'
import pathe from '@flex-development/pathe'
import { DOT, join } from '@flex-development/tutils'
import { CqrsModule } from '@nestjs/cqrs'
import { Test } from '@nestjs/testing'
import { Octokit } from '@octokit/core'
import fs from 'node:fs'
import CommitCommand from '../commit.command'
import TestSubject from '../commit.handler'

describe('unit:commands/CommitCommandHandler', () => {
  let owner: string
  let ref: string
  let repo: string
  let subject: TestSubject

  afterAll(() => {
    server.close()
  })

  afterEach(() => {
    server.resetHandlers()
  })

  beforeAll(async () => {
    owner = import.meta.env.INPUT_OWNER
    ref = join(['test', faker.git.branch()], pathe.sep)
    repo = import.meta.env.INPUT_REPO

    subject = (await (await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        BranchQueryHandler,
        ChangesQueryHandler,
        TestSubject,
        {
          provide: Octokit,
          useValue: github.getOctokit(import.meta.env.GITHUB_TOKEN, {
            log: {
              debug: vi.fn().mockName('octokit.log.debug'),
              error: vi.fn().mockName('octokit.log.error'),
              info: vi.fn().mockName('octokit.log.info'),
              warn: vi.fn().mockName('octokit.log.warn')
            },
            request: {
              fetch: async (url: string, opts: RequestInit) => fetch(url, opts)
            }
          })
        }
      ]
    }).compile()).init()).get(TestSubject)

    server.listen()
  })

  describe('execute', () => {
    let branch: Spy<BranchQueryHandler['execute']>
    let changes: Spy<ChangesQueryHandler['execute']>

    beforeEach(() => {
      branch = vi.spyOn(BranchQueryHandler.prototype, 'execute')
      changes = vi.spyOn(ChangesQueryHandler.prototype, 'execute')
    })

    it('should return empty string if new commit is empty', async ctx => {
      // Arrange
      changes.mockImplementationOnce(async () => ({
        additions: [],
        deletions: []
      }))

      // Act
      const result = await subject.execute(new CommitCommand({
        message: join(['test', ctx.task.name], pathe.delimiter),
        owner,
        ref,
        repo
      }))

      // Expect
      expect(result).to.be.a('string').that.is.empty
    })

    it('should return new commit sha if commit was created', async ctx => {
      // Arrange
      changes.mockImplementationOnce(async () => ({
        additions: [{
          contents: fs.readFileSync(toURL(import.meta.url).pathname, 'base64'),
          path: pathe.relative(DOT, toURL(import.meta.url).pathname)
        }],
        deletions: []
      }))

      // Act
      const result = await subject.execute(new CommitCommand({
        message: join(['test', ctx.task.name], pathe.delimiter),
        owner,
        ref,
        repo
      }))

      // Expect
      expect(result).to.be.a('string').that.is.not.empty
    })

    it('should throw if command.branch.ref is not found', async ctx => {
      // Arrange
      branch.mockImplementationOnce(vi.fn(async () => null))
      let error!: Error

      // Act
      try {
        await subject.execute(new CommitCommand({
          message: join(['test', ctx.task.name], pathe.delimiter),
          owner,
          ref,
          repo
        }))
      } catch (e: unknown) {
        error = <typeof error>e
      }

      // Expect
      expect(error).to.be.instanceof(Error)
      expect(error).to.have.property('cause').be.instanceof(BranchQuery)
      expect(error).to.have.property('message', `refs/heads/${ref} not found`)
    })
  })
})
