import React, {useEffect, useRef} from 'react'
import {drawEcharts} from './index'
import Cempty from '@com/useEmpty'
export default function Ichart(props={}) {
  const ref = useRef()
  let {dataset={}, type=2, pieData} = props

  useEffect(() => {
    if(type == 2 && dataset?.source?.length > 0) {
      console.log(props)
        drawEcharts(ref.current, {...props})
    }
    if(type == 3 && pieData?.data?.length > 0) {
      drawEcharts(ref.current, {...props})
    }
  }, [props])
  if(type == 2) {
    if(!Array.isArray(dataset.source) || (Array.isArray(dataset.source) && dataset.source?.length ===0)) {
      return <Cempty />
    }
  }
  if(type == 3) {
    if(!Array.isArray(pieData.data) || (Array.isArray(pieData.data) && pieData.data?.length ===0)) {
      return <Cempty />
    }
  }
  return (
     <div style={{flex: 1}}  ref={ref}>

    </div>
  )
}
