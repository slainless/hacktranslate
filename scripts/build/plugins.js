import { extname, normalize } from 'path'
import { build } from 'esbuild'
import { sassPlugin } from 'esbuild-sass-plugin'
import { cwd } from 'process'
import { join, relative, resolve } from 'path'
import { render } from '@lit-labs/ssr'
import { collectResult } from '@lit-labs/ssr/lib/render-result.js'

function nodeModulesAlias(moduleName, resolveToNodeModules) {
  return {
    alias: new RegExp(`^${moduleName}$`),
    transform: 'file://' + join(cwd(), 'node_modules', resolveToNodeModules),
  }
}

async function renderComponent(contents) {
  const base64module = `data:text/javascript;base64,${Buffer.from(
    contents
  ).toString('base64')}`
  const imported = await import(base64module)
  const result = render(imported.default())
  return collectResult(result)
}

export function ssrComponentsBuild(inputDir) {
  /** @type import('esbuild').Plugin */
  const plugin = {
    name: 'ssr-components-build',
    setup(b) {
      b.onResolve({ filter: /.*/ }, async (args) => {
        for (const entry of inputDir) {
          if (entry.ssr == null || entry.ssr == false) continue
          if (normalize(args.path).startsWith(normalize(entry.dir)) == false)
            continue
          const base = relative(entry.dir, args.path)
          return {
            path: normalize(args.path).replace(
              new RegExp(`${extname(base)}$`),
              '.html'
            ),
            namespace: 'ssr-components',
            pluginData: args,
          }
        }
        return
      })

      b.onLoad({ filter: /.*/, namespace: 'ssr-components' }, async (args) => {
        for (const entry of inputDir) {
          if (entry.ssr == null || entry.ssr == false) continue
          if (normalize(args.path).startsWith(normalize(entry.dir)) == false)
            continue
          // const basePath = relative(normalize(entry.dir), normalize(args.path))
          const result = await build({
            entryPoints: [args.pluginData.path],
            write: false,
            outdir: entry.dir,
            bundle: true,
            treeShaking: true,
            format: 'esm',
            external: ['lit'],
            plugins: [
              sassPlugin(),
              replacePath([nodeModulesAlias('lit', 'lit/index.js')]),
            ],
          })
          const module = result.outputFiles.find(
            (file) =>
              normalize(file.path) ==
              resolve(args.pluginData.path).replace(/\.ts$/, '.js')
          )
          if (module == null) throw new Error('No module built?')
          const html = await renderComponent(module.contents)
          /** @type import('esbuild').OnLoadResult */
          const loadResult = {
            contents: html,
            loader: 'copy',
          }
          return loadResult
        }
        return
      })
    },
  }
  return plugin
}

export function replacePath(inputDir) {
  /** @type import('esbuild').Plugin */
  const plugin = {
    name: 'alias-replace-path',
    setup(build) {
      build.onResolve({ filter: /.*/ }, (args) => {
        for (const entry of inputDir) {
          if (entry.ssr) continue
          if (entry.alias.test(args.path))
            return {
              path: args.path.replace(entry.alias, entry.transform),
              external: true,
            }
        }
        return
      })
    },
  }
  return plugin
}
