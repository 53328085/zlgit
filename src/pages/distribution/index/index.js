import React, {useState, useEffect} from 'react'
import moment from 'moment'
import {Layout} from 'antd'
import {Outlet} from 'react-router-dom'
import Comhead from '../usehead/com'
import {useLocation} from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import {  getOnelevel,  selectOneLevel, setCurrentlevel, getcurlRommid} from "@redux/systemconfig.js";
export default function Index() {
   const location = useLocation()
   const dispatch = useDispatch();
   let {state={}} = location
   const onelevels = useSelector(selectOneLevel)
   let {nested = '', primary} = state;
   //let show = nested !== 'report'

 const [inpage, setInpage] = useState(['report', 'room'])
 const showroute = {
  designerDistribution: ["line"]
 }
 const [dateval, setDateVal] = useState(moment())
 const [showRoom, setShowroom] = useState(true) // 是否显示配电房选择框
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
   dateval
   
 }
 const sethandler = () => {
  if(primary == 'designerDistribution' && nested == 'room') {
    setShowroom(false)
    let level = onelevels.filter((l) => l.id != 0);
    dispatch(getOnelevel([...level]));
    dispatch(setCurrentlevel(level[0] || []))
   }else {
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
         { show && <Comhead showRoom={showRoom} setDateVal={setDateVal} /> }
           <Outlet context={context} />
        </div>
       </Content>
    )
  
}
