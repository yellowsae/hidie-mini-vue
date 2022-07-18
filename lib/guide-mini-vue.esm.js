// 创建一个组件的实例对象 -> instance
function createComponentInstance(vnode) {
    // 通过 vnode 创建一个组件的实例对象 component
    // 返回一个component对象
    const component = {
        vnode,
        // 为了简化操作——> 获取 type 
        type: vnode.type
    };
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
    // initProps()
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
    // 2. 结构出 setup 
    const { setup } = Component;
    // 判断 setup 是否存在
    if (setup) {
        // 调用 setup() 拿到返回值
        const stupResult = setup();
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
    // 需要保证 组件必须要用 runner 函数
    finishComponentSetup(instance);
}
// 进行挂载 render 函数
function finishComponentSetup(instance) {
    const Component = instance.type;
    // 判断组件中是否具有 runner() 
    // 组件中具有 runner(), 将 runner 挂载到 instance 上
    instance.render = Component.render;
}

// 在mount()方法定义的runner()函数，接收创建的虚拟节点vnode和根容器，交给patch()函数进行渲染
function runner(vnode, container) {
    // runner(虚拟节点, 根容器)
    //runner 的作用 -> 主要调用 patch() 方法
    patch(vnode);
    // 使用 patch() 函数 为了方便递归
}
// 目的为了根据判断 虚拟节点，都组件或者是 Element 进行一个渲染
// patch(虚拟节点, 容器)
function patch(vnode, container) {
    // 1. 判断 vnode 的类型 -> 可能是 组件类型 或者 Element 类型
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
    // 模拟判断 
    // 因为 vnode 要么是 组件类型 -> Object , 要么是 Element 类型 ->  string
    if (typeof vnode.type === 'object') {
        processComponent(vnode);
    }
    else if (typeof vnode.type === 'string') {
        processElement(vnode);
    }
}
// 实现组件初始化的总体函数
function processComponent(vnode, container) {
    // 1. 挂载组件
    // 使用 mountComponent 函数 挂载组件
    mountComponent(vnode);
    console.log(vnode);
}
// 当 vnode 是一个 Element 类型执行这个函数
function processElement(vnode, container) {
    console.log(vnode);
}
// 挂载组件mountComponent, 初始化组件实例
function mountComponent(vnode, container) {
    // 1. 通过 vnode 创建一个组件的实例对象 ->  instance 
    const instance = createComponentInstance(vnode);
    // 2. setupComponent() 初始化
    // 2.1 解析处理组件的其他内置属性 比如： props , slots 这些 
    // 2.2 组件中setup() 的返回值 和 挂载 runder() 返回
    setupComponent(instance);
    // 3. 开始调用 组件的 runner 函数
    setupRenderEffect(instance);
}
function setupRenderEffect(instance, container) {
    // 调用 runder() 函数
    // subTree 是 h() 函数返回的 vnode, 也是虚拟节点树 subTree 
    const subTree = instance.render();
    // 再基于返回过来的虚拟节点 vnode, 再进一步的调用 patch() 函数
    // vnode -> subTree 是一个 Element类型 ->  挂载 mountElement
    // 递归调用 -> patch(虚拟节点，容器)
    patch(subTree);
    // patch()再去判断，-> subTree 的类型 -> 可能是 组件类型 或者 Element类型 -> 一直递归进行下去
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
    };
    // 返回创建组件的虚拟节点
    return vnode;
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
            runner(vnode);
            // runner(虚拟节点, 根容器)
        }
    };
}

// h 函数 -> 创建节点 ， 虚拟DOM  vnode
function h(type, props, children) {
    // 这里使用 createVNode 创建
    return createVNode(type, props, children);
}

export { createApp, h };
