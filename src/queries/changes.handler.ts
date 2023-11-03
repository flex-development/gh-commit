/**
 * @file Queries - ChangesQueryHandler
 * @module gh-commit/queries/ChangesQueryHandler
 */

import type { Changes } from '#src/types'
import * as exec from '@actions/exec'
import pathe from '@flex-development/pathe'
import { includes } from '@flex-development/tutils'
import { QueryHandler, type IQueryHandler } from '@nestjs/cqrs'
import fs from 'node:fs'
import ChangesQuery from './changes.query'

/**
 * File changes query handler.
 *
 * @see {@linkcode Changes}
 * @see {@linkcode ChangesQuery}
 *
 * @class
 * @implements {IQueryHandler<ChangesQuery, Changes>}
 */
@QueryHandler(ChangesQuery)
class ChangesQueryHandler implements IQueryHandler<ChangesQuery, Changes> {
  /**
   * Execute a file changes query.
   *
   * @see {@linkcode Changes}
   * @see {@linkcode ChangesQuery}
   *
   * @public
   * @async
   *
   * @param {ChangesQuery} query - Query to execute
   * @return {Promise<Changes>} Changed files object
   */
  public async execute(query: ChangesQuery): Promise<Changes> {
    /**
     * Changed files.
     *
     * @const {Changes} changes
     */
    const changes: Changes = { additions: [], deletions: [] }

    /**
     * Error handler.
     *
     * @param {Buffer} data - Error buffer
     * @return {never} Nothing when complete
     * @throws {Error}
     */
    const stderr = (data: Buffer): never => {
      throw new Error(data.toString('utf8').replace(/^fatal: */, ''))
    }

    /**
     * Changed file handler.
     *
     * @param {string} status - Working tree status line
     * @return {void} Nothing when complete
     */
    const stdline = (status: string): void => {
      /**
       * Relative path to changed file.
       *
       * @const {string} path
       */
      const path: string = status.slice(3)

      // do nothing if changed file should be ignored
      if (query.files.length && !includes(query.files, path)) return void path

      // add changed file
      if (status.slice(1, 2) === 'D') changes.deletions.push({ path })
      else {
        /**
         * Absolute path to changed file.
         *
         * @const {string} file
         */
        const file: string = pathe.join(query.workspace, path)

        changes.additions.push({
          contents: fs.readFileSync(file, 'base64'),
          path
        })
      }

      return void status
    }

    // get changed files
    // https://git-scm.com/docs/git-status
    await exec.exec('git', ['status', '--porcelain', '--untracked-files'], {
      cwd: query.workspace,
      ignoreReturnCode: true,
      listeners: { stderr, stdline },
      silent: true
    })

    return changes
  }
}

export default ChangesQueryHandler
