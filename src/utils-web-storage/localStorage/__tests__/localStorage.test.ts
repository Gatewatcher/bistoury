import * as storage from '../index';

describe('Localstorage tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should store string', () => {
    storage.set('key', 'value');

    expect(localStorage.getItem('key')).toEqual(JSON.stringify('value'));
  });

  it('should store number', () => {
    storage.set('key', 1);

    expect(localStorage.getItem('key')).toEqual('1');
  });

  it('should store object', () => {
    const object = { test: 'ok' };
    storage.set('key', object);

    expect(localStorage.getItem('key')).toEqual(JSON.stringify(object));
  });

  it('should store array', () => {
    const array = ['array', 'of', 'values'];
    storage.set('key', array);

    expect(localStorage.getItem('key')).toEqual(JSON.stringify(array));
  });

  it('should return string', () => {
    storage.set('key', 'value');
    expect(storage.get('key')).toEqual('value');
  });

  it('should return number', () => {
    storage.set('key', 1);
    expect(storage.get('key')).toEqual(1);
  });

  it('should return object', () => {
    const object = { test: 'ok' };
    storage.set('key', object);

    expect(storage.get('key')).toEqual(object);
  });

  it('should return array', () => {
    const array = ['array', 'of', 'values'];
    storage.set('key', array);

    expect(storage.get('key')).toEqual(array);
  });

  it('should clear item', () => {
    storage.set('key', 'value');
    expect(storage.get('key')).toEqual('value');
    storage.remove('key');
    expect(storage.get('key')).toBeNull();
  });

  it('should clear', () => {
    storage.set('key', 'value');
    storage.set('test', 'ok');
    expect(storage.get('key')).toEqual('value');
    expect(storage.get('test')).toEqual('ok');

    storage.clear();
    expect(storage.get('key')).toBeNull();
    expect(storage.get('test')).toBeNull();
  });
});
