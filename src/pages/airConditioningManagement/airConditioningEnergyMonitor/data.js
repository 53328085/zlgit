import moment from "moment";
export const Radio_Options = [
  {
    label: "空调用能",
    value: "1",
  },
  { label: "空调节能", value: "2" },
];
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
export const Table_Option = [
  {
    label: "列表模式",
    value: "1",
  },
  { label: "图表模式", value: "2" },
];

//空调用能表头
export const TbCol = [
  {
    title: "设备名称",
    dataIndex: "name",
    key: "name",
    width: 138,
    fixed: 'left',
  },
  {
    title: "通讯地址",
    dataIndex: "address",
    key: "address",
    width: 122,
    fixed: 'left',
  },
  {
    title: "总开机时长 （h）",
    dataIndex: "time",
    key: "time",
    width: 140,
    sorter: {
      compare: (a, b) => a.partitionTime - b.partitionTime,
      multiple: 1,
    },
  },
  {
    title: "电量(kWh)",
    dataIndex: "elec",
    key: "elec",
    width: 109,
  },
  {
    title: "开机时段",
    dataIndex: "timecol",
    key: "timecol",
    width: 639,
  },
  {
    title: "开启频次",
    dataIndex: "enable",
    key: "enable",
    width: 79,
  },
  {
    title: "关闭频次",
    dataIndex: "close",
    key: "close",
    width: 93,
  },
  {
    title: "空调类型",
    dataIndex: "type",
    key: "type",
    width: 110,
  },
  {
    title: "安装地址",
    dataIndex: "address2",
    key: "address2",

  },
];
//空调节能表头
export const TbColAir =[
    {
        title: "设备名称",
        dataIndex: "partitionTime",
        key: "partitionTime",
      },
      {
        title: "通讯地址",
        dataIndex: "partitionTime",
        key: "partitionTime",
      },
      {
        title: "节能时长(h)",
        dataIndex: "partitionTime",
        key: "partitionTime",
        sorter: {
          compare: (a, b) => a.partitionTime - b.partitionTime,
          multiple: 1,
        },
      },
      {
        title: "时间段",
        dataIndex: "partitionTime",
        key: "partitionTime",
      },
      {
        title: "空调类型",
        dataIndex: "partitionTime",
        key: "partitionTime",
      },
      {
        title: "安装地址",
        dataIndex: "partitionTime",
        key: "partitionTime",
      },
]

export const PieOption = {

  tooltip: {
    trigger: 'item'
  },
  legend: {
    top:"28%",
    right: 10,
    orient: 'vertical',
  },
  xAxis:{
    show:false
  },

  series: [
    {
      name: 'Access From',
      type: 'pie',
      center: ['38%', '50%'],
      radius: ['50%', '70%'],
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 40,
          fontWeight: 'bold'
        },
      },
      labelLine: {
        show: false
      },
      data: [
        { value: 1048, name: 'Search Engine' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' },
        { value: 300, name: 'Video Ads' }
      ]
    }
  ]
};
export const Chart_Options = {
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
      nameGap: 60,
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

export const Column_Options={
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
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
      data: [10, 52, 200, 334, 390, 330, 220]
    }
  ]
}

export const MdTbCol=[
  {
    title: "时间",
    dataIndex: "address2",
    key: "address2",

  },{
    title: "起始示值",
    dataIndex: "address2",
    key: "address2",

  },
  {
    title: "结束示值",
    dataIndex: "address2",
    key: "address2",

  },{
    title: "综合倍率",
    dataIndex: "address2",
    key: "address2",

  },{
    title: "用电量",
    dataIndex: "address2",
    key: "address2",

  }
]
export const MdOptions= {
  grid:{
    left:'5%',
    right:'5%',
    bottom:'3%'
  },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'bar'
    }
  ]
};
export const MdColHidden=[
  {
    title: "",
    dataIndex: "name",
    key: "name",
    width:203,
    className:"bg"
  },
  {
    title: "",
    dataIndex: "age",
    key: "age",
    width:203
  },
  {
    title: "",
    dataIndex: "address",
    key: "address",
    width:203,
     className:"bg"
  }, {
    title: "",
    dataIndex: "key",
    key: "key",
    width:203
  }
]
export const MdTbData=[{
  key: '1',
  name: '设备名称',
  age: 32,
  address: '通信地址',
},{
  key: '1',
  name: '所属区域',
  age: 32,
  address: '安装地址',
}]

export const PlainOptions=[{ label: '全部', value: 0},{ label: '开启', value: 1},{ label: '关闭', value: 2}]
export const PlainColumns=[{
  title: "操作时间",
  dataIndex: "age",
  key: "age",
  width:203
},{
  title: "开关状态",
  dataIndex: "age",
  key: "age",
  width:122
},{
  title: "设定温度",
  dataIndex: "age",
  key: "age",
  width:122
},{
  title: "操作人",
  dataIndex: "age",
  key: "age",
  width:122
},{
  title: "控制类型",
  dataIndex: "age",
  key: "age",
  width:122
}]