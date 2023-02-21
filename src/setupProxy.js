const { createProxyMiddleware } = require("http-proxy-middleware")

module.exports = function(app) {
    app.use( 
        createProxyMiddleware("/api/V1", {
            target: 'http://10.5.7.62:4155',   // 王建 10.5.23.234:4155
        //    target: 'http://10.5.23.46:4155',
            changeOrigin : true,
            ws: true,
            pathRewrite: {
                "^/api": ''
            }
        })
    )
}