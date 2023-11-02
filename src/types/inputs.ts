/**
 * @file Type Definitions - Inputs
 * @module commit-action/types/Inputs
 */

/**
 * Action inputs.
 *
 * @see https://docs.github.com/actions/learn-github-actions/contexts#github-context
 */
type Inputs = {
  /**
   * Base URL of GitHub API.
   *
   * @default github.api_url
   */
  api: string

  /**
   * Changed file filters.
   *
   * Each filter should be a file path relative to {@linkcode workspace}.
   *
   * If empty, all detected changes will be committed.
   *
   * @default []
   */
  files: string[]

  /**
   * Commit header and body without trailers.
   */
  message: string

  /**
   * Repository owner.
   *
   * @default github.repository_owner
   */
  owner: string

  /**
   * Name of branch to push commit to.
   *
   * @default
   *  github.head_ref || github.ref
   */
  ref: string

  /**
   * Repository name.
   *
   * @default github.event.repository.name
   */
  repo: string

  /**
   * Personal access token (PAT) used to authenticate GitHub API requests.
   *
   * @default github.token
   */
  token: string

  /**
   * Commit message trailers.
   *
   * @default []
   */
  trailers: string[]

  /**
   * Path to current working directory.
   *
   * @default github.workspace
   */
  workspace: string
}

export type { Inputs as default }
