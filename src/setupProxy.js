const { createProxyMiddleware } = require("http-proxy-middleware")

module.exports = function (app) {
    app.use(
        createProxyMiddleware("/api/V1", {
            // target:   // https://nis.chint.com/ (正式)   // http://10.5.7.60:4155（测试） 
            //target: 'https://nis.chint.com/',
            target: 'https://nis.chint.com/',
            changeOrigin: true,
            ws: true,
            pathRewrite: {
                "^/api": ''
            }
        })
    )
}