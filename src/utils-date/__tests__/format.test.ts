import dayjs from 'dayjs';

import {
  formatAbsoluteDate,
  format as formatDate,
  formatMilliseconds,
  formatRelativeDate,
  formatSeconds,
  getMsTimestamp,
  getSecondsTimestamp,
} from '../format';

describe('date', () => {
  describe('absolute', () => {
    const date = new Date('2018-09-22T15:00:00');
    const date2 = new Date('2018-09-04T15:00:00');

    it('should format date', () => {
      expect(formatAbsoluteDate(date)).toBe('22/09/2018');
      expect(formatAbsoluteDate(date, 'L LT')).toBe('22/09/2018 15:00');
      expect(formatAbsoluteDate(date2, 'l')).toBe('4/9/2018');
    });

    it('should sanitize', () => {
      expect(formatAbsoluteDate(1695387600)).toBe('22/09/2023');
      expect(formatAbsoluteDate(1695387600000)).toBe('22/09/2023');
      expect(formatAbsoluteDate(1695387600000000)).toBe('22/09/2023');
    });

    it('should handle locale', () => {
      expect(formatAbsoluteDate(date, 'L', { locale: 'fr' })).toBe(
        '22/09/2018',
      );
      expect(formatAbsoluteDate(date, 'L LT', { locale: 'en' })).toBe(
        '09/22/2018 3:00 PM',
      );
    });
  });

  describe('relative', () => {
    const now = 1695387600000; // 22 septembre 2023, 15:00:00

    beforeAll(() => {
      vi.useFakeTimers({
        now,
      });
    });

    it('should format date', () => {
      expect(formatRelativeDate(now - 10)).toBe('a few seconds ago');
      expect(formatRelativeDate(now - 200000)).toBe('3 minutes ago');
    });

    it('should handle locale', () => {
      const locale = 'fr';
      expect(formatRelativeDate(now - 10, { locale })).toBe(
        'il y a quelques secondes',
      );
      expect(formatRelativeDate(now - 200000, { locale })).toBe(
        'il y a 3 minutes',
      );
    });
  });

  describe('format', () => {
    it('should handle locales', () => {
      const date = new Date('2018-09-22T15:00:00');
      expect(formatDate(date, 'l', { locale: 'fr' })).toBe('22/9/2018');
    });
  });

  describe('timestamp', () => {
    const timestampMs = 1717243200000; // 1er juin 2024, 12:00:00
    const timestampS = 1717243200;
    const date = new Date('2024-06-01T12:00:00');

    it('should get timestamp in ms', () => {
      expect(getMsTimestamp(date)).toBe(timestampMs);
      expect(getMsTimestamp(dayjs(date).toDate())).toBe(timestampMs);
      expect(getMsTimestamp(dayjs(date).unix())).toBe(timestampMs);
    });

    it('should get timestamp in s', () => {
      expect(getSecondsTimestamp(date)).toBe(timestampS);
      expect(getSecondsTimestamp(dayjs(date).toDate())).toBe(timestampS);
      expect(getSecondsTimestamp(dayjs(date).valueOf())).toBe(timestampS);
    });
  });

  describe('format seconds', () => {
    it('should format seconds to seconds', () => {
      expect(formatSeconds(3)).toEqual({ value: 3, unit: 's' });
      expect(formatSeconds(59)).toEqual({ value: 59, unit: 's' });
    });

    it('should format seconds to minutes', () => {
      expect(formatSeconds(60)).toEqual({ value: 1, unit: 'm' });
      expect(formatSeconds(110)).toEqual({ value: 2, unit: 'm' });
    });

    it('should format seconds to hours', () => {
      expect(formatSeconds(4000)).toEqual({ value: 2, unit: 'h' });
      expect(formatSeconds(3500 * 24)).toEqual({ value: 24, unit: 'h' });
    });

    it('should format seconds to days', () => {
      expect(formatSeconds(3601 * 24)).toEqual({ value: 2, unit: 'd' });
      expect(formatSeconds(10000000000).unit).toBe('d');
    });
  });

  describe('format milliseconds', () => {
    it('should format to milliseconds when less than 1 second', () => {
      expect(formatMilliseconds(0)).toBe('0 ms');
      expect(formatMilliseconds(300)).toBe('300 ms');
      expect(formatMilliseconds(999)).toBe('999 ms');
    });

    it('should format to seconds when >= 1 second and < 1 minute', () => {
      expect(formatMilliseconds(1000)).toBe('1 s');
      expect(formatMilliseconds(45000)).toBe('45 s');
      expect(formatMilliseconds(59999)).toBe('59 s');
    });

    it('should format to minutes and seconds when >= 1 minute and < 1 hour', () => {
      expect(formatMilliseconds(60000)).toBe('1 m 0 s');
      expect(formatMilliseconds(100000)).toBe('1 m 40 s');
      expect(formatMilliseconds(3599999)).toBe('59 m 59 s');
    });

    it('should format to hours and minutes when >= 1 hour and < 1 day', () => {
      expect(formatMilliseconds(3600000)).toBe('1 h 0 m');
      expect(formatMilliseconds(5400000)).toBe('1 h 30 m');
      expect(formatMilliseconds(86399999)).toBe('23 h 59 m');
    });

    it('should format to days and hours when >= 1 day', () => {
      expect(formatMilliseconds(86400000)).toBe('1 d 0 h');
      expect(formatMilliseconds(90000000)).toBe('1 d 1 h');
      expect(formatMilliseconds(180000000)).toBe('2 d 2 h');
    });
  });
});
