import { useCallback, useEffect, useState } from 'react';

import { consoleDebug } from './../../utils-log';
import { useOnWindowResize } from './../useOnWindowResize';

type OnMutationFunction = {
  (bounding: DOMRect): void;
};

const DEFAULT_ON_MUTATION = () => {};

export const useAnchorObserver = (
  anchorId = '',
  onMutation: OnMutationFunction = DEFAULT_ON_MUTATION,
) => {
  if (!anchorId) {
    throw new Error('Anchor ID is required.');
  }

  const getAnchorBounding = useCallback(() => {
    if (!document.getElementById(anchorId)) {
      return {
        bottom: 0,
        height: 0,
        left: 0,
        right: 0,
        top: 0,
        width: 0,
        x: 0,
        y: 0,
      } as DOMRect;
    }
    return document.getElementById(anchorId)?.getBoundingClientRect();
  }, [anchorId]);

  const [anchorBounding, setAnchorBounding] = useState(getAnchorBounding());

  useEffect(() => {
    const elementToObserve = document.getElementById(anchorId);
    if (!elementToObserve) {
      consoleDebug('useAnchorObserver: element to observe not found !');
      return;
    }

    const observer = new MutationObserver(() => {
      setAnchorBounding(getAnchorBounding());
      onMutation(getAnchorBounding());
    });

    observer.observe(elementToObserve, { childList: true });
    setAnchorBounding(getAnchorBounding());
    return () => observer.disconnect();
  }, [anchorId, onMutation, getAnchorBounding]);

  useOnWindowResize(() => {
    setAnchorBounding(getAnchorBounding());
  });

  return {
    anchorBounding,
    setAnchorBounding,
  };
};
