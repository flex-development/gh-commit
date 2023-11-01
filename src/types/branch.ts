/**
 * @file Type Definitions - Branch
 * @module commit-action/types/Branch
 */

/**
 * Branch query payload.
 */
type Branch = {
  /**
   * SHA of head commit.
   */
  head: string

  /**
   * Branch name without `refs/heads/` prefix.
   */
  name: string

  /**
   * Repository name and owner.
   */
  repository: string
}

export type { Branch as default }
