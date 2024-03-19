const { createProxyMiddleware } = require("http-proxy-middleware")

module.exports = function(app) {
    app.use( 
        createProxyMiddleware("/api/V1", {
            // target: 'http://10.5.7.60:4155',   // https://dmm.chint.com/ (正式)   // http://10.5.7.60:4155（测试）
<<<<<<< HEAD
            target: 'http://10.5.7.60:4155', // 王建 http://10.5.25.19:4155/
=======
           target: 'http://10.5.7.60:4155', // 王建 http://10.5.25.19:4155/
>>>>>>> ac139faa3919d2cb43c9d28b984153ff4dbfa958
            changeOrigin : true,
            ws: true,
            pathRewrite: {
                "^/api": ''
            }
        })
    )
}