import { Response } from "../types/response.js";
export declare function post<T>({ url, body, parameters, options, }: {
    url: string;
    body?: any;
    parameters?: Record<string, any> | null;
    options?: RequestInit;
}): Response<T>;
