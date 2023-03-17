import { Area, Pie } from '@ant-design/plots';
import React, { useCallback, useState, useEffect, useMemo } from 'react'
//折线图
export let Charts = ({ consumeDetail, color }) => {
  const data = consumeDetail.x.map((it, index) => {
    return {
      x: it,
      y: Number(consumeDetail.y[index]),
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
    let total = 0
    proportion.forEach(it=>total+=Number(it.value))
    const config = {
      data:proportion,
      angleField: 'value',
      colorField: 'name',
      radius: 0.8,
      innerRadius: 0.75,
      legend: {
        position: 'bottom',
        offsetY: 0
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
          content: `${total > 0 ? (<div><div>总</div><div>{total}</div></div>) : ''}`,
        },
      },
    };
    return (<Pie {...config} />)
  }