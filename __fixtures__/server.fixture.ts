/**
 * @file Fixtures - GitHub Server
 * @module fixtures/server
 */

import pathe from '@flex-development/pathe'
import { join } from '@flex-development/tutils'
import type { CreateCommitOnBranchInput } from '@octokit/graphql-schema'
import {
  HttpResponse,
  http,
  type GraphQLJsonRequestBody,
  type StrictRequest
} from 'msw'
import { setupServer, type SetupServer } from 'msw/node'
import INPUT_API from './input-api.fixture'

/**
 * GraphQL request body.
 *
 * @see {@linkcode Variables}
 */
type Body = GraphQLJsonRequestBody<
  | Record<'input', CreateCommitOnBranchInput>
  | Record<'owner' | 'ref' | 'repo', string>
>

/**
 * Mock GitHub server.
 *
 * @const {SetupServer} server
 */
const server: SetupServer = setupServer(
  http.post<Record<string, string>, Body>(
    join([INPUT_API, 'graphql'], pathe.sep),
    /**
     * Intercept a GraphQL `POST` request.
     *
     * @async
     *
     * @param {{ request: StrictRequest<Body> }} opts - Interceptor options
     * @param {StrictRequest<Body>} opts.request - Request object
     * @return {Promise<HttpResponse>} Mock HTTP response
     */
    async (opts: { request: StrictRequest<Body> }): Promise<HttpResponse> => {
      const { variables } = <Required<Body>>await opts.request.json()

      if ('input' in variables) {
        return HttpResponse.json({
          data: { payload: { commit: { oid: faker.git.commitSha() } } },
          status: 201
        })
      }

      return HttpResponse.json({
        data: {
          payload: {
            ref: {
              name: variables.ref,
              repository: {
                nameWithOwner: `${variables.owner}${pathe.sep}${variables.repo}`
              },
              target: {
                oid: faker.git.commitSha()
              }
            }
          }
        }
      }, {
        status: 200,
        statusText: 'OK'
      })
    }
  )
)

export default server
