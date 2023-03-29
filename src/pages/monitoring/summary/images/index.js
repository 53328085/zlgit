const path = require('path')
const imgurl ={}
let files = require.context('./', true, /\.jpg$/)
files.keys().forEach(filep => {   
    let filename = path.basename(filep, '.jpg')
    let file = require(filep +'')
    Object.assign(imgurl, {[filename]: file})
});
 export default imgurl