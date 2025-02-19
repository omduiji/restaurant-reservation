const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'https://api.foodics.dev',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
        logLevel: 'debug',
      },
    },
  },
})
