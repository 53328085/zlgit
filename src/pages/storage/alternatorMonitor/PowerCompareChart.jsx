import React, { memo, useMemo } from 'react';
import styled from 'styled-components';
import Ichart from '@com/useEcharts/Ichart';
import { useSelector } from 'react-redux';
import { themeColor } from '@redux/systemconfig.js';

const ChartWrapper = styled.div`
  height: 100%;
  background-color: #fff;
  border-radius: 4px;

  .chart-body {
    height: 100%;
    min-height: 240px;
  }
`;

const PowerCompareChart = memo(({ chartData }) => {
  const { successColor, warningColor } = useSelector(themeColor);

  const option = useMemo(() => ({
    type: 2,
    color: [successColor, warningColor],
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' }
    },
    legend: {
      data: ['08/01', '08/02'],
      top: 0,
      left: 'center',
      textStyle: { color: '#333' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '40px',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['01-01', '01-02', '01-03', '01-04', '01-05', '01-06', '01-07', '01-08', '01-09', '01-10', '01-11', '01-12'],
      axisLabel: { color: '#333' },
      axisLine: { lineStyle: { color: '#333' } }
    },
    yAxis: {
      type: 'value',
      name: '单位(%)',
      min: 0,
      max: 400,
      axisLabel: { color: '#333' },
      axisLine: { lineStyle: { color: '#333' } },
      splitLine: { lineStyle: { color: '#eee' } }
    },
    series: [
      {
        name: '08/01',
        type: 'line',
        data: chartData?.series1 || [],
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { width: 2 }
      },
      {
        name: '08/02',
        type: 'line',
        data: chartData?.series2 || [],
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { width: 2 }
      }
    ]
  }), [chartData, successColor, warningColor]);

  return (
    <ChartWrapper>
      <div className="chart-body">
        <Ichart {...option} />
      </div>
    </ChartWrapper>
  );
});

export default PowerCompareChart;
