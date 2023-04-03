import React, { useCallback, useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import style from './style.module.less'
import Bluecolumn from '@com/bluecolumn';
import { Divider } from 'antd'
import { Charts, PieCharts } from './charts'
import icon1 from './imgs/icon1.png'
import icon2 from './imgs/icon2.png'
import icon3 from './imgs/icon3.png'
import icon4 from './imgs/icon4.png'
import uppng from './imgs/up.png'
import downpng from './imgs/down.png'
import empty from './imgs/empty.png'
export default function Energy({ showData, dateType }) {
  const { bg1class, bg2class, bg3class } = style
  let consumeTotal 
  let consumeDetail 
  let proportion 
  let color = ['#bdd2fd', '#99adba', '#ffc299', '#99d699']
  if (showData) {
    consumeTotal = showData.consumeTotal
    console.log(consumeTotal)
    consumeDetail = showData.consumeDetail
    proportion = showData.proportion
  }


  useEffect(() => {

  }, [])
  return (


    <div className={style.gridstyle}>
      {
        consumeTotal?.map((it, index) => (<div className={style.bdcolor} >
          <div className={`${style.bgclass}  ${index === 0 ? "" : index === 1 ? bg1class : index === 2 ? bg2class : bg3class}`}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: 4, height: 32, backgroundColor: '#237ae4' }}></div>
              <div style={{ fontSize: 12, color: '#666' }}><span style={{ fontSize: 14, color: '#000', fontWeight: 'bold', padding: '0 16px' }}>{it?.name}</span>(吨标煤)</div>
            </div>
          </div>
          <div className={style.textstyle} style={{ backgroundColor: index % 2 === 0 ? '#a0cede' : '#afdb92' }} >
            <div>{dateType === 1 ? "今日:" : dateType === 2 ? "本月:" : "本年:"}<span className={style.pdlf16}>{it?.periodValue}</span></div>
            <div style={{ display: 'flex', alignItems: 'center' }}>环比:<span className={style.pdlf16}>
              {it?.mom}
            </span>
            {dateType==3?<img src={Number(it.periodValue) - Number(it.lastYearPeriodValue)>0?uppng:downpng} style={{ width: 10, marginLeft: 2 }} />:
             <img src={Number(it.periodValue) - Number(it.lastMonthPeriodValue)>0?uppng:downpng} style={{ width: 10, marginLeft: 2 }} />
            }
            </div>
            <div>{dateType === 1 ? "昨日:" : dateType === 2 ? "上月:" : "上年:"}<span className={style.pdlf16}>{it?.lastMonthPeriodValue}</span></div>
            <div style={{ display: 'flex', alignItems: 'center' }}>同比:<span className={style.pdlf16}>{it?.yoy}</span>
            {dateType==3?<img src={Number(it.periodValue) - Number(it.lastYearPeriodValue)>0?uppng:downpng} style={{ width: 10, marginLeft: 2 }} />:
             <img src={Number(it.periodValue) - Number(it.lastMonthPeriodValue)>0?uppng:downpng} style={{ width: 10, marginLeft: 2 }} />
            }
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', padding: 16 }}>
            <Charts consumeDetail={consumeDetail[index]} color={color[index]} />
          </div>
        </div>))
      }
      {
        consumeTotal?( <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div className={style.piestyle}>
          <Bluecolumn name="分类能耗占比" />
          <div style={{ width: 378, height: 360, marginTop: 16 }}>
            {proportion && proportion.length > 0 ? <PieCharts proportion={proportion}></PieCharts> : <img src={empty}></img>}

          </div>

        </div>
        <div className={style.sorts}>
          <Bluecolumn name={<span>分类能耗<span style={{ fontSize: 12, color: '#666', paddingLeft: 8, }}>(吨标煤)</span></span>} />
          <Divider style={{ margin: "16px 0", borderColor: '#d7d7d7' }} dashed />
          <div style={{ height: 237, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {
              consumeTotal?.map((it, index) => (<Card index={index} {...it} />))
            }
          </div>
        </div>
      </div>):null
      }
     
    </div>
  )
}


let Card = ({ index, ...other }) => {
  return (
    <div style={{ border: '1px solid #d7d7d7', padding: 1, display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex' }}>
        <img src={index === 0 ? icon1 : index === 1 ? icon2 : index === 2 ? icon3 : icon4} alt="" style={{ width: 54, height: 42 }} />
        <div style={{ marginLeft: 24 }}>
          <div style={{ fontSize: 12, color: '#666', minHeight: 18 }}>{other.name ? other.name : ""}</div>
          <div style={{ fontSize: 18, color: '#333', lineHeight: '18px' }}>{other.periodValue}</div>
        </div>
      </div>
      <div style={{ marginRight: 16, display: 'flex', alignItems: 'center' }}>
           <img src={parseFloat(other.mom)>0?uppng:downpng} alt="" style={{ width: 14, height: 19 }} />
        <span style={{ fontSize: 18, lineHeight: '18px', padding: '0 16px' }}>{parseFloat(other.mom)}</span>
        <span>%</span>
      </div>
    </div>
  )
}