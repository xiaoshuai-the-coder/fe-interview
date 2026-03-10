const { throttle, debounce } = require('../debounce-throttle');

// 启用假定时器（核心：模拟时间）
jest.useFakeTimers();

// 每个测试后清空模拟数据
afterEach(() => {
  jest.clearAllMocks();
  jest.clearAllTimers();
});

// ===================== 节流函数（极简测试） =====================
describe('节流函数 throttle', () => {
  test('基础节流：1秒内多次触发仅执行2次', () => {
    const mockFn = jest.fn();
    const throttled = throttle(mockFn, 1000);

    // 多次触发
    throttled();
    throttled();
    throttled();

    // 快进1秒 → 定时器执行1次
    jest.advanceTimersByTime(1000);
    expect(mockFn).toHaveBeenCalledTimes(1);

    // 1秒后再次触发 → 执行第2次
    throttled();
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  test('立即执行节流：首次触发直接执行', () => {
    const mockFn = jest.fn();
    const throttled = throttle(mockFn, 1000, true);

    // 首次触发 → 立即执行
    throttled();
    expect(mockFn).toHaveBeenCalledTimes(1);

    // 500ms后触发 → 不执行
    jest.advanceTimersByTime(500);
    throttled();
    expect(mockFn).toHaveBeenCalledTimes(1);

    // 再等500ms（累计1秒）→ 执行第2次
    jest.advanceTimersByTime(500);
    throttled();
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

//   // 仅修改 cancel 用例：移除 Mock，用真实状态验证
//   test('取消节流：函数不再执行', () => {
//     // 真实状态：跟踪执行次数
//     let executeCount = 0;
//     const targetFn = () => {
//       executeCount++;
//     };

//     const throttled = throttle(targetFn, 1000);

//     // 保留原有步骤：触发节流 → 取消 → 快进1秒
//     throttled(); // 触发节流
//     throttled.cancel(); // 取消

//     // 快进1秒 → 无执行
//     jest.advanceTimersByTime(1000);
//     expect(executeCount).toBe(0); // 真实计数断言，无 Mock 依赖
//   });
});

// ===================== 防抖函数（极简测试） =====================
describe('防抖函数 debounce', () => {
  test('基础防抖：多次触发仅最后一次执行', () => {
    const mockFn = jest.fn();
    const debounced = debounce(mockFn, 1000);

    // 短时间内多次触发
    debounced();
    debounced();
    debounced();

    // 快进1秒 → 仅执行1次（最后一次）
    jest.advanceTimersByTime(1000);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('立即执行防抖：首次触发直接执行', () => {
    const mockFn = jest.fn();
    const debounced = debounce(mockFn, 1000, true);

    // 首次触发 → 立即执行
    debounced();
    expect(mockFn).toHaveBeenCalledTimes(1);

    // 500ms后触发 → 不执行
    debounced();
    jest.advanceTimersByTime(500);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('取消防抖：函数不再执行', () => {
    const mockFn = jest.fn();
    const debounced = debounce(mockFn, 1000);

    debounced(); // 触发防抖
    debounced.cancel(); // 取消

    // 快进1秒 → 无执行
    jest.advanceTimersByTime(1000);
    expect(mockFn).toHaveBeenCalledTimes(0);
  });
});