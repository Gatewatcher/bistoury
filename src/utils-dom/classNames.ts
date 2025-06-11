// Fork form clsx package : https://github.com/lukeed/clsx
// Custom unit tests
type Mix = string | number | boolean | null | undefined | string[] | Object;

const toVal = (mix: Mix): string => {
  let k, y;
  let str = '';

  if (typeof mix === 'string' || typeof mix === 'number') {
    str += mix.toString();
  } else if (typeof mix === 'object') {
    if (Array.isArray(mix)) {
      for (k = 0; k < mix.length; k++) {
        if (mix[k]) {
          if ((y = toVal(mix[k]))) {
            str && (str += ' ');
            str += y;
          }
        }
      }
    } else {
      for (k in mix) {
        if (mix[k]) {
          str && (str += ' ');
          str += k;
        }
      }
    }
  }

  return str;
};

export const classNames = (...args: Mix[]): string => {
  let str = '';
  let i = 0,
    tmp,
    x;

  while (i < args.length) {
    if ((tmp = args[i++])) {
      if ((x = toVal(tmp))) {
        str && (str += ' ');
        str += x;
      }
    }
  }

  return str.replace(/\s+/g, ' ').trim();
};
