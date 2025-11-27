const { createProxyMiddleware } = require("http-proxy-middleware")

module.exports = function (app) {
    app.use(
        createProxyMiddleware("/api/V1", {
            // target:   // https://nis.chint.com/ (正式)   // http://10.5.7.60:4155（测试） http://10.5.7.60:4170（测试）
            
            target: 'https://nis.chint.com/',//'https://nis.chint.com/', //'http://10.5.7.60:4155',
            // target: 'http://10.5.24.199:4155',//(程工)
            changeOrigin: true,
            ws: true,
            pathRewrite: {
                "^/api": ''
            }
        })
    )
}
