import { h, ref, getCurrentInstance, nextTick } from "../../lib/guide-mini-vue.esm.js"

export const App = {
  name: "App",

  setup() {
    const count = ref(1)
    const instance = getCurrentInstance()
    function onClick() {
      for (let i = 0; i < 100; i++) {
        console.log('update')
        count.value = i
      }

      // 获取当前组件实例 
      console.log(instance)
      // 因为当执行 打印instance， 此时 count 已经为 99 了， 但是 instance 中页面上的 count 又是 1 , 这时进行同步的代码 

      // 所以使用 nextTick 来解决, 来执行微任务，异步执行
      // nextTick() 获取更新之后 页面视图的数据 
      nextTick(() => {
        // 此时 instance 就能获取到 count 的为99 的值， 页面也发生变化了
        console.log(instance)
      })



      // 这样的方式也能获取到更新之后的视图
      // await nextTick()
      // console.log(instance)

    }

    return {
      count,
      onClick
    }
  },
  render() {
    const button = h('button', { onClick: this.onClick }, "update")
    const p = h('p', {}, "count : " + this.count)

    return h('div', {}, [button, p])
  },

}

// 出现情况： for 循环中，每次循环都会触发一次更新，这样会导致性能问题。
// 因为视图更新只需要执行一次就行，不需要执行 100 次

// 实现: 也就是当 for 循环完成后， 再去更新视图 
/**
 * 在执行for循环， 是一个同步的逻辑
 * 实现： 当同步代码之后完成后， 在微任务去进行异步代码的视图更新
 * 
 * 利用微任务： 
 * 1. 创建一个队列 , 把视图更新的逻辑添加到队列中  job 
 * 2. 在同步时候收集 job ,  当同步代码执行完后，微任务去出队列中的 job , 然后执行 
 *    - job 如果已经在当前队列中，就不需要添加到队列中
 * 3. 这样就达到了  job ， 在执行同步代码后，只会执行一次 
 */


/**
 * 代码实现 
 *  render.ts 中
 *  要把更新视图的逻辑添加到队列中， 所以更新逻辑不能立即执行 
 * 
 * 代码实现：
 * 1. 在effect 中， 具有第二个参数 schedule 方法, 利用它执行 fn 的时机,
 *    - 当初始化调用一次fn， 在响应式变化时，就会调用 schedule 方法
 * 2. 在 scheduler 中， 进行 job 的收集 , job 就是 effect返回的 instance.update 方法, 组件发生变化的逻辑 
 * 3. 创建 scheduler.ts , 导出 queueJobs() 方法, 接收 job 参数
 * 4. queueJobs() 中，判断 job 是否在队列中，如果队列中没有 job,  把job添加到 queue 里面
 * 5. 之后在微任务时候， 执行 job 
 */
