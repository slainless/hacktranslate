import { sassPlugin } from 'esbuild-sass-plugin'
import { folders } from './scripts/build/readdir.js'
import { BuildOptions } from 'esbuild'
import { ssrComponentsPlugin } from './scripts/build/plugins/ssr-components.js'

export default {
  bundle: true,
  splitting: true,
  treeShaking: true,
  minify: true,
  format: 'esm',
  tsconfig: './tsconfig.json',
  target: ['chrome120'],

  outdir: './artifact',
  entryPoints: await folders([
    './app/components',
    './app/modules',
    './app/ssr_components',
  ]),

  // external: ['Modules/*', 'Components/*', 'SSRComponents/*'],
  plugins: [
    sassPlugin(),
    // replacePathPlugin([
    //   { find: /^Components\/(.*)/, replaceWith: '/artifact/components/$1' },
    //   { find: /^Modules\/(.*)/, replaceWith: '/artifact/modules/$1' },
    // ]),
    ssrComponentsPlugin({
      filter: 'ssr_components/**/*',
    }),
  ],
} satisfies BuildOptions
