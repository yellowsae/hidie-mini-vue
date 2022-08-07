// TODO

import { h, ref } from "../../../lib/guide-mini-vue.esm.js"


/**
 * 使用 双端对比 Array - Array
 * 
 * 对比两个 Array 节点，采用的是 双端对比的方法 
 * 因为： 在Element中， 一般改变的是 页面中间的元素，-> 添加 修改 删除 移动 ， 都基本在Element 中间的元素发生， 两边的元素不经常改变 
 * 所以使用 双端对比的方法，确定Element两端不会改变， 在对比Array发生改变时， 能够有更好的优化, 提高新能
 * 
 * 双端对比算法 就是针对于 Element 前端页面 出现的特定算法  -> 针对特定场景
 *
 */


/**
 * 双端对比方法的核心：就是筛选出 两个 Array 中间的 乱序的元素
 * 
 * Array -> Array 的双端对比方法 使用场景
 * 
 * 1. 左侧
 *  - Array1:  A B C
 *  - Array2:  A B D E
 *  - 找出左侧相同的元素， 即 A B，得到乱序的元素 D E ，然后基于乱序元素进行对比， 确定要改变的元素 C -> D E
 * 
 * 2. 右侧
 *  - Array1:  A B C
 *  - Array2:  D E B C 
 *  - 基于右侧找到形同的元素 B C , 得到乱序的元素 A D E ,  然后基于乱序元素进行对比， 确定要改变的元素 A -> E D
 */


// 1. 左侧对比
// ( A B ) C
// ( A B ) D E
// const prevChildren = [
//   // 多谢了一个 Key
//   h("p", { key: "A" }, "A"),
//   h("p", { key: "B" }, "B"),
//   h("p", { key: "C" }, "C"),
// ];

// const nextChildren = [
//   h("p", { key: "A" }, "A"),
//   h("p", { key: "B" }, "B"),
//   h("p", { key: "D" }, "D"),
//   h("p", { key: "E" }, "E"),
// ];
/**
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
 *  - 这里 左侧对比 为创建 D E 节点
 *  - 基于指针的判断 i <= e1 && i <= e2
 *  - 调用 patch() 进行创建 渲染
 */








// 2.右侧对比
//  A ( B  C )
//  D E (B C )
// const prevChildren = [
//   // 多谢了一个 Key
//   h("p", { key: "A" }, "A"),
//   h("p", { key: "B" }, "B"),
//   h("p", { key: "C" }, "C"),
// ];

// const nextChildren = [
//   h("p", { key: "D" }, "D"),
//   h("p", { key: "E" }, "E"),
//   h("p", { key: "B" }, "B"),
//   h("p", { key: "C" }, "C"),
// ];
/**
 * 右侧对比 实现思路：
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
 */









// 对比场景
// 3 左侧一样， 新的比老的长  -> 创建节点
// const prevChildren = [
//   h("p", { key: "A" }, "A"),
//   h("p", { key: "B" }, "B"),
// ];

// const nextChildren = [
//   h("p", { key: "A" }, "A"),
//   h("p", { key: "B" }, "B"),
//   h("p", { key: "C" }, "C"),
// ];

/**
 * 1. 左侧一样， 新的比老的长 
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









// 4. 右侧一样， 新的比老的长
// const prevChildren = [
//   h("p", { key: "A" }, "A"),
//   h("p", { key: "B" }, "B"),
// ];

/**
 * Array1: A B
 * Array2: D C A B
 * 
 * 这里出现 bug, 当新的 Array 创建多个节点时，C  D , 会出现问题，它会添加到最后，而不是头部
 * - 分析： 当进行右侧对比后： i = 0 | e1 = -1 | e2 = 1 , 然后进入到创建的逻辑。
 *         但是在设置 nextPos = i + 1， 指定到C节点，而此时C节点还没有创建， 所以 nextPos = null
 * 
 * - 解决： 应该获取锚点是是基于 e2 + 1 -> 取到 A 节点
 * 
 * 这样创建节点时基于锚点 A，在A前面插入 D 节点 ->  在A前面插入 C 节点
 */

// const nextChildren = [
//   h("p", { key: "C" }, "C"),
//   h("p", { key: "D" }, "D"),
//   h("p", { key: "A" }, "A"),
//   h("p", { key: "B" }, "B"),
// ];
/**
 *  2. 右侧一样， 新的比老的长
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
 *  - 创建 C 节点，添加到 Array2 头部 ， 指定的位置
 *      - 实现添加到头部需要 ： 锚点 -> 基于锚点 把创建的节点添加锚点的前一位置 
 */






// 当老的Array 比 新的 Array长时 ,  -> 进行删除逻辑


// 5. 基于左侧对比
// const prevChildren = [
//   h("p", { key: "A" }, "A"),
//   h("p", { key: "B" }, "B"),
//   h("p", { key: "C" }, "C"),
// ];

// const nextChildren = [
//   h("p", { key: "A" }, "A"),
//   h("p", { key: "B" }, "B"),
// ];
/**
 * 3. Array1 比 Array2 长
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








// 6. 基于右侧对比 
// const prevChildren = [
//   h("p", { key: "A" }, "A"),
//   h("p", { key: "B" }, "B"),
//   h("p", { key: "C" }, "C"),

// ];

// const nextChildren = [
//   h("p", { key: "B" }, "B"),
//   h("p", { key: "C" }, "C"),
// ];
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




/**
 * 对比场景 
 *  1. 左侧一样， 新的比老的长 
 *  - Array1: A B 
 *  - Array2: A B C D
 *  - 基于左侧对比，得到变化的元素，创建 C ， 把新创建的 C 添加到尾部
 * 
 * 
 * 2. 右侧一样， 新的比老的长
 *  - Array1: A B
 *  - Array2: C A B
 *  - 基于右侧对比，得到变化的元素， 创建 C ，把新创建的 C 添加到头部
 * 
 * 
 * 3. Array1 比 Array2 长
 *  - Array1: A B C 
 *  - Array2: A B
 *  - 基于左侧对比，  找到乱序元素 C ,  执行删除 C 
 * 
 * 4. Array1 比 Array2 长
 *  - Array1: A B C
 *  - Array2: B C
 *  - 基于右侧对比， 得到变化的元素 A ，  执行删除 A 
 */









// 两个Array 中间 进行对比 
/**
 * 双端对比中， 最复杂的中间元素的对比，  也是 双端对比的最核心部分
 * 
 * 中间元素乱序的几种情况
 * 
 * Array1:  A B C Y E F G
 * Array2:  A B E D C F G
 * 
 * 中间乱序： C Y E  -> E D C 
 * 
 * 1. 创建新的 D  -> 老的节点中不存在， 新的节点中存在
 * 2. 删除老的节点中 Y  ->  在老节点的里面存在， 新节点里面不存在
 * 3. 移动 C E  ->  节点存在于新的和老的节点里， 但是位置发生改变了
 */



const prevChildren = [
  h("p", { key: "A" }, "A"),
  h("p", { key: "B" }, "B"),
  h("p", { key: "C", id: "c-prev" }, "C"),
  h("p", { key: "D" }, "D"),
  h("p", { key: "F" }, "F"),
  h("p", { key: "G" }, "G"),

];

const nextChildren = [
  h("p", { key: "A" }, "A"),
  h("p", { key: "B" }, "B"),
  h("p", { key: "E" }, "E"),  // 增加了E节点 & 删除 D 节点
  h("p", { key: "C", id: "c-next" }, "C"),  // props不同
  h("p", { key: "F" }, "F"),
  h("p", { key: "G" }, "G"),
];

// 1. 删除Array2 中的节点 D  -> 老节点中存在， 新节点中不存在
/**
 * Array1:  A B C D F G
 * Array2:  A B E C F G
 * 
 * 
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


export default {
  name: "ArrayToArray",
  setup() {
    // 定义响应式变量
    const isChange = ref(false)
    window.isChange = isChange
    return {
      isChange
    }
  },
  render() {
    const self = this

    // 实现根据 isChange 判断显示的 节点
    return self.isChange === true ? h("div", {}, nextChildren) : h("div", {}, prevChildren)
  }
};

