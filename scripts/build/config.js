import tsconfig from '../../tsconfig.json' assert { type: 'json' }
import esbuild from '../../esbuild.js'
import { readdir } from './readdir.js'

export function tsconfigAlias() {
  return Object.fromEntries(
    Object.entries(tsconfig.compilerOptions.paths).map(([k, v]) => [k, v[0]])
  )
}

export function entrypoints() {
  return Promise.all(esbuild.inputDir.map((dir) => readdir(dir.dir))).then(
    (p) => p.reduce((a, b) => [...a, ...b])
  )
}

export function externals() {
  return esbuild.inputDir.map((dir) => dir.alias)
}

export function replacePath() {
  const plugin = {
    name: 'alias-replace-path',
    setup(build) {
      build.onResolve({ filter: /.*/ }, (args) => {
        for (const entry of esbuild.inputDir)
          if (entry.alias.test(args.path))
            return {
              path: args.path.replace(entry.alias, entry.transform),
              external: true,
            }
        return
      })
    },
  }
  return plugin
}

export { esbuild }
