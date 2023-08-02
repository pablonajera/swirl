import { makeNonCachingRequest } from '../utils/non-cache-request';
import { SWRConfiguration } from 'swr';

export function patch<T>(url: string, body?: any, config?: SWRConfiguration<T, any>) {
  return makeNonCachingRequest({url, method: 'PATCH', body, config});
}