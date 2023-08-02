import { RequestError } from './errors';

export async function fetcher<T>(url: string, options?: RequestInit) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorInfo = await response.json();
    throw new RequestError('An error occurred while fetching the data.', errorInfo, response.status);
  }
  return response.json() as Promise<T>;
}
