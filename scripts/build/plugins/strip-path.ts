import { OnResolveResult, Plugin } from 'esbuild'
import { minimatch } from 'minimatch'
import { normalize } from 'path'

export const stripPathPlugin = (stripGlobs?: string[]) => {
  return {
    name: 'strip-path',
    async setup(build) {
      if (stripGlobs == null || stripGlobs.length <= 0) return
      build.onResolve({ filter: /.*/ }, (args) => {
        for (const glob of stripGlobs) {
          if (
            minimatch(normalize(args.path).replaceAll('\\', '/'), glob, {
              allowWindowsEscape: true,
            })
          ) {
            return {
              path: args.path,
              namespace: 'skipped',
            } satisfies OnResolveResult
          }
        }
        return
      })

      build.onLoad({ filter: /.*/, namespace: 'skipped' }, async (args) => {
        return { loader: 'file', contents: '' }
      })
    },
  } satisfies Plugin
}
