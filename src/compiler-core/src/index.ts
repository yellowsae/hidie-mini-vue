

// compiler 编译器的出口 


// 直接导出 compiler 
export * from './compiler'




/**
 * 在什么时候调用 compiler 模块呢？
 * 
 * 在 runtime.core 中 把 setup 函数的返回值赋值后，会去调用 render 函数
 * - 因为最终的目的是用于写 template,  所以在调用 render 函数前 判断是否具有 template ， 然后把 template 编译为 render 函数 
 * 
 * 
 */

