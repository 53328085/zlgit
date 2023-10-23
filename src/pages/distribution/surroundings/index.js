import React, { useEffect } from 'react'
import style from './style.module.less'
import { Select, Button, DatePicker } from 'antd'
import { SearchOutlined } from '@ant-design/icons';
import * as echarts from "echarts";
import updateImg from './updateImg.png'
import ItemCard from './itemCard'
import BlueColumn from '@com/bluecolumn'
import styled from 'styled-components'
export default function Index() {
  const {Option} = Select;
  useEffect( ()=>{
    let lineChart = echarts.init(document.getElementById('lineChart'));
    lineChart.setOption({
        color:['#6395f9', '#62daab', '#657798'],
        tooltip:{
            trigger: "axis",
            axisPointer: {
                type: "line",
            },
        },
        legend:{
            show: true,
            top: 10,
        },
        grid:{
            left:48,
            top:50,
            right: 30,
            bottom: 70,
        },
        dataZoom:{
            type:'slider',
            height: 30,
            bottom: 10,
            moveHandleSize: 0,
            height: 20,
        },
        xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['0:00',"2:00", '4:00', '6:00', '8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']
        },
        yAxis: {
        type: 'value',
        },
        series: [
        {
            name: '温度',
            type: 'line',
            symbol:'circle',
            symbolSize: 6,
            data: [26.3, 26.4, 26.2, 27.1, 28.4, 29.1, 29.4, 29.3, 30.3, 27.5, 26.4, 25.4],
        },
        {
            name: '湿度',
            type: 'line',
            symbol:'circle',
            symbolSize: 6,
            data: [56.3, 51.3, 56.6, 57.4, 56.4, 58.6, 59.4, 56.3, 54.3, 54.2, 53.2, 56.7],
        }]
    }
    )
} )
  return (
    <div>
       <div className={style.header}>
        <span style={{marginLeft: '12px'}}>区域选择</span>
        <Select
          placeholder="请选择区域"
          size="middle"
          style={{width: '330px', marginLeft: '12px'}}
        >
          <Option value="1">正泰物联全部园区</Option>
          <Option value="2">正泰物联滨江园区</Option>
          <Option value="3">正泰物联温州园区</Option>
        </Select>
        <span style={{marginLeft: '12px'}}>配电房</span>
        <Select
          placeholder="请选择配电房"
          size="middle"
          style={{width: '330px', marginLeft: '12px'}}
        >
          <Option value="1">配电房1</Option>
          <Option value="2">配电房2</Option>
          <Option value="3">配电房3</Option>
        </Select>
        <div className={style.updateTime}>
          <img src={updateImg} className={style.updateImg}></img>
          <span className={style.time}>更新时间: 2021-09-08  10:25:11</span>
        </div>
      </div>
      <div className={style.content}>
        <div className={style.topContent}>
          {/* <div className={style.topTitle}>环境温湿度</div> */}
          <div className={style.topheader}>
          <BlueColumn name="环境温湿度" styled={{padding: '16px 0 0 16px'}}/>
          <div className={style.searchDiv}>
            <span >日期</span>
            <DatePicker  size='middle' style={{marginLeft:16,marginRight:16}}></DatePicker>
            <Button size='middle' type='primary' icon={<SearchOutlined />}>查询</Button>
          </div>
          </div>
          
          <div className={style.lineChart} id='lineChart'></div>
        </div>
        <div className={style.bottomContent}>
          <BlueColumn name="环境监测" />
          <div className={style.cardflex}>
          <ItemCard title={'环境温度'} desc={'正常'} value={'28.5℃'} img="temperature"></ItemCard>
          <ItemCard title={'环境湿度'} desc={'正常'} value={'56.2%'} img="humidness"></ItemCard>
          <ItemCard title={'水浸监测'} desc={'无水'} value={''} img="water"></ItemCard>
          <ItemCard title={'烟感监测'} desc={'无烟'} value={''} img="smook"></ItemCard>
          <ItemCard title={'噪音监测'} desc={'正常'} value={'56/72 bB'} img="nosie"></ItemCard>
          <ItemCard title={'明火监测'} desc={'无明火'} value={''} img="fire"></ItemCard>
          <ItemCard title={'门禁监控'} desc={'门关闭'} value={'2022-09-23 14:45:25'} img="door"></ItemCard>
          </div>
         
        </div>
      </div>
    </div>
  )
}
