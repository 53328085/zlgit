import React, {useRef, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {selectCurProject} from '@redux/user.js'
import Titlelayout from '@com/titlelayout';
import {drawEcharts} from '@com/useEcharts'
import {CustTransO} from "@com/useButton"
const fs = {
  hv: '24px',
  fc: '#333',
  shadow: "y"
}

const option = (name, color, type="line") =>  ({
  xAxis: {   
    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月','9月','10月','11月','12月']
  },
  series: [
    {
      data: [150, 230, 224, 218, 135, 147, 460, 224, 218, 135, 147, 460],
      type,
      name 
    }
  ],
  grid:{
    // 图表 grid
    left: "0px",
    right: "0",
    top: "30px",
    bottom: "0px",
    containLabel: true,
  },
  color 
});

const tdrawEcharts = (c, option) => {
  return drawEcharts(c, {...option, type:2 })
}


export default function DefaultHome(){
  const curProject = useSelector(selectCurProject)
  const cref = useRef(null)
  useEffect(() => {
    tdrawEcharts(cref.current, option(<CustTransO text="CarbonEmissions"/>, ["#5e92f9"], 'bar'))
  }, [])
  
  return (
    <Titlelayout title={<CustTransO text="CarbonEmissions"/>} {...fs} style={{height: "200px"}} layout="flex">
        <div ref={cref} style={{flex:1}}></div>
    </Titlelayout>
  )
}
