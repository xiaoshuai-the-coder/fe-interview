/**
 * 节流函数: 指定时间内仅执行一次，多次触发不重新计时
 * @param {Function} fn - 目标函数
 * @param {number} wait - 节流间隔(ms)
 * @param {boolean} immediate - 是否立即执行
 * @returns {Function} 节流后的函数（含cancel方法）
 */
const throttle = (fn, wait, immediate = false) => {
  let timer = null;
  let lastCallTime = 0;
  let isCanceled = false

  const throttled = function (...args) {
    const now = Date.now();
    const context = this;

    if (isCanceled) return;

    // 立即执行：首次触发直接执行
    if (immediate && lastCallTime === 0) {
      fn.apply(context, args);
      lastCallTime = now;
      return;
    }
    if (timer) {
      clearTimeout(timer);
      timer = null;
      return
    }
    const timeRemaining = wait - (now - lastCallTime);

    if (timeRemaining <= 0) {
      // 间隔到期：直接执行
      fn.apply(context, args);
      lastCallTime = now;
    } else {
      // 间隔未到：设置定时器
      timer = setTimeout(() => {
        fn.apply(context, args);
        lastCallTime = Date.now();
        timer = null;
      }, timeRemaining);
    }
  };

  throttled.cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    lastCallTime = 0;
    isCanceled = true
  };

  return throttled;
};

/**
 * 防抖函数: 触发后延迟执行，重复触发重置延迟
 * @param {Function} fn - 目标函数
 * @param {number} wait - 防抖延迟(ms)
 * @param {boolean} immediate - 是否立即执行
 * @returns {Function} 防抖后的函数（含cancel方法）
 */
const debounce = (fn, wait = 0, immediate = false) => {};

module.exports = { throttle, debounce };
