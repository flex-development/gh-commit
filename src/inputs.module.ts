/**
 * @file InputsModule
 * @module gh-commit/InputsModule
 */

import * as core from '@actions/core'
import pathe from '@flex-development/pathe'
import { join } from '@flex-development/tutils'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import type { Inputs } from './types'

/**
 * Action inputs module.
 *
 * @class
 */
@Module({
  exports: [ConfigService],
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
      ignoreEnvFile: false,
      ignoreEnvVars: false,
      isGlobal: true,
      load: [
        (): Inputs => ({
          api: core.getInput('api', { required: true }),
          files: core.getMultilineInput('files'),
          message: core.getInput('message', { required: true }),
          owner: core.getInput('owner', { required: true }),
          ref: join([
            'refs',
            'heads',
            core.getInput('ref', { required: true })
          ], pathe.sep).replace(/(refs\/heads\/){2}/, '$1'),
          repo: core.getInput('repo', { required: true }),
          token: core.getInput('token', { required: true }),
          trailers: core.getMultilineInput('trailers'),
          workspace: core.getInput('workspace', { required: true })
        })
      ]
    })
  ],
  providers: [ConfigService]
})
class InputsModule {}

export default InputsModule
