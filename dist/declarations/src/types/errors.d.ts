export declare class RequestError extends Error {
  status: number
  info: any
  constructor (message: string, info: any, status: number)
}
