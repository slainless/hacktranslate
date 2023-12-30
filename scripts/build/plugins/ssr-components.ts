import {
  build as _build,
  BuildOptions,
  Metafile,
  OnEndResult,
  OnResolveArgs,
  OnResolveResult,
  Plugin,
} from 'esbuild'
import { extname, join, normalize } from 'path'
import { minimatch } from 'minimatch'
import { pathToFileURL } from 'url'
import { readFile } from 'fs/promises'

type Filter = string | RegExp | (string | RegExp)[]
export interface SSRComponentsPluginOptions {
  filter: Filter
}

const getFilters = (filters: Filter): { glob: string[]; regExp: RegExp[] } => {
  if (typeof filters == 'string') return { glob: [filters], regExp: [] }
  if (filters instanceof RegExp) return { regExp: [filters], glob: [] }
  const m: ReturnType<typeof getFilters> = { regExp: [], glob: [] }
  for (const filter of filters) {
    if (typeof filter == 'string') {
      m.glob.push(filter)
      continue
    }
    if (filter instanceof RegExp) {
      m.regExp.push(filter)
      continue
    }
  }
  return m
}

const markAsSSRComponents = (args: OnResolveArgs) => {
  return {
    path: args.path.replace(new RegExp(`${extname(args.path)}$`), '.html'),
    namespace: 'ssr-components',
    pluginData: args,
  } as const satisfies OnResolveResult
}

const allowedExt = ['.js', '.ts', '.jsx', '.tsx']
export const ssrComponentsPlugin = (options: SSRComponentsPluginOptions) => {
  const filters = getFilters(options.filter)
  return {
    name: 'ssr-components',
    async setup(build) {
      build.initialOptions.metafile = true

      /* -------------------------------------------------------------------------- */
      /*                               Resolver setup                               */
      /* -------------------------------------------------------------------------- */

      if (filters.glob.length > 0) {
        build.onResolve({ filter: /.*/ }, async (args) => {
          for (const filter of filters.glob) {
            if (allowedExt.includes(extname(args.path)) == false) return
            if (
              minimatch(normalize(args.path), filter, {
                allowWindowsEscape: true,
              })
            ) {
              return markAsSSRComponents(args)
            }
          }
          return
        })
      }

      for (const regExp of filters.regExp)
        build.onResolve({ filter: regExp }, (args) => {
          if (allowedExt.includes(extname(args.path)) == false) return
          return markAsSSRComponents(args)
        })

      /* -------------------------------------------------------------------------- */
      /*                                Loader setup                                */
      /* -------------------------------------------------------------------------- */

      build.onLoad(
        { filter: /.*/, namespace: 'ssr-components' },
        async (args) => {
          const config = {
            entryPoints: [args.pluginData.path],
            outdir: build.initialOptions.outdir,
            treeShaking: true,
            tsconfig: options.tsconfig ?? build.initialOptions.tsconfig,
            format: 'esm',
            plugins: [] as Plugin[],
          } as const satisfies BuildOptions

          if (options.plugins) config.plugins.push(...options.plugins)
          if (options.strip) config.plugins.push(stripPathPlugin(options.strip))
          if (options.external)
            config.plugins.push(
              resolveModulesPlugin({ include: options.external })
            )
          else config.plugins.push(resolveModulesPlugin({ exclude: [] }))

          const result = await _build(config)
          result.metafile
          // console.log(
          //   result,
          //   Buffer.from(result.outputFiles[0].contents).toString('utf-8')
          // )
          // build.resolve()
          return undefined
        }
      )
    },
  } as const satisfies Plugin
}
