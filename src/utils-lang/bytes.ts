type FormatBytesOptions = {
  skipUnit?: boolean;
  unitFormatter?: (unit: string) => string;
};

export const formatBytes = (
  bytes: number,
  decimals = 2,
  options: FormatBytesOptions = { skipUnit: false },
): string => {
  if (bytes <= 0) return '0';

  const k = 1024;
  const sizes = ['Bytes', 'Kb', 'Mb', 'Gb', 'Tb'];
  const index = Math.floor(Math.log(bytes) / Math.log(k));

  let unit;

  if (!options.skipUnit) {
    unit = sizes[index];
    if (options.unitFormatter) {
      unit = options.unitFormatter(unit);
    }
  }

  return `${parseFloat((bytes / Math.pow(k, index)).toFixed(decimals))} ${
    unit || ''
  }`.trim();
};
