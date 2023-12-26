import { readdir } from 'node:fs/promises'
import { join } from 'node:path'

function _readdir(dir) {
  return readdir(dir).then((files) => files.map((file) => join(dir, file)))
}

export { _readdir as readdir }
