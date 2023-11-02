/**
 * @file Type Definitions - Changes
 * @module commit-action/types/Changes
 */

import type { FileAddition, FileDeletion } from '@octokit/graphql-schema'

/**
 * A description of file tree changes to be made as part of a commit, modeled as
 * zero or more file `additions` and zero or more file `deletions`.
 */
type Changes = {
  /**
   * Files to add to tree.
   *
   * @see {@linkcode FileAddition}
   */
  additions: FileAddition[]

  /**
   * Files to remove from tree.
   *
   * @see {@linkcode FileDeletion}
   */
  deletions: FileDeletion[]
}

export type { Changes as default }
