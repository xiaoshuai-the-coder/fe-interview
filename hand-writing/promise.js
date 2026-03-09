const STATES = {
  PENDING: "pending",
  FULFILLED: "fulfilled",
  REJECTED: "rejected",
};
class MyPromise {
  constructor(executor) {
    this.state = STATES.PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onFulFilledCb = [];
    this.onRejectedCb = [];

    const resolve = (value) => {
      if (this.state === STATES.PENDING) {
        this.state = STATES.FULFILLED;
        this.value = value;
        this.onFulFilledCb.forEach((fn) =>
          queueMicrotask(() => {
            fn(this.value);
          }),
        );
      }
    };

    const reject = (reason) => {
      if (this.state === STATES.PENDING) {
        this.state = STATES.REJECTED;
        this.reason = reason;
        this.onRejectedCb.forEach((fn) =>
          queueMicrotask(() => {
            fn(this.reason);
          }),
        );
      }
    };

    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }

  then(onFulFilled, onRejected) {
    // 非函数处理为函数
    onFulFilled =
      typeof onFulFilled === "function" ? onFulFilled : (value) => value;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (error) => {
            throw error;
          };

    const promise = new MyPromise((resolve, reject) => {
      const handleFulFilled = (value) => {
        try {
          const result = onFulFilled(value);
          MyPromise.resolvePromise(promise, result, resolve, reject);
        } catch (error) {
          reject(error);
        }
      };

      const handleRejected = (value) => {
        try {
          const result = onRejected(value);
          MyPromise.resolvePromise(promise, result, resolve, reject);
        } catch (error) {
          reject(error);
        }
      };
      if (this.state === STATES.FULFILLED) {
        queueMicrotask(() => {
          handleFulFilled(this.value);
        });
      } else if (this.state === STATES.REJECTED) {
        queueMicrotask(() => {
          handleRejected(this.reason);
        });
      } else {
        this.onFulFilledCb.push(handleFulFilled);
        this.onRejectedCb.push(handleRejected);
      }
    });

    return promise;
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  static resolvePromise(newPromise, result, resolve, reject) {
    if (newPromise === result) {
      return reject(new TypeError("cycle promise"));
    }

    if (result instanceof MyPromise) {
      result.then(resolve, reject);
    } else if (
      (result !== null && typeof result === "function") ||
      typeof result === "object"
    ) {
      try {
        result.then(
          (r) => resolve(r),
          (x) => reject(x),
        );
      } catch (error) {
        reject(error);
      }
    } else {
      resolve(result);
    }
  }

  static resolve(value) {
    if (value instanceof MyPromise) {
      return value;
    }
    return new MyPromise((resolve) => resolve(value));
  }

  static reject(error) {
    return new MyPromise((_, reject) => reject(error));
  }

  static all(promises) {
    return new MyPromise((resolve, reject) => {
      let finishedCount = 0;
      const promisesList = Array.from(promises);
      const result = [];
      if (promisesList.length === 0) {
        resolve(result);
      }
      promisesList.forEach((fn, index) => {
        MyPromise.resolve(fn).then(
          (value) => {
            result[index] = value;
            finishedCount++;
            if (finishedCount === promisesList.length) {
              resolve(result);
            }
          },
          (error) => {
            reject(error);
          },
        );
      });
    });
  }

  static race(promises) {
    return new MyPromise((resolve, reject) => {
      const promisesList = Array.from(promises);
      // 是否已经获取到第一个结果
      let isDone = false;
      promisesList.forEach((fn) => {
        MyPromise.resolve(fn).then(
          (value) => {
            if (!isDone) {
              isDone = true;
              resolve(value);
            }
          },
          (error) => {
            if (!isDone) {
              isDone = true;
              reject(error);
            }
          },
        );
      });
    });
  }

  finally(onFinally) {
    return this.then(
      (value) => {
        return MyPromise.resolve(onFinally()).then(() => value);
      },
      (error) => {
        return MyPromise.resolve(onFinally()).then(() => {
          throw error;
        });
      },
    );
  }
  static allSettled(promises) {
    return new MyPromise((resolve, reject) => {
      let count = 0;
      let promisesList = Array.from(promises);
      const result = []
      promisesList.forEach((fn, index) => {
        MyPromise.resolve(fn).then(
          (value) => {
            result[index] = { state: STATES.FULFILLED, value };
          },
          (error) => {
            result[index] = { state: STATES.REJECTED, reason: error };
          },
        )
        .finally(()=> {
          count ++ 
          if (count === promisesList.length) {
              resolve(result)
          }
        })
      });
    });
  }
}

module.exports = MyPromise;
//1. class的resolve和reject和constructor中的有什么区别
//2. resolvePromise 静态方法未加 static 修饰 为什么一定要加static
