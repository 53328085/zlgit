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
    dataIndex: "csn",
    key: "csn",
    width: 122,
    fixed: 'left',
  },
  {
    title: "总开机时长 （h）",
    dataIndex: "tu",
    key: "tu",
    width: 140,
    sorter: {
      compare: (a, b) => a.partitionTime - b.partitionTime,
      multiple: 1,
    },
  },
  {
    title: "电量(kWh)",
    dataIndex: "eu",
    key: "eu",
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
    dataIndex: "openNum",
    key: "openNum",
    width: 79,
  },
  {
    title: "关闭频次",
    dataIndex: "closeNum",
    key: "closeNum",
    width: 93,
  },
  {
    title: "空调类型",
    dataIndex: "typeName",
    key: "typeName",
    width: 110,
  },
  {
    title: "安装地址",
    dataIndex: "address",
    key: "address",

  },
];
//空调节能表头
export const TbColAir = [
  {
    title: "设备名称",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "通讯地址",
    dataIndex: "csn",
    key: "csn",
  },
  {
    title: "节能时长(h)",
    dataIndex: "ts",
    key: "ts",
    sorter: {
      compare: (a, b) => a.partitionTime - b.partitionTime,
      multiple: 1,
    },
  },
  {
    title: "节能电量(kWh)",
    dataIndex: "es",
    key: "es",
  },
    {
    title: "节能费用(元)",
    dataIndex: "ms",
    key: "ms",
  },
  {
    title: "空调类型",
    dataIndex: "typeName",
    key: "typeName",
  },
  {
    title: "安装地址",
    dataIndex: "address",
    key: "address",
  },
]

export const PieOption = {

  tooltip: {
    trigger: 'item'
  },
  legend: {
    top: 'middle',   // 垂直居中
    right: 10,
    orient: 'vertical',
    type: 'scroll',
    // 当图例过长时的滚动配置
    height: '60%',  // 限制图例高度，避免覆盖饼图
    itemGap: 8,     // 减小图例项间距
    textStyle: {
      fontSize: 12,  // 保持原始字体大小
      width: 80,     // 限制文字宽度，超出则截断
      overflow: 'truncate',  // 文字超出时截断
      ellipsis: '...'        // 添加省略号
    },
    // 滚动分页配置
    pageButtonItemGap: 5,
    pageIconSize: 12,
    pageTextStyle: {
      fontSize: 10
    }
  },
  xAxis: {
    show: false
  },

  series: [
    {
      // name: 'Access From',
      type: 'pie',
      center: ['40%', '50%'],  // 调整为更居中的位置，与垂直居中的图例配合
      radius: ['45%', '65%'],  // 稍微缩小饼图半径
      avoidLabelOverlap: true,
      label: {
        show: false,
        position: 'center'
      },
      labelLine: {
        show: false
      },
      data: [
      
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
    formatter: function (params) {
      let result = params[0].name + '<br/>';
      params.forEach(function (item) {
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
    data: [],
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
        formatter: '{value}'
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
        formatter: function (value) {
          return value % 1 === 0 ? value : value + '%'; // 整数显示数量，小数显示百分比
        }
      }
    }
  ],

  // 系列配置
  series: [
    // 第一个柱状图（左Y轴）
    {
      name: '今日能耗(kWh)',
      type: 'bar',
      barWidth: '30%',
      itemStyle: {
        color: '#6395fa'
      },
      data: []
    },

    // 第二个柱状图（右Y轴）
    {
      name: '昨日能耗(kWh)',
      type: 'bar',
      barWidth: '30%',
      yAxisIndex: 0, 
      itemStyle: {
        color: '#63daab'
      },
      data: []
    },

    // 折线图（右Y轴）
    {
      name: '环比率',
      type: 'line',
      yAxisIndex: 1, // 使用第二个Y轴
      symbol: 'circle',
      symbolSize: 8,
      itemStyle: {
        color: '#5d7092'
      },
      lineStyle: {
        width: 3
      },
      data: []
    }
  ]
};

export const Column_Options = {
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
      data: [],
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
      name: '节能电量(kWh)',
      type: 'bar',
      barWidth: '60%',
      itemStyle: {
        color: '#63daab',  // 绿色 - 代表节能环保

      },
      data: []
    }
  ]
}

export const MdTbCol = [
  {
    title: "时间",
    dataIndex: "address2",
    key: "address2",

  }, {
    title: "起始示值",
    dataIndex: "address2",
    key: "address2",

  },
  {
    title: "结束示值",
    dataIndex: "address2",
    key: "address2",

  }, {
    title: "综合倍率",
    dataIndex: "address2",
    key: "address2",

  }, {
    title: "用电量",
    dataIndex: "address2",
    key: "address2",

  }
]
export const MdOptions = {
  grid: {
    left: '5%',
    right: '5%',
    bottom: '3%'
  },
  xAxis: {
    type: 'category',
    data: []
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [],
      type: 'bar'
    }
  ]
};
export const MdColHidden = [
  {
    title: "",
    dataIndex: "value1",
    key: "value1",
    width: 203,
    className: "bg"
  },
  {
    title: "",
    dataIndex: "value2",
    key: "value2",
    width: 203
  },
  {
    title: "",
    dataIndex: "value3",
    key: "value3",
    width: 203,
    className: "bg"
  }, {
    title: "",
    dataIndex: "value4",
    key: "value4",
    width: 203
  }
]
export const PlainColumns = [{
  title: "操作时间",
  dataIndex: "createTime",
  key: "createTime",
  width: 203
}, {
  title: "开关状态",
  dataIndex: "ioName",
  key: "ioName",
  width: 122
}, {
  title: "设定温度",
  dataIndex: "tempset",
  key: "tempset",
  width: 122,
  render: (text) => <>{text}℃</>
}, {
  title: "操作人",
  dataIndex: "sourceName",
  key: "sourceName",
  width: 122
}, {
  title: "控制类型",
  dataIndex: "controlType",
  key: "controlType",
  width: 122
}]