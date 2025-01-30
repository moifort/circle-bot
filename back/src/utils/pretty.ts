import { Console } from 'node:console'
import { Transform } from 'node:stream'

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const toTable = (data: Array<any>) => {
  const ts = new Transform({
    transform(chunk, enc, cb) {
      cb(null, chunk)
    },
  })

  const logger = new Console({ stdout: ts })
  logger.table(data)
  return (ts.read() || '').toString()
}
