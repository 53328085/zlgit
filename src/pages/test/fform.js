import React, {useEffect, useState} from 'react'
import styled from 'styled-components';
const Ccanvas = styled.canvas`
 && {
  border: 1px solid #dedede;

 }
`
export default function Index() {
  const [info, setInfo] = useState('')
  const draw = (ctx) => {
        ctx.fillStyle = "rgb(200,0,0)";
        ctx.fillRect (10, 10, 55, 50);

        ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
        ctx.fillRect (30, 30, 55, 50);
  }
  useEffect(() => {
    var canvas = document.querySelector("#canvas")
    var ctx = canvas.getContext('2d');
    if(canvas.getContext) {
      var ctx = canvas.getContext('2d');
      draw(ctx);
    }else {
       setInfo('浏览器不支持canvas,请安装新版浏览器')
    }
  })
  return (
    <div>
       <Ccanvas id="canvas" width="150" height="150">{info}</Ccanvas>
    </div>
  )
}
