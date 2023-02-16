import React, {useRef, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {selectCurProject} from '@redux/user.js'
import Titlelayout from '@com/titlelayout';
import {drawEcharts} from '@com/useEcharts'

const fs = {
  hv: '24px',
  fc: '#333'
}

const datasetMonth = {
  dimensions: ["time", "2020", "2019"],
  source: [
    { time: "1月", "2020": 5600, "2019": 9600 },
    { time: "2月", "2020": 4600, "2019": 3644 },
    { time: "3月", "2020": 3600, "2019": 4644 },
    { time: "4月", "2020": 5611, "2019": 9655 },
    { time: "5月", "2020": 5644, "2019": 3677 },
    { time: "6月", "2020": 4677, "2019": 3633 },
    { time: "7月", "2020": 3688, "2019": 4655 },
    { time: "8月", "2020": 5088, "2019": 2644 },
    { time: "9月", "2020": 6677, "2019": 2641 },
    { time: "10月", "2020": 5866, "2019": 5641 },
    { time: "11月", "2020": 4677, "2019": 7645 },
    { time: "12月", "2020": 1877, "2019": 2645 },
  ],
};


export default function DefaultHome(){
  const curProject = useSelector(selectCurProject)

  const mref = useRef(null)
  useEffect(() => {
    drawEcharts(mref.current, {dataset: datasetMonth, series: [{ type: "bar" }, { type: "bar" }],  grid:{
      // 图表 grid
      left: "0px",
      right: "0",
      top: "30px",
      bottom: "0px",
      containLabel: true,
    }, })
  }, [])
  
  return (
         <Titlelayout title={'月度能耗趋势'} {...fs}>
         <div ref={mref} style={{width: '422px', height: '358px'}}>
         </div>
         </Titlelayout>
  )
}
