import { h } from "../../lib/guide-mini-vue.esm.js"


// 实现 Emit 功能
export const Foo = {


  // 1. 实现Emit
  // setup 接收的第二个参数 {}， 导出 Emit 
  // 这里注意： 第二个参数是一个对象 ， 而对象里面有一个emit
  // 实现： 
  // - 在调用 setup() 时候传入第二个参数， 是一个对象， 对象中有一个emit 方法
  // - 这个emit是一个函数，需要在组件实例中进行初始化 -> emit: instance.emit  -> 初始化emit: () => {} 
  // - 定义 emit 方法，将他挂载到 component.emit 上面
  // 关系: Foo组件 emit('事件名') ->  instance.emit这里只是函数名 -> component.emit 初始化的 emit  = 创建的 emit("事件名") 函数  

  // - 接下来的逻辑在 componetntEmit.ts 中
  setup(props, { emit }) {

    const emitAdd = () => {
      console.log('emit add —— 在setup() 中被调用')




      // 2. 当调用 emit 时，传入一个事件名，
      //  - 在找事件时候，需要找当前组件 props 中有没有这个事件函数
      //  - 实现： 匹配 on + 事件名 -> 需要首事件字母大写

      // 当执行 emitAdd 时，会触发 App 组件的 emit 事件
      // emit('add')

      // 实现emit 传参功能, 
      // 1, 2  能够在 App 组件中获取到传入的参数
      // 实现逻辑
      // - 在实现emit逻辑中，使用解构 ...args 获取传入的参数, 然后调用 handler(...args) 是传入接收的参数就行
      // emit('add', 1, 2)



      // 实现事件的命名方式 on-add
      // 实现逻辑-> add-foo 在实现emit 时候转为 AddFoo 命名
      // 只需要把 - 去掉， 首字符变为大写
      emit('add-foo', 1, 2)



    }
    // 返回 emitAdd 函数
    return {
      emitAdd
    }
  },



  render() {

    // 声明一个点击事件
    const btn = h('button', {
      // 声明click 为 this.emitAdd
      onClick: this.emitAdd
    }, 'emitAdd')


    // 定义声明 Foo 组件
    const foo = h('p', {}, 'Foo组件')

    // 返回Element逻辑
    return h('div', {}, [foo, btn])
  }
}
