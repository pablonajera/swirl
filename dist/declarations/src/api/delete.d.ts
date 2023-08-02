import { SWRConfiguration } from "swr";
import { Response } from "../types/response.js";
export declare function del<T>(url: string, config?: SWRConfiguration<T, any>): Response<T>;
