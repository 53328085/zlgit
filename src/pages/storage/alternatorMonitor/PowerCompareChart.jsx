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
  const series1Name = chartData?.series1Name || '功率趋势';
  const series2Name = chartData?.series2Name || '对比趋势';

  const { yAxisMin, yAxisMax, yAxisInterval } = useMemo(() => {
    const values = [chartData?.series1, chartData?.series2]
      .flat()
      .filter((value) => Number.isFinite(Number(value)))
      .map((value) => Number(value));

    if (!values.length) {
      return {
        yAxisMin: 0,
        yAxisMax: 40,
        yAxisInterval: 10
      };
    }

    const dataMin = Math.min(...values);
    const dataMax = Math.max(...values);
    const absMax = Math.max(Math.abs(dataMin), Math.abs(dataMax));
    const roughStep = absMax / 4 || 1;
    const magnitude = 10 ** Math.floor(Math.log10(roughStep));
    const normalizedStep = roughStep / magnitude;
    const stepFactor = normalizedStep <= 1 ? 1 : normalizedStep <= 2 ? 2 : normalizedStep <= 2.5 ? 2.5 : normalizedStep <= 5 ? 5 : 10;
    const interval = stepFactor * magnitude;

    let min = Math.floor(dataMin / interval) * interval;
    let max = Math.ceil(dataMax / interval) * interval;

    if (dataMin < 0 && dataMax > 0) {
      min = Math.min(min, 0);
      max = Math.max(max, 0);
    }

    if (dataMax <= 0) {
      max = Math.min(0, max);
    }

    if (dataMin >= 0) {
      min = Math.max(0, min);
    }

    if (min === max) {
      if (max === 0) {
        max = interval * 4;
      } else if (max > 0) {
        min = Math.max(0, max - interval * 4);
      } else {
        max = Math.min(0, min + interval * 4);
      }
    }

    return {
      yAxisMin: min,
      yAxisMax: max,
      yAxisInterval: interval
    };
  }, [chartData]);

  const option = useMemo(() => ({
    type: 2,
    color: [successColor, warningColor],
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' }
    },
    legend: {
      data: hasSeries2 ? [series1Name, series2Name] : [series1Name],
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
      name: '单位(kW)',
      min: yAxisMin,
      max: yAxisMax,
      interval: yAxisInterval,
      axisLabel: { color: '#333' },
      axisLine: { lineStyle: { color: '#333' } },
      splitLine: { lineStyle: { color: '#eee' } }
    },
    series: [
      {
        name: series1Name,
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
            name: series2Name,
            type: 'line',
            data: chartData?.series2 || [],
            smooth: true,
            symbol: 'circle',
            symbolSize: 6,
            lineStyle: { width: 2 }
          }]
        : []
    )
  }), [chartData, hasSeries2, series1Name, series2Name, successColor, warningColor, yAxisInterval, yAxisMax, yAxisMin]);

  return (
    <ChartWrapper>
      <div className="chart-body">
        <Ichart {...option} />
      </div>
    </ChartWrapper>
  );
});

export default PowerCompareChart;
