import { SWRConfiguration } from 'swr';

export interface RequestOptions<T> {
  url: string;
  method: string;
  body?: any;
  config?: SWRConfiguration<T, any>;
}