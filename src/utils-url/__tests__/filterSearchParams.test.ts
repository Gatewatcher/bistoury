import { filterSearchParams } from '../filterSearchParams';
import {
  getUrlWithParams,
  objectToURLSearchParams,
  urlSearchParamsToObject,
} from '../utils';

describe('filterSearchParams', () => {
  it('Keeps all parameters by default', async () => {
    const queryString =
      'date_from=2021-12-16T11%3A46%3A23&date_to=2021-12-22T11%3A46%3A23&page_size=25&page=1';
    const searchParams = new URLSearchParams(queryString);
    const newSearchParams = filterSearchParams(searchParams);
    expect(newSearchParams.toString()).toEqual(queryString);
  });

  it('Filters by including keys', async () => {
    const queryString =
      'date_from=2021-12-16T11%3A46%3A23&date_to=2021-12-22T11%3A46%3A23&page_size=25&page=1&gcap_id=3';
    const searchParams = new URLSearchParams(queryString);
    const expected = 'page_size=25&page=1';
    const newSearchParams = filterSearchParams(searchParams, {
      include: ['page_size', 'page'],
    });
    expect(newSearchParams.toString()).toEqual(expected);
  });

  it('Filters by including keys with multiple values', async () => {
    const queryString =
      'date_from=2021-12-16T11%3A46%3A23&date_to=2021-12-22T11%3A46%3A23&page_size=25&page=1&page=2&gcap_id=42&page=3';
    const searchParams = new URLSearchParams(queryString);
    const expected = 'page=1&page=2&page=3';
    const newSearchParams = filterSearchParams(searchParams, {
      include: ['page'],
    });
    expect(newSearchParams.toString()).toEqual(expected);
  });

  it('Filters by excluding keys', async () => {
    const queryString =
      'date_from=2021-12-16T11%3A46%3A23&date_to=2021-12-22T11%3A46%3A23&page_size=25&page=1&gcap_id=3';
    const searchParams = new URLSearchParams(queryString);
    const expected = 'date_from=2021-12-16T11%3A46%3A23&page=1';
    const newSearchParams = filterSearchParams(searchParams, {
      exclude: ['page_size', 'date_to', 'gcap_id'],
    });
    expect(newSearchParams.toString()).toEqual(expected);
  });

  it('Filters by excluding keys with multiple values', async () => {
    const queryString =
      'date_from=2021-12-16T11%3A46%3A23&date_to=2021-12-22T11%3A46%3A23&page_size=25&page=1&page=2&gcap_id=42&page=3';
    const searchParams = new URLSearchParams(queryString);
    const expected =
      'date_from=2021-12-16T11%3A46%3A23&date_to=2021-12-22T11%3A46%3A23&page_size=25&gcap_id=42';
    const newSearchParams = filterSearchParams(searchParams, {
      exclude: ['page'],
    });
    expect(newSearchParams.toString()).toEqual(expected);
  });

  it('Exclusions have priority on inclusions', async () => {
    const queryString =
      'date_from=2021-12-16T11%3A46%3A23&date_to=2021-12-22T11%3A46%3A23&page_size=25&page=1&gcap_id=42';
    const searchParams = new URLSearchParams(queryString);
    const expected = 'page_size=25&page=1';
    const newSearchParams = filterSearchParams(searchParams, {
      include: ['date_from', 'date_to', 'page_size', 'page', 'gcap_id'],
      exclude: ['date_to', 'date_from', 'gcap_id'],
    });
    expect(newSearchParams.toString()).toEqual(expected);
  });

  it('Replaces existing keys', async () => {
    const queryString =
      'date_from=2021-12-16T11%3A46%3A23&date_to=2021-12-22T11%3A46%3A23&page_size=25&page=1';
    const searchParams = new URLSearchParams(queryString);
    const expected =
      'date_from=2021-12-16T11%3A46%3A23&date_to=2023-12-24T23%3A59%3A59&page_size=25&page=42&page=58';
    const newSearchParams = filterSearchParams(searchParams, {
      replace: {
        date_to: '2023-12-24T23:59:59',
        page: ['42', '58'],
        // gcap_id(s) should be ignored as they doesn't exist.
        gcap_id: '128',
        gcap_ids: ['128', '256'],
      },
    });
    expect(newSearchParams.toString()).toEqual(expected);
  });

  it('Sets default parameters', async () => {
    const queryString =
      'date_from=2021-12-16T11%3A46%3A23&date_to=2021-12-22T11%3A46%3A23&page_size=25';
    const searchParams = new URLSearchParams(queryString);
    const expected =
      'date_from=2021-12-16T11%3A46%3A23&date_to=2021-12-22T11%3A46%3A23&page_size=25&gcap_id=42&page=10&page=15';
    const newSearchParams = filterSearchParams(searchParams, {
      defaults: {
        gcap_id: '42',
        page: ['10', '15'],
        // It should not set page_size as it already exists.
        page_size: '20',
      },
    });
    expect(newSearchParams.toString()).toEqual(expected);
  });

  it('Discards empty keys by default', async () => {
    const queryString = 'page=&page_size=25&gcap_id=&page=15&date_from=';
    const searchParams = new URLSearchParams(queryString);
    const newSearchParams = filterSearchParams(searchParams);
    expect(newSearchParams.toString()).toEqual('page_size=25&page=15');
  });

  it('Removes empty keys (scalar)', async () => {
    const queryString = 'page=&page_size=25&gcap_id=&page=15&date_from=';
    const searchParams = new URLSearchParams(queryString);
    const expected = 'page_size=25&page=15';
    const newSearchParams = filterSearchParams(searchParams, {
      removeEmpty: true,
    });
    expect(newSearchParams.toString()).toEqual(expected);
  });

  it('Removes empty keys (array)', async () => {
    const queryString = 'page=&page_size=25&gcap_id=&page=&page=15&date_from=';
    const searchParams = new URLSearchParams(queryString);
    const expected = 'page_size=25&page=15';
    const newSearchParams = filterSearchParams(searchParams, {
      removeEmpty: true,
    });
    expect(newSearchParams.toString()).toEqual(expected);
  });

  it('Can keep empty parameters', async () => {
    const queryString = 'page=&page_size=25&gcap_id=&page=15&date_from=';
    const searchParams = new URLSearchParams(queryString);
    const newSearchParams = filterSearchParams(searchParams, {
      removeEmpty: false,
    });
    expect(newSearchParams.toString()).toEqual(queryString);
  });

  it('Handles complex cases', async () => {
    const queryString =
      'random=5678&date_from=2021-12-16T11%3A46%3A23&date_to=2021-12-22T11%3A46%3A23&any_key=foo&page_size=25&gcap_id=42&page=10&page=15&random=1234&empty_key_1=';
    const searchParams = new URLSearchParams(queryString);
    const expected =
      'date_from=2023-12-24T00%3A00%3A00&date_to=2023-12-24T23%3A59%3A59&page_size=25&gcap_id=75&gcap_id=82&random=12345678&page=1&page=2&page=3';
    const newSearchParams = filterSearchParams(searchParams, {
      include: ['date_from', 'date_to', 'page_size', 'random', 'empty_key_1'],
      // Exlude `random` anyway.
      exclude: ['random', 'any_key'],
      // Replace dates, other are exluded.
      replace: {
        page: ['45'],
        random: 'blob',
        date_from: '2023-12-24T00:00:00',
        date_to: '2023-12-24T23:59:59',
        empty_key_2: '',
      },
      // Set default `cap_id`, `random` & `page`.
      // `page_size` is already in.
      defaults: {
        gcap_id: ['75', 82],
        random: '12345678',
        page_size: '1',
        page: [1, '2', '3'],
        empty_key_3: '',
      },
      removeEmpty: true,
    });
    expect(newSearchParams.toString()).toEqual(expected);
  });

  it('Works with strings', async () => {
    const queryString =
      'date_from=2021-12-16T11%3A46%3A23&date_to=2021-12-22T11%3A46%3A23&page_size=25&page=1';
    const newSearchParams = filterSearchParams(queryString);
    expect(newSearchParams.toString()).toEqual(queryString);
  });

  it('Works with URLSearchParams', async () => {
    const previousSearchParams = new URLSearchParams(
      'date_from=2021-12-16T11%3A46%3A23&date_to=2021-12-22T11%3A46%3A23&page_size=25&page=5',
    );
    const newSearchParams = filterSearchParams(previousSearchParams, {
      include: ['page_size'],
      defaults: { answer: 42 },
    });
    expect(newSearchParams.toString()).toEqual('page_size=25&answer=42');
  });

  it('Works with objects', async () => {
    const searchParams = {
      date_from: '2021-12-16T11:46:23',
      date_to: '2021-12-22T11:46:23',
      page_size: '25',
      page: ['1', '2'],
    };
    const queryString =
      'date_from=2021-12-16T11%3A46%3A23&date_to=2021-12-22T11%3A46%3A23&page_size=25&page=1&page=2';
    const newSearchParams = filterSearchParams(searchParams);
    expect(newSearchParams.toString()).toEqual(queryString);
  });
});

describe('ObjectToURLSearchParams', () => {
  it('Works', async () => {
    const searchParams = objectToURLSearchParams({
      prime: [3, 5, 7],
      nextPrime: 11,
    });
    expect(searchParams.getAll('prime')).toEqual(['3', '5', '7']);
    expect(searchParams.get('nextPrime')).toEqual('11');
  });
});

describe('urlSearchParamsToObject', () => {
  it('Works', async () => {
    const params = new URLSearchParams();
    params.append('prime', '3');
    params.append('prime', '5');
    params.append('prime', '7');
    params.set('nextPrime', '11');
    const paramsObject = urlSearchParamsToObject(params);
    expect(paramsObject).toEqual({
      prime: ['3', '5', '7'],
      nextPrime: '11',
    });
  });
});

describe('getUrlWithParams', () => {
  it('Works with url search param', async () => {
    const url = 'baseUrl/path';
    const searchParams = objectToURLSearchParams({
      valueA: 11,
      valueB: 'test',
    });
    const possibilities = [
      `${url}?valueA=11&valueB=test`,
      `${url}?valueB=test&valueA=11`,
    ];
    expect(possibilities.includes(getUrlWithParams(url, searchParams))).toBe(
      true,
    );
  });

  it('Works with search param object', async () => {
    const url = 'baseUrl/path';
    const searchParamsObject = {
      valueA: 11,
      valueB: 'test',
    };
    const possibilities = [
      `${url}?valueA=11&valueB=test`,
      `${url}?valueB=test&valueA=11`,
    ];
    expect(
      possibilities.includes(getUrlWithParams(url, searchParamsObject)),
    ).toBe(true);
  });

  it('Works with string', async () => {
    const url = 'baseUrl/path';
    const searchParamsString = 'valueA=11&valueB=test';
    expect(getUrlWithParams(url, searchParamsString)).toEqual(
      `${url}?${searchParamsString}`,
    );
  });
});
