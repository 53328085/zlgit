import React from 'react'
import {useOutletContext} from "react-router-dom"
export default function QuotaAlarms() {
  const {setCustview} =useOutletContext()
  const toDetail=()=>{window.open('/detailIndicators','_blank')}
  return (
    <div onClick={toDetail}>
      定额告警
    </div>
  )
}
