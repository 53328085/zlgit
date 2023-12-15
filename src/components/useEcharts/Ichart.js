import React, {useEffect, useRef} from 'react'
import {drawEcharts} from './index'
import Cempty from '@com/useEmpty'
export default function Ichart(props={}) {
  const ref = useRef()
  let {dataset={}} = props
 
  useEffect(() => {
    if( dataset?.source?.length > 0) {
        drawEcharts(ref.current, {...props})
    }
     
  }, [props])
  if(!Array.isArray(dataset.source) || (Array.isArray(dataset.source) && dataset.source?.length ===0)) {
    return <Cempty />
  }
  return (
     <div style={{flex: 1}} ref={ref}>

    </div>
  )
}
