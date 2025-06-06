import { useEffect, useState } from "react";

export const useMatchMedia = (
  query: string,
  onMatches: (event: MediaQueryListEvent) => void = () => {}
) => {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);
  useEffect(() => {
    const handler = (e: MediaQueryListEvent) => {
      onMatches(e);
      setMatches(e.matches);
    };
    window.matchMedia(query).addEventListener("change", handler);
    return () => {
      window.matchMedia(query).removeEventListener("change", handler);
    };
  }, [query, onMatches]);
  return [matches, setMatches];
};
