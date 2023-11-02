/**
 * @file Queries - BranchQuery
 * @module commit-action/queries/BranchQuery
 */

import type { Inputs } from '#src/types'
import { sep } from '@flex-development/pathe'
import { join, type Pick } from '@flex-development/tutils'

/**
 * Branch query model.
 *
 * @see {@linkcode Inputs}
 *
 * @class
 * @implements {Pick<Inputs, 'owner' | 'ref' | 'repo'>}
 */
class BranchQuery implements Pick<Inputs, 'owner' | 'ref' | 'repo'> {
  /**
   * Repository owner.
   *
   * @public
   * @instance
   * @member {string} owner
   */
  public owner: string

  /**
   * Branch name.
   *
   * @public
   * @instance
   * @member {string} ref
   */
  public ref: string

  /**
   * Name of repository containing {@linkcode ref}.
   *
   * @public
   * @instance
   * @member {string} repo
   */
  public repo: string

  /**
   * Create a new branch query.
   *
   * @param {BranchQuery} params - Query parameters
   */
  constructor({ owner, ref, repo }: BranchQuery) {
    this.owner = owner
    this.ref = join(['refs', 'heads', ref.replace(/^refs\/heads\//, '')], sep)
    this.repo = repo
  }
}

export default BranchQuery
