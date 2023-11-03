/**
 * @file Test Utilities - git
 * @module tests/utils/git
 */

import * as exec from '@actions/exec'

/**
 * Execute `git` commands.
 *
 * @async
 *
 * @param {string[]} args - Command arguments
 * @return {Promise<exec.ExecOutput>} Command output
 */
const git = async (args: string[]): Promise<exec.ExecOutput> => {
  return exec.getExecOutput('git', args, {
    cwd: process.cwd(),
    silent: true
  })
}

export default git
