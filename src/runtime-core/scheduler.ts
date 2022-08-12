

// 定义一个队列， 用于存储 job 
const queue: any[] = [];


// 添加一个布尔值 , 用来判单执行 一次 Promise
let isFlushPending = false;

// 重构 
const p = Promise.resolve();

// 实现nextTick
export function nextTick(fn) {
  /**
   * 接收 fn
   * 实现逻辑 将 nextTick() 添加到微任务里,  并且让 Promise 执行 fn()
   * 执行一个微任务，返回一个 Promise，让 Promise 执行 fn()
   * 
   * 主要是：把更新的逻辑放到异步，也就是微任务，提供nextTick() 让用户方便调用，能够拿到最新的状态
   */

  return fn ? p.then(fn) : p
}


// 收集 job 的方法 
export function queueJobs(job) {

  // 1. 判断 job 时候存在队列中 
  if (!queue.includes(job)) {
    // 如果队列中没有 job,  把job添加到 queue 里面
    queue.push(job)
  }
  // 封装为 queueFlush 方法
  queueFlush();
}

// 之后在微任务时候， 执行 job 
function queueFlush() {

  // 判断 isFlushPending 
  // 如果为真， 则返回 
  if (isFlushPending) return;

  // 设置 isFlushPending = true 
  isFlushPending = true;  // 让 Promise 只执行一次

  // // 微任务使用 Promise 异步调用实现
  // Promise.resolve().then(() => {

  //   // 在执行微任务时，在把isFlushPending 设置为 false -> 打开开关
  //   isFlushPending = false;  // 之后会再执行 Promise

  //   // 从队列中， 取出 job
  //   let job

  //   // 取出 头部的 job 
  //   while ((job = queue.shift())) {
  //     // 执行 job 
  //     job && job();
  //   }
  // });

  // 代码重构 
  nextTick(flushJobs)
}


// 封装执行 job 的逻辑
function flushJobs() {
  isFlushPending = false;  // 之后会再执行 Promise
  // 从队列中， 取出 job
  let job

  // 取出 头部的 job 
  while ((job = queue.shift())) {
    // 执行 job 
    job && job();
  }
}
