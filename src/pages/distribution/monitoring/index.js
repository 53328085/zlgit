import React, { useState, useRef ,useMemo, useEffect } from 'react'
import { Select ,Space,Divider,DatePicker,Radio, Button, message } from 'antd'
import styled from 'styled-components'
import {useSelector,  } from 'react-redux'
import { selectcurlRommid } from "@redux/systemconfig";
import {useOutletContext} from 'react-router-dom'
import Pagecount from '@com/pagecontent'
import CustContext from '@com/content.js'
 
 
import {DistributionRoomRuntime } from '@api/api.js'
import  imgurl from '@imgs'
import moment from 'moment'
import CEmpty from '@com/useEmpty.js'
import Transform from './transData.js'
import Chartbox from './chartbox.js'
const Mainbox=styled.div`
&&{
  background-color: #fff;
flex: 1;
 padding: 16px;
display: flex;
 flex-direction: column;
row-gap: 16px;
.upbox {
   
  padding-bottom: 16px;
  border-bottom: 1px dotted #d7d7d7;
}
}
`

 
 
export default function Index() {
  const projectId = useSelector(state => state.system.menus.projectId)  
 
  const roomId = useSelector(selectcurlRommid)
 
  const [tabs,setTabs] =useState([])
  const {deviceStyle} = useOutletContext()

   const {label:deviceName, value:deviceVal} = deviceStyle
  const [value, setvalue] =useState(0)

  const device = tabs?.[value]
  const transprop ={
     device,
     projectId
  }

  // 获取配电房设备列表
  
 
   
 
  const dataprop={
    tabs,
  //  setTabs,
    value,
    setvalue,
    initialval: tabs?.[0]?.key
  }


  const getDeviceList =async() => {
    try {
      let body ={
        projectId,
        roomId,
        deviceStyle:deviceVal
      }
      let {success, data} = await   DistributionRoomRuntime.DeviceList(body)
      if(success && Array.isArray(data) && data?.length >0) {
        const items = data.map((it,i)=>({
            key:i,
            label:it.name,
            ...it,
          }))
        setTabs(items)
        
      }else {
        setTabs([])
      
      
      }
    } catch (error) {
       
    }
   
  }
 
 
  useEffect(() => {
    if([projectId, roomId, deviceVal].every(n => Number.isInteger(parseInt(n)))) {
       getDeviceList() 
    }

  }, [projectId, roomId, deviceVal])

 

  
  return (
    <>
 
        {
          tabs.length>0?(
            <CustContext.Provider value={dataprop}>
            <Pagecount pd="0"> 
            <Mainbox>
               <div className='upbox'>
                   <Transform  {...transprop} />
               </div>
               <Chartbox {...transprop}  />
            </Mainbox>
         </Pagecount>
         </CustContext.Provider>
          ):
           <CEmpty bgcolor="#fff" tip={deviceName+'暂无数据'} />
        
        }
   
    </>
    
  )
}