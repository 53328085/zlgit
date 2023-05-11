import React, {useEffect, useState} from 'react'
import styled from 'styled-components';
const Ccanvas = styled.canvas`
 && {
  border: 1px solid #dedede;

 }
`
export default function Index() {
  const [info, setInfo] = useState('')
   
  useEffect(() => {
    var canvas = document.querySelector("#canvas")
    if(canvas.getContext) {
      var ctx = canvas.getContext('2d');
      let liner = ctx.createLinearGradient(0,0,0,150)
      liner.addColorStop(0, "#bae0ff");
      liner.addColorStop(1, "#");
      ctx.fillStyle = liner;
      ctx.fillRect(0,0,150,150)
    }else {
       setInfo('浏览器不支持canvas,请安装新版浏览器')
    }
  })
  return (
    <div>
       <canvas id="canvas" width="150" height="150">{info}</canvas>
    </div>
  )
}
