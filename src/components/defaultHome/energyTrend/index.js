import React, {useRef, useEffect} from 'react'
import {useSelector} from 'react-redux'
import { selectProjectId } from '@redux/systemconfig.js'
import Titlelayout from '@com/titlelayout';
import {drawEcharts} from '@com/useEcharts'
import { useReactive } from 'ahooks';
import { HomeRuntime } from '@api/api.js'
import { message } from 'antd';

const fs = {
  hv: '24px',
  fc: '#333'
}

const datasetMonth = {
  dimensions: ["time", "2020", "2019"],
  source: [
    { time: "1月", "2020": 5600, "2019": 9600 },
    { time: "2月", "2020": 4600, "2019": 3644 },
    { time: "3月", "2020": 3600, "2019": 4644 },
    { time: "4月", "2020": 5611, "2019": 9655 },
    { time: "5月", "2020": 5644, "2019": 3677 },
    { time: "6月", "2020": 4677, "2019": 3633 },
    { time: "7月", "2020": 3688, "2019": 4655 },
    { time: "8月", "2020": 5088, "2019": 2644 },
    { time: "9月", "2020": 6677, "2019": 2641 },
    { time: "10月", "2020": 5866, "2019": 5641 },
    { time: "11月", "2020": 4677, "2019": 7645 },
    { time: "12月", "2020": 1877, "2019": 2645 },
  ],
};


export default function DefaultHome(props){
  const projectId = useSelector(selectProjectId)

  const { GetMonthEnergyTrends } = HomeRuntime

  const drawBar = (dataSet) => {
    drawEcharts(mref.current, {dataset: dataSet, series: [{ type: "bar" }, { type: "bar" }],  grid:{
      // 图表 grid
      left: "0px",
      right: "0",
      top: "30px",
      bottom: "0px",
      containLabel: true,
    }, })
  }

  const mref = useRef(null)
  useEffect(() => {

    if (props.type == 'runtTime') {
      GetMonthEnergyTrends(projectId).then(res => {
        let { success, data } = res
        if (success) {
          if (data) {
            let nowYear = new Date().getFullYear()
            let lastYear = nowYear - 1
            nowYear = nowYear.toString()
            lastYear = lastYear.toString()

            let dimension = ["time", nowYear, lastYear]
            let lists = []

            data.x.map((item, index) => {
              lists.push({
                time: data.x[index],
              })
              lists[index][nowYear] = data.y[index]
              lists[index][lastYear] = data.y1[index]
            })
            let dataSets = {
              dimensions: dimension,
              source: lists
            }
            drawBar(dataSets)
          }
        } else {
          message.error(res.errMsg)
        }
      })
    } else if (props.type == 'configure') {
      drawBar(datasetMonth);
      return;
    }

    
  }, [])
  
  return (
         <Titlelayout title={'月度能耗趋势'} {...fs}>
         <div ref={mref} style={{width: '422px', height: '358px'}}>
         </div>
         </Titlelayout>
  )
}
