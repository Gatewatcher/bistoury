import { isSVGPathSupported } from '../support';

describe('DOM support test utils', () => {
  it('should not be supported on jest', () => {
    expect(isSVGPathSupported()).toBe(false);
  });
});
