/* eslint-disable @typescript-eslint/no-explicit-any */

// Source : https://practicalrescript.com/rescript-vs-typescript-concurrent-queue/
// adapted to our needs
type QueueOpts = {
  maxConcurrency: number;
  keepResults: boolean;
  delayInMs?: number;
};

type Task<R> = () => Promise<R>;

const PAUSE_LOOP_DELAY = 500;

export class ConcurrentQueue<R> {
  private maxConcurrency = 1;
  keepResults = false;
  delayInMs: number;
  running = true;
  tasks: Task<R>[] = [];
  results: (R | any)[] = [];
  workers: Promise<void>[] = [];
  availableWorkers = 0;

  constructor({ maxConcurrency, keepResults, delayInMs }: QueueOpts) {
    this.maxConcurrency = maxConcurrency;
    this.keepResults = keepResults;
    this.delayInMs = delayInMs ?? 0;
    this.availableWorkers = this.maxConcurrency;
  }

  setMaxConcurrency(value: number) {
    this.availableWorkers =
      value - (this.maxConcurrency - this.availableWorkers);
    this.maxConcurrency = value;
  }

  pause() {
    this.running = false;
  }

  run() {
    this.running = true;
  }

  /**
   * Returns a Promise that resolves to an array of inputs, like Promise.all.
   *
   * If additional unresolved promises are added to the passed-in iterable or
   * array, the returned Promise will additionally wait for those, as long as
   * they are added before the final promise in the iterable can resolve.
   * Source : https://stackoverflow.com/a/37819138
   */
  iterablePromiseAll = (iterable: Array<Promise<void>>): any => {
    return Promise.all(iterable).then(resolvedIterable => {
      if (iterable.length !== resolvedIterable.length) {
        // The list of promises or values changed. Return a new Promise.
        // The original promise won't resolve until the new one does.
        return this.iterablePromiseAll(iterable);
      }
      // The list of promises or values stayed the same.
      // Return results immediately.
      return resolvedIterable;
    });
  };

  public async waitForResults(): Promise<R[]> {
    // Calling this method wait for all the workers to be done, clear them,
    // then send a copy of the results (the results are cleared too).
    await this.iterablePromiseAll(this.workers);
    this.tasks = [];
    this.workers = [];
    const results = this.results;
    this.results = [];
    return results;
  }

  public addTasks(tasks: Task<R>[]) {
    if (tasks.length) {
      this.tasks = [...this.tasks, ...tasks];
      this.createWorkers();
    }
  }

  createWorkers() {
    this.workers.push(
      ...new Array(this.availableWorkers).fill(0).map(() => this.doWork()),
    );

    this.availableWorkers = 0;
  }

  async doWork(): Promise<void> {
    if (this.tasks.length < 1) {
      this.availableWorkers++;
      return;
    }
    if (!this.running) {
      setTimeout(() => this.doWork().then(), PAUSE_LOOP_DELAY);
      return;
    }
    const nextTask = this.tasks.shift();
    let result;
    try {
      result = await nextTask?.();
    } catch (err) {
      result = err;
    }
    if (this.keepResults) {
      this.results.push(result);
    }
    if (this.delayInMs) {
      await new Promise(resolve => setTimeout(resolve, this.delayInMs));
    }
    return this.doWork();
  }
}
