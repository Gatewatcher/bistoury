export const getCookie = (cookieName: string) => {
  const name = cookieName + '=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let c of ca) {
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
};

export const setCookie = (
  name: string,
  value: string,
  expires: number = 60 * 60 * 1000,
) => {
  const d = new Date();
  d.setTime(d.getTime() + expires);
  const expiresString = `expires=${d.toUTCString()}`;
  document.cookie = `${name}=${value};${expiresString};path=/`;
};

export const checkCookie = (name: string, value: string) => {
  return value === getCookie(name);
};
