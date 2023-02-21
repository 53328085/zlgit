const { createProxyMiddleware } = require("http-proxy-middleware")

module.exports = function(app) {
    app.use( 
        createProxyMiddleware("/api/V1", {
<<<<<<< HEAD
            target: 'http://10.5.7.62:4155',   // 王建 10.5.23.234:4155
        //    target: 'http://10.5.23.46:4155',
=======
            target: 'http://10.5.7.62:4155',   // 王建 10.5.23.234:4155 , 测试环境
           // target: 'http://10.5.23.234:4155',
>>>>>>> 9e5a96d7d88b785f28e0650723472a1b3ce63e1e
            changeOrigin : true,
            ws: true,
            pathRewrite: {
                "^/api": ''
            }
        })
    )
}