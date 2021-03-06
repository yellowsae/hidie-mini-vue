'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const extend = Object.assign;
function isObject(obj) {
    return obj !== null && typeof obj === 'object';
}
// 判断一个对象中是否具有 key 属性
const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key);
// 实现 add-foo  变为 AddFoo
const camelize = (str) => {
    // 返回一个正则替换
    return str.replace(/-(\w)/g, (_, c) => {
        return c ? c.toUpperCase() : "";
    });
};
// 将 event 的 add 变为 Add  -> 首字符大写
const capitalize = (str) => {
    // 将首字符获取到，并转换为大写，然后拼接后面的字符串
    return str.charAt(0).toUpperCase() + str.slice(1);
};
// 处理 on + 事件 的行为
const toHandlerKey = (str) => {
    // 如果 str 有值，执行首字符大写，没有返回空字符串
    return str ? "on" + capitalize(str) : "";
};
// const handler = props['onAdd']
// 使用 capitalize(event) 首字符大写行为
// const handler = props['on' + capitalize(event)]
// 实现 handerName
// 在这里使用 - 转为 驼峰命名 的函数 camelize()
// const handlerName = toHandlerKey(camelize(event))
// const handler = props[handlerName]
// // 判断 handler 有没有， 有就调用
// // 将 args 传入 handler 函数中，然后在APP组件上 emit(a,b)接收参数
// handler && handler(...args)

// 声明一个对象，根据key，判断是否有属性，返回 instance 上的值
const publicPropertiesMap = {
    $el: (instance) => instance.vnode.el
};
// 这里的 instance ， 可以通过 ctx 进行传值 
// { _: instance } -> 传值的方式
const PublicInstanceProxyHandlers = {
    get({ _: instance }, key) {
        // target 就是ctx ， key 就是 ctx 需要获取的 key 
        // 例如： 在App组件中访问this.msg,   key 就是 msg
        // 1. 实现从setupState 拿到值
        // 解构 setupState 
        // const { setupState } = instance
        // // 判断 setupState 中是否有 key 属性
        // if (key in setupState) {
        //   // 有属性，就 setupState 返回属性值
        //   return setupState[key]
        // }
        // 拿到 props 
        const { setupState, props } = instance;
        // 重构一下 
        // 使用 hasOwn() 方法，判断  object 是否具有 key 属性
        if (hasOwn(setupState, key)) {
            // 如果有，直接返回 key 对应的值
            return setupState[key];
        }
        else if (hasOwn(props, key)) {
            return props[key];
        }
        // 2. 添加判断 实现访问 $el 的逻辑
        // if (key === '$el') {
        //   // 如果是 $el ， 就返回真实的 DOM 元素
        //   // 这里instance 组件实例 上已经挂载了 vnode , 通过vnode访问 el 
        //   // 因为这里的 vnode 类型是 Object , 而不是 string ，说明这个 vnode 是组件的虚拟节点，不是element的。
        //   // 所以，通过 vnode 获取 el 元素，返回 null 
        //   // 解决： 就是当 再次调用patch()后，将 调用 render() 返回的 subTree.el 赋值给 vnode.el
        //   return instance.vnode.el
        // }
        // 因为后续可能不只有 $el，还会添加其他， 直接使用 key === $el 不太合适
        // 实现重构, 重构方式 -> publicPropertiesMap[key]
        const publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    }
};

// initProps 的逻辑 
// 两个参数 -> instance 组件的实例 , rawProps -> 没有经过初始化的 props 
function initProps(instance, rawProps) {
    // 逻辑： 只需要把 props 挂载到 instance 上， 
    // 然后在调用 setup() 时候传输 props 给到就行了
    // 需要props 在创建 instance 时 初始化 init 
    // 如果 rawProps 为空 ，则设置为 {}
    instance.props = rawProps || {};
    //  后续处理 attrs
}

// TODO: 收集依赖
// 使用 targetMap -> Map() 声明一个容器
const targetMap = new Map();
// TODO: 触发依赖  执行依赖 run() 方法
function trigger(target, key) {
    // 基于 target 和 key 取出 dep , 
    // 然后循环 dep, 取出实例对象，然后执行 run() 方法 
    // 1. 先取出 depsMap
    let depsMap = targetMap.get(target);
    // 2. 再取出 dep
    let dep = depsMap.get(key);
    // 3. 遍历 dep, 执行 触发依赖 run() 方法
    triggerEffects(dep); // 抽离出触发依赖的方法
}
// 收集 执行依赖的逻辑抽离，同样方便 ref 使用
function triggerEffects(dep) {
    for (const effect of dep) { // 循环  dep 中的 ReactiveEffect
        // 这里判断 是否有 scheduler 参数
        if (effect.scheduler) {
            // 如果有 执行 scheduler 方法
            effect.scheduler();
        }
        else {
            // 如果没有就普通的 修改数据， 执行run() 方法
            // 执行 它的 run 方法
            effect.run();
        }
    }
}

// 将 reactive 的代码抽离出来
// 一上来初始化时候，就创建 getter 和 setter,  达到缓存的目的
const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
// 把第二个参数传给他
const shallowReadonlyGet = createGetter(true, true);
const shallowReactiveGet = createGetter(false, true);
// 重构 get 函数 
function createGetter(isReadonly = false, shallowReadonly = false) {
    return function get(target, key) {
        // 这里判断是否是响应式对象 还是  readonly 对象
        if (key === "__v_isReactive" /* ReactiveFlags.IS_REACTIVE */) {
            // 判断是否响应式对象
            return !isReadonly;
        }
        else if (key === "__v_isReadonly" /* ReactiveFlags.IS_READONLY */) {
            // 判断是否 是 readonly
            return isReadonly;
        }
        // 返回出去的值
        let Res = Reflect.get(target, key);
        // 实现 shallowReadonly 功能
        // 1. 它不需要执行 嵌套功能
        // 2. 它不需要执行 trick 收集依赖 功能
        // 也就是直接返回  Res
        if (shallowReadonly) {
            return Res;
        }
        // 可以进行一个判断,实现 reactive 嵌套功能
        // 1. 判断 Res 是否是一个 Object 
        if (isObject(Res)) {
            // 如果是 object  执行 reactive 函数 , 达到嵌套的效果
            // 返回 reactive(Res) 的结果, 也就是 嵌套的响应式对象 添加了 getter 和 setter 的结果
            // 判断isReadonly 是否是 readonly 还是  reactive, 然后执行它们之间的嵌套
            return isReadonly ? readonly(Res) : reactive(Res);
        }
        return Res;
    };
}
// 重构 setter() 
function createSetter() {
    return function set(target, key, value) {
        let Res = Reflect.set(target, key, value);
        trigger(target, key);
        return Res;
    };
}
const mutableHandlers = {
    // get: createGetter(),
    // set: createSetter()
    // 重构
    get,
    set
};
const readonlyHandlers = {
    // 重构后
    get: readonlyGet,
    set(target, key, value) {
        console.warn(`key: ${key} set 失败, 因为 target 是 readonly`, target);
        return true;
    },
};
extend({}, mutableHandlers, {
    get: shallowReactiveGet,
});
// extend 合并对象
// shallowReadonlyHandlers() 的 getter 和 setter
const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
    get: shallowReadonlyGet,
    // shallowReadonlyHandlers 和 readonlyHandlers 的 setter 函数是一样的, 使用 合并对象, 达到代码复用
});

// 导出 reactive() 函数
// 接收的响应式对象参数 raw
function reactive(raw) {
    // // 返回一个 Proxy 代理对象，代理 raw 属性
    // return new Proxy(raw, {
    //   // // 当读取对象属性触发 get() 操作
    //   // get(target, key) {
    //   //   // 使用 Reflect() 反射 读取的值
    //   //   let Res = Reflect.get(target, key)
    //   //   // TODO: 收集依赖, 重点是执行收集的依赖
    //   //   track(target, key)
    //   //   return Res  // 把读取的属性值返回出去
    //   // },
    //   // // 当数据变化时触发 set() 操作
    //   // set(target, key, value) {
    //   //   // 修改变化的数据
    //   //   let Res = Reflect.set(target, key, value)
    //   //   // TODO: 触发依赖  这个核心
    //   //   trigger(target, key)
    //   //   return Res
    //   // },
    //   // 重构后 
    //   get: createGetter(),
    //   set: createSetter()
    // })
    // return new Proxy(raw, mutableHandlers)
    return createActiveObject(raw, mutableHandlers);
}
function readonly(raw) {
    // return new Proxy(raw, {
    //   // get (target, key) {
    //   //   let Res = Reflect.get(target, key)
    //   //   // 并不会执行依赖收集
    //   //   // track(target, key)
    //   //   return Res
    //   // },
    //   set (target, key, value) {
    //     return true
    //   },
    //   // 重构后
    //   get: createGetter(true)
    // })
    //  抽离到 baseHandlers.ts
    return createActiveObject(raw, readonlyHandlers);
}
function shallowReadonly(raw) {
    return createActiveObject(raw, shallowReadonlyHandlers);
}
// 把 new Proxy 抽离封装 为一个函数
function createActiveObject(target, baseHandlers) {
    // 如果 raw 不是一个对象
    if (!isObject(target)) {
        console.warn(`target ${target} 必须是一个对象`);
        return target;
    }
    return new Proxy(target, baseHandlers);
}
/**
 * 因为 readonly 和  reactive 的很类似， 可以进行相应的代码重构
 * - TDD
 *   - 先写一个测试
 *   - 写逻辑代码，让测试通过
 *   - 对代码进行重构
 *
 *
 * 重构就是把 具有相同|类似的代码内容，抽象成一个函数，让执行这个函数就行, 达到代码的优化，可读性更高
 */

// 实现 Emit
// 导出 emit 函数
// 接收 Foo组件 中 emit('事件名') -> 中事件名 参数 
function emit(instance, event, ...args) {
    // 检测 emit 的传参
    console.log('emit', event, '在 emit实现逻辑中调用');
    // 实现 emit 逻辑
    // 1. 找到 instance.props  中有没有这个 event 对应的 函数名和回调函数
    //   -> 实现: 传入 instance 拿到 props 
    //   -> 因为在Foo组件的emit 只会传入一个事件名的参数， 不是两个参数
    //   -> 可以在componet.emit 调用 emit()时候 使用 bind() -> emit.bind(null, component), 代表传入第一个函数是this, 第二个参数是 emit接收的第一个参数instance 这是一个代码技巧
    // 2. 取到 props, 根据key 拿到对应的事件函数
    // TPP 开发技巧 ：先去写一个特定的行为，再去重构为通过的行为
    const { props } = instance;
    // 判断传入过来的参数是不是一个 add
    // // 实现 add-foo  变为 AddFoo
    // const camelize = (str: string) => {
    //   // 返回一个正则替换
    //   return str.replace(/-(\w)/g, (_, c: string) => {
    //     return c ? c.toUpperCase() : ""
    //   })
    // }
    // // 将 event 的 add 变为 Add  -> 首字符大写
    // const capitalize = (str: string) => {
    //   // 将首字符获取到，并转换为大写，然后拼接后面的字符串
    //   return str.charAt(0).toUpperCase() + str.slice(1);
    // }
    // // 处理 on + 事件 的行为
    // const toHandlerKey = (str: string) => {
    //   // 如果 str 有值，执行首字符大写，没有返回空字符串
    //   return str ? "on" + capitalize(str) : ""
    // }
    // // const handler = props['onAdd']
    // // 使用 capitalize(event) 首字符大写行为 
    // // const handler = props['on' + capitalize(event)]
    // 使用重构 
    // 实现 handerName 
    // 在这里使用 - 转为 驼峰命名 的函数 camelize()
    const handlerName = toHandlerKey(camelize(event));
    // 根据props中的key, 找到对应的回调函数, 然后执行
    const handler = props[handlerName];
    // 判断 handler 有没有， 有就调用
    // 将 args 传入 handler 函数中，然后在APP组件上 emit(a,b)接收参数 
    handler && handler(...args);
}

// 创建一个组件的实例对象 -> instance
function createComponentInstance(vnode) {
    // 通过 vnode 创建一个组件的实例对象 component
    // 返回一个component对象
    const component = {
        vnode,
        // 为了简化操作——> 获取 type 
        type: vnode.type,
        // 初始时，声明setupState， 在后续 Proxy 中使用
        setupState: {},
        // 初始化props
        props: {},
        // 初始化 emit -> 是一个函数
        emit: () => { }
    };
    // 声明 emit 方法， 挂载到 component.emit 上
    // 抽离 emit() 方法 -> componentEmit.ts
    component.emit = emit.bind(null, component);
    // 返回 component  组件实例对象
    return component;
}
// 通过 vnode 创建一个组件的实例对象 ->  instance 
// instance 就是 虚拟节点
// 对组件初始化的逻辑函数
function setupComponent(instance) {
    // 解析处理组件的其他内置属性 比如： props , slots 这些 
    // 和 组件中setup() 的返回值
    // TODO:
    // 1. 先初始化 props 
    // 初始化 initProps 给定两个参数， instance, 和 props 
    initProps(instance, instance.vnode.props);
    // 2. 初始化 slots
    // initSlots()
    // 3. 初始化component, 也就是 调用 setup() 之后的返回值
    setupStatefulComponent(instance); // 翻译： setupStatefulComponent -> 初始化有状态的 component
}
// 实现 setup 函数调用
function setupStatefulComponent(instance) {
    // 拿到 setup() 的返回值 
    // 1. 获取到虚拟节点的type ， 也就是用户定义的 App 组件 
    const Component = instance.type;
    // 创建组件代理对象 Proxy, 并添加到 instance组件实例上
    // Proxy的第一个参数 {}  -> ctx 上下文
    // instance.proxy = new Proxy({}, {
    //   get(target, key) {
    //     // target 就是ctx ， key 就是 ctx 需要获取的 key 
    //     // 例如： 在App组件中访问this.msg,   key 就是 msg
    //     // 1. 实现从setupState 拿到值
    //     // 解构 setupState 
    //     const { setupState } = instance
    //     // 判断 setupState 中是否有 key 属性
    //     if (key in setupState) {
    //       // 有属性，就 setupState 返回属性值
    //       return setupState[key]
    //     }
    //     // 2. 添加判断 实现访问 $el 的逻辑
    //     if (key === '$el') {
    //       // 如果是 $el ， 就返回真实的 DOM 元素
    //       // 这里instance 组件实例 上已经挂载了 vnode , 通过vnode访问 el 
    //       // 因为这里的 vnode 类型是 Object , 而不是 string ，说明这个 vnode 是组件的虚拟节点，不是element的。
    //       // 所以，通过 vnode 获取 el 元素，返回 null 
    //       // 解决： 就是当 再次调用patch()后，将 调用 render() 返回的 subTree.el 赋值给 vnode.el
    //       return instance.vnode.el
    //     }
    //   }
    // })
    // 实现重构
    // { _: instance } -> ctx传值 ，传 instance
    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
    // 2. 解构出 setup 
    const { setup } = Component;
    // 判断 setup 是否存在
    if (setup) {
        // 调用 setup() 拿到返回值
        // 把 props 传入 setup() 
        // 因为 props是一个只读的 -> 在setup调用的时候，设置为shallowReadonly(props)
        // 实现emit -> 第二个参数{} -> 对象中有 emit 
        // 将 emit 默认赋值给 instance.emit
        const stupResult = setup(shallowReadonly(instance.proxy), { emit: instance.emit });
        // 判断 stupResult 的类型
        handleStupResult(instance, stupResult);
    }
}
// 根据 setup 函数的返回值 stupResult 的类型
function handleStupResult(instance, stupResult) {
    // 因为 setup 可以返回出 Function | Object 
    // 如果是 Function 类型，那么就是组件的 render 函数
    // 如果是 Object 类型，将这个对象 注入到这个组件的上下文中
    // TODO: 这里先实现 Object， 之后再去实现 Function
    if (typeof stupResult === 'object') {
        // 将这个值注入到 instance 实例上
        instance.setupState = stupResult;
    }
    // 需要保证 组件必须要用 render 函数
    finishComponentSetup(instance);
}
// 进行挂载 render 函数
function finishComponentSetup(instance) {
    const Component = instance.type;
    // 判断组件中是否具有 render() 
    // 组件中具有 render(), 将 render 挂载到 instance 上
    instance.render = Component.render;
}

// 在mount()方法定义的runner()函数，接收创建的虚拟节点vnode和根容器，交给patch()函数进行渲染
function runner(vnode, container) {
    // runner(虚拟节点, 根容器)
    //runner 的作用 -> 主要调用 patch() 方法
    patch(vnode, container);
    // 使用 patch() 函数 为了方便递归
}
// 目的为了根据判断 虚拟节点，都组件或者是 Element 进行一个渲染
// patch(虚拟节点, 容器)
function patch(vnode, container) {
    // 实现 shapeFlag - vue 
    // shapeFlag 的作用是， 描述当前节点的类型，是一个 Element 还是一个组件 | children 是一个字符串 还是一个数组
    // 1. 判断 vnode 的类型 -> 可能是 组件类型 或者 Element 类型
    // console.log(vnode.type)  可以看到  vnode.type 要么是 组件类型 -> Object , 要么是 Element 类型 ->  string
    // 使用 ShapeFlags -> 进行判断 类型
    const { shapeFlag } = vnode;
    // 这里判断 vnode.type 类型 -> ELEMENT
    if (shapeFlag & 1 /* ShapeFlags.ELEMENT */) {
        // if (typeof vnode.type === "string") {
        // 如果 vnode.type 是 string 类型, 表示它是 Element 
        processElement(vnode, container);
        // 这里判断是否组件类型  -> STATEFUL_COMPONENT
    }
    else if (shapeFlag & 2 /* ShapeFlags.STATEFUL_COMPONENT */) {
        // } else if (isObject(vnode.type)) {  、// 之前的判断
        // 如果 vnode.type 是 object 类型 , 表示它是 组件类型
        processComponent(vnode, container);
    }
    // 如果是 组件类型
    // 去处理组件 
    // 实现初始化组件的逻辑 
    // 实现组件初始化的总体函数 processComponent 的函数
    // processComponent(vnode, container)
    // 如果是 Element 类型
    // 处理Element ，将其旋渲染出来
    // TODO: 判断vnode 是不是一个 element -> 那么就应该处理 element
    // 思考题： 如何判断vnode 是一个 element
    // processElement(vnode, container)
}
// 当 vnode 是一个 Element 类型执行这个函数
function processElement(vnode, container) {
    // 进行一个 Element 的渲染 
    // 1. Element 分为两种情况 -> init 初始化 ->  update 更新
    // 实现初始化Element的逻辑
    mountElement(vnode, container);
}
// 初始化 Element
function mountElement(vnode, container) {
    // 1. 创建一个真实的 Element -> vnode.type
    const el = (vnode.el = document.createElement(vnode.type)); // 使用 el 保存根节点 -> 给el赋值
    // 2. props , 解析属性 -> vnode
    const { props } = vnode;
    if (props) { // 当props 不为空时
        for (const key in props) {
            const val = props[key];
            // console.log(key)
            // 进行重构
            // 处理注册事件功能
            // 具体的 针对于 click -> 通用  （小步骤的开发思想）
            // 实现通用的，可以根据 组件的命名规范，来实现， 
            // 因为 on + 事件名称 ：  click -> onClick , onMouseDown -> MouseDown
            // 可以使用正则方式，匹配 on 之后的事件名，来注册不同事件
            // 封装 通过注册方法 isOn
            const isOn = (key) => /^on[A-Z]/.test(key);
            if (isOn(key)) {
                // if (key === 'onClick') {
                // 添加 注册点击事件 
                // val 就是 onClick 的会调函数
                // el.addEventListener('click', val)
                // 获取事件名称
                const event = key.slice(2).toLowerCase();
                el.addEventListener(event, val);
            }
            else {
                // 如果不是 on 之后的事件名称
                // 设置 el 的属性值
                el.setAttribute(key, val);
            }
        }
    }
    // 3. children,  解析然后赋值 
    // children 有两种情况， 是一个数组， 或者是一个字符串
    const { children, shapeFlag } = vnode;
    // 这里也是用 shapeFlag 判断 children 的类型 -> 可能是数组，可能是字符串
    // 如果是一个字符串 -> TEXT_CHILDREN
    if (shapeFlag & 4 /* ShapeFlags.TEXT_CHILDREN */) {
        // if (typeof children === 'string') {
        // 直接设置 el 的文本内容
        el.textContent = children;
        // 如果是一个数组 -> ARRAY_CHILDREN
    }
    else if (shapeFlag & 8 /* ShapeFlags.ARRAY_CHILDREN */) {
        // } else if (Array.isArray(children)) {
        // 表示 [h(), h()]
        // 使用 mountChildren 重构 children - Array 的渲染
        mountChildren(vnode, el);
    }
    // 4. 挂载 el 到 容器 container 上
    container.appendChild(el);
}
// 封装 渲染 children 的函数
function mountChildren(vnode, container) {
    // 循环 children 内的虚拟节点, 然后调用 patch()进行递归->再去渲染
    vnode.children.forEach((v) => {
        // 这里 container 容器设置为 el 
        patch(v, container);
    });
}
// 实现组件初始化的总体函数
function processComponent(vnode, container) {
    // 1. 挂载组件
    // 使用 mountComponent 函数 挂载组件
    mountComponent(vnode, container);
}
// 挂载组件mountComponent, 初始化组件实例
function mountComponent(initialVNode, container) {
    // 1. 通过 vnode 创建一个组件的实例对象 ->  instance 
    const instance = createComponentInstance(initialVNode);
    // 2. setupComponent() 初始化
    // 2.1 解析处理组件的其他内置属性 比如： props , slots 这些 
    // 2.2 组件中setup() 的返回值 和 挂载 render() 返回
    setupComponent(instance);
    // 3. 开始调用 组件的 runner 函数
    setupRenderEffect(instance, initialVNode, container);
}
function setupRenderEffect(instance, initialVNode, container) {
    // 当调用 render时候，应该拿到 组件的代理对象
    const { proxy } = instance;
    // 拿到 proxy 后, 在调用 render时候，进行绑定
    // 调用 render() 函数
    // subTree 是 h() 函数返回的 vnode, 也是虚拟节点树 subTree 
    const subTree = instance.render.call(proxy); // 绑定 proxy
    // 再基于返回过来的虚拟节点 vnode, 再进一步的调用 patch() 函数
    // vnode -> subTree 是一个 Element类型 ->  挂载 mountElement
    // 递归调用 -> patch(虚拟节点，容器)
    patch(subTree, container);
    // patch()再去判断，-> subTree 的类型 -> 可能是 组件类型 或者 Element类型 -> 一直递归进行下去
    // 实现 $el 的关键时机， 在这个时候赋值 el
    // 当patch() 再次调用，可能是 进行Element流程
    // 将 subTree.el 赋值给 vnode.el
    initialVNode.el = subTree.el;
}

// 导出创建虚拟节点的方法
function createVNode(type, props, children) {
    // 参数：
    // type -> 组件类型
    // props -> 可选 -> 属性
    // children -> 可选 -> 子节点
    const vnode = {
        type,
        props,
        children,
        // 初始化 el
        el: null,
        // 1. 初始化 ShapeFlags
        shapeFlag: getShapeFlag(type)
    };
    // debugger
    // 2. 处理 children
    if (typeof children === 'string') {
        // 如果 children 是 string , 给 vnode.ShapeFlag  进行赋值 
        // vnode.ShapeFlag | ShapeFlags.text_children 进行一个 或 | 运算 
        // vnode.ShapeFlag = vnode.ShapeFlag | ShapeFlags.text_children
        // 简化
        vnode.shapeFlag |= 4 /* ShapeFlags.TEXT_CHILDREN */;
    }
    else if (Array.isArray(children)) {
        // 如果 children 是数组，赋值 ShapeFlag 为 数组 
        vnode.shapeFlag |= 8 /* ShapeFlags.ARRAY_CHILDREN */;
    }
    // 返回创建组件的虚拟节点
    return vnode;
}
// 这里判断类型
function getShapeFlag(type) {
    // 返回设置类型
    return typeof type === 'string' ? 1 /* ShapeFlags.ELEMENT */ : 2 /* ShapeFlags.STATEFUL_COMPONENT */;
}

// createApp 逻辑 
function createApp(rootComponent) {
    // 返回一个对象
    return {
        // 对象内部必须有一个 rootContainer , 根容器 -> id=app 的容器
        // 目的是为了将 runner 函数渲染后给他 添加到 <div id='app'></div> 里面
        mount(rootContainer) {
            // 1. 先将 rootComponent 根容器(App) 转为一个 虚拟节点 vnode
            // 将 组件转为虚拟节点
            // 2. 将所有的逻辑操作 都会基于 vnode 做处理
            const vnode = createVNode(rootComponent);
            // vnode -> 返回出来的虚拟节点 vnode
            // createVNode（组件） ->  基于组件创建虚拟节点
            // 得到虚拟节点后 -> 可以调用 runner() 函数
            runner(vnode, rootContainer);
            // runner(虚拟节点, 根容器)
        }
    };
}

// h 函数 -> 创建节点 ， 虚拟DOM  vnode
function h(type, props, children) {
    // 这里使用 createVNode 创建
    return createVNode(type, props, children);
}

exports.createApp = createApp;
exports.h = h;
