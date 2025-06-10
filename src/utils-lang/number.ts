/* eslint-disable @typescript-eslint/no-explicit-any */

export const formatNumber = (
  value: number,
  { unit = '', min = 1e3 }: { unit?: string; min?: number } = {
    unit: '',
    min: 1e3,
  },
) => {
  if (value < min) {
    return value.toLocaleString();
  }
  const units = ['k', 'M', 'G', 'T'];
  const order = Math.floor(Math.log(value) / Math.log(1000));
  const unitPower = units[order - 1];
  const num = Math.floor(value / 1000 ** order);

  return num + unitPower + unit;
};

export const clamp = (number = 0, min: number, max: number) => {
  return Math.max(min, Math.min(number, max));
};

export const isNumber = (number: any): number is number => {
  return typeof number === 'number';
};

export const isOdd = (nb: number) => {
  return nb % 2 === 1;
};
