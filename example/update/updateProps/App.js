
// 实现Props 更新流程
import { h, ref } from "../../../lib/guide-mini-vue.esm.js"
export const App = {
  name: "App",
  setup() {
    const count = ref(0)
    const onClick = () => {
      count.value++
    }

    const props = ref({
      foo: "foo",
      bar: "bar"
    })

    // 修改 props 属性
    const onChangePropsDemo1 = () => {
      props.value.foo = "new-foo"
    }

    // 删除了 foo 属性
    const onChangePropsDemo2 = () => {
      props.value.foo = undefined
    }

    // 删除了 bar 属性
    const onChangePropsDemo3 = () => {
      props.value = {
        foo: "foo"
      }
    }

    return {
      count,
      props,
      onClick,
      onChangePropsDemo1,
      onChangePropsDemo2,
      onChangePropsDemo3,
    }
  },

  render() {
    // 实现更新流程
    // console.log(this.props)
    return h(
      "div",
      {
        id: "root",
        ...this.props
      },
      [
        h('div', {}, 'count: ' + this.count),
        h('button', { onClick: this.onClick }, "click"),
        h(
          'button',
          { onClick: this.onChangePropsDemo1 },
          // 直接修改 props.foo 的值
          'foo - 值改变了 - 修改'
        ),
        h(
          'button',
          { onClick: this.onChangePropsDemo2 },
          'foo - 值变成了 undefined - 删除'
        ),
        h(
          'button',
          { onClick: this.onChangePropsDemo3 },
          'bar - 删除'
        )
      ]
    )
  }
}

/**
 * 实现 Props 的更新
 * 
 * props的更新要求 
 * 1. foo 之前的值 与 之后的值不一样了， 修改 props 属性
 * 2. foo 更新后变为了 null | undefined  ；  删除了 foo 属性
 * 3. bar 更新后这个属性在更新后没有了， 删除 bar 属性
 */
