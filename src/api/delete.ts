import { makeNonCachingRequest } from '../utils/non-cache-request';
import { SWRConfiguration } from 'swr';

export function del<T>(url: string, config?: SWRConfiguration<T, any>) {
  return makeNonCachingRequest({url, method: 'DELETE', body: undefined, config});
}