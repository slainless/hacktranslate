import { build, context } from 'esbuild'
import { sassPlugin } from 'esbuild-sass-plugin'
import { entrypoints, esbuild, externals, replacePath } from './build/config.js'

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

  plugins: [sassPlugin(), replacePath()],
}

if (process.env.WATCH == null) build(config)
else {
  const ctx = await context(config)
  await ctx.watch()
  console.log('watching...')
}
