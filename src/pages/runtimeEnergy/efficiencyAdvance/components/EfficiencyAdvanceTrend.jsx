import React, { useState, useEffect, useRef } from 'react'
import TitleLayout from '@com/titlelayout'
import { DatePicker, Flex } from 'antd'
import dayjs from 'dayjs'
import { drawEcharts } from '@com/useEcharts'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { adaptation } from '@redux/systemconfig'

const BaseYearView = styled.div`
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 13px;
  color: #303133;
  line-height: 18px;
  font-style: normal;
`

const ChartContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 16px;
`

export default function EfficiencyAdvanceTrend({ currentYear }) {
  const chartRef = useRef()
  const [baseYear, setBaseYear] = useState(2024)
  const [baseYearData, setBaseYearData] = useState([])
  const [currentYearData, setCurrentYearData] = useState([])
  const {laptop} = useSelector(adaptation)

  useEffect(() => {
    const mockBaseYearData = [120, 132, 101, 134, 90, 230, 210, 200, 180, 150, 140, 130]
    const mockCurrentYearData = [110, 125, 95, 128, 85, 220, 200, 190, 170, 145, 135, 125]
    
    setBaseYearData(mockBaseYearData)
    setCurrentYearData(mockCurrentYearData)
  }, [baseYear, currentYear])

  useEffect(() => {
    if (!chartRef.current || !baseYearData.length || !currentYearData.length) return

    const months = ['1 月', '2 月', '3 月', '4 月', '5 月', '6 月', '7 月', '8 月', '9 月', '10 月', '11 月', '12 月']
    
    const dimensions = ['month', 'baseYear', 'currentYear']
    const source = months.map((month, index) => ({
      month,
      baseYear: baseYearData?.[index] || 0,
      currentYear: currentYearData?.[index] || 0,
    }))

    const dataset = {
      dimensions,
      source,
    }

    const chart = drawEcharts(chartRef.current, {
      color:['#5983FE','#5ED9A7'],
      dataset,
      series: [
        {
          type: 'line',
          name: `${baseYear}基准能耗`,
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 3,
          },
          itemStyle: {
            color: '#5e92f9',
          },
        },
        {
          type: 'line',
          name: `${currentYear}优化能耗`,
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 3,
          },
          itemStyle: {
            color: '#099c9c',
          },
        },
      ],
      grid: {
        left: '20px',
        right: '10px',
        bottom: '10px',
        containLabel: true,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
        formatter: (params) => {
          let html = `<div style="font-weight:bold;margin-bottom:8px;">${params[0].name}</div>`
          params.forEach((param) => {
            const value = typeof param.value === 'number' ? param.value : (param.value?.[param.seriesIndex + 1] || 0)
            html += `<div style="margin:4px 0;">
              <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background-color:${param.color};margin-right:8px;"></span>
              <span>${param.seriesName}: ${value.toFixed(2)} tce</span>
            </div>`
          })
          return html
        },
      },
      legend: {
        top: 0,
        left: 'center',
        icon: 'rect',
        itemHeight: 8,
        itemWidth: 20,
        itemGap: 30,
        textStyle: {
          fontSize: 12,
        },
      },
      xAxis: {
        type: 'category',
        axisLabel: {
          fontSize: 12,
        },
      },
      yAxis: {
        type: 'value',
        name: 'tce',
        nameTextStyle: {
          fontSize: 12,
          padding: [0, 0, 0, 10],
        },
        axisLabel: {
          fontSize: 12,
          formatter: '{value}',
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#e0e0e0',
          },
        },
      },
    })

    return () => {
      chart?.dispose()
    }
  }, [baseYearData, currentYearData, baseYear, currentYear])

  const handleBaseYearChange = (date, dateString) => {
    const year = dateString ? parseInt(dateString) : null
    if (year) {
      setBaseYear(year)
    }
  }

  return (
    <TitleLayout
      title={
        <Flex align="center" justify="space-between">
          <div>能耗优化效果趋势</div>
          <Flex align="center" gap={12}>
            <BaseYearView>基准年</BaseYearView>
            <DatePicker picker="year" value={baseYear ? dayjs(String(baseYear)) : null} onChange={handleBaseYearChange} />
          </Flex>
        </Flex>
      }
      layout="flex"
      dr="column"
      style={{ minHeight: laptop ? 300:400 }}
    >
      <ChartContainer ref={chartRef} />
    </TitleLayout>
  )
}
