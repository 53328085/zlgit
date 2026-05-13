import React, { useMemo } from 'react'
import TitleLayout from '@com/titlelayout'
import Ichart from '@com/useEcharts/Ichart'

export default function EnergyTrendChart() {
  const energyConsumptionTrend = useMemo(
    () => ({
      type: 2,
      grid: {
        left: 70,
        right: 20,
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
      yAxis: {
        name: 'tce(吨标准煤)',
      },
      series: [
        {
          type: 'bar',
          name: '能源消费量',
          data: [2235746.23, 2189523.18, 2256891.45, 2178432.67, 2134567.89, 2201234.56],
          barWidth: 32,
        },
      ],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
    }),
    [],
  )

  return (
    <TitleLayout title="能源消费趋势" layout="flex">
      <Ichart {...energyConsumptionTrend} />
    </TitleLayout>
  )
}