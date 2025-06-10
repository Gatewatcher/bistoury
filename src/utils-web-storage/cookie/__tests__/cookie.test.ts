import { checkCookie, getCookie, setCookie } from '../index';

describe('Cookie tests', () => {
  it(`should return '' if no cookie named test`, () => {
    const check = getCookie('test');
    expect(check).toBe('');
  });
  it('should set cookie value', () => {
    setCookie('test', '2');
    const value = getCookie('test');
    expect(value).toBe('2');
  });
  it('should get cookie by name', () => {
    setCookie('test', '1');
    const value = getCookie('test');
    expect(value).toBe('1');
  });
  it('should return true if cookie match', () => {
    const value = '1';
    setCookie('test', value);
    const check = checkCookie('test', value);
    expect(check).toBe(true);
  });
  it(`should return false if cookie doesn't match`, () => {
    const value = '1';
    setCookie('test', value);
    const check = checkCookie('test', '2');
    expect(check).toBe(false);
  });
  afterAll(() => setCookie('test', ''));
});
