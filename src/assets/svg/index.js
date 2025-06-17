import React from 'react'
const path = require('path')
const svgurl ={}
let files = require.context('./', true, /\.svg$/)
files.keys().forEach(filep => {   
    let filename = path.basename(filep, '.svg')
    let file = require(filep +'')
    Object.assign(svgurl, {[filename]: file})
});

export default svgurl
export {ReactComponent as LightSize} from './light.svg'

