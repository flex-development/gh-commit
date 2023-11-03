/**
 * @file Main
 * @module commit-action/main
 */

import * as core from '@actions/core'
import type { INestApplicationContext as App } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { RunnerService } from './providers'
import RunnerModule from './runner.module'

try {
  /**
   * NestJS application context.
   *
   * @const {App} app
   */
  const app: App = await NestFactory.createApplicationContext(RunnerModule, {
    abortOnError: false,
    logger: ['error', 'fatal', 'warn']
  })

  // create commit
  void await (await app.init()).get(RunnerService).run()
} catch (e) {
  core.setFailed(<Error>e)
}
