import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

type useScrollToAnchorOptions = ScrollIntoViewOptions & { timeout: number };

const DEFAULT_TIMEOUT = 100;

const DEFAULT_OPTIONS: ScrollIntoViewOptions = {
  behavior: "smooth",
  block: "start",
};

export const useScrollToAnchor = (
  options: useScrollToAnchorOptions = {
    ...DEFAULT_OPTIONS,
    timeout: DEFAULT_TIMEOUT,
  }
) => {
  const { hash } = useLocation();
  const lastHash = useRef("");
  const { timeout, ...rest } = options;

  useEffect(() => {
    if (hash) {
      lastHash.current = hash.slice(1);
    }

    const anchor = document.getElementById(lastHash.current);

    if (lastHash.current && anchor) {
      setTimeout(() => {
        anchor?.scrollIntoView(rest);
        lastHash.current = "";
      }, timeout);
    }
  }, [hash, rest, timeout]);
};
