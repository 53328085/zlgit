import React, {  useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import { selectProjectId, iszhCN } from '@redux/systemconfig.js'
import Titlelayout from '@com/titlelayout';
 
import { HomeRuntime } from '@api/api.js'
import { message } from 'antd';
 
import {useTranslation} from 'react-i18next'
import Ichart  from '@com/useEcharts/Ichart';
 
const fs = {
//  hv: '24px',
  fc: '#333',
  shadow: "y"
}


export default function DefaultHome(props){
  const projectId = useSelector(selectProjectId)
 
  const {t} = useTranslation(["overview","comm"])
  const iszh = useSelector(iszhCN)
 
  const [option, setOption] = useState({
    series: [{type: "line", seriesLayoutBy: 'row'}],
    grid:{
      // 图表 grid
      left: "0px",
      right: "0px",
      top: "30px",
      bottom: "0px",
      containLabel: true,
    },
    legend: {
      top: "5px"
    },
    color:["#099c9c"],
    dataset: {
      dimensions:  [],
      source:  []
    } 
  });
 
 

  const { GetUseETrends_Water } = HomeRuntime

  useEffect(() => {
    if (props.type == 'runtTime') {
      GetUseETrends_Water(projectId).then(res => {
        let {success, data} = res
          if(success && data){
            console.log(111)
            let {x=[], y=[]} = data

            let dataset = {
              dimensions: [
                {name: t("comm:month")},
                {name: t("overview:WaterConsumption")},
              ],
              source: [
                x, 
                y,
              ],
             sourceHeader: false,
            }


            setOption({
              ...option,
               dataset,
              })
          }else{
            console.log(res.errMsg)
           // message.error(res.errMsg)
          }
      }).catch(e => {
        alert(e)
        console.log(e)
      })
    }else{
       
    }
    
  }, [iszh])
  
  return (
         <Titlelayout title={t("overview:WaterConsumption")} {...fs} style={{height: "200px"}} layout="flex">
          <div  style={{flex: 1, display: 'flex'}}>
           <Ichart  {...option}/>
           </div>
       
         </Titlelayout>
  )
}
