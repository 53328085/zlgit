import React, {useEffect, useRef} from 'react'
import {drawEcharts} from './index'
import Cempty from '@com/useEmpty'
export default function Ichart(props={}) {
  const ref = useRef()
  let {dataset={}, type=2, pieData, custoption} = props
  let typechart = custoption?.type || type
  useEffect(() => {
    if(typechart == 2 && dataset?.source?.length > 0) {
     
        drawEcharts(ref.current, {...props})
    }
    if(typechart == 3 && pieData?.data?.length > 0) {
      drawEcharts(ref.current, {...props})
    }
    if(typechart == 5 && custoption?.series[0]?.data.length > 0) {
        console.log(5)
        drawEcharts(ref.current, {...props})
    }
  }, [props])
  if(typechart == 2) {
    if(!Array.isArray(dataset.source) || (Array.isArray(dataset.source) && dataset.source?.length ===0)) {
      return <Cempty />
    }
  }
  if(typechart == 3) {
    if(!Array.isArray(pieData.data) || (Array.isArray(pieData.data) && pieData.data?.length ===0)) {
      return <Cempty />
    }
  }
  if(typechart==5) {
    console.log(custoption?.series)
    if(!Array.isArray(custoption?.series) || (Array.isArray(custoption?.series[0].data) && custoption?.series[0].data.length ===0)) {
      return <Cempty />
    }
  }
  return (
     <div style={{flex:1, height: "100%"}}  ref={ref}>
      
    </div>
  )
}
