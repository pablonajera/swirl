// get.ts
import useSWR, { SWRConfiguration } from 'swr';
import { fetcher } from '../utils/fetcher';

export function get<T>(url: string, config?: SWRConfiguration<T, any>) {
  const { data, error } = useSWR<T>(url, fetcher, config);

  return {
    data,
    isLoading: !error && !data,
    error,
  };
}
