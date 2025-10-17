const path = require('path')
const imgurl ={}
let files = require.context('./', true, /\.png$/)
files.keys().forEach(filep => {
    const ext = path.extname(filep);
    let filename = path.basename(filep, ext)
    let file = require(filep +'')
    Object.assign(imgurl, {[filename]: file})
});
 export default imgurl