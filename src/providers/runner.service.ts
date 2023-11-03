/**
 * @file Providers - RunnerService
 * @module gh-commit/providers/RunnerService
 */

import { CommitCommand } from '#src/commands'
import type { Inputs } from '#src/types'
import * as core from '@actions/core'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CommandBus } from '@nestjs/cqrs'

/**
 * Action runner service.
 *
 * @class
 */
@Injectable()
class RunnerService {
  /**
   * Create a new action runner service.
   *
   * @see {@linkcode CommandBus}
   * @see {@linkcode ConfigService}
   * @see {@linkcode Inputs}
   *
   * @param {CommandBus} commands - Command bus
   * @param {ConfigService<Inputs, true>} inputs - Action inputs service
   */
  constructor(
    protected readonly commands: CommandBus,
    protected readonly inputs: ConfigService<Inputs, true>
  ) {}

  /**
   * Create a commit.
   *
   * @public
   * @async
   *
   * @return {Promise<void>} Nothing when complete
   */
  public async run(): Promise<void> {
    /**
     * Commit command to execute.
     *
     * @const {CommitCommand} command
     */
    const command: CommitCommand = new CommitCommand({
      files: this.inputs.get<string[]>('files'),
      message: this.inputs.get('message'),
      owner: this.inputs.get('owner'),
      ref: this.inputs.get('ref'),
      repo: this.inputs.get('repo'),
      trailers: this.inputs.get<string[]>('trailers'),
      workspace: this.inputs.get<string>('workspace')
    })

    // create commit
    return void core.setOutput('sha', await this.commands.execute(command))
  }
}

export default RunnerService
