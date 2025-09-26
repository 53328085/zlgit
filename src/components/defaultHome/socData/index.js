import React, {useRef, useEffect, useMemo} from 'react'
import {useSelector} from 'react-redux'
import { selectProjectId, themeColor } from '@redux/systemconfig.js'
import {TitlelayoutOv as Titlelayout} from '@com/titlelayout';
 
import Ichart from '@com/useEcharts/Ichart';
import {hextodec} from "@com/usehandler"
import { useReactive } from 'ahooks';
import { HomeRuntime } from '@api/api.js'
import { message } from 'antd';
import {useTranslation} from 'react-i18next'
import { use } from 'react';
const fs = {
 // hv: '24px',
  fc: '#333',
  shadow: "y"
}



export default function DefaultHome(props){
  const projectId = useSelector(selectProjectId)
  const {primaryColor} = useSelector(themeColor)
  const {t} = useTranslation("overview")
  const { GetSiteSoc } = HomeRuntime
  
 

  const state = useReactive({
    socData: 0.56
  })
    const rgb = hextodec(primaryColor);
  
    const option = useMemo(() => {
      return  {
        type: 4,
        
        liuqiu: {
          series: {
           data: [state?.socData],
           waveLength: "89%",
           backgroundStyle: {
            borderWidth: 2,
            borderColor: primaryColor,
            color: rgb?.length==3 ? `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]},0.15)` : "#fff"
           },
           color: [primaryColor],
           outline: {
              show:false
           },
          label: {
            normal: {
         formatter: function() {
                  return `SOC\n {a|${(state.socData*100)?.toFixed(2)}%}`;
              },  
              textStyle: {
                  fontSize: 16,
                  color: '#333'
              },
              position: ['50%', '65%'],
              rich: {
                a: {
                  lineHeight: 22,
                  fontSize: "small",
                  fontWeight: "bold"
                }
              }
           }
          },
          
        },
       
      }}}
     , [state?.socData,primaryColor,rgb])
  useEffect(()=>{
    if (props.type == 'runtTime') {
      GetSiteSoc(projectId).then(res => {
        let {success, data} = res
          if(success){
            if(data){
              state.socData = data
             
            }
          }else{
            message.error(res.errMsg)
          }
      })
    } else {
      
    }
  },[primaryColor])

  
  return (
    <Titlelayout title={t("sitesoc")} {...fs} style={{height: '100%'}}>
        <div style={{  minHeight: '200px',height: "100%", display: "flex"}}>
        <div style={{flex:1}} >
          <Ichart {...option} />
        </div> 
          </div>
    </Titlelayout>
  )
}
