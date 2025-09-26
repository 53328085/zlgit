import React, {  useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import { selectProjectId } from '@redux/systemconfig.js'
import styled from 'styled-components';
import {useTranslation} from 'react-i18next'
import { useReactive } from 'ahooks';
import { HomeRuntime } from '@api/api.js'
import { message } from 'antd';
import Ichart  from '@com/useEcharts/Ichart';
const Mainbox = styled.div`
  
  width:100%;
  min-height: 200px;
  height: 100%;
  padding: 16px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.349019607843137);
  display: flex;
  flex-direction: column;
  .headerTitle{
    padding-left: 16px;
    border-left: 4px solid ${props => props.theme.primaryColor};
    height: 24px;
    line-height: 24px;
    font-size: 14px;
    color: #333;
  }
`
export default function DefaultHome(props){
  const projectId = useSelector(selectProjectId)

  const { GetStorageProfitTrends } = HomeRuntime
 
  const {t} = useTranslation(['comm','overview'])
  const state = useReactive({
    x: ['03/15', '03/16', '03/17', '03/18', '03/19', '03/20', '03/21'],
    y: ['523.23', '418.58', '306.98', '489.32', '874.59', '742.63', '684.25'],
    y1: ['685.25', '514.23', '451.36', '598.32', '957.32', '845.36', '874.39'], 
    y2:['162.02', '95.65', '144.38', '109', '82.73', '102.73', '190.14']

  })
  
  
  const [options, setOptions] = useState({
    series: [{ type: "bar",  seriesLayoutBy: 'row' }, { type: "bar",  seriesLayoutBy: 'row' }, { type: "line",  seriesLayoutBy: 'row' }],  
    grid: {
      top: '28px',
      left: '6px',
      right: '6px',
      bottom: '0px',
      containLabel: true
    },
    legend: {
      top: '0px',
      left: 'center',
      data:[
        {
          name:  t("overview:ChargeAmount"),
          icon: 'rect'
        },
        {
          name: t("overview:DischargeAmount"),
          icon: "rect"
        },
        {
          name: t("overview:earnings"),
          icon: 'diamond',
        }
      ]
    },
    color:['#5fba5c', '#4d77ff', '#9951fe'],
    dataset: {}
  })




  useEffect(()=>{
   
      GetStorageProfitTrends(projectId).then(res => {
        let {success, data} = res
          if(success){
            if(data.constructor == Object){
               let {x, y, y1, y2} = data
               let dataset = {
                dimensions: [
                  {name:  t("comm:date"), type: 'time'},
                  {name:  t("overview:ChargeAmount") },
                  {name: t("overview:DischargeAmount") },
                  {name: t("overview:earnings") },
                ],
                source: [
                  x, 
                  y,
                  y1,
                  y2,
                ],
               sourceHeader: false,
              }
            
              setOptions({...options, dataset})
            }
          }else{
            message.error(res.errMsg)
          }
      }).catch()
    
  },[])

  return (
         <Mainbox>
            <div className='headerTitle'>{t("overview:EnergyStorageRevenueStatistics")}</div>
            <div style={{flex:1, display: 'flex'}} id='barChart'  >
            <Ichart {...options} />

            </div>
         </Mainbox>
           
  )
}
