module.exports = {
    presets: [
        '@vue/cli-plugin-babel/preset'
    ],
    plugins: [
        '@babel/plugin-proposal-nullish-coalescing-operator',
        '@babel/plugin-proposal-optional-chaining',
        ['@babel/plugin-syntax-decorators', { decoratorsBeforeExport: true }],
        ['import', {
            libraryName: 'view-design',
            libraryDirectory: 'src/components'
        }]]
}
