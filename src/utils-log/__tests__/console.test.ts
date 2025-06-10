import { LogEnvironment, logConfig } from '../config';
import {
  consoleDebug,
  consoleError,
  consoleInfo,
  consoleLog,
  consoleWarn,
  throwError,
} from '../console';

describe('Console log utils tests', () => {
  const message = 'test';
  const savedEnv = process.env.NODE_ENV as LogEnvironment;

  beforeEach(() => {
    logConfig.environment = savedEnv;
  });

  it('should call console.debug', () => {
    const spy = vi.spyOn(console, 'debug').mockImplementation(() => {});
    consoleDebug(message);
    expect(spy).toHaveBeenLastCalledWith(message);
    spy.mockRestore();
  });

  it('should not call console.debug in production', () => {
    logConfig.environment = 'production';
    const spy = vi.spyOn(console, 'debug').mockImplementation(() => {});
    consoleDebug(message);
    expect(spy).toHaveBeenCalledTimes(0);
    spy.mockRestore();
  });

  it('should call console.warn', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    consoleWarn(message);
    expect(spy).toHaveBeenLastCalledWith(message);
    spy.mockRestore();
  });

  it('should not call console.warn in production', () => {
    logConfig.environment = 'production';
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    consoleWarn(message);
    expect(spy).toHaveBeenCalledTimes(0);
    spy.mockRestore();
  });

  it('should call console.error', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    consoleError(message);
    expect(spy).toHaveBeenLastCalledWith(message);
    spy.mockRestore();
  });

  it('should not call console.error in production', () => {
    logConfig.environment = 'production';
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    consoleError(message);
    expect(spy).toHaveBeenCalledTimes(0);
    spy.mockRestore();
  });

  it('should call console.info', () => {
    const spy = vi.spyOn(console, 'info').mockImplementation(() => {});
    consoleInfo(message);
    expect(spy).toHaveBeenLastCalledWith(message);
    spy.mockRestore();
  });

  it('should not call console.info in production', () => {
    logConfig.environment = 'production';
    const spy = vi.spyOn(console, 'info').mockImplementation(() => {});
    consoleInfo(message);
    expect(spy).toHaveBeenCalledTimes(0);
    spy.mockRestore();
  });

  it('should call console.log', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleLog(message);
    expect(spy).toHaveBeenLastCalledWith(message);
    spy.mockRestore();
  });

  it('should not call console.log in production', () => {
    logConfig.environment = 'production';
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleLog(message);
    expect(spy).toHaveBeenCalledTimes(0);
    spy.mockRestore();
  });

  it('should call throw error', () => {
    expect(() => throwError('error')).toThrow('error');
  });

  it('should not throw error in production', () => {
    logConfig.environment = 'production';
    expect(() => throwError('error')).not.toThrow('error');
  });
});
