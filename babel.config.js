module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
  ],
};


// 配置 babel, 让 Node-CJS 可以识别 ESM ,  并且支持 TypeScript
