const { createProxyMiddleware } = require("http-proxy-middleware")

module.exports = function (app) {
    app.use(
        createProxyMiddleware("/api/V1", {
            // target: 'https://nis.chint.com/',
           
            target: 'http://localhost:8081',
            changeOrigin: true,
            ws: true,
            pathRewrite: {
                "^/api": ''
            }
        })
    )
    /*    app.use(
            createProxyMiddleware("/auth", { 
                target: ' http://localhost:3006',            
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    "^/auth": ''
                }
            })
        )  */
}
