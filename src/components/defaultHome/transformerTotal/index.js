import React, {useEffect, useState, useContext} from 'react'
import {useSelector} from 'react-redux'
import { selectProjectId } from '@redux/systemconfig.js'
import {TitlelayoutOv as Titlelayout} from '@com/titlelayout';
 
import {useTranslation} from 'react-i18next'
import fuhe from '../fuhe.svg'
import { HomeRuntime } from '@api/api.js'
import { message } from 'antd';
import Context from "@com/content"
const fs = {
 // hv: '24px',
  fc: '#333',
  shadow: "y"
}

 


export default function DefaultHome(props){
  const projectId = useSelector(selectProjectId)
  const {t} = useTranslation("overview")
  const [total, setTotal] = useState(0)
  const {laptop} =useContext(Context)
 
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
         <Titlelayout title={t("TotalTransformerLoad")} {...fs} style={{minHeight: '200px', height: "100%"}} layout="flex">
         <div  style={{flex:1, display: 'flex'}}>
               <div style={{display: "flex", flex: 1, alignItems: "center", justifyContent: "space-between", padding: laptop ? "0 8px" : "0 32px"}}>
                  <img src={fuhe} width={64} height={64} />
                  <div style={{display: "flex", flexDirection: "column", }}>
                    <span style={{color: "#333"}}>{t("Realtimetotalload")}</span>
                    <p style={{marginTop: "16px"}}>
                      <span style={{fontSize: "24px",color: "#515151"}}>{total}</span>
                      <span style={{paddingLeft: "32px", color:"#999", display: "inline-block"}}>kw</span>
                      </p>
                  </div>
               </div>
         </div>
         </Titlelayout>
  )
}
