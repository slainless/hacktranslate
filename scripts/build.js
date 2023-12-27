import { build, context } from 'esbuild'
import { sassPlugin } from 'esbuild-sass-plugin'
import { entrypoints, esbuild } from './build/config.js'
import { replacePath, ssrComponentsBuild } from './build/plugins.js'

/** @type import('esbuild').BuildOptions **/
const config = {
  entryPoints: await entrypoints(),

  bundle: true,
  splitting: true,
  treeShaking: true,
  minify: true,
  format: 'esm',

  // external: externals(),
  outdir: esbuild.outputDir,

  plugins: [
    sassPlugin(),
    replacePath(esbuild.inputDir),
    ssrComponentsBuild(esbuild.inputDir),
  ],
}

if (process.env.WATCH == null) build(config)
else {
  const ctx = await context(config)
  await ctx.watch()
  console.log('watching...')
}
