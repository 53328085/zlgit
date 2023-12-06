const { createProxyMiddleware } = require("http-proxy-middleware")

module.exports = function(app) {
    app.use( 
        createProxyMiddleware("/api/V1", {
            // target: ' http://10.5.7.60:4155',   // https://dmm.chint.com/ (正式)   // http://10.5.7.60:4155（测试）
           target: 'https://dmm.chint.com/', // 王建  
            changeOrigin : true,
            ws: true,
            pathRewrite: {
                "^/api": ''
            }
        })
    )
}