import { HttpError } from './HttpError';
import { RequestOptions } from './types';

export const probeFetch = async (
  url: string,
  { method = 'GET', ...options }: RequestOptions = {},
): Promise<void> => {
  const response = await fetch(url, {
    method,
    ...options,
  });

  if (!response.ok) {
    throw new HttpError('Probing failed.', response);
  }

  if (!response.body) {
    throw new Error('Could not read response body.');
  }

  const reader = response.body.getReader();
  await reader.read();
  await reader.cancel();
};
