import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import { selectProjectId } from '@redux/systemconfig.js'
import Titlelayout from '@com/titlelayout';
 
import moment from 'moment';
import fuhe from '../fuhe.svg'
import { HomeRuntime } from '@api/api.js'
import { message } from 'antd';
 
const fs = {
  hv: '24px',
  fc: '#333',
  shadow: "y"
}

 


export default function DefaultHome(props){
  const projectId = useSelector(selectProjectId)

  const [total, setTotal] = useState(0)

 
  useEffect(() => {

    
    HomeRuntime.GetTransformerLoad(projectId).then(res => {
        let { success, data } = res
        if (success) {
           setTotal(data)
        } else {
          message.error(res.errMsg)
        }
      }).catch(e => {
        console.log(e);
      })
   
    
  }, [])
  
  return (
         <Titlelayout title={'变压器总负荷'} {...fs} style={{height: '200px'}} layout="flex">
         <div  style={{flex:1, display: 'flex'}}>
               <div style={{display: "flex", flex: 1, alignItems: "center", justifyContent: "space-between", padding: "0 32px"}}>
                  <img src={fuhe} width={48} height={44} />
                  <div style={{display: "flex", flexDirection: "column", }}>
                    <span style={{color: "#333"}}>实时总负荷</span>
                    <p style={{marginTop: "16px"}}><span style={{fontSize: "24px",color: "#515151"}}>{total}</span><span sytle={{paddingLeft: "64px"}}>kw</span></p>
                  </div>
               </div>
         </div>
         </Titlelayout>
  )
}
