const path = require('path')
const imgurl ={}
let files = require.context('./', true, /\.png$/)
files.keys().forEach(filep => {   
    let filename = path.basename(filep, '.png')
    let file = require(filep +'')
    Object.assign(imgurl, {[filename]: file})
});
 export default imgurl
 export {ReactComponent as E01}   from './e01.svg'
 export {ReactComponent as E02}   from './e02.svg'
export {ReactComponent as E03}   from './e03.svg'