import {
  deepMerge,
  filterByKeys,
  filterKeys,
  getValue,
  isObject,
  isObjectDeepEqual,
  isObjectEqual,
  isPlainObject,
  objectDiff,
  objectKeysToCamelCase,
  removeEmpty,
  sortObjectKeys,
  withoutKey,
} from '../object';

describe('Lang object utils tests', () => {
  const date_from = '10/10/2020';
  const date_to = '11/10/2020';
  it('should filter object by keys', () => {
    const mockObj = {
      date_from,
      date_to,
    };
    const resObj = filterByKeys(['date_from'], mockObj);
    expect(Object.keys(resObj).length).toBe(1);
    expect(resObj.date_from).toBe(date_from);
    expect(resObj.date_to).toBe(undefined);
  });

  it('should remove empty key/value', () => {
    const mockObj = {
      date_from,
      date_to: undefined,
      date: null,
    };
    const resObj = removeEmpty(mockObj);

    expect(Object.keys(resObj).length).toBe(1);
    expect(resObj.date_from).toBe(date_from);
  });

  it('should be a object', () => {
    const obj = {};
    expect(isObject(obj)).toBe(true);
  });

  it('should not be a object', () => {
    const obj = true;
    expect(isObject(obj)).toBe(false);
  });

  it('should be an object', () => {
    const obj = {};
    expect(isPlainObject(obj)).toBe(true);
  });

  it('should not be an object, testing undefined', () => {
    const obj = undefined;
    expect(isPlainObject(obj)).toBe(false);
  });

  it('should not be an object, testing null', () => {
    const obj = null;
    expect(isPlainObject(obj)).toBe(false);
  });

  it('should not be an object, testing array', () => {
    const obj = [];
    expect(isPlainObject(obj)).toBe(false);
  });

  it('should not be an object, testing function', () => {
    const obj = () => {};
    expect(isPlainObject(obj)).toBe(false);
  });

  it('should be equal', () => {
    const objectA = {
      someKey: 'someValue',
      someOtherKey: 42,
    };
    const objectB = {
      someOtherKey: 42,
      someKey: 'someValue',
    };
    expect(isObjectEqual(objectA, objectB)).toBe(true);
  });

  it('should not be equal', () => {
    const objectA = {
      someKey: 'someValue',
      someOtherKey: 42,
    };
    const objectB = {
      someKey: 'someValue',
      someOtherKey: 43,
    };
    expect(isObjectEqual(objectA, objectB)).toBe(false);
  });

  it('should be deep equal simple objects', () => {
    const objectA = {
      someKey: 'someValue',
      someOtherKey: 42,
    };
    const objectB = {
      someOtherKey: 42,
      someKey: 'someValue',
    };
    expect(isObjectDeepEqual(objectA, objectB)).toBe(true);
  });

  it('should be deep equal nested objects', () => {
    const objectA = {
      someKey: 'someValue',
      someOtherKey: 42,
      anArray: [1, 2, 'test', 3],
      nestedObject: {
        anOtherArray: ['123465', 99, null],
        isOk: true,
        isBad: false,
      },
    };
    const objectB = {
      someKey: 'someValue',
      someOtherKey: 42,
      anArray: [1, 2, 'test', 3],
      nestedObject: {
        anOtherArray: ['123465', 99, null],
        isOk: true,
        isBad: false,
      },
    };
    expect(isObjectDeepEqual(objectA, objectB)).toBe(true);
  });

  it('should not be deep equal', () => {
    const objectA = {
      someKey: 'someValue',
      someOtherKey: 42,
      anArray: [1, 2, 'test', 3],
      nestedObject: {
        anOtherArray: ['123465', 99, null],
        isOk: true,
        isBad: false,
      },
    };
    const objectB = {
      someKey: 'someValue',
      someOtherKey: 42,
      anArray: [1, 2, 'test', 3],
      nestedObject: {
        anOtherArray: ['123465', 888888888888888, null],
        isOk: true,
        isBad: false,
      },
    };
    expect(isObjectDeepEqual(objectA, objectB)).toBe(false);
  });

  it('should remove given key', () => {
    const objectA = {
      someKey: 'someValue',
      someOtherKey: 42,
    };
    const objectWithoutKey = withoutKey(objectA, ['someOtherKey']);
    // the initial object is not modified
    expect(Object.keys(objectA).length).toBe(2);
    expect(Object.keys(objectWithoutKey).length).toBe(1);
    expect(objectWithoutKey.someKey).toBe(objectA.someKey);
  });

  it('should remove given keys (array of key)', () => {
    const objectA = {
      someKey: 'someValue',
      someOtherKey: 42,
      some3rdValue: 3,
    };
    const objectWithoutKey = withoutKey(objectA, ['someKey', 'someOtherKey']);
    // the initial object is not modified
    expect(Object.keys(objectA).length).toBe(3);
    expect(Object.keys(objectWithoutKey).length).toBe(1);
    expect(objectWithoutKey.some3rdValue).toBe(objectA.some3rdValue);
  });

  describe('filterKeys', () => {
    it('should return filtered object', () => {
      const object = {
        someKey: 'someValue',
        someOtherKey: 42,
        some3rdValue: 3,
      };
      expect(filterKeys(object, ['someKey'])).toStrictEqual({
        someKey: 'someValue',
      });
      expect(filterKeys(object, ['someKey', 'some3rdValue'])).toStrictEqual({
        someKey: 'someValue',
        some3rdValue: 3,
      });
    });
  });

  describe('deep merge', () => {
    it('should merge', () => {
      const a = { a: '1', b: { c: 'c', d: true } };
      const b = { a: 'a', b: { c: 1 }, e: 'e' };
      expect(deepMerge(a, b)).toEqual({
        a: 'a',
        b: { c: 1, d: true },
        e: 'e',
      });
    });

    it('should merge multiple objects', () => {
      const a = { a: '1', b: { c: 'c', d: true } };
      const b = { a: 'a', b: { c: 1 }, e: 'e' };
      const c = { b: { c: false }, f: 'f' };

      expect(deepMerge(a, b, c)).toEqual({
        a: 'a',
        b: { c: false, d: true },
        e: 'e',
        f: 'f',
      });
    });
  });

  describe('getValue', () => {
    const object = {
      a: 1,
      b: {
        c: 'c',
      },
      d: { e: ['e', 'f'] },
    };

    it('should get value', () => {
      expect(getValue(object, 'a')).toBe(1);
      expect(getValue(object, 'b.c')).toBe('c');
      expect(getValue(object, ['b', 'c'])).toBe('c');
      expect(getValue(object, ['d', 'e', '1'])).toBe('f');
      expect(getValue(object, 'd.e')).toEqual(['e', 'f']);
    });

    it('should return undefined', () => {
      expect(getValue(object, 'a.c')).toBeUndefined();
    });

    it('should return default value', () => {
      expect(getValue(object, 'a.c', 'default')).toBe('default');
    });
  });

  describe('objectDiff', () => {
    it('should detect a change in a property value', () => {
      expect(objectDiff({ foo: 'bar' }, { foo: 'baz' })).toStrictEqual({
        foo: 'bar',
      });
    });

    it('should return an empty object', () => {
      expect(objectDiff({}, { foo: 42 })).toStrictEqual({});
    });

    it('should detect an extra property', () => {
      expect(objectDiff({ foo: 42 }, {})).toStrictEqual({ foo: 42 });
    });

    it('should treat a numeric string as different as a number', () => {
      expect(objectDiff({ foo: 42 }, { foo: '42' })).toStrictEqual({ foo: 42 });
    });

    it('should consider undefined equal as a non-existing property', () => {
      expect(objectDiff({ foo: undefined }, {})).toStrictEqual({});
    });
  });

  describe('sortObjectKeys', () => {
    it('should sort object keys based on the provided order', () => {
      const inputObject = {
        z: 1,
        a: 2,
        c: 3,
        b: 4,
      };
      const order = ['a', 'b', 'c', 'z'];
      const expectedResult = {
        a: 2,
        b: 4,
        c: 3,
        z: 1,
      };
      expect(sortObjectKeys(inputObject, order)).toEqual(expectedResult);
    });

    it('should handle keys not present in the order array', () => {
      const inputObject = {
        z: 1,
        a: 2,
        c: 3,
        b: 4,
      };
      const order = ['a', 'b', 'c'];
      const expectedResult = {
        a: 2,
        b: 4,
        c: 3,
        z: 1,
      };
      expect(sortObjectKeys(inputObject, order)).toEqual(expectedResult);
    });

    it('should handle empty order array', () => {
      const inputObject = {
        z: 1,
        a: 2,
        c: 3,
        b: 4,
      };
      const order: string[] = [];
      const expectedResult = {
        z: 1,
        a: 2,
        c: 3,
        b: 4,
      };
      expect(sortObjectKeys(inputObject, order)).toEqual(expectedResult);
    });
  });

  it('should camelCase object keys', () => {
    const input = {
      first_name: 'john',
      last_name: 'doe',
      address: {
        city: 'London',
        zip_code: 0,
        streets: [
          { name: 'street1', number: 1, is_active: true },
          { name: 'street2', number: 2, is_active: false },
        ],
      },
    };

    expect(objectKeysToCamelCase(input)).toEqual({
      firstName: 'john',
      lastName: 'doe',
      address: {
        city: 'London',
        zipCode: 0,
        streets: [
          { name: 'street1', number: 1, isActive: true },
          { name: 'street2', number: 2, isActive: false },
        ],
      },
    });
  });
});
