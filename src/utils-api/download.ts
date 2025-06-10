/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiError } from '.';
import { isFunction } from './../utils-lang';

type Options = {
  onSuccess?: () => void;
  onError?: (error: any) => void;
  onSettled?: () => void;
};

const fileToURI = (file: File | Blob) => {
  if (!isFunction(window.URL.createObjectURL)) {
    throw new Error('window.URL.createObjectURL is not supported.');
  }

  return window.URL.createObjectURL(file);
};

/**
 * @deprecated please use `withObjectUrlFromFile()` and `saveFileAtUrl()`
 */
export const downloadURI = (uri: string, name = '') => {
  const link = document.createElement('a');
  link.href = uri;
  link.download = name;
  link.click();

  if (!isFunction(window.URL.revokeObjectURL)) {
    throw new Error('window.URL.revokeObjectURL is not supported.');
  }

  window.URL.revokeObjectURL(uri);
};

/**
 * @deprecated please use `fetchFile()`, `withObjectUrlFromFile()` and `saveFileAtUrl()`
 */
export const download = async (
  url: string | File,
  name?: string,
  fetchOptions?: RequestInit,
  downloadOptions?: Options,
) => {
  if (typeof url === 'string') {
    try {
      const response = await fetch(url, fetchOptions);
      if (response.status >= 400 && response.status < 600) {
        const error: ApiError = {
          statusCode: response.status,
          detail: (await response.json()).detail,
        };
        throw error;
      }

      const blob = await response.blob();
      const uri = fileToURI(blob);

      const contentDisposition =
        response.headers.get('Content-Disposition') || '';

      const filename = name || contentDisposition.split('filename=')[1];

      downloadURI(uri, filename);
      downloadOptions?.onSuccess?.();
    } catch (err: any) {
      downloadOptions?.onError?.(err);
      throw new Error(err);
    }
  } else {
    const file = url as File;
    const uri = fileToURI(file);
    downloadOptions?.onSuccess?.();
    downloadURI(uri, name || file.name);
  }
  downloadOptions?.onSettled?.();
};

/**
 * @deprecated please use `probeFetch()`
 */
export const probeRequest = (
  url: string,
  options?: Options,
  fetchOptions?: RequestInit,
) => {
  return fetch(url, fetchOptions)
    .then(async response => {
      if (!response.ok) {
        const detail = (await response.json())?.detail;
        const error: ApiError = {
          statusCode: response.status,
          detail: detail || 'Error occured during fetch',
        };
        throw error;
      }
      return response.body;
    })
    .then(body => {
      if (body === null) {
        throw new Error('No body returned');
      }
      const reader = body?.getReader();
      reader?.read().then(({ done, value }) => {
        if (done || value) {
          options?.onSuccess?.();
        }
      });
    })
    .catch(err => {
      console.error(err);
      options?.onError?.(err);
    })
    .finally(() => {
      options?.onSettled?.();
    });
};

/**
 * @deprecated please use `probeFetch()` and `saveFileAtUrl()`
 */
export const downloadWithProbing = (
  url: string,
  name?: string,
  fetchOptions?: RequestInit,
  probeRequestOptions?: Options,
) => {
  const probeOptions: Options = {
    ...probeRequestOptions,
    onSuccess: () => {
      probeRequestOptions?.onSuccess?.();
      downloadURI(url, name);
    },
  };
  probeRequest(url, probeOptions, fetchOptions);
};
