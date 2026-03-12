const format = (level, message, details) => {
  const payload = [`[${level}]`, message]
  if (details) {
    payload.push(details)
  }
  return payload
}

const canDebug =
  typeof window === 'undefined' || window.location.hostname === 'localhost'

export const logger = {
  info(message, details) {
    if (canDebug) {
      console.info(...format('INFO', message, details))
    }
  },
  warn(message, details) {
    console.warn(...format('WARN', message, details))
  },
  error(message, details) {
    console.error(...format('ERROR', message, details))
  }
}

export const createTraceId = () =>
  `trace-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`
