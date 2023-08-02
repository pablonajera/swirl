import { SWRConfiguration } from "swr";
import { Response } from "../types/response.js";
export declare function post<T>(url: string, body?: any, config?: SWRConfiguration<T, any>): Response<T>;