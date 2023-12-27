export default {
  outputDir: './artifact',
  inputDir: [
    {
      dir: './app/components',
      alias: /^Components\/(.*)/,
      transform: '/artifact/components/$1',
    },
    {
      dir: './app/modules',
      alias: /^Modules\/(.*)/,
      transform: '/artifact/modules/$1',
    },
    {
      ssr: true,
      dir: './app/ssr_components',
    },
  ],
}
