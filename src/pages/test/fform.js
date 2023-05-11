import React, {useEffect, useState} from 'react'
import styled from 'styled-components';
import log from './log.png'
const Ccanvas = styled.canvas`
 && {
  border: 1px solid #d7d7d7;

 }
`
export default function Index() {
  const [info, setInfo] = useState('')
   
  useEffect(() => {
    var canvas = document.querySelector("#canvas")
    if(canvas.getContext) {
      var ctx = canvas.getContext('2d');
      let img = new Image()
      img.src=log
     /*  img.onload = () => {
        console.log(2222)
        try {
          var ptrn = ctx.createPattern(img, 'repeat');
          ctx.fillStyle = ptrn;
          ctx.fillRect(10, 10, 160, 160);
        } catch (error) {
          console.log(error)
        }
       
      } */
      ctx.shadowOffsetX = 4;
      ctx.shadowOffsetY = 4;
      ctx.shadowBlur = 2;
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    
      ctx.beginPath();
      ctx.arc(50, 50, 30, 0, Math.PI*2, true);
      ctx.arc(50, 50, 15, 0, Math.PI*2, true);
      ctx.fill("evenodd");
      ctx.font="50px serif";
      ctx.textAlign = "left"
      ctx.strokeText("正泰物联", 100, 65)
      
    }else {
       setInfo('浏览器不支持canvas,请安装新版浏览器')
    }
  })
  return (
    <div>
       <canvas id="canvas" width="550" height="550" style={{border: '1px solid #d7d7d7'}}>{info}</canvas>
    </div>
  )
}
