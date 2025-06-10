/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';

// Avoid flashy loader indicator
export const useDelayedRender = (delay = 100) => {
  const [delayed, setDelayed] = useState(true);
  useEffect(() => {
    const timeout = setTimeout(() => setDelayed(false), delay);
    return () => clearTimeout(timeout);
  }, [delay]);
  return (fn: () => any) => !delayed && fn();
};
