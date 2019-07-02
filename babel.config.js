const { NODE_ENV } = process.env
const isTest = NODE_ENV === 'test'

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: isTest ? 'commonjs' : false,
        targets: isTest
          ? {
              node: 'current'
            }
          : {
              android: '4.4',
              ios: '9'
            }
      }
    ]
  ],
  plugins: [['@babel/plugin-transform-runtime', { useESModules: !isTest }]]
}
