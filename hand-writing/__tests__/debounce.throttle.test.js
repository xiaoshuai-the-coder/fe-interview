const { throttle, debounce } = require('../debounce-throttle');

// 启用假定时器（核心：模拟时间）
jest.useFakeTimers();

// 每个测试后清空模拟数据
afterEach(() => {
  jest.clearAllMocks();
  jest.clearAllTimers();
});

describe('节流函数 throttle', () => {
  let fn;
  let throttledFn;

  // 每个测试用例执行前重置函数和定时器
  beforeEach(() => {
    fn = jest.fn(); // 创建模拟函数
    throttledFn = throttle(fn, 1000); // 节流时间 1 秒
    jest.clearAllMocks(); // 清空 mock 调用记录
  });

  // 测试 1：基础调用 —— 立即执行一次
  test('首次调用立即执行函数', () => {
    throttledFn();
    
    // 首次调用应该立即执行
    expect(fn).toHaveBeenCalledTimes(1);
  });

  // 测试 2：连续频繁触发，间隔内只执行一次
  test('1秒内连续调用，只执行一次', () => {
    // 连续调用 5 次
    throttledFn();
    throttledFn();
    throttledFn();
    throttledFn();
    throttledFn();

    // 间隔内只执行 1 次
    expect(fn).toHaveBeenCalledTimes(1);
  });

  // 测试 3：超过间隔时间后，再次执行
  test('超过间隔时间后再次执行', () => {
    // 第一次调用
    throttledFn();
    expect(fn).toHaveBeenCalledTimes(1);

    // 快进时间 1000ms（超过节流间隔）
    jest.advanceTimersByTime(1000);

    // 再次调用
    throttledFn();
    
    // 总共执行 2 次
    expect(fn).toHaveBeenCalledTimes(2);
  });

  // 测试 4：正确绑定 this 指向
  test('正确绑定 this 指向', () => {
    const obj = { name: 'test' };
    // 将节流函数挂载到对象上
    obj.throttledFn = throttle(fn, 1000);

    // 调用
    obj.throttledFn();

    // 验证 this 指向 obj
    expect(fn).toHaveBeenCalledWith();
    expect(fn.mock.instances[0]).toBe(obj);
  });

  // 测试 5：正确传递参数
  test('调用时正确传递参数', () => {
    throttledFn('参数1', 123, { key: 'value' });

    // 验证参数传递正确
    expect(fn).toHaveBeenCalledWith('参数1', 123, { key: 'value' });
  });
});

describe('防抖函数 debounce', () => {
  let mockFn;
  let debouncedFn;

  // 每个用例执行前重置
  beforeEach(() => {
    mockFn = jest.fn();
    debouncedFn = debounce(mockFn, 500); // 延迟 500ms
    jest.clearAllMocks();
  });

  test('连续触发只执行最后一次', () => {
    // 连续调用 3 次
    debouncedFn();
    debouncedFn();
    debouncedFn();

    // 快进时间到定时器执行
    jest.runAllTimers();

    // 最终只执行 1 次
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('正确传递参数', () => {
    debouncedFn('test', 123);
    jest.runAllTimers();
    expect(mockFn).toHaveBeenCalledWith('test', 123);
  });

  test('正确绑定 this 指向', () => {
    const obj = { name: 'test' };
    obj.debouncedFn = debounce(mockFn, 500);
    
    obj.debouncedFn();
    jest.runAllTimers();
    
    expect(mockFn.mock.instances[0]).toBe(obj);
  });
});