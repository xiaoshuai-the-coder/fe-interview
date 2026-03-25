const { EventBus } = require('../eventBus');

describe('事件总线 - 发布订阅模式', () => {
  let bus;
  beforeEach(() => {
    bus = new EventBus();
  });

  // 1. 基础 on/emit
  test('on 监听，emit 触发', (done) => {
    bus.on('test', (val) => {
      expect(val).toBe('hello');
      done();
    });
    bus.emit('test', 'hello');
  });

  // 2. once 只执行一次
  test('once 只执行一次', () => {
    let count = 0;
    bus.once('once', () => count++);
    bus.emit('once');
    bus.emit('once');
    expect(count).toBe(1);
  });

  // ------------------------------
  // 3. 【核心】一个事件，多个回调（必测）
  // ------------------------------
  test('同一个事件绑定多个回调，全部执行', () => {
    let count1 = 0;
    let count2 = 0;

    // 同一个事件，绑定 2 个函数
    bus.on('multi', () => count1++);
    bus.on('multi', () => count2++);

    bus.emit('multi');

    expect(count1).toBe(1);
    expect(count2).toBe(1);
  });

  // ------------------------------
  // 4. 【核心】取消单个回调，其他回调正常执行（必测）
  // ------------------------------
  test('off 取消单个回调，不影响其他回调', () => {
    let count1 = 0;
    let count2 = 0;
    const fn1 = () => count1++;
    const fn2 = () => count2++;

    bus.on('offSingle', fn1);
    bus.on('offSingle', fn2);

    // 只取消 fn1
    bus.off('offSingle', fn1);
    bus.emit('offSingle');

    // fn1 已取消 → 0
    // fn2 仍存在 → 1
    expect(count1).toBe(0);
    expect(count2).toBe(1);
  });

  // ------------------------------
  // 5. 【核心】不传 fn，取消整个事件所有回调
  // ------------------------------
  test('off 不传 fn，删除整个事件所有回调', () => {
    let count1 = 0;
    let count2 = 0;

    bus.on('offAll', () => count1++);
    bus.on('offAll', () => count2++);

    // 删除整个事件
    bus.off('offAll');
    bus.emit('offAll');

    expect(count1).toBe(0);
    expect(count2).toBe(0);
  });
});