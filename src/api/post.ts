import { makeNonCachingRequest } from '../utils/non-cache-request';
import { SWRConfiguration } from 'swr';

export function post<T>(url: string, body?: any, config?: SWRConfiguration<T, any>) {
  return makeNonCachingRequest({url, method: 'POST', body, config});
}