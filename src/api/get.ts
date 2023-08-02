import useSWR, { SWRConfiguration } from "swr";
import { fetcher } from "../utils/fetcher";
import { Response } from "../types/response";

export function get<T>(
  url: string,
  config?: SWRConfiguration<T, any>
): Response<T> {
  const { data, error } = useSWR<T>(url, fetcher, config);

  return {
    data,
    isLoading: !error && !data,
    error,
  };
}
