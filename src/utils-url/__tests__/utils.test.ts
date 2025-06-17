import {
  buildEndpointWithVariables,
  createBaseRoute,
  generateFullPaths,
  generateLinkTo,
} from '../utils';

describe('utils', () => {
  it('should create base route', () => {
    expect(createBaseRoute('test')).toBe('test/*');
    expect(createBaseRoute('nested/route')).toBe('nested/route/*');
  });

  it('should generate link to', () => {
    expect(generateLinkTo('path')).toBe('path');
    expect(generateLinkTo('path', 'to')).toBe('path/to');
    expect(generateLinkTo('path', undefined, 'to', null)).toBe('path/to');
  });

  it('should generate full paths', () => {
    expect(
      generateFullPaths('base', { link: 'link', another: 'another/link' }),
    ).toEqual({
      link: 'base/link',
      another: 'base/another/link',
    });
  });

  it('should build endpoint with variables', () => {
    expect(buildEndpointWithVariables('endpoint/*', ['var'])).toBe(
      'endpoint/var',
    );
    expect(
      buildEndpointWithVariables('endpoint/*/another/*', ['var', 10]),
    ).toBe('endpoint/var/another/10');
  });
});
