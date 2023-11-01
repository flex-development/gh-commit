/**
 * @file Unit Tests - BranchQueryHandler
 * @module commit-action/queries/tests/unit/BranchQueryHandler
 */

import * as github from '@actions/github'
import pathe from '@flex-development/pathe'
import { join } from '@flex-development/tutils'
import { Test } from '@nestjs/testing'
import { Octokit } from '@octokit/core'
import TestSubject from '../branch.handler'
import BranchQuery from '../branch.query'

describe('unit:queries/BranchQueryHandler', () => {
  let subject: TestSubject

  beforeAll(async () => {
    subject = (await Test.createTestingModule({
      providers: [
        TestSubject,
        {
          provide: Octokit,
          useValue: github.getOctokit(process.env.GITHUB_TOKEN!, {
            log: {
              debug: vi.fn().mockName('octokit.log.debug'),
              error: vi.fn().mockName('octokit.log.error'),
              info: vi.fn().mockName('octokit.log.info'),
              warn: vi.fn().mockName('octokit.log.warn')
            }
          })
        }
      ]
    }).compile()).get(TestSubject)
  })

  describe('execute', () => {
    let owner: string
    let repo: string

    beforeAll(() => {
      owner = 'flex-development'
      repo = 'commit-action'
    })

    it('should return branch payload if query.ref is found', async () => {
      // Arrange
      const ref: string = 'main'
      const query: BranchQuery = new BranchQuery({ owner, ref, repo })

      // Act
      const result = await subject.execute(query)

      // Expect
      expect(result).to.have.keys(['head', 'name', 'repository'])
      expect(result).toMatchObject({
        head: <string>expect.any(String),
        name: ref,
        repository: join([owner, repo], pathe.sep)
      })
    })

    it('should return null if query.ref is not found', async () => {
      // Arrange
      const query: BranchQuery = new BranchQuery({ owner, ref: '', repo })

      // Act + Expect
      expect(await subject.execute(query)).to.be.null
    })
  })
})
