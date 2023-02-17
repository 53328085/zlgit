const { createProxyMiddleware } = require("http-proxy-middleware")

module.exports = function(app) {
    app.use( 
        createProxyMiddleware("/api/V1", {
            target: 'http://10.5.7.62:4155',   // 王建 10.5.23.234:4155 , 测试环境
           // target: 'http://10.5.23.234:4155',
            changeOrigin : true,
            ws: true,
            pathRewrite: {
                "^/api": ''
            }
        })
    )
}