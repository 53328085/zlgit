import React, { useCallback, useState, useEffect, useMemo } from 'react'
import moment from 'moment'
import style from './style.module.less'

import { Tooltip } from 'antd'
import { numberformat } from '@com/usehandler'

import Titlelayout from '@com/titlelayout'
import Ichart from '@com/useEcharts/Ichart'
import { Cdivider } from "@com/comstyled"
/* import icon1 from './imgs/icon1.png'
import icon2 from './imgs/icon2.png'
import icon3 from './imgs/icon3.png'
import icon4 from './imgs/icon4.png' */
import uppng from './imgs/up.png'
import downpng from './imgs/down.png'

import imgurl from './imgs'
import { getTime } from '@com/usehandler'
const Boxchart = ({ index, showType, data, date }) => {
  let istoday = date.format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')
  let color = ['#bdd2fd', '#99adba', '#ffc299', '#99d699']
  const [options, setOptions] = useState({
    series: [{ type: "line", seriesLayoutBy: 'row' }],
    grid: {
      left: "0px",
      right: "0",
      top: "40px",
      bottom: "0px",
      containLabel: true,
    },
    legend: {
      top: "0px",
      // itemHeight: 4,
      // itemWidth: 16,
    },
    xAxis: {
      axisLabel: {
        showMaxLabel: true,
        hideOverlap: true,
        interval: "auto"
      }
    },
    dataset: {},

  })

  useEffect(() => {
    if (data.constructor == Object) {
      let { x = [], y } = data
      let hours = new Date().getHours();
      let today = new Date().getDate();
      let ptoday = date.date()
      console.log(ptoday)
      let xaxis = istoday ? x.filter(h => parseInt(h) <= hours) : x

      setOptions({
        ...options,
        dataset: {
          dimensions: [
            { name: '时间', type: 'time' },
            { name: showType === 1 ? 'kWh' : '元' },

          ],
          source: [xaxis, y],
          sourceHeader: false,
        },
        color: color[index]

      })
    }



  }, [index, showType, data])

  return <Ichart {...options} />
}

export default function Energy({ showData, dateType, showType, date }) {

  const { bg1class, bg2class, bg3class } = style
  let consumeTotal
  let consumeDetail
  let proportion


  if (showData) {

    consumeTotal = [...showData.consumeTotal].sort((a, b) => parseFloat(b.periodValue) - parseFloat(a.periodValue))
    consumeDetail = showData.consumeDetail
    proportion = showData.proportion

  }

  const [options, setOptions] = useState({
    type: 3,
    pieData: { data: [], total: '100%', radius: ["55%", "70%"] },
    legend: {
      top: 'auto',
      bottom: 16,
      //  orient: 'vertical',
      // left: 'left'
    },
    grid: {
      containLabel: true,
      left: 0,
      right: 0,
    }
  })

  const overcss = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  }
  useEffect(() => {
    setOptions({
      ...options,
      pieData: {
        ...options.pieData,
        data: proportion
      }
    })

  }, [proportion])
  return (
    <div className={style.gridstyle}>
      {
        showData?.consumeTotal?.map((it, index) => {
          let { lastDayPeriodValue, lastMonthPeriodValue, lastYearPeriodValue } = it;
          let timetype = ['', lastDayPeriodValue, lastMonthPeriodValue, lastYearPeriodValue][dateType]
          return (<div className={style.bdcolor} key={index} >
            <div className={`${style.bgclass}  ${index === 0 ? "" : index === 1 ? bg1class : index === 2 ? bg2class : bg3class}`}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {/* <div className={style.leftbd}></div> */}
                <div style={{ fontSize: 12, color: '#666', padding: '0  16px ', backgroundColor: '#ffffff', borderRadius: '36px' }}>
                  <span style={{ fontSize: 14, color: '#000', padding: '0  16px 0 0' }}>{it?.name}</span>
                  {showType == 1 ? '(kWh)' : '(元)'}</div>
              </div>
            </div>
            {/* style={{ backgroundColor: index % 2 === 0 ? '#a0cede' : '#afdb92' }}  */}
            <div className={style.textstyle} style={{ backgroundColor: index === 0 ? '#a8e8eb' : index === 1 ? '#71cefe' : index === 2 ? '#8db4d3' : '#cbe8f0' }}>
              <div style={overcss}>{dateType === 1 ? "今日:" : dateType === 2 ? "本月:" : "本年:"}
                <Tooltip title={parseFloat(it?.periodValue)}>
                  <span className={style.pdlf16}>{parseFloat(it?.periodValue)}</span>
                </Tooltip>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', ...overcss }}>环比:<span className={style.pdlf16}>
                {parseFloat(it?.mom)}%
              </span>
                {dateType == 3 ? <img src={Number(it.periodValue) - Number(it.lastYearPeriodValue) > 0 ? uppng : downpng} style={{ width: 10, marginLeft: 2 }} /> :
                  <img src={Number(it.periodValue) - Number(timetype) > 0 ? uppng : Number(it.periodValue) - Number(timetype) < 0 ? downpng : ''} style={{ width: 10, marginLeft: 2 }} />
                }
              </div>
              <div style={overcss}>{dateType === 1 ? "昨日:" : dateType === 2 ? "上月:" : "上年:"}
                <Tooltip title={parseFloat(timetype)}>
                  <span className={style.pdlf16}>{parseFloat(timetype)}</span>
                </Tooltip>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', ...overcss }}>同比:<span className={style.pdlf16}>{parseFloat(it?.yoy)}%</span>
                {dateType == 3 ? <img src={Number(it.periodValue) - Number(timetype) > 0 ? uppng : downpng} style={{ width: 10, marginLeft: 2 }} /> :
                  <img src={Number(it.periodValue) - Number(timetype) > 0 ? uppng : Number(it.periodValue) - Number(timetype) < 0 ? downpng : ''} style={{ width: 10, marginLeft: 2 }} />
                }
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', padding: 16, flex: 1 }}>
              <Boxchart index={index} data={consumeDetail[index]} showType={showType} date={date} />
            </div>
          </div>)
        }
        )
      }
      {
        consumeTotal ? (<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, rowGap: '16px' }}>
          <Titlelayout title={showType === 1 ? "分类能耗占比" : "分类能耗费用占比"} layout="flex">

            <div style={{ flex: 1, marginTop: 16 }}>
              <Ichart {...options} />

            </div>

          </Titlelayout>
          <Titlelayout title={<div><span>{showType === 1 ? '分类能耗' : '分类能耗费用'}</span> <span style={{ fontSize: 12, color: '#666', paddingLeft: 8, }}>{showType === 1 ? '' : '(元)'}</span></div>} >

            <Cdivider type="h" margin="16px 0" />
            <div style={{ height: 237, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              {
                consumeTotal?.map((it, index) => (<Card index={index} {...it} showtype={showType} />))
              }
            </div>
          </Titlelayout>
        </div>) : null
      }

    </div>
  )
}


let Card = ({ index, showtype, ...other }) => {
  return (
    <div style={{ border: '1px solid #d7d7d7', padding: 1, display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex' }}>
        <img src={imgurl[other.name]} alt="" style={{ width: 54, height: 42 }} />
        <div style={{ marginLeft: 24 }}>
          <div style={{ fontSize: 12, color: '#666', minHeight: 18 }}>{other.name ? other.name : ""}  {showtype == 1 ? '(kwh)' : '元'}</div>
          <div style={{ fontSize: 18, color: '#333', lineHeight: '18px' }}>{other.periodValue}</div>
        </div>
      </div>
      <div style={{ marginRight: 16, display: 'flex', alignItems: 'center' }}>
        {numberformat(other.mom)}
        {/*  <img src={parseFloat(other.mom)>0?uppng:downpng} alt="" style={{ width: 14, height: 19 }} />
        <span style={{ fontSize: 18, lineHeight: '18px', padding: '0 16px' }}>{parseFloat(other.mom)}</span>
        <span>%</span> */}
      </div>
    </div>
  )
}