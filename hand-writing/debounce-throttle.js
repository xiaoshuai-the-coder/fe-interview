/**
 * 节流函数: 指定时间内仅执行一次，多次触发不重新计时
 * @param {Function} fn - 目标函数
 * @param {number} wait - 节流间隔(ms)
 * @param {boolean} immediate - 是否立即执行
 * @returns {Function} 节流后的函数（含cancel方法）
 */
const throttle = (fn, wait, immediate = false) => {
  let lastRunTime = null
  return function (...args) {
      if (immediate) {
          fn.apply(this, args)
      }

      const now = Date.now()

      if (now - lastRunTime >= wait) {
        lastRunTime = now
        fn.apply(this, args)
      }

  }
};

/**
 * 防抖函数: 触发后延迟执行，重复触发重置延迟
 * @param {Function} fn - 目标函数
 * @param {number} wait - 防抖延迟(ms)
 * @param {boolean} immediate - 是否立即执行
 * @returns {Function} 防抖后的函数（含cancel方法）
 */
const debounce = (fn, wait = 0, immediate = false) => {
    let timer = null
    return function (...args) {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }

      timer = setTimeout(()=> {
        fn.apply(this, args)
        timer = null
      }, wait)
    }
};

module.exports = { throttle, debounce };
