export const isSVGPathSupported = () => {
  // Test if SVG features are supported
  // (jsdom don't support SVG geometric shape)
  // https://github.com/jsdom/jsdom/issues/2128
  return !!window.SVGPathElement;
};
