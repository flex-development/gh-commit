/**
 * @file Queries - BranchQuery
 * @module commit-action/queries/BranchQuery
 */

import { sep } from '@flex-development/pathe'
import { join } from '@flex-development/tutils'

/**
 * Branch query model.
 *
 * @class
 */
class BranchQuery {
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
