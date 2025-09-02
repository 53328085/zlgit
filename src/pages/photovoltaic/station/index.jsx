import React, { useEffect, useState } from 'react'
import Building from '@com/building'
import { useSelector } from 'react-redux'
import { adaptation } from "@redux/systemconfig";
import Pagecount from "@com/pagecontent";
import Ichart from "@com/useEcharts/Ichart"
import Titlelayout from '@com/titlelayout'
import powerStation from './images/powerStation.png'
import inverter from './images/inverter.png'
import installedCapacity from './images/installedCapacity.png'
import runtimeDuration from './images/runtimeDuration.png'
import { message } from 'antd';

import { Container, TopBox, FotterBox } from "./style";
const fs = {
  fc: '#333'
}
export default function Index() {
  let { laptop } = useSelector(adaptation)
  const comoptionfn = (laptop) => ({
    type: 5,
    tooltip: {
      formatter: ' {b}<br/>{c}'
    },
    color: ['#6395fa'],
    series: [{
      type: 'gauge',
      min: 0,
      max: 3000,
      center: ["50%", "50%"],
      radius: laptop ? 65 : 110,
      progress: {
        show: true,
      },
      axisLine: {
        lineStyle: {
          width: laptop ? 8 : 10
        }
      },
      splitLine: {
        lineStyle: {
          width: 1,
          color: '#999'
        }
      },
      axisLabel: {
        distance: 12,
        color: '#999',
        fontSize: laptop ? 7 : 9
      },
      anchor: {
        show: true,
        showAbove: true,
      },
      detail: {
        valueAnimation: true,
        formatter: '{value}',
        offsetCenter: [0, '40%'],
        fontSize: laptop ? 20 : 30
      },


    }]

  })
  let comoption = comoptionfn(laptop)
  const custoption = {
    ...comoption,
    series: [
      {
        ...comoption.series[0],
        data: [
          {
            title: {
              show: true,
              fontSize: laptop ? "12px" : "14px",
              offsetCenter: [0, "70%"]
            },
            value: 413,
            name: "实时功率(kW)",
          }
        ]
      }
    ]
  }
  return (
    // <div style={{flex: 1, display:"flex", justifyContent: 'center', alignContent: 'center'}}>
    //   <Building pagename="电站监控" />
    // </div>
    < Pagecount bgcolor="#eeeff4" pd={0} >
      <Container>
        <TopBox>
          <Titlelayout title={'电站信息'} {...fs}>
            <div className='infoBox1'>
              <img src={powerStation} className='powerStation' />
              <div className='content'>
                <div className='info'>
                  <span></span><span>名  称： </span> <span>东区光伏电站1</span></div>
                <div className='info'>
                  <span></span> <span>编  号：</span> <span>2893049</span></div>
                <div className='info'>
                  <span></span> <span>总表名称：</span><span>东区光伏车棚总表1</span></div>
                <div className='info'>
                  <span></span> <span>总表编号：</span><span>83894894</span></div>
                <div className='info'>
                  <span></span><span>安装地址：</span> <span>东区光伏车棚文字较长的情况是这样的</span></div>
              </div>
            </div>
            <div className='powerNum'>
              <div className='numBox'>
                <img src={inverter} className='powerIcon' />
                <div className='num'>
                  <div>5</div>
                  <div>逆变器(个)</div>
                </div>
              </div>
              <div className='numBox'>
                <img src={installedCapacity} className='powerIcon' />
                <div className='num'>
                  <div>5000</div>
                  <div>装机容量(kW)</div>
                </div>
              </div>
              <div className='numBox'>
                <img src={runtimeDuration} className='powerIcon' />
                <div className='num'>
                  <div>125</div>
                  <div>运行时长(h)</div>
                </div>
              </div>
            </div>
          </Titlelayout>
          <Titlelayout title={'发电实时功率'}>
            <Ichart custoption={custoption} />
          </Titlelayout>
          <Titlelayout title={'发电概览'}>
            <div className='infoBox2'>
              <div className='info'>
                <div className='box'>
                  <img src={runtimeDuration} className='powerIcon' />
                  <div className='num'>
                    <div>125</div>
                    <div>本日发电量(kWh)</div>
                  </div>
                </div>
                <div className='box'>
                  <img src={runtimeDuration} className='powerIcon' />
                  <div className='num'>
                    <div>125</div>
                    <div>本月发电量(kWh)</div>
                  </div>
                </div>
                <div className='box'>
                  <img src={runtimeDuration} className='powerIcon' />
                  <div className='num'>
                    <div>125</div>
                    <div>本年发电量(kWh)</div>
                  </div>
                </div>
              </div>

              <div className='info'>
                <div className='box'>
                  <img src={runtimeDuration} className='powerIcon' />
                  <div className='num'>
                    <div>125</div>
                    <div>本日发电量(kWh)</div>
                  </div>
                </div>
                <div className='box'>
                  <img src={runtimeDuration} className='powerIcon' />
                  <div className='num'>
                    <div>125</div>
                    <div>本月发电量(kWh)</div>
                  </div>
                </div>
                <div className='box'>
                  <img src={runtimeDuration} className='powerIcon' />
                  <div className='num'>
                    <div>125</div>
                    <div>本年发电量(kWh)</div>
                  </div>
                </div>
              </div>
            </div>
          </Titlelayout>
          <Titlelayout title={'碳排概览'}>
            <div className='infoBox'>
              <div className='box'>
              </div>
            </div>
          </Titlelayout>
        </TopBox>
        <FotterBox>
          <Titlelayout title={'逆变器'}>
            <div className='infoBox'>
              <div className='box'>
              </div>
            </div>
          </Titlelayout>

          <Titlelayout title={'光伏发电量趋势'}>
            <div className='infoBox'>
              <div className='box'>
              </div>
            </div>
          </Titlelayout>
        </FotterBox>
      </Container>
    </Pagecount>
  )
}
