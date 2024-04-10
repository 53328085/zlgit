import React, {useEffect, useState} from 'react'
 
import {  Space } from 'antd';
import {useOutletContext} from 'react-router-dom'
import OtherPage from './otherPage'
import MainPage from './mainPage'
import {useSelector} from 'react-redux'
import {selectProjectId, selectOneLevel, levelDefaultLabel} from '@redux/systemconfig.js'
import Pagecount from '@com/pagecontent'
import {CustButton} from '@com/useButton'
export default function Index() {
  let {exparams, setCustview} = useOutletContext() 
  let {areaId} = exparams;
 
  const [display, setDisplay] = useState(true);
 
  //const projectId = useSelector(selectProjectId);
  const areaList = useSelector(selectOneLevel)
  const areaName = areaList.find(a => a.id == areaId)?.name??''
 
 
  const goBack = () => {
    setDisplay(true)
  }
 
 const CustView =( <Space> {  display ? null : <CustButton onClick={goBack}>返回</CustButton> }</Space> )

 

 useEffect(() => {
  setCustview(CustView);
  return () => {
    setCustview(undefined)
  }
 }, [display])
  return (
    <Pagecount>  
     {display ? <OtherPage sendToIndex={setDisplay} areaId={areaId} areaName={areaName}></OtherPage>:<MainPage  areaId={areaId} areaName={areaName}></MainPage>} 
    </Pagecount>
  )
}