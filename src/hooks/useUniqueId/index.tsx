import { useId, useRef } from 'react';

let counter = 0;

export const useUniqueId = (idFromParams: string | null = null): string => {
  const uniqueId = useId();
  const idFromUseId = typeof useId === 'function' ? uniqueId : null;

  const idRef = useRef<string | null>(idFromParams || idFromUseId || null);
  if (idRef.current === null) {
    idRef.current = '' + counter++;
  }

  return idRef.current;
};
