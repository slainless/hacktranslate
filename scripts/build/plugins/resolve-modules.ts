import { BuildOptions, Plugin } from 'esbuild'
import { minimatch } from 'minimatch'
import { normalize, relative } from 'path'
import { resolve } from 'import-meta-resolve'
import { pathToFileURL } from 'url'

export function resolveModulesPlugin(options: { include: string[] }): Plugin
export function resolveModulesPlugin(options: { exclude: string[] }): Plugin
export function resolveModulesPlugin(options: {
  include?: string[]
  exclude?: string[]
}) {
  return {
    name: 'resolve-modules',
    async setup(build) {
      build.onResolve({ filter: /.*/ }, (args) => {
        if (args.importer == '' || args.importer == null) return
        if (
          options.exclude != null &&
          options.exclude.some((glob) => minimatch(args.path, glob))
        )
          return
        if (
          options.include == null ||
          (options.include != null &&
            options.include.some((glob) => minimatch(args.path, glob)))
        ) {
          const importer = pathToFileURL(args.importer)
          let path: string
          try {
            path = resolve(args.path, importer.href)
          } catch (e) {
            path = resolve(relative(args.importer, args.path), importer.href)
          }

          return {
            path,
            external: true,
          }
        }

        return
      })
    },
  } as const satisfies Plugin
}
