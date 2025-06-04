export type LogEnvironment = 'development' | 'production' | 'test';

class LogConfig {
  #environment: LogEnvironment;

  set environment(environment) {
    this.#environment = environment;
  }

  get environment() {
    return this.#environment;
  }
}

export const logConfig = new LogConfig();
