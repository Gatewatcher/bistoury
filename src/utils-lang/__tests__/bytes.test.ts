import { formatBytes } from '../bytes';

const kilobyteInBytes = 1 * 1024;
const megabyteInBytes = kilobyteInBytes * 1024;
const gigabyteInBytes = megabyteInBytes * 1024;
const terabyteInBytes = gigabyteInBytes * 1024;

describe('formatBytes', () => {
  it('should return 0', () => {
    const result = formatBytes(0);
    expect(result).toBe('0');
  });

  it('should have two decimals', () => {
    const result = formatBytes(10000000);
    expect(result.split(' ')[0]).toHaveLength(4);
  });

  it('should equals 1 Tb', () => {
    const result = formatBytes(terabyteInBytes);
    expect(result).toBe('1 Tb');
  });

  it('should equals 1', () => {
    const result = formatBytes(terabyteInBytes);
    expect(result.split(' ')[0]).toBe('1');
  });

  it('should equals 1', () => {
    const result = formatBytes(terabyteInBytes, undefined, { skipUnit: true });
    expect(result).toBe('1');
  });

  it('should equals 1 TB', () => {
    const result = formatBytes(terabyteInBytes, undefined, {
      unitFormatter: unit => unit.toUpperCase(),
    });
    expect(result).toBe('1 TB');
  });
});
