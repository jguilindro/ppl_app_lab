var path = require('path')

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: '.',
    assetsPublicPath: '.',
    productionSourceMap: true,
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 8001,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/api': {
        logLevel: 'debug',
        target: 'http://localhost:8000',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': '/api'
        }
      },
      '/api/v2': {
        logLevel: 'debug',
        target: 'http://localhost:8000',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api/v2': '/api/v2'
        }
      }
    },
    cssSourceMap: false
  }
}
