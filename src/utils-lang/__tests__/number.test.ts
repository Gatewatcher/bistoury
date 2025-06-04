import { clamp, formatNumber, isOdd } from '../number';

describe('Number utils tests', () => {
  it('should format number to 10k', () => {
    expect(formatNumber(10000)).toBe('10k');
  });
  it('should format number to 1M', () => {
    expect(formatNumber(1e6)).toBe('1M');
  });
  it('should format number to 2G', () => {
    expect(formatNumber(2e9)).toBe('2G');
  });
  it('should format number to 1T', () => {
    expect(formatNumber(1e12)).toBe('1T');
  });
  it('should format number to 10k and add a unit', () => {
    expect(formatNumber(10000, { unit: 'B' })).toBe('10kB');
  });

  it('should clamp number', () => {
    expect(clamp(0, 1, 100)).toBe(1);
  });

  it('should be even', () => {
    expect(isOdd(2)).toBe(false);
  });
  it('should be odd', () => {
    expect(isOdd(1)).toBe(true);
  });
});
