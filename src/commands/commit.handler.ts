/**
 * @file Commands - CommitCommandHandler
 * @module gh-commit/commands/CommitCommandHandler
 */

import pkg from '#pkg' assert { type: 'json' }
import type { Branch, Changes } from '#src/types'
import pathe from '@flex-development/pathe'
import { isNull, join, type Nullable } from '@flex-development/tutils'
import { CommandHandler, QueryBus, type ICommandHandler } from '@nestjs/cqrs'
import { Octokit } from '@octokit/core'
import type {
  CreateCommitOnBranchPayload as Payload
} from '@octokit/graphql-schema'
import * as graphql from 'graphql'
import gql from 'graphql-tag'
import CommitCommand from './commit.command'

/**
 * Commit command handler.
 *
 * @see {@linkcode CommitCommand}
 *
 * @class
 * @implements {ICommandHandler<CommitCommand, string>}
 */
@CommandHandler(CommitCommand)
class CommitCommandHandler implements ICommandHandler<CommitCommand, string> {
  /**
   * GraphQL mutation.
   *
   * @see https://docs.github.com/graphql/reference/mutations#createcommitonbranch
   *
   * @protected
   * @readonly
   * @instance
   * @member {string} operation
   */
  protected readonly operation: string

  /**
   * Create a new commit command handler.
   *
   * @see {@linkcode Octokit}
   * @see {@linkcode QueryBus}
   *
   * @param {Octokit} octokit - Hydrated octokit client
   * @param {QueryBus} queries - Query bus
   */
  constructor(
    protected readonly octokit: Octokit,
    protected readonly queries: QueryBus
  ) {
    this.operation = graphql.print(gql`
      mutation ($input: CreateCommitOnBranchInput!) {
        payload: createCommitOnBranch(input: $input) {
          commit { oid }
        }
      }
    `)
  }

  /**
   * Execute a commit command.
   *
   * @see {@linkcode CommitCommand}
   *
   * @public
   * @async
   *
   * @param {CommitCommand} command - Command to execute
   * @return {Promise<string>} New commit sha or empty string
   * @throws {Error}
   */
  public async execute(command: CommitCommand): Promise<string> {
    /**
     * Branch to push commit to.
     *
     * @const {Nullable<Branch>} branch
     */
    const branch: Nullable<Branch> = await this.queries.execute(command.branch)

    // throw if branch was not found
    if (isNull(branch)) {
      throw new Error(`${command.branch.ref} not found`, {
        cause: command.branch
      })
    }

    /**
     * Changed files.
     *
     * @const {Changes} changes
     */
    const changes: Changes = await this.queries.execute(command)

    // create commit on branch if commit is not empty
    if (changes.additions.length + changes.deletions.length) {
      const { payload } = await this.octokit.graphql<{ payload: Payload }>({
        input: {
          branch: {
            branchName: branch.name,
            repositoryNameWithOwner: branch.repository
          },
          clientMutationId: join([pkg.name, pkg.version], pathe.sep),
          expectedHeadOid: branch.head,
          fileChanges: changes,
          message: command.message
        },
        query: this.operation
      })

      return <string>payload.commit!.oid
    }

    return ''
  }
}

export default CommitCommandHandler
