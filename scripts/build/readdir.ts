import { readdir } from 'node:fs/promises'
import { join } from 'node:path'

function _readdir(dir: string) {
  return readdir(dir).then((files) => files.map((file) => join(dir, file)))
}

export { _readdir as readdir }
export const folders = (paths: string[]) =>
  Promise.all(paths.map((path) => _readdir(path))).then((paths) => paths.flat())
