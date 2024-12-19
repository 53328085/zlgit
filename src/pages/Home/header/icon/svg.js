const path = require('path')
const imgurl ={}
let files = require.context('./', true, /\.svg$/)
files.keys().forEach(filep => {   
    let filename = path.basename(filep, '.svg')
    let file = require(filep +'')
    Object.assign(imgurl, {[filename]: file})
});
 export default imgurl