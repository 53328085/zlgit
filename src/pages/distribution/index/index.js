import React, {useState, useEffect} from 'react'
import moment from 'moment'
import {Layout} from 'antd'
import {Outlet, useSearchParams, useLocation} from 'react-router-dom'
import Comhead from '../usehead/com'
 
import { useDispatch, useSelector} from "react-redux";
 

import {  getOnelevel,  selectOneLevel, setCurrentlevel, getcurlRommid} from "@redux/systemconfig.js";
export default function Index() {
   const location = useLocation()
 
   
   const dispatch = useDispatch();
   const [custview, setCustview] = useState(undefined);
   const {state} = location || {}
   const onelevels = useSelector(selectOneLevel)
   let {nested = '', primary, lineName} = state || {};
   //let show = nested !== 'report'
 console.log('lineName', lineName)
 const [inpage, setInpage] = useState(['report', 'room'])
 const showroute = {
  designerDistribution: ["line"]
 }
 const [dateval, setDateVal] = useState(moment())
 const [showRoom, setShowroom] = useState(true) // 是否显示配电房选择框
 const [showArea, setShowarea] = useState(true)
 let show = !inpage.includes(nested) || showroute[primary]?.includes(nested)
 let style = show ? {
  flex: 1, display: "grid", gridTemplateRows: "48px 1fr", rowGap: "16px", position:"relative"
 }: {
  display: 'flex',
  flex: 1,
 }
 const context ={
   setInpage,
   setShowroom,
   dateval,
   setCustview,
 }
 const props = {
  showRoom,
  showArea,
  setDateVal,
  custview,
 }
 const sethandler = () => {
  if(primary == 'designerDistribution' && nested == 'room') {
    setShowroom(false)
    let level = onelevels.filter((l) => l.id != 0);
    dispatch(getOnelevel([...level]));
    dispatch(setCurrentlevel(level[0] || []))
   }else if(primary == 'ledger' && nested == 'deviceLedger') {
    setShowroom(false)
    let level = onelevels.filter((l) => l.id != 0);
    dispatch(getOnelevel([...level]));
    dispatch(setCurrentlevel(level[0] || []))
   }else if(primary == 'runtimeDistribution' && nested == 'statements' && lineName) {
     console.log("~~~~~~~~~~~~", lineName)
    setShowroom(false)
    setShowarea(false)
   }
   else {
    setShowarea(true)
    setShowroom(true)
   } 
}
  useEffect(() => {
    sethandler()
   
}, [nested, primary])
 useEffect(() => {
  return () => {
    dispatch(getcurlRommid(null))
  }
 }, [])
 const {Content } = Layout;   
    return (  
      <Content className='page--main'>
        <div style={style}>
         { show && <Comhead  {...props} /> }
           <Outlet context={context} />
        </div>
       </Content>
    )
  
}
