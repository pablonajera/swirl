import { SWRConfiguration } from "swr";
import { Response } from "../types/response.js";
export declare function get<T>(url: string, config?: SWRConfiguration<T, any>): Response<T>;
