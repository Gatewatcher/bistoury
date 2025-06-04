// import { isDefined, isJSON } from '@gw/utils-lang';
// import { consoleDebug } from '@gw/utils-log';

// const isSupported = (): boolean => {
//   try {
//     return 'localStorage' in window && isDefined(window.localStorage);
//   } catch (error) {
//     console.error('Error accessing localStorage:', error);
//     return false;
//   }
// };

// const set = (key: string, value: any): boolean => {
//   if (!isSupported()) {
//     return false;
//   }
//   try {
//     window.localStorage.setItem(key, JSON.stringify(value));
//     return true;
//   } catch (e) {
//     consoleDebug(`unable to set localStorage ${e}`);
//     return false;
//   }
// };

// const get = (key: string) => {
//   if (!isSupported()) {
//     return false;
//   }
//   const item: any = window.localStorage.getItem(key);
//   try {
//     return isJSON(item) ? JSON.parse(item) : item;
//   } catch (e) {
//     consoleDebug(`unable to get localStorage ${e}`);
//     return e;
//   }
// };

// export default {
//   isSupported,
//   set,
//   get,
// };
