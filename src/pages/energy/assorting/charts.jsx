import { Area, Pie } from '@ant-design/plots';
import React, { useCallback, useState, useEffect, useMemo } from 'react'
//折线图
export let Charts = ({ consumeDetail, color }) => {
  const data = consumeDetail.y.map((it, index) => {
    return {
      x: consumeDetail.x[index],
      y: Number(it),
      type: '吨标煤'
    }

  })
  const config = {
    data,
    color,
    width: 272,
    height: 448,
    autoFit: false,
    seriesField: 'type',
    xField: 'x',
    yField: 'y',
    smooth: true,
    legend: {

      position: 'top'
    },
    xAxis: {
      range: [0, 1],
    },
  };
  return (
    <Area {...config} />
  )
}

//饼图
export let PieCharts = ({proportion}) => {
  console.log(proportion)
    const data = proportion.map(it=>{
      return {
        ...it,
        value:Number(it.value)
      }
    })
    let total=0
    data.forEach(it=>{total+=it.value})

    const config = {
      data,
      angleField: 'value',
      colorField: 'name',
      radius: 0.8,
      innerRadius: 0.75,
      legend: {
        position: 'bottom',
        offsetY: 0,
        flipPage:false,
        itemSpacing:1,
    
      },
      label: {
        type: 'outer',
        formatter: useCallback((v) => {
          return v.value + '%'
        }, [])
      },
      statistic: {
        title: false,
        content: {
          style: {
            whiteSpace: 'pre-wrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontWeight: 'normal',
            fontSize: '16px'
          },
          customHtml:useCallback((container,view,datum,data)=>{return (<p><p style={{marginBottom:12}}>总</p><p>{total.toFixed(2)}</p></p>)},[total])
          // formatter:useCallback((a,b,v)=>{console.log(a,b,v)})
          // content: total > 0 ? (<div><div>总</div><div>100</div></div>) : '',
        },
      },
    };
    return (<Pie {...config} />)
  }