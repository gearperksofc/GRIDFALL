type Level = 'debug' | 'info' | 'warn' | 'error'

const enabled = process.env.NODE_ENV !== 'production'

function log(level: Level, scope: string, ...args: unknown[]) {
  if (!enabled && level === 'debug') return
  const prefix = `[game:${scope}]`
  switch (level) {
    case 'error':
      console.error(prefix, ...args)
      break
    case 'warn':
      console.warn(prefix, ...args)
      break
    default:
      console.log(prefix, ...args)
  }
}

export const logger = {
  scope: (scope: string) => ({
    debug: (...args: unknown[]) => log('debug', scope, ...args),
    info: (...args: unknown[]) => log('info', scope, ...args),
    warn: (...args: unknown[]) => log('warn', scope, ...args),
    error: (...args: unknown[]) => log('error', scope, ...args),
  }),
}
