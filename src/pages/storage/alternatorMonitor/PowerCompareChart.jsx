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
  const hasSeries2 = Array.isArray(chartData?.series2) && chartData.series2.length > 0;

  const option = useMemo(() => ({
    type: 2,
    color: [successColor, warningColor],
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' }
    },
    legend: {
      data: hasSeries2 ? ['08/01', '08/02'] : ['08/01'],
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
      data: chartData?.xAxis || [],
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
      }
    ].concat(
      hasSeries2
        ? [{
            name: '08/02',
            type: 'line',
            data: chartData?.series2 || [],
            smooth: true,
            symbol: 'circle',
            symbolSize: 6,
            lineStyle: { width: 2 }
          }]
        : []
    )
  }), [chartData, hasSeries2, successColor, warningColor]);

  return (
    <ChartWrapper>
      <div className="chart-body">
        <Ichart {...option} />
      </div>
    </ChartWrapper>
  );
});

export default PowerCompareChart;
