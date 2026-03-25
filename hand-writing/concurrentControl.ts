type Task<T = unknown> = () => Promise<T>;
interface ConcurrentControlInterface {
  tasksQuene: Task[];
  running: number;
  result: unknown[];
  limits: number;
}
class ConcurrentControl implements ConcurrentControlInterface {
  tasksQuene: Task[];
  running: number;
  result: unknown[];
  limits: number;

  constructor(limits: number) {
    this.tasksQuene = [];
    this.running = 0;
    this.result = [];
    this.limits = limits;
  }

  add(task: Task) {
    this.tasksQuene.push(task);
    this.run();
  }

  async run() {
    if (this.running >= this.limits) {
      return;
    }
    const fn = this.tasksQuene.shift();
    if (fn) {
      this.running++;

      fn()
        .then((res) => {
          this.result.push(res);
        })
        .finally(() => {
          this.running--;
          this.run();
        });
    }
  }
  async waitAll() {
    return new Promise(async (resolve, reject) => {
      const check = () => {
        if (this.tasksQuene.length === 0 && this.running === 0) {
          resolve(this.result);
          return;
        }
        setTimeout(check, 10);
      };
      check();
      this.run();
    });
  }
}

module.exports = { ConcurrentControl };
