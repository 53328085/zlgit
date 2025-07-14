import moment from "moment";
export const Init_Value = {
  dtype: "1",
  date: moment(),
};
export const Date_Value = [
  {
    label: "日",
    value: "1",
  },
  { label: "月", value: "2" },
  { label: "年", value: "3" },
];
//三张卡片内静态数据
export const EnergyData =[
  {
    title:"能耗情况",
    secTitle:"当日累计用电量",
    value1:"0.0",
    value2:"0.0",
    thrTitle:"上一日累计用电量",
    value3:"0.0",
  },
  {
    title:"节能情况",
    value1:"0.0",
    value2:"0.0",
    secTitle:"当日累计节能电量",
    thrTitle:"节能率",
    value3:"0.0",
  }, {
    title:"碳排情况",
    value1:"0.0",
    value2:"0.0",
    secTitle:"当日累计碳排",
    thrTitle:"昨日碳排",
    value3:"0.0",
  }
] 

export const  AirChartData={
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '0%',
    right: '0%',
    bottom: '0%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisTick: {
        alignWithLabel: true
      }
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: 'Direct',
      type: 'bar',
      barWidth: '60%',
      data: [10, 52, 200, 334, 390, 330, 220],
      itemStyle: {
        borderRadius: [10 ,10, 0, 0]
      }
    }
  ]
};

export const Radio_Options= [
  {
    label: "图表模式",
    value: "1",
  },
  { label: "列表模式", value: "2" },
];
export const Chart_Options = {
  // 标题配置
  // title: {
  //   text: '销售与访问量分析',
  //   subtext: '2023年数据',
  //   left: 'center'
  // },
  
  // 提示框配置
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow' // 阴影指示器
    },
    // 自定义提示框内容
    formatter: function(params) {
      let result = params[0].name + '<br/>';
      params.forEach(function(item) {
        let marker = item.marker;
        let seriesName = item.seriesName;
        let value = item.value;
        // 格式化数值
        if (seriesName.includes('金额')) {
          value = '¥' + value.toLocaleString();
        } else if (seriesName.includes('率')) {
          value = value + '%';
        }
        result += `${marker} ${seriesName}: ${value}<br/>`;
      });
      return result;
    }
  },
  
  // 图例配置
  legend: {
    data: ['今日能耗', '昨日能耗', '环比率'],
    top: 10
  },
  
  // 网格配置
  grid: {
    top: '10%',
    left: '5%',
    right: '5%',
    bottom: '3%',
    containLabel: true
  },
  
  // X轴配置
  xAxis: {
    type: 'category',
    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    axisPointer: {
      type: 'shadow'
    }
  },
  
  // Y轴配置（双Y轴）
  yAxis: [
    {
      type: 'value',
      name: '电量(kWh)',
      min: 0,
      axisLabel: {
        formatter: '¥{value}'
      },
      nameLocation: "middle",
      nameGap: 45,
      splitLine: {
        show: false // 不显示分割线
      }
    },
    {
      type: 'value',
      name: '环比率',
      nameLocation: "middle",
      nameGap: 45,
      min: 0,
      axisLabel: {
        formatter: function(value) {
          return value % 1 === 0 ? value : value + '%'; // 整数显示数量，小数显示百分比
        }
      }
    }
  ],
  
  // 系列配置
  series: [
    // 第一个柱状图（左Y轴）
    {
      name: '销售额',
      type: 'bar',
      barWidth: '30%',
      itemStyle: {
        color: '#5470C6'
      },
      data: [12000, 15000, 18000, 21000, 25000, 28000, 31000, 34000, 37000, 40000, 43000, 46000]
    },
    
    // 第二个柱状图（右Y轴）
    {
      name: '订单量',
      type: 'bar',
      barWidth: '30%',
      yAxisIndex: 1, // 使用第二个Y轴
      itemStyle: {
        color: '#91CC75'
      },
      data: [120, 150, 180, 210, 250, 280, 310, 340, 370, 400, 430, 460]
    },
    
    // 折线图（右Y轴）
    {
      name: '转化率',
      type: 'line',
      yAxisIndex: 1, // 使用第二个Y轴
      symbol: 'circle',
      symbolSize: 8,
      itemStyle: {
        color: '#EE6666'
      },
      lineStyle: {
        width: 3
      },
      data: [2.5, 2.8, 3.0, 3.2, 3.5, 3.7, 4.0, 4.2, 4.5, 4.7, 5.0, 5.2]
    }
  ]
};