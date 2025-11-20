import React, {  useMemo } from 'react'
import {Title,Detailbox} from '../../style'
import {Descriptions} from "antd"
import imgurl from "../../icon";
import Titlelayout from "@com/titlelayout";
import Ichart from "@com/useEcharts/Ichart";
 
import { numberformat, getTime } from '@com/usehandler'
export default function({qverview={}, op,my, type, datetype, tabvalue, laptop })  {
     const {proportion, total={},proportionTitle } = qverview
    let {lastDayPeriodValue, lastMonthPeriodValue, lastYearPeriodValue}=total
    let timetype = ['', lastDayPeriodValue, lastMonthPeriodValue, lastYearPeriodValue][datetype]
    
   

      const pieopt = useMemo(()=>{
        let total = proportion?.reduce((a,b)=> a+ parseFloat(b.value),0)
        return{
            type: 3,
            pieData: { data: proportion, total,radius:"50%",   },
            toolbox: {
                feature: {
                  saveAsImage: {},
                },
              },
            legend: {
              top: 'auto',
              bottom: 0,
              //  orient: 'vertical',
              // left: 'left'
            },
            grid: {
              containLabel: true,
              left: 0,
              right: 0,
            },
           
        }
    },[proportion])
    return (
        <Detailbox tabvalue={tabvalue}>
      <Titlelayout title={<Title title={total?.name} />}   layout="flex">
        <div className='divbox'> 
            <div className="imgbox">
              <img
                src={imgurl[tabvalue] || imgurl['cO2']}
                alt=""
              />
            </div> 
           {tabvalue==0 ? <Descriptions size='small' column={1} colon>
                <Descriptions.Item label={`今${type}能耗`} contentStyle={{justifyContent: "right"}} >{total.periodValue}</Descriptions.Item>
                <Descriptions.Item label={`${my}${type}能耗`} contentStyle={{justifyContent: "right"}} >{timetype}</Descriptions.Item>
                <Descriptions.Item label="同比" contentStyle={{justifyContent: "right"}} >{ numberformat(total.yoy)}</Descriptions.Item>
                <Descriptions.Item label="环比" contentStyle={{justifyContent: "right"}} >{ numberformat(total.mom)}</Descriptions.Item>
            </Descriptions>
            : <Descriptions size='small' column={2} colon>
            <Descriptions.Item label={`今${type}`} contentStyle={{justifyContent: "left" }} >{total.periodValue}</Descriptions.Item>          
            <Descriptions.Item label="同比" contentStyle={{justifyContent: "right"}} >{ numberformat(total.yoy)}</Descriptions.Item>
            <Descriptions.Item label={`${my}${type}`} contentStyle={{justifyContent: "left" }} >{timetype}</Descriptions.Item>
            <Descriptions.Item label="环比" contentStyle={{justifyContent: "right"}} >{ numberformat(total.mom)}</Descriptions.Item>
        </Descriptions>
}
        
        </div>
       
      </Titlelayout>
      <Titlelayout
          type="inner"
          title={<Title title={proportionTitle} />}
          style={{ padding: "0px", border: "none" }}
          layout="flex"
        > 
            <Ichart {...pieopt}></Ichart> 
        </Titlelayout>
      </Detailbox>
    )
  }