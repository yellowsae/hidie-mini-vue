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
const prevChildren = [
  // 多谢了一个 Key
  h("p", { key: "A" }, "A"),
  h("p", { key: "B" }, "B"),
  h("p", { key: "C" }, "C"),
];

const nextChildren = [
  h("p", { key: "A" }, "A"),
  h("p", { key: "B" }, "B"),
  h("p", { key: "D" }, "D"),
  h("p", { key: "E" }, "E"),
];
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
 *  - 这里 左侧对比 位创建 D E 节点
 *  - 调用 patch() 进行创建 渲染
 */



// 2.右侧对比 


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




/**
 * 对比场景 
 * 
 * 1. 左侧一样， 新的比老的长 
 *  - Array1: A B 
 *  - Array2: A B C
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
 *  - 基于左侧对比， 得到变化的元素 A ，  执行删除 A 
 * 
 * 
 */


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
