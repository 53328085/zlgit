import React , {useEffect, useState} from 'react'
import {nanoid} from '@reduxjs/toolkit'
import {useOutletContext} from 'react-router-dom'
import styled from 'styled-components'
import Pagecount from '@com/pagecontent' 
import CustContext from '@com/content.js'
 
import {useSelector,  } from 'react-redux'
import { selectcurlRommid , selectProjectId} from "@redux/systemconfig";
import Wtjc from './wtjc'
import Xbpp from './xbpp'
import Wtqx from './wtqx'
export default function Index() {
  const {exparams} = useOutletContext()
  const {sn, dateval} = exparams || {}
  const projectId = useSelector(selectProjectId)  
  const roomId = useSelector(selectcurlRommid)
  const [value, setvalue] = useState('0')
  const propsdata ={
     sn, 
     projectId,
     day:dateval
  }
  const tabs = [
    { key: '0', label: '稳态检测' },
    { key: '1', label: '谐波频谱' },
    { key: '2', label: '稳态曲线' },
    { key: '3', label: '谐波曲线' },
    { key: '4', label: '负荷曲线' },
    { key: '5', label: '暂态分析' },
    { key: '6', label: 'SOE事件' },
    { key: '7', label: '电能质量分析' },
    { key: '8', label: '电能质量治理' },
  ]
  const Com = {
    0: Wtjc,
    1: Xbpp,
    2: Wtqx
  }[value]


  const dataProps = {
    value,
    setvalue,
    tabs,
  }
  return (
    <CustContext.Provider value={dataProps} >
    <Pagecount>
      <Com  {...propsdata}/>
    </Pagecount>
    </CustContext.Provider>
  )
}
