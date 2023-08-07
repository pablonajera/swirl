import { type RequestError } from './errors.js'

export interface Response<T> {
  data: T | undefined
  isLoading: boolean
  error: RequestError | undefined
  statusCode: number | undefined
}
