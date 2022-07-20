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
        const { setupState } = instance;
        // 判断 setupState 中是否有 key 属性
        if (key in setupState) {
            // 有属性，就 setupState 返回属性值
            return setupState[key];
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

export { createApp, h };
