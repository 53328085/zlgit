const { createProxyMiddleware } = require("http-proxy-middleware")

module.exports = function (app) {
    app.use(
        createProxyMiddleware("/api/V1", {
            // target: 'https://nis.chint.com/',
            // target: 'http://10.5.7.60:4186', //()
            target: 'http://10.5.7.60:4155',
            // target: 'http://10.5.7.60:4155', 4170;
           // target: 'http://10.5.7.60:4155',//(程工)
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
