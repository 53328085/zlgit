import React, { useMemo } from 'react'
import TitleLayout from '@com/titlelayout'
import Ichart from '@com/useEcharts/Ichart'

export default function IntensityTrendChart() {
  const intensityTrend = useMemo(
    () => ({
      color: ['#FFAA54', '#5ED9A7'],
      type: 2,
      grid: {
        left: 35,
        right: 35,
        top: 48,
        bottom: 50,
      },
      legend: {
        top: 8,
        left: 'center',
      },
      xAxis: {
        type: 'category',
        data: ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06'],
        axisLabel: {
          interval: 0,
          rotate: 0,
          fontSize: 12,
        },
        axisTick: {
          alignWithLabel: true,
        },
      },
      yAxis: [
        {
          type: 'value',
          name: 'tce/吨产品',
          position: 'left',
          axisLabel: {
            formatter: '{value}',
          },
        },
        {
          type: 'value',
          name: 'tce/万元产值',
          position: 'right',
          axisLabel: {
            formatter: '{value}',
          },
        },
      ],
      series: [
        {
          type: 'bar',
          name: '单位产品能耗',
          yAxisIndex: 0,
          data: [365.25, 378.56, 362.12, 358.78, 365.25, 352.34],
          barWidth: 24,
        },
        {
          type: 'line',
          name: '单位产值能耗',
          yAxisIndex: 1,
          data: [223.13, 218.45, 225.67, 229.89, 223.13, 231.56],
          smooth: true,
          showSymbol: false,
        },
      ],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
      },
    }),
    [],
  )

  return (
    <TitleLayout title="能耗强度趋势" layout="flex">
      <Ichart {...intensityTrend} />
    </TitleLayout>
  )
}