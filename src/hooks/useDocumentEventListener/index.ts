import { useEffect } from 'react';

export const useDocumentEventListener = <K extends keyof DocumentEventMap>(
  type: K,
  listener: (event: DocumentEventMap[K]) => unknown,
  options?: boolean | AddEventListenerOptions,
) => {
  useEffect(() => {
    document.addEventListener(type, listener, options);
    return () => document.removeEventListener(type, listener);
  }, [type, listener, options]);
};
