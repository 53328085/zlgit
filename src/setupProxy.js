const { createProxyMiddleware } = require("http-proxy-middleware")

module.exports = function(app) {
    app.use( 
        createProxyMiddleware("/api/V1", {
            // target: 'http://10.5.7.60:4155',   // https://dmm.chint.com/ (正式)   // http://10.5.7.85:4155/（测试）
           target: 'http://10.5.7.60:4141', // 王建 http://10.5.25.19:4155/
            changeOrigin : true,
            ws: true,
            pathRewrite: {
                "^/api": ''
            }
        })
    )
}