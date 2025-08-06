/* eslint-disable @typescript-eslint/no-explicit-any */
import { isDefined } from './../../utils-lang/common';
import { consoleDebug } from './../../utils-log';

export const isSupported = (): boolean => {
  try {
    return 'localStorage' in window && isDefined(window.localStorage);
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    return false;
  }
};

export const set = (key: string, value: any): boolean => {
  if (!isSupported()) {
    return false;
  }
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    consoleDebug(`unable to set localStorage ${e}`);
    return false;
  }
};

export const get = (key: string) => {
  if (!isSupported()) {
    return false;
  }
  const item: any = window.localStorage.getItem(key);
  try {
    try {
      return JSON.parse(item);
    } catch {
      return item;
    }
  } catch (e) {
    consoleDebug(`unable to get localStorage ${e}`);
    return false;
  }
};

export const remove = (key: string) => {
  if (!isSupported()) {
    return false;
  }

  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (e) {
    consoleDebug(`unable to remove localStorage ${e}`);
    return false;
  }
};

export const clear = () => {
  if (!isSupported()) {
    return false;
  }

  try {
    window.localStorage.clear();
    return true;
  } catch (e) {
    consoleDebug(`unable to clear localStorage ${e}`);
    return false;
  }
};
