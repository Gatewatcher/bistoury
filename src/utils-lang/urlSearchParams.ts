export const isURLSearchParams = (p: any): p is URLSearchParams => {
  return p instanceof URLSearchParams;
};
