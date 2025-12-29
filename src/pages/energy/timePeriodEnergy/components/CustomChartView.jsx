
import * as echarts from "echarts";
import { useEffect, useRef } from "react";

// 将数值转换为HH:mm格式的时间字符串
const formatTime = (value) => {
  const hours = Math.floor(value);
  const minutes = Math.floor((value - hours) * 60);
  
  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  
  return `${formattedHours}:${formattedMinutes}`;
};

export default function CustomChartView({dailyChartData}) {
    const chartRef = useRef(null);
    var myChart;
    var option;

    const initChart = () => {
        const chartDom = chartRef.current;
        if (!chartDom) return;
        
        myChart = echarts.init(chartDom);
        
        const colorList = dailyChartData.colorList;
        const data = dailyChartData.data.map(function (item, index) {
            return {
              value: item,
              itemStyle: {
                color: colorList[index]
              }
            };
          });
        // 计算y轴的最大值，为markArea留出空间
        const yValues = dailyChartData.data.map(item => {
          // 根据数据结构提取y值
          if (Array.isArray(item)) {
            return item[2] || 0; // 如果是数组，取第三个元素作为y值
          } else if (typeof item === 'object' && item.value && Array.isArray(item.value)) {
            return item.value[2] || 0; // 如果是对象且value是数组，取value的第三个元素
          } else {
            return item || 0; // 否则直接返回值
          }
        });
        
        const maxValue = yValues.length > 0 ? Math.max(...yValues) : 1;
        const yMax = (maxValue * 1.2).toFixed(2); // 增加20%的空间
        
        option = {
            xAxis: {
              type: 'value',
              min: dailyChartData.pointXLabel[0] ?? 0,
              max: dailyChartData.pointXLabel[dailyChartData.pointXLabel.length - 1] ?? 0,
              axisLabel: {
                formatter: function (value) {
                  // 只显示关键时间点的标签
                  if (dailyChartData.pointXLabel.includes(value)) {
                    return formatTime(value);
                  }
                  return '';
                }
              },
              axisTick: {
                show: false  // 隐藏所有刻度线
              },
              splitLine: {
                show: false  // 隐藏分割线
              },
              splitNumber: 24  // 将x轴分为24份，对应每个小时
            },
            yAxis: {
              max: yMax,
              name: 'kWh',
              splitLine: {
                show: false  // 隐藏分割线
              }
            },
            series: [
              {
                type: 'custom',
                renderItem: function (params, api) {
                  var yValue = api.value(2);
                  var start = api.coord([api.value(0), yValue]);
                  var size = api.size([api.value(1) - api.value(0), yValue]);
                  var style = api.style();
                  return {
                    type: 'rect',
                    shape: {
                      x: start[0],
                      y: start[1],
                      width: size[0],
                      height: size[1]
                    },
                    style: style
                  };
                },
                label: {
                  show: true,
                  position: 'top',
                  formatter: function (params) {
                    return `${params.value[2]} kWh`;
                  }
                },
                encode: {
                  x: [0, 1],
                  y: 2,
                  tooltip: [0, 1, 2],
                  itemName: 3
                },
                data: data
              },
              {
                type: 'line',
                markArea: dailyChartData.markArea,
                data: []
              }
            ]
        };
        option && myChart.setOption(option);
    };

    useEffect(() => {
        console.log('CustomChartView mounted',dailyChartData);
      initChart();
      
      return () => {
        if (myChart) {
          myChart.dispose();
        }
      };
    }, [dailyChartData]);

  return <div ref={chartRef} style={{flex:1, height: "100%"}}>Custom Chart View</div>;
}
