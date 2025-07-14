import React, { useCallback, useState, useEffect, useMemo } from 'react'
import moment from 'moment'
import styled, {css} from 'styled-components'
import {useSelector} from "react-redux"
import { Tooltip } from 'antd'
import { numberformat } from '@com/usehandler'

import Titlelayout from '@com/titlelayout'
import Ichart from '@com/useEcharts/Ichart'
import { Cdivider } from "@com/comstyled"
import {  adaptation} from '@redux/systemconfig.js'
import uppng from './imgs/up.png'
import downpng from './imgs/down.png'

import imgurl from './imgs'

const sty= css`
//  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
`

const Mainbox=styled.div`

   // display: grid;
   // grid-template-columns: repeat(4, 304px) 1fr;
    display: flex;
    flex-wrap: wrap;
    gap:16px;
    flex:1;
    min-height: 753px;
    ${props => props.laptop ? sty : null}
    .bdcolor {
        flex-basis: 304px;
        border: 1px solid #d7d7d7;
        border-radius: 4px;
        padding-top: 1px;
        background-color: #fff;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        .leftbd {
            width: 4px;
            height: 32px;
            background-color: var(--ant-primary-color);
        }

        .bgclass {
          //  width: ${props => props.laptop ? "100%" : "300px"};
            height: 220px;
         //   margin: 0 auto;
            padding: ${props => props.laptop ? "8px" : "16px"} ;
            background-image: url(${imgurl['bg1']});
            background-size: 100% 100%;
        }

        .bg1class {
            background-image: url(${imgurl['bg2']});
        }

        .bg2class {
            background-image: url(${imgurl['bg3']});
        }

        .bg3class {
            background-image: url(${imgurl['bg4']});
        }

        .textstyle {
            height: 104px;
           // width: 300px;
           // margin: 0 auto;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: repeat(2, 30px);
            column-gap: 10px;
            padding: 0 10px;
            align-content: center;
            align-items: center;
            padding-left: 16px;

            .pdlf16 {
                padding-left: 8px;
                padding-right: 2px;
                color: #303133;
            }
        }
    }

    .piestyle {
        height: 448px;
        width: 408px;
        border: 1px solid #d7d7d7;
        border-radius: 4px;
        background-color: #fff;
        padding: 14px;
    }

    .sorts {
        height: 335px;
        width: 100%;
        border: 1px solid #d7d7d7;
        border-radius: 4px;
        background-color: #fff;
        padding: 16px
    }
`
const sty2=css`
  flex-direction: column;
 // align-items: center;
  padding: 4px;
`
const Cardbox=styled.div`
    border: 1px solid #d7d7d7;
    padding-right: 8px;
    display: flex;
    justify-content: space-between;
    ${props => props.laptop ? sty2 : null}
  .box {
    display: flex;
    flex: auto;
  }
  .left {
     column-gap: ${props => props.laptop ? "8px" : "24px"};
     align-items: center;
    
     .lable{
        font-size: 12px;
        color: #666;
     }
     .value {
      font-size: 18px;
      color: #333;
     }
  }
  .right{

    align-items: center;
    justify-content: ${props=> props.laptop ? "flex-start" : "flex-end"};
  }
`
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
    //  console.log(ptoday)
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
        color: color[index % 4]

      })
    }



  }, [index, showType, data])

  return <Ichart {...options} />
}

export default function Energy({ showData, dateType, showType, date }) {
  let {laptop} = useSelector(adaptation)
 
/*   let consumeTotal
  let consumeDetail
  let proportion

  console.log(showData)
  if (showData) {

    consumeTotal = [...showData.consumeTotal].sort((a, b) => parseFloat(b.periodValue) - parseFloat(a.periodValue))
    consumeDetail = showData.consumeDetail
    proportion = showData.proportion

  } */
  const [consumeTotal=[], consumeDetail=[], proportion=[]] = useMemo(()=> {
  if(showData) {
   let consumeTotal = Array.isArray(showData?.consumeTotal) ? [...showData?.consumeTotal]?.sort?.((a, b) => parseFloat(b.periodValue) - parseFloat(a.periodValue)) :[]
   let consumeDetail = showData?.consumeDetail
   let proportion = showData?.proportion
   return [consumeTotal, consumeDetail, proportion]
  }else {
    return [[],[],[]]
  }
  }, [showData])

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
    <Mainbox laptop={laptop}>
      {
        showData?.consumeTotal?.map((it, index) => {
          let { lastDayPeriodValue, lastMonthPeriodValue, lastYearPeriodValue } = it;
          let timetype = ['', lastDayPeriodValue, lastMonthPeriodValue, lastYearPeriodValue][dateType]
          return (<div className="bdcolor" key={index} >
            <div className={`bgclass  ${index === 0 ? "" : index === 1 ? 'bg1class' : index === 2 ? 'bg2class' : 'bg3class'}`}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {/* <div className={style.leftbd}></div> */}
                <div style={{ fontSize: 12, color: '#666', padding: '0  16px ', backgroundColor: '#ffffff', borderRadius: '36px' }}>
                  <span style={{ fontSize: 14, color: '#000', padding: '0  16px 0 0' }}>{it?.name}</span>
                  {showType == 1 ? '(kWh)' : '(元)'}</div>
              </div>
            </div>
          
            <div className="textstyle" style={{ backgroundColor: index === 0 ? '#a8e8eb' : index === 1 ? '#71cefe' : index === 2 ? '#8db4d3' : '#cbe8f0' }}>
              <div style={overcss}>
                {dateType === 1 ? "今日:" : dateType === 2 ? "本月:" : "本年:"}
                <Tooltip title={parseFloat(it?.periodValue)}>
                  <span className="pdlf16">{parseFloat(it?.periodValue)}</span>
                </Tooltip>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', ...overcss }}>环比:<span className="pdlf16">
                {parseFloat(it?.mom)}%
              </span>
                {dateType == 3 ? <img src={Number(it.periodValue) - Number(it.lastYearPeriodValue) > 0 ? uppng : downpng} style={{ width: 10, marginLeft: 2 }} /> :
                  <img src={Number(it.periodValue) - Number(timetype) > 0 ? uppng : Number(it.periodValue) - Number(timetype) < 0 ? downpng : ''} style={{ width: 10, marginLeft: 2 }} />
                }
              </div>
              <div style={overcss}>{dateType === 1 ? "昨日:" : dateType === 2 ? "上月:" : "上年:"}
                <Tooltip title={parseFloat(timetype)}>
                  <span className="pdlf16">{parseFloat(timetype)}</span>
                </Tooltip>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', ...overcss }}>同比:<span className="pdlf16">{parseFloat(it?.yoy)}%</span>
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
        consumeTotal ? (<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between',flexBasis: "394px",   rowGap: '16px' }}>
          <Titlelayout title={showType === 1 ? "分类能耗占比" : "分类能耗费用占比"} layout="flex">

            <div style={{ flex: 1, marginTop: 16 }}>
              <Ichart {...options} />

            </div>

          </Titlelayout>
          <Titlelayout title={<div><span>{showType === 1 ? '分类能耗' : '分类能耗费用'}</span> <span style={{ fontSize: 12, color: '#666', paddingLeft: 8, }}>{showType === 1 ? '' : '(元)'}</span></div>} >

           {/*  <Cdivider type="h" margin="16px 0" /> */}
            <div style={{ height: 237, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              {
                consumeTotal?.map?.((it, index) => (<Card index={index} {...it} showtype={showType} laptop={laptop} />))
              }
            </div>
          </Titlelayout>
        </div>) : null
      }

    </Mainbox>
  )
}


let Card = ({ index, showtype,laptop, ...other }) => {
  return (
    <Cardbox laptop={laptop}>
      <div  className='box left'>
        {laptop ? null : <img src={imgurl[index+1]} alt="" style={{ width: 54, height: 42 }} />} 
        <div>
          <div className='lable'>{other.name ? other.name : ""}  {showtype == 1 ? '(kwh)' : '元'}</div>
          <div className='value'>{other.periodValue}</div>
        </div>
      </div>
      <div className='box right' >
        {numberformat(other.mom)}
      </div>
    </Cardbox>
  )
}