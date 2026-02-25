import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';

import {
  INPUT_DATE_FORMAT,
  MS_PER_DAY,
  MS_PER_HOUR,
  MS_PER_MINUTE,
  MS_PER_SECOND,
} from './constants';
import './locales';
import { DurationUnit } from './types';

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.extend(duration);
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

export const formatSeconds = (
  seconds: number,
): { value: number; unit: DurationUnit } => {
  const units: { unit: DurationUnit; seconds: number }[] = [
    { unit: 'd', seconds: 86400 },
    { unit: 'h', seconds: 3600 },
    { unit: 'm', seconds: 60 },
    { unit: 's', seconds: 1 },
  ];

  const { unit, seconds: unitSeconds } =
    units.find(u => seconds >= u.seconds) ?? units.at(-1)!;

  return { value: Math.ceil(seconds / unitSeconds), unit };
};

export const formatMilliseconds = (ms: number): string => {
  if (ms >= MS_PER_DAY) {
    const days = Math.floor(ms / MS_PER_DAY);
    const hours = Math.floor((ms % MS_PER_DAY) / MS_PER_HOUR);
    return `${days}d${hours}h`;
  }

  if (ms >= MS_PER_HOUR) {
    const hours = Math.floor(ms / MS_PER_HOUR);
    const minutes = Math.floor((ms % MS_PER_HOUR) / MS_PER_MINUTE);
    return `${hours}h${minutes}m`;
  }

  if (ms >= MS_PER_MINUTE) {
    const minutes = Math.floor(ms / MS_PER_MINUTE);
    const seconds = Math.floor((ms % MS_PER_MINUTE) / MS_PER_SECOND);
    return `${minutes}m${seconds}s`;
  }

  if (ms >= MS_PER_SECOND) {
    const seconds = Math.floor(ms / MS_PER_SECOND);
    return `${seconds}s`;
  }

  return `${ms}ms`;
};
