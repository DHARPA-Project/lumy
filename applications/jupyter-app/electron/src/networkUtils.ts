import net from 'net'

function createConnectionWithTimeout(host: string, port: number, timeout: number): Promise<void> {
  return new Promise((res, rej) => {
    const socket = net.createConnection({
      host,
      port,
      timeout
    })
    socket.once('connect', () => {
      socket.destroy()
      res()
    })

    socket.on('error', error => {
      socket.destroy(error)
      rej(error)
    })
  })
}

export interface WaitForPortParams {
  host: string
  port: number
  intervalMs: number
  timeoutMs: number
  maxWaitMs: number
}

export function waitForPort({
  host,
  port,
  intervalMs,
  timeoutMs,
  maxWaitMs
}: WaitForPortParams): Promise<void> {
  const startTime = process.hrtime()

  return new Promise((res, rej) => {
    const check = () => {
      createConnectionWithTimeout(host, port, timeoutMs)
        .then(() => res())
        .catch(() => {
          const [executionTimeSec, executionTimeNs] = process.hrtime(startTime)
          const executionTimeMs = executionTimeSec * 1000 + executionTimeNs / 1000000
          if (executionTimeMs > maxWaitMs) {
            const msg = `Could not connect within the "maxWaitMs" interval of ${maxWaitMs} ms: ${executionTimeMs} ms`
            return rej(new Error(msg))
          }
          setTimeout(check, intervalMs)
        })
    }
    check()
  })
}

export function getFreePort(): Promise<number> {
  return new Promise((res, rej) => {
    const srv = net.createServer(sock => sock.end())
    srv.listen(0, () => {
      const { port } = srv.address() as net.AddressInfo
      srv.close(err => {
        if (err) return rej(err)
        res(port)
      })
    })
  })
}
