import { Plugin } from 'esbuild'

type ReplaceDirective = {
  find: RegExp
  replaceWith: string
}

export const replacePathPlugin = (replaceDirectives: ReplaceDirective[]) => {
  return {
    name: 'replace-path',
    async setup(build) {
      build.onResolve({ filter: /.*/ }, (args) => {
        for (const entry of replaceDirectives) {
          if (entry.find.test(args.path)) {
            return {
              path: args.path.replace(entry.find, entry.replaceWith),
              external: true,
            }
          }
        }
        return
      })
    },
  } satisfies Plugin
}
