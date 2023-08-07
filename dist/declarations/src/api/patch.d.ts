import { type Response } from '../types/response.js'

export declare function patch<T> ({ url, body, parameters, options }: {
  url: string
  body?: any
  parameters?: Record<string, any> | null
  options?: RequestInit
}): Response<T>
