// 导入你手写的 Promise 类（路径根据实际文件调整）
const MyPromise = require('../promise')

// 基础功能测试
describe('MyPromise 基础特性', () => {
  // 测试 Promise 初始化状态为 pending
  test('初始状态为 pending', () => {
    const promise = new MyPromise(() => {});
    expect(promise.state).toBe('pending');
  });

  // 测试 resolve 成功状态
  test('resolve 触发 fulfilled 状态', (done) => {
    const testValue = 'success';
    const promise = new MyPromise((resolve) => {
      resolve(testValue);
    });

    promise.then((value) => {
      expect(value).toBe(testValue);
      expect(promise.state).toBe('fulfilled');
      done(); // 异步测试必须调用 done 或返回 Promise
    });
  });

  // 测试 reject 失败状态
  test('reject 触发 rejected 状态', (done) => {
    const testReason = 'error';
    const promise = new MyPromise((_, reject) => {
      reject(testReason);
    });
    
    promise.catch((reason) => {
      expect(reason).toBe(testReason);
      expect(promise.state).toBe('rejected');
      done();
    });
  });

  // 测试异步 resolve
  test('异步 resolve 能正确执行回调', (done) => {
    const testValue = 'async success';
    const promise = new MyPromise((resolve) => {
      setTimeout(() => {
        resolve(testValue);
      }, 100);
    });

    promise.then((value) => {
      expect(value).toBe(testValue);
      done();
    });
  });
});

// 链式调用测试
describe('MyPromise 链式调用', () => {
  // 测试基础链式调用
  test('then 支持链式调用，值穿透', () => {
    const testValue = 'chain value';
    return MyPromise.resolve(testValue)
      .then() // 空回调，值穿透
      .then((value) => {
        expect(value).toBe(testValue);
        return value + ' chain';
      })
      .then((value) => {
        expect(value).toBe('chain value chain');
      });
  });

  // 测试链式调用返回 Promise
  test('then 回调返回 Promise 时，等待其完成', () => {
    return MyPromise.resolve(1)
      .then((value) => {
        return new MyPromise((resolve) => {
          setTimeout(() => resolve(value + 1), 50);
        });
      })
      .then((value) => {
        expect(value).toBe(2);
      });
  });

  // 测试链式调用异常捕获
  test('catch 能捕获链式调用中的异常', () => {
    return MyPromise.resolve()
      .then(() => {
        throw new Error('chain error');
      })
      .catch((err) => {
        expect(err.message).toBe('chain error');
      });
  });
});

// 静态方法测试
describe('MyPromise 静态方法', () => {
  // 测试 Promise.all
  test('all 方法：所有 Promise 成功则返回结果数组', () => {
    const p1 = MyPromise.resolve(1);
    const p2 = new MyPromise((resolve) => setTimeout(() => resolve(2), 100));
    const p3 = 3; // 非 Promise 值

    return MyPromise.all([p1, p2, p3]).then((values) => {
      expect(values).toEqual([1, 2, 3]);
    });
  });

  test('all 方法：任意一个 Promise 失败则立即 reject', () => {
    const p1 = MyPromise.resolve(1);
    const p2 = MyPromise.reject('all error');
    const p3 = MyPromise.resolve(3);

    return MyPromise.all([p1, p2, p3]).catch((reason) => {
      expect(reason).toBe('all error');
    });
  });

  // 测试 Promise.race
  test('race 方法：返回第一个完成的 Promise 结果', () => {
    const p1 = new MyPromise((resolve) => setTimeout(() => resolve(1), 100));
    const p2 = new MyPromise((resolve) => setTimeout(() => resolve(2), 50));

    return MyPromise.race([p1, p2]).then((value) => {
      expect(value).toBe(2);
    });
  });

  // 测试 Promise.allSettled
  test('allSettled 方法：返回所有 Promise 的执行结果', () => {
    const p1 = MyPromise.resolve(1);
    const p2 = MyPromise.reject('settled error');

    return MyPromise.allSettled([p1, p2]).then((results) => {
      expect(results).toEqual([
        { state: 'fulfilled', value: 1 },
        { state: 'rejected', reason: 'settled error' }
      ]);
    });
  });
});

// 异常处理测试
describe('MyPromise 异常处理', () => {
  test('执行器同步异常能被捕获', (done) => {
    const promise = new MyPromise(() => {
      throw new Error('executor error');
    });

    promise.catch((err) => {
      expect(err.message).toBe('executor error');
      done();
    });
  });

  test('finally 无论成功失败都会执行', () => {
    const mockFn = jest.fn();
    // 成功状态
    MyPromise.resolve().finally(mockFn);
    // 失败状态
    MyPromise.reject().finally(mockFn);

    // 等待微任务执行
    return Promise.resolve().then(() => {
      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });
});