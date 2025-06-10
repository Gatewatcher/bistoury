/* eslint-disable @typescript-eslint/no-explicit-any */
import { logConfig } from './config';

export const shouldLog = () => {
  return logConfig.environment !== 'production';
};

export const consoleDebug = (...args: any[]) => {
  if (shouldLog()) {
    console.debug(...args);
  }
};

export const consoleWarn = (...args: any[]) => {
  if (shouldLog()) {
    console.warn(...args);
  }
};

export const consoleError = (...args: any[]) => {
  if (shouldLog()) {
    console.error(...args);
  }
};

export const consoleInfo = (...args: any[]) => {
  if (shouldLog()) {
    console.info(...args);
  }
};

export const consoleLog = (...args: any[]) => {
  if (shouldLog()) {
    console.log(...args);
  }
};

export const throwError = (message?: string, options?: ErrorOptions) => {
  if (shouldLog()) {
    throw new Error(message, options);
  }
};
