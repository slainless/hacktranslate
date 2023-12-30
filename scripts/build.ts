import { build, context } from 'esbuild'
import config from '../esbuild.js'

if (process.env.WATCH == null) build(config)
else {
  const ctx = await context(config)
  await ctx.watch()
  console.log('watching...')
}
