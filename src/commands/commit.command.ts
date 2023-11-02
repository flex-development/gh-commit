/**
 * @file Commands - CommitCommand
 * @module commit-action/commands/CommitCommand
 */

import { BranchQuery, ChangesQuery } from '#src/queries'
import { type Assign, type Omit } from '@flex-development/tutils'

/**
 * Commit command data transfer object.
 */
type CommitCommandDTO = Assign<Omit<CommitCommand, 'branch'>, [
  BranchQuery,
  Partial<ChangesQuery>,
  {
    /**
     * Commit message.
     */
    message: string

    /**
     * Commit message trailers.
     */
    trailers?: string[]
  }
]>

/**
 * Commit creation command.
 *
 * @see {@linkcode ChangesQuery}
 *
 * @class
 * @extends {ChangesQuery}
 */
class CommitCommand extends ChangesQuery {
  /**
   * Branch query.
   *
   * @see {@linkcode BranchQuery}
   *
   * @public
   * @instance
   * @member {BranchQuery} branch
   */
  public branch: BranchQuery

  /**
   * Commit message.
   *
   * @public
   * @instance
   * @member {{ body: string; headline: string }} message
   */
  public message: { body: string; headline: string }

  /**
   * Create a new commit command.
   *
   * @see {@linkcode CommitCommandDTO}
   *
   * @param {CommitCommandDTO} params - Command parameters
   */
  constructor({
    message,
    trailers = [],
    owner,
    ref,
    repo,
    ...rest
  }: CommitCommandDTO) {
    super(rest)

    if (message && trailers.length) {
      message += '\n'
      for (const trailer of trailers) message += trailer + '\n'
    }

    this.branch = new BranchQuery({ owner, ref, repo })
    this.message = {
      body: message.replace(/.+\n*/, ''),
      headline: message.replace(/\n.+/s, '')
    }
  }
}

export default CommitCommand
