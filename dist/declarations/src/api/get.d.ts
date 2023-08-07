import { type GetOptions } from '../types/get-options.js'
import { type Response } from '../types/response.js'

export declare function get<T> (url: string, { parameters, disableCache, options }: GetOptions): Response<T>
