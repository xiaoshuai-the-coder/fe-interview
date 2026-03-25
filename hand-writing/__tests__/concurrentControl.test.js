const { ConcurrentControl } = require('../concurrentControl');

// 模拟异步任务
const createTask = (time, value) => () =>
  new Promise(resolve => setTimeout(() => resolve(value), time));

describe('Class 版 并发控制', () => {
  // 1. 基础并发 + 返回结果
  test('基础并发限制，并返回正确结果', async () => {
    const pool = new ConcurrentControl(2);

    const t1 = createTask(100, 'task1');
    const t2 = createTask(100, 'task2');
    const t3 = createTask(100, 'task3');

    // 添加任务
    pool.add(t1);
    pool.add(t2);
    pool.add(t3);

    // 等待全部完成
    const res = await pool.waitAll();

    // 断言结果
    expect(res).toEqual(expect.arrayContaining(['task1', 'task2', 'task3']));
  });

  // 2. 空任务直接完成
  test('空任务时直接完成', async () => {
    const pool = new ConcurrentControl(2);
    const result = await pool.waitAll();
    expect(result).toEqual([]);
  });

  // 3. 最大并发数生效（核心测试）
  test('最大并发数限制生效', async () => {
    const pool = new ConcurrentControl(2);
    let currentRunning = 0;

    const task = () =>
      new Promise(resolve => {
        currentRunning++;
        setTimeout(() => {
          currentRunning--;
          resolve();
        }, 200);
      });

    pool.add(task);
    pool.add(task);
    pool.add(task);

    // 短时间检查：最多只能有 2 个同时运行
    const promise = new Promise(resolve => {
      setTimeout(() => {
        expect(currentRunning).toBe(2);
        resolve(true);
      }, 50);
    });

    await promise;
    await pool.waitAll();
  });
});