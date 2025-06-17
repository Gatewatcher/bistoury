import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';

import { INPUT_DATE_FORMAT } from './constants';
import './locales';

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.locale('en-gb');

export type Mode = 'relative' | 'absolute';
export type DateInput = string | number | Date;

export type FormatOptions = {
  locale?: string;
};

export const sanitize = (date: DateInput) => {
  if (typeof date !== 'number') {
    return date;
  }

  const year = dayjs(date).year();
  if (year < 2000) {
    return dayjs(date * 1000).toDate();
  }
  if (year > 2050) {
    return dayjs(date / 1000).toDate();
  }

  return date;
};

export const getSecondsTimestamp = (date: DateInput) => {
  return dayjs(sanitize(date)).unix();
};

export const getMsTimestamp = (date: DateInput) => {
  return dayjs(sanitize(date)).valueOf();
};

export const formatAbsoluteDate = (
  date: DateInput,
  format = 'L',
  options?: FormatOptions,
) => {
  const { locale } = options || {};

  return locale
    ? dayjs(sanitize(date)).locale(locale).format(format)
    : dayjs(sanitize(date)).format(format);
};

export const formatRelativeDate = (
  date: DateInput,
  options?: FormatOptions,
) => {
  const { locale } = options || {};

  return locale
    ? dayjs(sanitize(date)).locale(locale).fromNow()
    : dayjs(sanitize(date)).fromNow();
};

export const format = (date: DateInput, format, options?: FormatOptions) => {
  const { locale } = options || {};

  return locale
    ? dayjs(date).locale(locale).format(format)
    : dayjs(date).format(format);
};

export const formatDateInput = (date: DateInput) => {
  return dayjs(date).format(INPUT_DATE_FORMAT);
};
