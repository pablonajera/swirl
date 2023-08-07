import { makeRequest } from '../utils/make-request'
import { type Response } from '../types/response'

export function del<T> ({
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
  return makeRequest({ url, method: 'DELETE', body, parameters, options })
}
