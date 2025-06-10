/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  arrayDifference,
  createRange,
  filterBy,
  first,
  formatArray,
  groupBy,
  insertIf,
  last,
  maxValueOf,
  mutuallyExclusive,
  range,
  shuffle,
  shuffled,
  splitArrayBy,
  toggleItem,
  unique,
} from '../array';

type MutuallyExclusiveObjectTestType = {
  id: string;
  name: string;
};

describe('Lang array utils tests', () => {
  it('should filter an array of objects by custom predicates', () => {
    const results = [
      {
        id: '2020-09-01T07:12:35.868Z',
        name: '414767060_gcap-howard.com',
        date: '2020-09-01T07:12:35.868Z',
        gcap: {
          id: '1',
          fqdn: 'gcap-1.gatewatcher.com',
          is_paired: true,
        },
        description: '414767060_gcap-howard.com',
        src_ip: '52.206.96.38',
        dest_ip: '48.203.147.134',
        risk: 9,
        type: 'shellcode',
      },
      {
        id: '2020-09-01T07:12:39.856Z',
        name: 'ET TROJAN Windows executable base64 encoded',
        date: '2020-09-01T07:12:35.868Z',
        gcap: {
          id: '1',
          fqdn: 'gcap-2.gatewatcher.com',
          is_paired: true,
        },
        description: 'A Network Trojan was detected',
        src_ip: '161.238.218.96',
        dest_ip: '52.206.96.38',
        risk: 8,
        type: 'sigflow',
      },
    ];

    const filters = {
      gcap: (gcap: any) => gcap.id === '1',
      src_ip: (_src_ip: string) => '52.206.96.38'.includes(_src_ip),
      no_fn: true,
    };
    const filtered = filterBy(results, filters);
    const expected = [
      {
        id: '2020-09-01T07:12:35.868Z',
        name: '414767060_gcap-howard.com',
        date: '2020-09-01T07:12:35.868Z',
        gcap: {
          id: '1',
          fqdn: 'gcap-1.gatewatcher.com',
          is_paired: true,
        },
        description: '414767060_gcap-howard.com',
        src_ip: '52.206.96.38',
        dest_ip: '48.203.147.134',
        risk: 9,
        type: 'shellcode',
      },
    ];
    expect(filtered).toStrictEqual(expected);
  });
  it('should createRange from 0 to 5', () => {
    expect(createRange(0, 5)).toStrictEqual([0, 1, 2, 3, 4]);
  });
  it('should createRange from 1 to 5', () => {
    expect(createRange(1, 5)).toStrictEqual([1, 2, 3, 4]);
  });
  it('should return last item of an array', () => {
    expect(last([1, 2, 3])).toStrictEqual(3);
  });
  it('should return first item of an array', () => {
    expect(first([1, 2, 3])).toStrictEqual(1);
  });

  it('should return max value of', () => {
    const values = [{ count: 1 }, { count: 2 }];
    const max = maxValueOf(values, value => value.count);
    expect(max).toBe(2);
  });
  it('should toggle item inside array', () => {
    const values = ['item1', 'item2', 'item3'];
    const item = 'item1';
    const results1 = toggleItem(values, item);
    expect(results1).toStrictEqual(['item2', 'item3']);
    const results2 = toggleItem(results1, item);
    expect(results2).toStrictEqual(['item2', 'item3', 'item1']);
  });
  it('should format array', () => {
    const values = formatArray(['item1', 'item2', 'item3', 'item4']);
    expect(values).toStrictEqual('item1, item2, item3, ...');
  });

  it('should insert element on true condition', () => {
    const array = [1, 2, 3];

    const withNewElement = [...array, ...insertIf(true, 4)];
    expect(withNewElement).toContain(4);
  });

  it('should insert multiple element on true condition', () => {
    const array = [1, 2, 3];

    const withNewElement = [...array, ...insertIf(true, 4, 5)];
    expect(withNewElement).toContain(4);
    expect(withNewElement).toContain(5);
  });

  it('should not inter element on false condition', () => {
    const array = [1, 2, 3];

    const withNewElement = [...array, ...insertIf(false, 4)];
    expect(withNewElement).not.toContain(4);
  });

  describe('unique', () => {
    it('should remove duplicates based on id', () => {
      const array = [
        { id: 1, title: '1' },
        { id: 2, title: '2' },
        { id: 1, title: '1' },
        { id: 3, title: '3' },
      ];

      expect(unique(array, 'id')).toStrictEqual([
        { id: 1, title: '1' },
        { id: 2, title: '2' },
        { id: 3, title: '3' },
      ]);
    });
  });

  describe('shuffle', () => {
    it('should shuffle and array in place', () => {
      const array = createRange(0, 50);
      const shuffledArray = [...array];
      shuffle(shuffledArray);
      expect(shuffledArray).not.toEqual(array);
    });

    it('should return a shuffled copy', () => {
      const array = createRange(0, 50);
      const shuffledArray = shuffled(array);
      expect(array).toEqual(array);
      expect(shuffledArray).toEqual(expect.any(Array));
      expect(shuffledArray).not.toEqual(array);
    });
  });

  describe('range', () => {
    it('should work with only end - ascending', () => {
      expect(range({ stop: 4 })).toEqual([0, 1, 2, 3]);
    });

    it('should work with start and end - ascending', () => {
      expect(range({ start: 3, stop: 6 })).toEqual([3, 4, 5]);
    });

    it('should work with start, end, and step - ascending', () => {
      expect(range({ start: 0, stop: 5, step: 2 })).toEqual([0, 2, 4]);
      expect(range({ start: 0, stop: 10, step: 2 })).toEqual([0, 2, 4, 6, 8]);
    });

    it('should work with start, end, and step - descending', () => {
      expect(range({ start: 5, stop: 0, step: -2 })).toEqual([5, 3, 1]);
      expect(range({ start: 8, stop: 2, step: -2 })).toEqual([8, 6, 4]);
    });

    it('should return an empty range', () => {
      expect(range({ start: 8, stop: 2 })).toEqual([]);
      expect(range({ start: 8, stop: 2, step: 2 })).toEqual([]);
      expect(range({ start: 1, stop: 5, step: -1 })).toEqual([]);
      expect(range({ start: 1, stop: 5, step: -2 })).toEqual([]);
    });

    it('throws if step === 0', () => {
      expect(() => range({ stop: 1, step: 0 })).toThrow(
        new RangeError('step cannot be equal to 0'),
      );
    });
  });

  describe('split array', () => {
    const array = range({ stop: 5 }).map(id => ({
      id,
      active: id % 2 === 0,
    }));

    it('should split array', () => {
      expect(splitArrayBy(array, item => item.active)).toEqual([
        [
          { id: 0, active: true },
          { id: 2, active: true },
          { id: 4, active: true },
        ],
        [
          { id: 1, active: false },
          { id: 3, active: false },
        ],
      ]);
    });
  });

  describe('mutually exclusive', () => {
    it('should return mutually exclusive array - number array', () => {
      expect(mutuallyExclusive([0, 1, 2], [0, 2])).toEqual([1]);
      expect(mutuallyExclusive([0, 2], [0, 1, 2])).toEqual([1]);
      expect(mutuallyExclusive([0, 1, 2], [1, 3])).toEqual([0, 2, 3]);
      expect(mutuallyExclusive([0, 1, 2], [0, 1, 2])).toEqual([]);
      expect(mutuallyExclusive([], [])).toEqual([]);
      expect(mutuallyExclusive([0, 1], [])).toEqual([0, 1]);
      expect(mutuallyExclusive([], [0, 1])).toEqual([0, 1]);
      expect(mutuallyExclusive([0], [1])).toEqual([0, 1]);
    });

    it('should return mutually exclusive array - string array', () => {
      expect(mutuallyExclusive(['aa', 'bb', 'cc'], ['aa', 'cc'])).toEqual([
        'bb',
      ]);
      expect(mutuallyExclusive(['aa', 'cc'], ['aa', 'bb', 'cc'])).toEqual([
        'bb',
      ]);
      expect(mutuallyExclusive(['aa', 'bb', 'cc'], ['bb', 'dd'])).toEqual([
        'aa',
        'cc',
        'dd',
      ]);
      expect(mutuallyExclusive(['aa', 'bb', 'cc'], ['aa', 'bb', 'cc'])).toEqual(
        [],
      );
      expect(mutuallyExclusive([], [])).toEqual([]);
      expect(mutuallyExclusive(['aa', 'bb'], [])).toEqual(['aa', 'bb']);
      expect(mutuallyExclusive([], ['aa', 'bb'])).toEqual(['aa', 'bb']);
      expect(mutuallyExclusive(['aa'], ['bb'])).toEqual(['aa', 'bb']);
    });

    it('should return mutually exclusive array - object array', () => {
      const a = {
        id: 'aa',
        name: 'Michel',
      };
      const b = {
        id: 'bb',
        name: 'Jean',
      };
      const c = {
        id: 'cc',
        name: 'Thierry',
      };
      const d = {
        id: 'dd',
        name: 'Paul',
      };
      const objectPredicate = (
        e1: MutuallyExclusiveObjectTestType,
        e2: MutuallyExclusiveObjectTestType,
      ) => e1.id === e2.id;

      expect(mutuallyExclusive([a, b, c], [a, c], objectPredicate)).toEqual([
        b,
      ]);
      expect(mutuallyExclusive([a, c], [a, b, c], objectPredicate)).toEqual([
        b,
      ]);
      expect(mutuallyExclusive([a, b, c], [b, d])).toEqual([a, c, d]);
      expect(mutuallyExclusive([a, b, c], [a, b, c])).toEqual([]);
      expect(mutuallyExclusive([], [])).toEqual([]);
      expect(mutuallyExclusive([a, b], [])).toEqual([a, b]);
      expect(mutuallyExclusive([], [a, b])).toEqual([a, b]);
      expect(mutuallyExclusive([a], [b])).toEqual([a, b]);
    });
  });

  describe('array difference', () => {
    it('should find the values that are only in the first array', () => {
      const arrayA = [0, 1];
      const arrayB = [0, 2];
      const result = arrayDifference(arrayA, arrayB);
      expect(result).toEqual([1]);
    });

    it('should find the values that are only in the first array, using a custom predicate', () => {
      const arrayA = [{ value: 0 }, { value: 1 }];
      const arrayB = [{ value: 0 }, { value: 2 }];
      const result = arrayDifference(
        arrayA,
        arrayB,
        (a, b) => a.value === b.value,
      );
      expect(result).toEqual([{ value: 1 }]);
    });
  });

  describe('group by', () => {
    it('should group by result of a modulo (number keys)', () => {
      const input = [0, 1, 2, 3, 4, 5];

      const expected: typeof result = {
        0: [0, 2, 4],
        1: [1, 3, 5],
      };

      const result = groupBy(input, item => item % 2);

      expect(result).toEqual(expected);
    });

    it('should group by "odd" or "even" (string keys)', () => {
      const input = [0, 1, 2, 3, 4, 5];

      const expected: typeof result = {
        even: [0, 2, 4],
        odd: [1, 3, 5],
      };

      const result = groupBy(input, item => (item % 2 ? 'odd' : 'even'));

      expect(result).toEqual(expected);
    });

    it('should group by age (multiple groups)', () => {
      const input = [
        { name: 'Michel', age: 17 },
        { name: 'Jean', age: 22 },
        { name: 'Thierry', age: 30 },
        { name: 'Paul', age: 40 },
      ];

      const expected: typeof result = {
        '0-17': [{ name: 'Michel', age: 17 }],
        '18-24': [{ name: 'Jean', age: 22 }],
        '25-34': [{ name: 'Thierry', age: 30 }],
        '35+': [{ name: 'Paul', age: 40 }],
      };

      const result = groupBy(input, person => {
        if (person.age <= 17) return '0-17';
        if (person.age <= 24) return '18-24';
        if (person.age <= 34) return '25-34';
        return '35+';
      });

      expect(result).toEqual(expected);
    });
  });
});
