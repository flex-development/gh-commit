/**
 * @file RunnerModule
 * @module gh-commit/RunnerModule
 */

import { Global, Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { CommitCommandHandler } from './commands'
import InputsModule from './inputs.module'
import OctokitModule from './octokit.module'
import { RunnerService } from './providers'
import { BranchQueryHandler, ChangesQueryHandler } from './queries'

/**
 * Action runner module.
 *
 * @class
 */
@Global()
@Module({
  exports: [RunnerService],
  imports: [CqrsModule.forRoot(), InputsModule, OctokitModule],
  providers: [
    BranchQueryHandler,
    ChangesQueryHandler,
    CommitCommandHandler,
    RunnerService
  ]
})
class RunnerModule {}

export default RunnerModule
