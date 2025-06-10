import { useCallback, useRef } from 'react';

export const ERROR_NOT_AVAILABLE = 'Clipboard is not available';
export const ERROR_UNKNOWN = 'Unknown error';

export type UseCopyToClipboardOptions = {
  onError?: (reason: string) => void;
  onSuccess?: () => void;
};

export const useCopyToClipboard = (
  clipText: string,
  { onError = () => {}, onSuccess = () => {} }: UseCopyToClipboardOptions = {},
) => {
  const api = {
    clipText,
    onError,
    onSuccess,
  };

  const apiRef = useRef(api);
  apiRef.current = api;

  const copyToClipboard = useCallback(async () => {
    assertClipboardIsAvailable();
    await navigator.clipboard.writeText(apiRef.current.clipText);
    apiRef.current.onSuccess();
  }, []);

  return useCallback(async () => {
    try {
      await copyToClipboard();
    } catch (e) {
      apiRef.current.onError(e instanceof Error ? e.message : ERROR_UNKNOWN);
    }
  }, [copyToClipboard]);
};

const assertClipboardIsAvailable = () => {
  if (!navigator.clipboard) {
    throw new Error(ERROR_NOT_AVAILABLE);
  }
};
