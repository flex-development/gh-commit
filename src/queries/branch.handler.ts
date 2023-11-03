/**
 * @file Queries - BranchQueryHandler
 * @module gh-commit/queries/BranchQueryHandler
 */

import type { Branch } from '#src/types'
import { isNIL, type Nullable } from '@flex-development/tutils'
import { QueryHandler, type IQueryHandler } from '@nestjs/cqrs'
import { Octokit } from '@octokit/core'
import type { Repository as Payload } from '@octokit/graphql-schema'
import * as graphql from 'graphql'
import gql from 'graphql-tag'
import BranchQuery from './branch.query'

/**
 * Branch query handler.
 *
 * @see {@linkcode Branch}
 * @see {@linkcode BranchQuery}
 *
 * @class
 * @implements {IQueryHandler<BranchQuery,Nullable<Branch>>}
 */
@QueryHandler(BranchQuery)
class BranchQueryHandler
  implements IQueryHandler<BranchQuery, Nullable<Branch>> {
  /**
   * GraphQL query.
   *
   * @see https://docs.github.com/graphql/reference/objects#repository
   *
   * @protected
   * @readonly
   * @instance
   * @member {string} operation
   */
  protected readonly operation: string

  /**
   * Create a new branch query handler.
   *
   * @see {@linkcode Octokit}
   *
   * @param {Octokit} octokit - Hydrated octokit client
   */
  constructor(protected readonly octokit: Octokit) {
    this.operation = graphql.print(gql`
      query ($owner: String!, $ref: String!, $repo: String!) {
        payload: repository(name: $repo, owner: $owner) {
          ref(qualifiedName: $ref) {
            name
            repository { nameWithOwner }
            target { oid }
          }
        }
      }
    `)
  }

  /**
   * Execute a branch query.
   *
   * @see {@linkcode Branch}
   * @see {@linkcode BranchQuery}
   *
   * @public
   * @async
   *
   * @param {BranchQuery} query - Query to execute
   * @return {Promise<Nullable<Branch>>} Branch payload or `null`
   */
  public async execute(query: BranchQuery): Promise<Nullable<Branch>> {
    // fetch branch reference from repository
    const { payload } = await this.octokit.graphql<{ payload: Payload }>({
      owner: query.owner,
      query: this.operation,
      ref: query.ref,
      repo: query.repo
    })

    // format branch payload if reference was found
    if (!isNIL(payload.ref) && !isNIL(payload.ref.target)) {
      return {
        head: payload.ref.target.oid,
        name: payload.ref.name,
        repository: payload.ref.repository.nameWithOwner
      }
    }

    return null
  }
}

export default BranchQueryHandler
