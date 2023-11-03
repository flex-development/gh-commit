/**
 * @file Queries - ChangesQuery
 * @module gh-commit/queries/ChangesQuery
 */

import type { Inputs } from '#src/types'
import { get, sift, unique, type Pick } from '@flex-development/tutils'

/**
 * File changes query model.
 *
 * @see {@linkcode Inputs}
 *
 * @class
 * @implements {Pick<Inputs, 'files' | 'workspace'>}
 */
class ChangesQuery implements Pick<Inputs, 'files' | 'workspace'> {
  /**
   * Changed file filters.
   *
   * Each filter should be a file path relative to {@linkcode workspace}.
   *
   * If empty, all detected changes will be returned from the query.
   *
   * @default []
   *
   * @public
   * @instance
   * @member {string[]} files
   */
  public files: string[]

  /**
   * Absolute path to current working directory.
   *
   * @default process.cwd()
   *
   * @public
   * @instance
   * @member {string} workspace
   */
  public workspace: string

  /**
   * Create a new changes query.
   *
   * @param {Partial<ChangesQuery>?} [params] - Query parameters
   */
  constructor(params?: Partial<ChangesQuery>) {
    this.files = unique(sift(get(params, 'files', [])))
    this.workspace = get(params, 'workspace', process.cwd())
  }
}

export default ChangesQuery
