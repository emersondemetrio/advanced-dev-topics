type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS" | "CONNECT" | "TRACE"

export const httpPromise = async (
  url: string,
  method: HTTPMethod = "GET",
  data?: BodyInit
) => {
  try {
    const result = await fetch(url, {
      method,
      // headers
      body: data
    })
    const body = result.json()
    return body
  } catch (error) {
    console.error(error)
    return error
  }
}

export const executePromise = async <T>(
  promiseFn: () => Promise<T>,
  finallyFn?: () => void
) => {
  try {
    const result = await promiseFn()
    return [result, null]
  } catch (error) {
    return [null, error]
  } finally {
    if (finallyFn && typeof finallyFn === 'function') {
      finallyFn()
    }
  }
}