import vue from 'rollup-plugin-vue'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'

const babelConfig = require('../babel.config')

export default {
    input: 'src/index.js',
    output: {
        format: 'cjs',
        file: 'dist/index.js'
    },
    plugins: [
        commonjs(),
        vue({
            css: true,
            compileTemplete: true
        }),
        babel({
            babelrc: false,
            ...babelConfig,
            runtimeHelpers: true,
            exclude: 'node_modules/**',
            extensions: ['.js', '.vue']   
        })
    ]
}