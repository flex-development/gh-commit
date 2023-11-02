/**
 * @file Unit Tests - ChangesQueryHandler
 * @module commit-action/queries/tests/unit/ChangesQueryHandler
 */

import type { Changes } from '#src/types'
import * as exec from '@actions/exec'
import { select, split } from '@flex-development/tutils'
import { Test } from '@nestjs/testing'
import pf from 'pretty-format'
import { dedent } from 'ts-dedent'
import type { TaskContext, TestContext } from 'vitest'
import TestSubject from '../changes.handler'
import ChangesQuery from '../changes.query'

describe('unit:queries/ChangesQueryHandler', () => {
  let subject: TestSubject

  beforeAll(async () => {
    subject = (await Test.createTestingModule({
      providers: [TestSubject]
    }).compile()).get(TestSubject)
  })

  describe('execute', () => {
    let err: string
    let query: ChangesQuery
    let stdout: string

    beforeAll(() => {
      stdout = dedent`
         M .commitlintrc.cts
         M CONTRIBUTING.md
         D __tests__/setup/matchers/index.ts
         D __tests__/setup/serializers/index.ts
         M src/queries/branch.query.ts
         M src/queries/changes.query.ts
         M src/queries/index.ts
         M src/types/index.ts
        ?? src/commands/__tests__/commit.command.spec-d.ts
        ?? src/commands/__tests__/commit.command.spec.ts
        ?? src/commands/commit.command.ts
        ?? src/commands/commit.handler.ts
        ?? src/commands/index.ts
        ?? src/queries/__tests__/changes.handler.spec.ts
        ?? src/queries/changes.handler.ts
        ?? src/types/__tests__/changes.spec-d.ts
        ?? src/types/changes.ts
      `

      query = new ChangesQuery({
        files: [
          'CONTRIBUTING.md',
          '__tests__/setup/matchers/index.ts',
          '__tests__/setup/serializers/index.ts',
          'src/queries/branch.query.ts',
          'src/queries/changes.query.ts',
          'src/queries/index.ts',
          'src/types/index.ts',
          'src/queries/__tests__/changes.handler.spec.ts',
          'src/queries/changes.handler.ts',
          'src/types/__tests__/changes.spec-d.ts',
          'src/types/changes.ts'
        ]
      })

      err = 'not a git repository (or any of the parent directories): .git'
    })

    beforeEach((ctx: TaskContext & TestContext) => {
      ctx.expect.addSnapshotSerializer({
        /**
         * Print `value`.
         *
         * @param {unknown} value - Value to print
         * @return {string} `value` as printable string
         */
        print(value: unknown): string {
          const { additions, deletions } = <Changes>value

          value = {
            additions: select(additions, null, addition => ({
              contents: `fs.readFileSync('${addition.path}', 'base64')`,
              path: addition.path
            })),
            deletions
          }

          return pf(value, { printBasicPrototype: false })
        },
        test: (): boolean => true
      })

      vi.spyOn(exec, 'exec').mockImplementationOnce(async (
        cmd: string,
        args?: string[],
        options?: exec.ExecOptions
      ): Promise<number> => {
        const { listeners } = options!

        /**
         * Return code.
         *
         * @var {0 | 1} code
         */
        let code: 0 | 1

        // call stderr or stdline
        if (ctx.task.name.startsWith('should throw')) {
          code = 1
          listeners!.stderr!(Buffer.from(err))
        } else {
          code = 0
          select(split(stdout, '\n'), null, stat => listeners!.stdline!(stat))
        }

        return code
      })
    })

    it('should return file changes payload', async () => {
      expect(await subject.execute(query)).toMatchSnapshot()
    })

    it('should throw on git error', async () => {
      // Arrange
      let error!: Error

      // Act
      try {
        await subject.execute(query)
      } catch (e: unknown) {
        error = <typeof error>e
      }

      // Expect
      expect(error).to.be.instanceof(Error)
      expect(error).to.have.property('message', err)
    })
  })
})
