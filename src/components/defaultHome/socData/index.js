import React, {useRef, useEffect} from 'react'
import {useSelector} from 'react-redux'
import { selectProjectId } from '@redux/systemconfig.js'
import Titlelayout from '@com/titlelayout';
import {Liquid} from "@ant-design/charts"
import { useReactive } from 'ahooks';
import { HomeRuntime } from '@api/api.js'
import { message } from 'antd';
import {useTranslation} from 'react-i18next'
const fs = {
  hv: '24px',
  fc: '#333',
  shadow: "y"
}



export default function DefaultHome(props){
  const projectId = useSelector(selectProjectId)
  const {t} = useTranslation("overview")
  const { GetSiteSoc } = HomeRuntime

  const DemoLiquid = (props) => {
    const config = {
      percent: props.data,
      outline: {
        border: 2,
        distance: 2,
      },
      wave: {
        length: 128,
      },
    
        statistic: {
          title: {
            formatter: () => 'SOC',
            style: {
              fontSize: 32,
              color: '#515151',
              
            }
          },
          
          content: {
            style: {
              fontSize: 32,
              color: '#515151'
            },
            customHtml: () => {
              return <span>{ (props.data * 100).toFixed(2)}%</span>
            }
          }
        }
     
    };
    return <Liquid {...config} />;
  };

  const state = useReactive({
    socData: 0.56
  })

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
  },[])

  
  return (
    <Titlelayout title={t("sitesoc")} {...fs}>
        <div style={{width: '424px', height: '338px', marginTop: 20}}>
              <DemoLiquid data={Number(state.socData)}></DemoLiquid>
              
          </div>
    </Titlelayout>
  )
}
