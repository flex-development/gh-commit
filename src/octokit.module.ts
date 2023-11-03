/**
 * @file OctokitModule
 * @module gh-commit/OctokitModule
 */

import * as core from '@actions/core'
import * as github from '@actions/github'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Octokit } from '@octokit/core'
import InputsModule from './inputs.module'
import type { Inputs } from './types'

/**
 * Octokit module.
 *
 * @see https://github.com/octokit/octokit.js
 *
 * @class
 */
@Module({
  exports: [Octokit],
  imports: [InputsModule],
  providers: [
    {
      inject: [ConfigService],
      provide: Octokit,
      useFactory(inputs: ConfigService<Inputs, true>): Octokit {
        return github.getOctokit(inputs.get('token'), {
          baseUrl: inputs.get<string>('api'),
          log: {
            debug: core.debug.bind(core),
            error: core.error.bind(core),
            info: core.info.bind(core),
            warn: core.warning.bind(core)
          }
        })
      }
    }
  ]
})
class OctokitModule {}

export default OctokitModule
