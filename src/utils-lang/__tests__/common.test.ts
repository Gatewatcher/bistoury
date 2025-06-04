import { isDefined } from '..';

describe('isDefined', () => {
  const unsafeSlice = (variable?: string | null) => {
    (variable as string).slice();
  };

  const safeSlice = (variable?: string | null) => {
    if (isDefined(variable)) {
      variable.slice();
    }
  };

  it('should work on a string', async () => {
    expect(() => unsafeSlice('')).not.toThrow();
  });

  it('should throw on undefined', async () => {
    expect(() => unsafeSlice(undefined)).toThrow();
  });

  it('should throw on null', async () => {
    expect(() => unsafeSlice(null)).toThrow();
  });

  it('should work on a string', async () => {
    expect(() => safeSlice('')).not.toThrow();
  });

  it('should be safe on undefined', async () => {
    expect(() => safeSlice(undefined)).not.toThrow();
  });

  it('should be safe on null', async () => {
    expect(() => safeSlice(null)).not.toThrow();
  });
});
