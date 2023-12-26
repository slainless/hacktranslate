export default {
  outputDir: './assets/artifact',
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
  ],
}
