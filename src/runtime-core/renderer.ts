import { effect } from "../reactivity/effect"
import { EMPTY_OBJ, isObject } from "../shared/index"
import { ShapeFlags } from "../shared/ShapeFlags"
import { createComponentInstance, setupComponent } from "./component"
import { createAppApi } from "./createApp"
import { Fragment, Text } from "./vnode"


// 实现createRenderer 函数 
// 包裹 render -> 
export function createRenderer(options) { // 接收 options 参数

  // 这个options 参数就是传入过来的 稳定接口
  // 解构出来渲染函数
  // const { createElement, patchProp, insert } = options

  // 这里设置别名不生效
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert,
    remove: hostRemove,
    setElementText: hostSetElementText
  } = options
  // const { hostCreateElement: createElement, hostPatchProp: patchProp, hostInsert: insert } = options


  // 在mount()方法定义的render()函数，接收创建的虚拟节点vnode和根容器，交给patch()函数进行渲染
  function render(vnode, container) {  // 取消导出
    // export function render(vnode, container) {
    // render(虚拟节点, 根容器)

    //render 的作用 -> 主要调用 patch() 方法

    // 初始化逻辑 n1 -> null
    // 把锚点赋值为 null， 因为初始时候
    patch(null, vnode, container, null, null)
    // 使用 patch() 函数 为了方便递归
  }


  // 目的为了根据判断 虚拟节点，都组件或者是 Element 进行一个渲染
  // patch(虚拟节点, 容器)

  // patch() 接收新的参数
  // n1 是旧的虚拟节点
  // n2 是新的虚拟节点
  // 如果 n1 不存在 --- 初始化 ,  n1 存在那就是 更新逻辑
  function patch(n1, n2, container, parentComponent, anchor) {
    // 实现 shapeFlag - vue 
    // shapeFlag 的作用是， 描述当前节点的类型，是一个 Element 还是一个组件 | children 是一个字符串 还是一个数组


    // 1. 判断 vnode 的类型 -> 可能是 组件类型 或者 Element 类型

    // console.log(vnode.type)  可以看到  vnode.type 要么是 组件类型 -> Object , 要么是 Element 类型 ->  string

    const { type, shapeFlag } = n2  // type 组件的类型 
    switch (type) {

      // 如果是 Fragment 包裹的标签
      case Fragment:
        // 就调用 processFragment 函数
        processFragment(n1, n2, container, parentComponent, anchor)
        break

      // 如果是 Text 的逻辑
      case Text:
        // 如果是 Text 节点
        processText(n1, n2, container)
        break

      // 如果不是，则走 默认的逻辑
      default:
        // 使用 ShapeFlags -> 进行判断 类型
        // 这里判断 vnode.type 类型 -> ELEMENT
        if (shapeFlag & ShapeFlags.ELEMENT) {
          // if (typeof vnode.type === "string") {
          // 如果 vnode.type 是 string 类型, 表示它是 Element 
          processElement(n1, n2, container, parentComponent, anchor)

          // 这里判断是否组件类型  -> STATEFUL_COMPONENT
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          // } else if (isObject(vnode.type)) {  、// 之前的判断
          // 如果 vnode.type 是 object 类型 , 表示它是 组件类型
          processComponent(n1, n2, container, parentComponent, anchor)
        }
        break
    }

    // // 使用 ShapeFlags -> 进行判断 类型
    // const { shapeFlag } = vnode
    // // 这里判断 vnode.type 类型 -> ELEMENT
    // if (shapeFlag & ShapeFlags.ELEMENT) {
    //   // if (typeof vnode.type === "string") {
    //   // 如果 vnode.type 是 string 类型, 表示它是 Element 
    //   processElement(vnode, container)

    //   // 这里判断是否组件类型  -> STATEFUL_COMPONENT
    // } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    //   // } else if (isObject(vnode.type)) {  、// 之前的判断
    //   // 如果 vnode.type 是 object 类型 , 表示它是 组件类型
    //   processComponent(vnode, container)
    // }

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

  // 初始化 TextNode 的逻辑
  function processText(n1, n2: any, container: any) {
    // 渲染 Text 的虚拟节点的 Vnode 的逻辑 


    // 1. 拿到用户传入的 text
    const { children } = n2;

    // 2. 创建一个 TextNode
    // 记得使用 vnode.el 赋值
    const textNode = (n2.el = document.createTextNode(children))

    // 3. 添加到 container 内容
    container.appendChild(textNode)
  }


  // 初始化 Fragment 的逻辑
  function processFragment(n1, n2: any, container: any, parentComponent, anchor) {
    // 调用 mountChildren
    mountChildren(n2.children, container, parentComponent, anchor)
  }



  // 当 vnode 是一个 Element 类型执行这个函数
  function processElement(n1, n2, container: any, parentComponent, anchor) {

    // 判断 n1 
    if (!n1) {
      // n1 不存在 表示初始化
      // 进行一个 Element 的渲染 

      // 1. Element 分为两种情况 -> init 初始化 ->  update 更新


      // 实现初始化Element的逻辑
      mountElement(n2, container, parentComponent, anchor)
    } else {
      // n1 有值 表示更新逻辑
      patchElement(n1, n2, container, parentComponent, anchor)
    }

  }

  // Element 更新 
  function patchElement(n1, n2, container, parentComponent, anchor) {
    // 实现Element更新的逻辑
    console.log("patchElement")
    console.log("n1", n1)
    console.log("n2", n2)


    // 执行Props的更新
    const oldProps = n1.props || EMPTY_OBJ   // 可能 n1.props 没有赋值 赋值为 EMPTY_OBJ 空对象
    const newProps = n2.props || EMPTY_OBJ

    // 取出 el, 并赋值 给n2
    const el = (n2.el = n1.el)

    // 实现 Children 的更新
    patchChildren(n1, n2, el, parentComponent, anchor)

    // 实现Props的更新
    // 定义patchProps的函数
    patchProps(el, oldProps, newProps)

  }

  // 实现 Children 的更新
  function patchChildren(n1, n2, container, parentComponent, anchor) { // 传入 el  和 父组件
    /**
     * 实现 Children 的更新逻辑
     * 
     * 1. 先判断当前节点 和 老的节点 的 children 的状态，看看他是 text 还是 Array
     * 2. 实现更新内容， 基于 shapeFlags 判断 children 的类型， 
     *  2.1 如果是 Array -> Text  节点
     *    - 实现： 1. 先清空掉数组， 2. 设置文本
     *  2.2 如果是 Text -> Text
     *    - 实现： 判断老的Text 和 新的 Text 是否相同，如果不同，则更新文本
     *  2.3 如果是 Text -> Array
     *    - 实现：1. 把Text清空，让后获取到Array的children , 重新进行mountChildren 渲染
     */

    // 1. 拿到 n2 的 shapeFlag
    const { shapeFlag } = n2
    // 拿到 n1 的 shapeFlag
    const prevShapeFlag = n1.shapeFlag


    // 拿到要更新的 Text 
    const c2 = n2.children
    // 拿到之前老节点的 值
    const c1 = n1.children

    // 2. 判断 n2 的 shapeFlag
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) { // 更新后的节点是一个 Text

      // 进一步判断
      // if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {  // 老的节点是一个 Array

      //   // 这里就是 children :   Array -> Text 的修改 

      //   // 逻辑：
      //   // 1. 把老的Array清空
      //   unmountChildren(n1.children)

      //   // 2. 设置 text 文本
      //   // hostSetElementText() 接口
      //   // 传入 div -> 也就是 老的节点的 el 
      //   hostSetElementText(container, c2)
      // } else {  // 这里进行的逻辑为： Text -> Text 的修改

      //   // 当两个节点不相等时才取更新
      //   if (c1 !== c2) {
      //     // 设置新的文本
      //     hostSetElementText(container, c2)
      //   }
      // }

      // 因为以上代码使用了两次 hostSetElementText 
      // 进行重构重构 
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {  // 老的节点是一个 Array
        // 执行 children-> Array 的清空
        unmountChildren(n1.children)
      }

      // 当两个节点不相等时才取更新
      if (c1 !== c2) {
        // 这里
        hostSetElementText(container, c2)
      }
    } else { // 更新后的节点是一个 Array
      // 已经确认 n2 的 shapeFlag 是一个 Array
      // 判断 n1 的 shapeFlag， 判断之前的是不是Text节点
      if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        // Text -> Array
        // 1. 把Text清空
        hostSetElementText(container, "")

        // 2. 渲染 children -> 之前实现过 mountChildren 渲染
        mountChildren(c2, container, parentComponent, anchor)
      } else {
        // 这里就行进行 diff 算法的逻辑 
        // 老Array -> 新Array
        // 使用 patchKeyChildren 函数实现
        // 传入 老的 Array 和 新的 Array
        patchKeyChildren(c1, c2, container, parentComponent, anchor)
      }
    }

  }

  // Array -> Array : diff 算法的逻辑
  function patchKeyChildren(c1, c2, container, parentComponent, parentAnchor) { // 添加锚点

    // 1. 创建指针索引 i  e1 e2
    // 对c2.length 进行重构
    let l2 = c2.length
    let i = 0
    let e1 = c1.length - 1
    let e2 = l2 - 1


    // 实现判断 n1 n2 是否一样的函数
    function isSomeVNodeType(n1, n2) {
      // 基于 type 
      // 基于 key
      return n1.type === n2.type && n1.key === n2.key
    }

    // 左侧对比 
    /**
     * 1. 左侧对比
     * ( A B ) C
     * ( A B ) D E
     * 
     * 实现思路： 
     * 1. 基于指针 i  e1  e2 
     *  - 其中 i 指针为 0 ， 指向两个数组的头部 
     *  - e1  为 老节点的 尾指针,  值为 e1 = n1.children.length - 1  Array1 的元素个数 
     *  - e2  为新节点的 尾指针， 值尾 e2 = n2.children.length - 1  Array2 的元素个数
     * 
     * 2. 基于左侧对比， n1.children [i]  于 n2.children [i] 比较
     *   - 左侧元素相同， 把 i 指针向后一个位 移动  i++
     *   - 当两个Array元素不同时，i指针停止，得到 i 的值
     * 
     * 3. 根据 得到 i  e1  e2 判断大小，确定Array是 增加 | 删除 | 修改 | 移动
     *  - 这里 左侧对比 位创建 D E 节点
     *  - 调用 patch() 进行创建 渲染
     */

    // 2. 循环对比
    while (i <= e1 && i <= e2) {
      // 取出节点 
      const n1 = c1[i]
      const n2 = c2[i]

      // 判断 n1 n2 连个节点是否一样
      // 如果相同，调用 patch() 递归进行对比
      if (isSomeVNodeType(n1, n2)) {
        // 如果相同，调用 patch() 递归进行对比
        patch(n1, n2, container, parentComponent, parentAnchor)
      } else {
        // 如果两个虚拟节点不相等时
        // 退出循环
        break
      }
      // 移动 i 指针
      i++
    }

    // 2.右侧对比
    //  A ( B  C )
    //  D E (B C )
    /**
     * 1. 基于指针 i  e1  e2
     * 
     * 2. 循环 n2 n2 对比 
     *  - i 初始为 0, 因为是左侧对比，i 基本固定不动 
     *  - 当 n1 n2 形同时， 移动 e1 e2  -> e1--, e2-- 
     *  - 当 n1 n2 不同时， 得到变化的节点，和 e1 e2 变化的值
     * 
     * 3. 根据 得到 i  e1  e2 判断大小，确定Array是 增加 | 删除 | 修改 | 移动
     * - 这里 右侧对比 为 删除 A ，创建 D E 节点
     * - 基于指针的判断 i <= e1 && i <= e2
     * 
     * 4. 基于当前 Array 最后的出 i = 0 && e1 = 0 e2 = 1  -> 确认变化的范围
     */
    while (i <= e1 && i <= e2) {
      // 1. 取出右侧节点
      const n1 = c1[e1]
      const n2 = c2[e2]

      // 2. 判断右侧 n1 n2 是否形同
      if (isSomeVNodeType(n1, n2)) {
        // 3. 如果相同，调用 patch() 递归进行对比, 并且创建 相同的节点
        patch(n1, n2, container, parentComponent, parentAnchor)
      } else {
        // 如果两个虚拟节点不相等时
        // 退出循环
        break
      }
      // 4. 移动 e1 e2 指针
      e1--
      e2--
    }


    /**
     * 3. 左侧一样， 新的比老的长, 进行创建节点 
     *  - Array1: A B 
     *  - Array2: A B C D
     *  - 基于左侧对比，得到变化的元素，创建 C ， 把新创建的 C 添加到尾部
     * 
     * 实现对比-> 创建 C 节点 
     * 1. 两个Array 进行对比， 因为是左侧一样， 新的比老的长，多出了 C 节点
     * 2. 基于指针 i  e1  e2 , 确定 C节点的位置 
     * 3. 创建 C 节点 添加到 Array2 尾部 
     * 
     *    - 最后指针为 i = 1  |  e1 = 1 | e2 = 2  
     *    - 创建 C 节点，添加到 Array2 尾部
     *    - 所以 i > e1  && i <= e2 时创建节点
     * 
     */


    /**
     *  4. 右侧一样， 新的比老的长，  头部创建节点
     *  - Array1: A B
     *  - Array2: C A B
     *  - 基于右侧对比，得到变化的元素， 创建 C ，把新创建的 C 添加到头部
     * 
     * 实现对比-> 创建 C 节点
     *  1. 两个Array 进行对比，基于右侧对比， 因为是右侧一样， 新的比老的长，多出了 C 节点
     *  2. 基于指针 i  e1  e2 , 确定 C节点的位置
     *  3. 创建 C 节点 添加到 Array2 头部
     * 
     *  - 右侧进行对比完，最后的指针为 i = 0 | e1 = -1 | e2 = 0
     *  - 所以在 i > e1  && i <= e2 时 创建新的节点 
     *  - 创建 C 节点，添加到 Array2 头部 
     *      - 实现添加到头部需要 ： 锚点 -> 基于锚点 把创建的节点添加锚点的前一位置 
     */
    if (i > e1) {
      if (i <= e2) {
        // 调用 patch() 创建节点 
        // 因为左侧对比到不同时，C 节点时， n1 是没有值的， n2 就是需要创建的新节点
        // 把创建的 C 节点添加到尾部 

        // 声明一个锚点， 锚点等于 A 节点的el，把创建的节点，添加到A节点之前
        // 声明一个位置 nextPos 
        const nextPos = e2 + 1  // 修改 bug 改为 e2 + 1 获取锚点

        // 因为这里的逻辑时 左侧对比 & 右侧对比 新节点比老节点长。 的逻辑都会执行这里 
        // 所以需要设置一个锚点，根据锚点判断，是添加在 头部 还是 尾部
        const anchor = nextPos < l2 ? c2[nextPos].el : null
        // 分析： 判断 i + 1 < c2.length  新节点的元素个数, 如果小于那就是进行了左侧对比， 所以赋值锚点为 null ， 表示添加到最后的尾部位置 
        //  如果 i + 1 没有小于 新节点的元素个数， 说明进行的是右侧对比，赋值锚点为 c2[i+1].el， 新节点的第二个位置的元素 ： A ，就是锚点, 

        // 因为新创建的节点，不仅仅是一个, 可能是 C D 
        // 所以需要一个循环，进行创建 
        while (i <= e2) {
          // 赋值锚点 
          patch(null, c2[i], container, parentComponent, anchor)

          // 创建完之后，指针 i 向后移动一位
          i++
        }

      }
    } else if (i > e2) {
      // Array1 比 Array2 长

      /**
       * 3. 基于左侧对比  Array1 比 Array2 长， 删除老节点多出的节点
       *  - Array1: A B C 
       *  - Array2: A B
       *  - 基于左侧对比，  找到乱序元素 C ,  执行删除 C 
       * 
       * 实现： 
       *  1. 两个Array 进行对比，基于左侧对比， 因为是左侧一样，老的比新的长，多出了 C 节点，所以需要删除 C 节点
       *  2. 在进行左侧对比时， 基于指针 i  e1  e2 , 确定 C节点的位置
       *  3. 最后指针为 i = 2 | e1 = 2 | e2 = 1  , 确定多出了 C 节点
       *  4. 执行删除 C 节点
       * 
       *    - 进行判断删除的逻辑 
       *    - i > e2 && i <= e1 时，执行删除逻辑
       *    - 删除 C 节点
       */

      /**
       * 4. Array1 比 Array2 长
       *  - Array1: A B C
       *  - Array2: B C
       *  - 基于左侧对比， 得到变化的元素 A ，  执行删除 A 
       *  
       * - 基于右侧对比， 得到指针数据， i = 0 | e1 = 0 | e2 = -1
       * - 发现于左侧对比，实现的判断一样  i <= e1 ; i > e2 ， 执行删除逻辑 
       * - 删除 首部节点 A
       */

      while (i <= e1) {
        // 执行删除多出的节点 c1[i].el ,老的节点，  使用 hostRemove 接口
        hostRemove(c1[i].el)

        // 删除完之后，指针 i 向后移动一位
        i++
      }
    } else {
      // 乱序的部分， 中间的部分 ， 中间对比的部分 

      // 1. 删除Array2 中的节点 D  -> 老节点中存在， 新节点中不存在
      /**
       * Array1:  A B C D F G
       * Array2:  A B E C F G
       * 
       * -> 实现逻辑： 删除 D， 修改C的props
       * 
       * 在Array1 和 Array2 已经进行过双端对比，得到中间节点的不同， 乱序的节点
       *    - C  D 
       *    - E  C
       *    - 删除 D  并且创建 E
       * 
       * 实现思路：找到中间乱序的节点， 进行遍历一遍 -> 在新Array2中创建映射表，遍历老Array1, 根据映射表，删除映射表的节点 -> D 节点
       *         - 还有一种遍历方法，也就是通过 key 查找节点。 -> 新节点key 是否在老节点 key 里面 
       * 
       * 1. 经过左侧与右侧的对比，得到中间节点的不同， 乱序的节点
       *    - 此时的指针为 i = 2 | e1 = 3 | e2 = 3
       * 2. 创建 基于新Array2映射表, key -> value, K 就是节点的key, value 为节点的索引值 
       * 3. 老节点遍历，根据key 查找对应的映射表, 如果没有对应上，就删除老Array1中 节点-> D 节点
       *     - 如果查找到对应的 映射表，调用 patch() 进行对比，可以 props | children不同需要进行修改 
       */

      // 2. 优化删除逻辑
      /**
       * Array1:  A B C E D F G
       * Array2:  A B E C F G
       * 
       * 优化的点： 当遍历Array1, 对应映射表时，如果映射表中的项已经映射完了，就不再进行循环映射了，直接删除Array1 之后的节点
       * 实现：
       * 1. 记录新Array 变化的数量， 当每次映射时候，定义一个变量记录下来
       * 2. 判断记录的数量 超过 新节点的数量时，Array1 后面的所有节点都进行移除
       * 
       */


      // 1. 需要遍历 Array1 & Array2 中间的乱序部分 
      // 创建指针 
      let s1 = i  // 老节点数组 Array1 的开始遍历位置
      let s2 = i  // 新节点数组 Array2 的开始遍历位置

      // 定义一个变量，记录新节点的数量
      const toBePatched = e2 - s2 + 1
      // 定义一个变量，记录当前已经映射过的数量
      let patched = 0

      let moved = false
      let maxNewIndexSofar = 0

      // 3. 中间节点移动节点的逻辑
      /**
       * 1. 确定中间节点的不同，并且建立中间节点， 新Array 与 老Array 的映射关系
       * 2. 初始化映射表 
       * 3. 赋值映射表 
       * 4. 求最长递增子序列, 也就是新节点中不变的节点,一共有多少个 
       * 5. 进行两个节点的对比
       */

      // 1. 建立映射表 新Array 与 老Array 的映射关系
      // 给定一个定长的数组， 因为性能更好，数组范围是，Array2 中间节点变化的数量 
      const newIndexToOldIndexMap = new Array(toBePatched)

      // 2. 初始化 映射表，  赋值为 i, i -> Array1 & Array2 的开始遍历位置
      //  表示没有建立映射关系 
      //  循环Array2, 初始化这个映射表 
      for (let i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0



      // 2. 基于新Array2 创建映射表
      const keyToNewIndexMap = new Map()
      for (let i = s2; i <= e2; i++) {
        // 获取到当前节点
        const nextChild = c2[i]
        // 添加到映射表 ,  key -> value, K 就是当前节点的key, value 为节点的索引值
        // 重要的点：节点的key 的应用，面试经常问到 -> 
        // 答：因为在源码中， diff 算法会对 更新后的Element节点，建立一个 key -> value 的一个映射关系， 映射表。 
        // 当老节点与新节点有不同时，老节点通过这个key 能够快速找到 与 新节点所在的位置，进行更新逻辑
        // diff 算法中节点写了 key ， 对比算法复杂度 为 O(1)
        // 
        // 如果没有写 key ， 对比算法的复杂度为  O(n) -> 
        //   - 没有 key , 需要遍历 新节点 和 老节点，判断在那个位置上是否相同， 如果相同，就不需要更新了， 
        //   - 如果不相同，就需要更新操作
        keyToNewIndexMap.set(nextChild.key, i)
      }


      // 3. 遍历老节点Array1
      for (let i = s1; i <= e1; i++) {
        // 取到当前的节点
        const prevChild = c1[i] // 老Array1 的节点

        // 这里每次都需要去检查 patched 是否超过 toBePatched，如果超过，就不再进行循环了
        // patched 映射的次数 >= toBePatched 新节点的数量
        if (patched >= toBePatched) {
          // 直接删除掉 Array1 之后的节点
          hostRemove(prevChild.el)
          continue
        }



        // 定义变量，保存索引值, 新节点所在的位置 
        let newIndex

        // 判断当Array1 中的 当前节点是否 赋值 key
        // 有两种情况 null | undefined
        if (prevChild.key != null) { // 当有key 时，才会去判断是否在映射表中

          // 根据在老Array 真正遍历的节点 key,  查找对应的映射表
          // 如果能获取到值 -> 新Array2中 一定存在该节点
          // 如果没有 -> 说明该节点在新Array2中不存在，需要删除
          newIndex = keyToNewIndexMap.get(prevChild.key)  // 返回值是索引， 新节点所在的位置
          // 当 newIndex 没有映射到值时，为 undefined  

        } else {
          // 如果 当前Array1 取出的节点 没有 key

          // 遍历 新Array2 中的节点， 
          // 如果不相同，删除老节点
          for (let j = s2; j <= e2; j++) {
            // 判断 新老节点是否相同 
            if (isSomeVNodeType(prevChild, c2[j])) {
              // 如果相同，说明该节点在新Array2中存在，不需要删除

              // 进行 newIndex 赋值 -> 新节点所在的位置
              newIndex = j
              // 查找到节点， 就没有必要遍历了
              break
            }
          }
        }


        // 判断 newIndex 这个值
        // 如果没有取到值 -> undefined，说明该节点在新Array2中不存在，需要删除
        if (newIndex === undefined) {
          // 删除老节点
          hostRemove(prevChild.el)
        } else {

          if (newIndex >= maxNewIndexSofar) {
            maxNewIndexSofar = newIndex
          } else {
            moved = true
          }

          // 这里赋值这个映射表 
          newIndexToOldIndexMap[newIndex - s2] = i + 1
          // 如果 newIndex 具有值 -> 新节点所在的位置
          // 调用patch() 进行更深度的对比 -> 进行判断 props | children 这些属性 
          patch(prevChild, c2[newIndex], container, parentComponent, null)

          // 这里表示已经处理完一个相同节点了，对patched++;
          patched++
        }
      }



      // 4. 获取最长递增子序列 
      const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : []

      // 5. 进行节点的对比， 一个是新节点，一个是最长递增子序列 
      // 定义索引指针， 用于指向最长递增子序列
      let j = increasingNewIndexSequence.length - 1
      // 遍历 Array2 
      for (let i = toBePatched - 1; i >= 0; i--) {
        // 调用 insert() 方法 -> 基于锚点 
        const nextIndex = i + s2
        const nextChild = c2[nextIndex]
        // 锚点 
        const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : null


        // 创建节点逻辑
        if (newIndexToOldIndexMap[i] === 0) {
          patch(null, nextChild, container, parentComponent, anchor)
        } else if (moved) {
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            // 进行移动位置 
            // console.log("移动位置")

            hostInsert(nextChild.el, container, anchor)
          } else {
            // 不需要移动 
            j--
          }
        }
      }
    }



  }

  // 把老的Array清空
  function unmountChildren(children) {
    // 遍历 children
    for (let i = 0; i < children.length; i++) {
      // 拿出 el
      const el = children[i].el

      // 执行删除逻辑
      // 写在runtime-dom 的接口上
      hostRemove(el)
    }
  }

  // const EMPTY_OBJ = {}
  // 实现 patchProps 更新Props的函数
  function patchProps(el, oldProps, newProps) {
    /**
     * 实现 Props 的更新
     * 
     * props的更新要求 
     * 1. foo 之前的值 与 之后的值不一样了， 修改 props 属性
     * 2. foo 更新后变为了 null | undefined  ；  删除了 foo 属性
     * 3. bar 更新后这个属性在更新后没有了， 删除 bar 属性
     */

    // 优化1. 当 oldProps 与 newProps 不相同时，需要更新
    if (oldProps !== newProps) {

      // 实现1. 循环 newProps  与 oldProps 做对比
      for (const key in newProps) {
        // 取到 oldProps 之前的 props
        const prevProp = oldProps[key];
        // 取到 新的 props 
        const nextProp = newProps[key];

        // 判断 prevProps 与 nextProp 是否一样
        if (prevProp !== nextProp) {
          // 当它们不等时， 说明 props 发生了变化
          // 这里进行触发更新的逻辑

          // 调用 hostPatchProp() 接口 
          // 因为就是在这里实现props的赋值的 

          // 传入  之前的Prop,  更新后的Prop
          hostPatchProp(el, key, prevProp, nextProp)
        }
      }

      // 优化2: 如果 oldProps 为空，不用进行对比
      if (oldProps !== EMPTY_OBJ) {
        // 实现3. bar 更新后这个属性在更新后没有了， 删除 bar 属性
        // 遍历 oldProps 
        for (const key in oldProps) {
          // 如果 key 不在 newProps 中
          if (!(key in newProps)) {
            //  删除这个 key
            // 调用 hostPatchProp() 接口 
            hostPatchProp(el, key, oldProps[key], null)
          }
        }
      }
    }

  }



  // 初始化 Element
  function mountElement(vnode: any, container: any, parentComponent, anchor) {

    // 实现 渲染 Canvas 平台的API 
    /**
     * 为了让渲染器 能够实现多个 平台接口，不仅能够实现 Element 还能够渲染 Canvas , 所以修改代码让它不单单支持Element 
     * 而是通过稳定的接口函数来 渲染 Element & Canvas
     * 
     * 需要3接口：
     * createElement
     * patchProp
     * insert
     * 
     * 
     * 实现方式
     * 1. 定义一个 createRender({}) 函数 -> 渲染器，传入对应的接口过来 
     * 2. 把具体的实现函数传入给createRender()
     */

    // 这里做了 Element 平台的API new Element
    // 1. 创建一个真实的 Element -> vnode.type
    // const el = (vnode.el = document.createElement(vnode.type))  // 使用 el 保存根节点 -> 给el赋值

    // 接口1 createElement
    const el = (vnode.el = hostCreateElement(vnode.type))  // 使用 el 保存根节点 -> 给el赋值

    // 2. props , 解析属性 -> vnode
    const { props } = vnode
    if (props) { // 当props 不为空时
      for (const key in props) {
        const val = props[key]

        // console.log(key)

        // 进行重构
        // 处理注册事件功能
        // 具体的 针对于 click -> 通用  （小步骤的开发思想）
        // 实现通用的，可以根据 组件的命名规范，来实现， 
        // 因为 on + 事件名称 ：  click -> onClick , onMouseDown -> MouseDown
        // 可以使用正则方式，匹配 on 之后的事件名，来注册不同事件

        // // 封装 通过注册方法 isOn
        // const isOn = (key: string) => /^on[A-Z]/.test(key)
        // if (isOn(key)) {
        //   // if (key === 'onClick') {
        //   // 添加 注册点击事件 
        //   // val 就是 onClick 的会调函数
        //   // el.addEventListener('click', val)

        //   // 获取事件名称
        //   const event = key.slice(2).toLowerCase()
        //   el.addEventListener(event, val)

        //   // 在Canvas 平台添加属性
        //   // el.x = 10


        // } else {
        //   // 如果不是 on 之后的事件名称
        //   // 设置 el 的属性值
        //   el.setAttribute(key, val)
        // }


        // 接口2 patchProp()
        // 传入需要赋值的参数
        hostPatchProp(el, key, null, val)
      }
    }

    // 3. children,  解析然后赋值 
    // children 有两种情况， 是一个数组， 或者是一个字符串
    const { children, shapeFlag } = vnode

    // 这里也是用 shapeFlag 判断 children 的类型 -> 可能是数组，可能是字符串
    // 如果是一个字符串 -> TEXT_CHILDREN
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // if (typeof children === 'string') {
      // 直接设置 el 的文本内容
      el.textContent = children

      // 如果是一个数组 -> ARRAY_CHILDREN
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      // } else if (Array.isArray(children)) {
      // 表示 [h(), h()]
      // 使用 mountChildren 重构 children - Array 的渲染
      mountChildren(vnode.children, el, parentComponent, anchor)
    }


    // 在 Canvas 平台添加到容器 
    // addChild(xxx)
    // 4. 挂载 el 到 容器 container 上
    // container.appendChild(el)


    // 接口3 insert()
    // 添加到容器
    hostInsert(el, container, anchor)
  }


  // 封装 渲染 children 的函数
  function mountChildren(children, container, parentComponent, anchor) {
    // 循环 children 内的虚拟节点, 然后调用 patch()进行递归->再去渲染
    children.forEach((v) => {
      // 这里 container 容器设置为 el 
      patch(null, v, container, parentComponent, anchor)
    })
  }

  // 实现组件初始化的总体函数
  function processComponent(n1, n2, container: any, parentComponent, anchor) {
    // 1. 挂载组件
    // 使用 mountComponent 函数 挂载组件
    mountComponent(n2, container, parentComponent, anchor)
  }


  // 挂载组件mountComponent, 初始化组件实例
  function mountComponent(initialVNode: any, container, parentComponent, anchor) {
    // 1. 通过 vnode 创建一个组件的实例对象 ->  instance 
    const instance = createComponentInstance(initialVNode, parentComponent)

    // 2. setupComponent() 初始化
    // 2.1 解析处理组件的其他内置属性 比如： props , slots 这些 
    // 2.2 组件中setup() 的返回值 和 挂载 render() 返回
    setupComponent(instance)

    // 3. 开始调用 组件的 render 函数
    setupRenderEffect(instance, initialVNode, container, anchor)
  }

  function setupRenderEffect(instance: any, initialVNode, container: any, anchor) {

    /**
     * 这里的流程是进行 Element 的渲染 
     * 
     * 这里 使用 effect 函数，来监听 ref 的响应式
     * 
     * 
     * 使用一个变量判断当前是否是 初始化逻辑 & 更新逻辑 
     * 这里变量挂载在 instance 中  instance.isMounted 
     * 
     * 
     * 主要触发更新页面逻辑的是 patch() 函数
     * 在patch() 函数初始化时  传入 n1 : null  n2 当前的VNode 虚拟节点 
     * 当 patch() 执行更新的逻辑时，传入 n1 : 老的虚拟节点, n2 新的虚拟节点
     * 
     * 当执行 patch 函数主要的逻辑时，都是基于 n2 去做的, 所以当前代码进行很多的重构逻辑
     * 
     * 
     * 这就是 Element 更新的逻辑  
     */

    // 使用 effect监视模板中响应式数据的变化 
    effect(() => {
      // 然后实现依赖收集 & 触发依赖的实现
      // 把 渲染的逻辑 写在这里， 收集依赖


      // 使用 isMounted 判断是否 init 初始化
      if (!instance.isMounted) {
        // 初始化 
        console.log("init")
        // 当调用 render时候，应该拿到 组件的代理对象
        const { proxy } = instance
        // 拿到 proxy 后, 在调用 render时候，进行绑定

        // 调用 render() 函数
        // subTree 是 h() 函数返回的 vnode, 也是虚拟节点树 subTree 

        // 使用 instance.subTree 存储  subTree, 在更新时候需要用， 需要在 component 初始化 subTree 
        const subTree = (instance.subTree = instance.render.call(proxy))  // 绑定 proxy
        // const subTree = instance.render.call(proxy)  // 绑定 proxy


        // 查看 当响应式数据发生变化时， 虚拟节点 subTree 的变化 
        // console.log(subTree)

        // 再基于返回过来的虚拟节点 vnode, 再进一步的调用 patch() 函数
        // vnode -> subTree 是一个 Element类型 ->  挂载 mountElement

        // 递归调用 -> patch(虚拟节点，容器)

        // 这里赋值 instance, 也就是父级组件
        // 初始化 -> n1 为 null
        patch(null, subTree, container, instance, anchor)
        // patch()再去判断，-> subTree 的类型 -> 可能是 组件类型 或者 Element类型 -> 一直递归进行下去


        // 实现 $el 的关键时机， 在这个时候赋值 el
        // 当patch() 再次调用，可能是 进行Element流程
        // 将 subTree.el 赋值给 vnode.el
        initialVNode.el = subTree.el

        // 改变 isMounted 状态 
        instance.isMounted = true
      } else {
        // 更新逻辑 
        console.log("update")

        // 实现： 在初始化时 instance 中用一个变量 保存 subTree 的值
        // 在更新时候，获取到 上一个 subTree 

        const { proxy } = instance
        // 拿到更新后的 subTree
        const subTree = instance.render.call(proxy)

        // 取出 之前保存上一次组件的 subTree 
        const prevSubTree = instance.subTree

        // console.log("当前的subTree", subTree)
        // console.log("之前的subTree", prevSubTree)

        // 再次重新更新  instance.subTree  -> 达到多次更新 
        instance.subTree = subTree


        // 递归调用 -> patch(虚拟节点，容器)
        // 这里赋值 instance, 也就是父级组件

        // 实现 patch() 的更新逻辑 
        // 添加 n1 n2;  老的虚拟节点 & 新的虚拟节点
        patch(prevSubTree, subTree, container, instance, anchor)
      }


    })
  }



  // createRenderer() 函数导出
  // 返回一个对象 
  return {
    // 逻辑：
    // createAppApi(render) 调用 , 传入当前的 具体的 render 
    // createAppApi(render) 返回一个 createApp 函数 

    // 的到之前 createApp 
    createApp: createAppApi(render)
  }
}


// 根据映射表，求最长递增子序列 
function getSequence(arr) {
  const p = arr.slice();
  const result = [0];
  let i, j, u, v, c;
  const len = arr.length;
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      j = result[result.length - 1];
      if (arr[j] < arrI) {
        p[i] = j;
        result.push(i);
        continue;
      }
      u = 0;
      v = result.length - 1;
      while (u < v) {
        c = (u + v) >> 1;
        if (arr[result[c]] < arrI) {
          u = c + 1;
        } else {
          v = c;
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p[i] = result[u - 1];
        }
        result[u] = i;
      }
    }
  }
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
    result[u] = v;
    v = p[v];
  }
  return result;
}
