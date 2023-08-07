import { makeRequest } from '../utils/make-request.js'
import { type Response } from '../types/response.js'

export function post<T> ({
  url,
  body = {},
  parameters = {},
  options = {}
}: {
  url: string
  body?: any
  parameters?: Record<string, any> | null
  options?: RequestInit
}): Response<T> {
  return makeRequest({ url, method: 'POST', body, parameters, options })
}
