import useSWR from 'swr';
import { fetcher } from './fetcher';
import { RequestOptions } from '../types/request-options';

export function makeNonCachingRequest<T>({
  url,
  method,
  body,
  config,
}: RequestOptions<T>) {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };

  const { data, error } = useSWR<T>(() => fetcher(url, options), config);

  return {
    data,
    isLoading: !error && !data,
    error,
  };
}