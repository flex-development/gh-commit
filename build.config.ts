/**
 * @file Configuration - Build
 * @module config/build
 */

import { defineBuildConfig, type Config } from '@flex-development/mkbuild'
import pathe from '@flex-development/pathe'
import { at, pick } from '@flex-development/tutils'
import type * as esbuild from 'esbuild'
import pkg from './package.json' assert { type: 'json' }
import tsconfig from './tsconfig.build.json' assert { type: 'json' }

/**
 * Build configuration options.
 *
 * @const {Config} config
 */
const config: Config = defineBuildConfig({
  bundle: true,
  charset: 'utf8',
  conditions: tsconfig.compilerOptions.customConditions,
  dts: false,
  external: [
    '@nestjs/microservices',
    '@nestjs/platform-express',
    '@nestjs/websockets',
    'class-transformer',
    'class-validator'
  ],
  platform: 'node',
  plugins: [
    {
      name: 'pkg',

      /**
       * Tree shake `package.json` imports.
       *
       * [1]: https://esbuild.github.io/plugins
       *
       * @param {esbuild.PluginBuild} build - [esbuild plugin api][1]
       * @param {esbuild.PluginBuild['onLoad']} build.onLoad - Load callback
       * @return {void} Nothing when complete
       */
      setup({ onLoad }: esbuild.PluginBuild): void {
        return void onLoad({ filter: /package\.json$/ }, args => {
          if (args.path === pathe.resolve('package.json')) {
            return {
              contents: JSON.stringify(pick(pkg, ['name', 'version']), null, 2),
              loader: 'json'
            }
          }

          return null
        })
      }
    }
  ],
  source: 'src/main.ts',
  sourcemap: true,
  sourcesContent: false,
  target: 'node' + at(/([\d.]+)/.exec(pkg.engines.node), 0, ''),
  tsconfig: 'tsconfig.build.json'
})

export default config
