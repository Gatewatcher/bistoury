/* eslint-disable @typescript-eslint/no-explicit-any */
// Adapted from https://github.com/pmndrs/react-use-measure
import { useEffect, useMemo, useRef, useState } from 'react';

import { useOnWindowResize } from '../useOnWindowResize';
import { useOnWindowScroll } from '../useOnWindowScroll';
import { debounce as createDebounce } from './../../utils-event';

interface ResizeObserver {
  observe(target: Element, options?: any): void;
  unobserve(target: Element): void;
  disconnect(): void;
  toString(): string;
}

export interface RectReadOnly {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly left: number;
  [key: string]: number;
}

type HTMLOrSVGElement = HTMLElement | SVGElement;

type Result = [
  (element: HTMLOrSVGElement | null) => void,
  RectReadOnly,
  () => void,
];

type State = {
  element: HTMLOrSVGElement | null;
  scrollContainers: HTMLOrSVGElement[] | null;
  resizeObserver: ResizeObserver | null;
  lastBounds: RectReadOnly;
};

export type Options = {
  debounce?: number | { scroll: number; resize: number };
  scroll?: boolean;
  enabled?: boolean;
};

export const useMeasure = (
  { debounce, scroll, enabled }: Options = {
    debounce: 0,
    scroll: false,
    enabled: true,
  },
): Result => {
  const ResizeObserver =
    typeof window === 'undefined'
      ? class ResizeObserver {}
      : (window as any).ResizeObserver;

  if (!ResizeObserver) {
    throw new Error('Resize observer is not supported.');
  }

  const [bounds, set] = useState<RectReadOnly>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    bottom: 0,
    right: 0,
    x: 0,
    y: 0,
  });

  const state = useRef<State>({
    element: null,
    scrollContainers: null,
    resizeObserver: null,
    lastBounds: bounds,
  });

  const scrollDebounce = debounce
    ? typeof debounce === 'number'
      ? debounce
      : debounce.scroll
    : null;
  const resizeDebounce = debounce
    ? typeof debounce === 'number'
      ? debounce
      : debounce.resize
    : null;

  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => void (mounted.current = false);
  });

  const [forceRefresh, resizeChange, scrollChange] = useMemo(() => {
    const callback = () => {
      if (!state.current.element) return;
      const { left, top, width, height, bottom, right, x, y } =
        state.current.element.getBoundingClientRect() as unknown as RectReadOnly;
      const size = { left, top, width, height, bottom, right, x, y };
      Object.freeze(size);
      if (mounted.current && !areBoundsEqual(state.current.lastBounds, size))
        set((state.current.lastBounds = size));
    };
    return [
      callback,
      resizeDebounce ? createDebounce(callback, resizeDebounce) : callback,
      scrollDebounce ? createDebounce(callback, scrollDebounce) : callback,
    ];
  }, [set, scrollDebounce, resizeDebounce]);

  function removeListeners() {
    if (state.current.scrollContainers) {
      state.current.scrollContainers.forEach(element =>
        element.removeEventListener('scroll', scrollChange, true),
      );
      state.current.scrollContainers = null;
    }

    if (state.current.resizeObserver) {
      state.current.resizeObserver.disconnect();
      state.current.resizeObserver = null;
    }
  }

  function addListeners() {
    if (!state.current.element) return;
    state.current.resizeObserver = new ResizeObserver(scrollChange);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    state.current.resizeObserver!.observe(state.current.element);
    if (scroll && state.current.scrollContainers) {
      state.current.scrollContainers.forEach(scrollContainer =>
        scrollContainer.addEventListener('scroll', scrollChange, {
          capture: true,
          passive: true,
        }),
      );
    }
  }

  // the ref we expose to the user
  const ref = (node: HTMLOrSVGElement | null) => {
    if (!node || node === state.current.element) return;
    removeListeners();
    state.current.element = node;
    state.current.scrollContainers = findScrollContainers(node);

    if (enabled) {
      addListeners();
    }
  };

  useOnWindowScroll(scrollChange, Boolean(scroll));
  useOnWindowResize(resizeChange);

  useEffect(
    () => {
      if (enabled) {
        removeListeners();
        addListeners();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scroll, scrollChange, resizeChange],
  );

  useEffect(
    () => removeListeners,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  return [ref, bounds, forceRefresh];
};

function findScrollContainers(
  element: HTMLOrSVGElement | null,
): HTMLOrSVGElement[] {
  const result: HTMLOrSVGElement[] = [];
  if (!element || element === document.body) return result;
  const { overflow, overflowX, overflowY } = window.getComputedStyle(element);
  if (
    [overflow, overflowX, overflowY].some(
      prop => prop === 'auto' || prop === 'scroll',
    )
  )
    result.push(element);
  return [...result, ...findScrollContainers(element.parentElement)];
}

const keys: (keyof RectReadOnly)[] = [
  'x',
  'y',
  'top',
  'bottom',
  'left',
  'right',
  'width',
  'height',
];
const areBoundsEqual = (a: RectReadOnly, b: RectReadOnly): boolean =>
  keys.every(key => a[key] === b[key]);
