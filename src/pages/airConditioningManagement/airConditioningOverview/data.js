import moment from "moment";
import imgUrl from "./imgs/index";
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
export const EnergyData = [
  {
    title: "能耗情况",
    secTitle: "当日累计用电量",
    value1: "0.1",
    value2: "0.2",
    thrTitle: "上一日累计用电量",
    value3: "0.3",
    imgurl: imgUrl.energy,
  },
  {
    title: "节能情况",
    value1: "0.0",
    value2: "0.0",
    secTitle: "当日累计节能电量",
    thrTitle: "节能率",
    value3: "0.0",
    imgurl: imgUrl.save,
  },
  {
    title: "碳排情况",
    value1: "0.0",
    value2: "0.0",
    secTitle: "当日累计碳排",
    thrTitle: "昨日碳排",
    value3: "0.0",
    imgurl: imgUrl.co2,
  },
];

export const AirChartData = {
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
  },
  grid: {
    left: "0%",
    right: "0%",
    bottom: "0%",
    top: "6%",
    containLabel: true,
  },
  xAxis: [
    {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      axisTick: {
        alignWithLabel: true,
      },
    },
  ],
  yAxis: [
    {
      type: "value",
    },
  ],
  series: [
    {
      name: "Direct",
      type: "bar",
      barWidth: "60%",
      data: [10, 52, 200, 334, 390, 330, 220],
      itemStyle: {
        borderRadius: [10, 10, 0, 0],
        color: "#10c6ee",
      },
    },
  ],
};

export const Radio_Options = [
  {
    label: "图表模式",
    value: "1",
  },
  { label: "列表模式", value: "2" },
];
export const Chart_Options = {
  // 提示框配置
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow", // 阴影指示器
    },
    // 自定义提示框内容
    formatter: function (params) {
      let result = params[0].name + "<br/>";
      params.forEach(function (item) {
        let marker = item.marker;
        let seriesName = item.seriesName;
        let value = item.value;
        // 格式化数值
        if (seriesName.includes("金额")) {
          value = "¥" + value.toLocaleString();
        } else if (seriesName.includes("率")) {
          value = value + "%";
        }
        result += `${marker} ${seriesName}: ${value}<br/>`;
      });
      return result;
    },
  },

  // 图例配置
  legend: {
    data: ["今日能耗", "昨日能耗", "环比率"],
    top: 10,
  },

  // 网格配置
  grid: {
    top: "10%",
    left: "5%",
    right: "5%",
    bottom: "3%",
    containLabel: true,
  },

  // X轴配置
  xAxis: {
    type: "category",
    data: [
      "1月",
      "2月",
      "3月",
      "4月",
      "5月",
      "6月",
      "7月",
      "8月",
      "9月",
      "10月",
      "11月",
      "12月",
    ],
    axisPointer: {
      type: "shadow",
    },
  },

  // Y轴配置（双Y轴）
  yAxis: [
    {
      type: "value",
      name: "电量(kWh)",
      min: 0,
      axisLabel: {
        formatter: "¥{value}",
      },
      nameLocation: "middle",
      nameGap: 45,
      splitLine: {
        show: false, // 不显示分割线
      },
    },
    {
      type: "value",
      name: "环比率",
      nameLocation: "middle",
      nameGap: 45,
      min: 0,
      axisLabel: {
        formatter: function (value) {
          return value % 1 === 0 ? value : value + "%"; // 整数显示数量，小数显示百分比
        },
      },
    },
  ],

  // 系列配置
  series: [
    // 第一个柱状图（左Y轴）
    {
      name: "今日能耗",
      type: "bar",
      barWidth: "30%",
      itemStyle: {
        color: "#6395fa",
      },
      data: [10, 52, 200, 334, 390, 330, 220],
    },

    // 第二个柱状图（右Y轴）
    {
      name: "昨日能耗",
      type: "bar",
      barWidth: "30%",
      yAxisIndex: 1, // 使用第二个Y轴
      itemStyle: {
        color: "#63daab",
      },
      data: [390, 330, 220, 10, 52, 200, 334],
    },

    // 折线图（右Y轴）
    {
      name: "环比率",
      type: "line",
      yAxisIndex: 1, // 使用第二个Y轴
      symbol: "circle",
      symbolSize: 8,
      itemStyle: {
        color: "#5d7092",
      },
      lineStyle: {
        width: 3,
      },
      data: [],
    },
  ],
};

export const TbHeader = [
  {
    title: "时间",
    dataIndex: "date",
    key: "date",

    sorter: {
      compare: (a, b) => a.date - b.date,
      multiple: 1,
    },
  },
  {
    title: "用电量（kWh）",
    dataIndex: "periodUseE",
    key: "periodUseE",
    defaultSortOrder: "ascend",
    sorter: {
      compare: (a, b) => a.periodUseE - b.periodUseE,
      multiple: 2,
    },
  },
  {
    title: "环比昨日用电量 (kWh)",
    dataIndex: "lastPeriodUseE",
    key: "lastPeriodUseE",
    sorter: {
      compare: (a, b) => a.lastPeriodUseE - b.lastPeriodUseE,
      multiple: 3,
    },
  },
  {
    title: "环比",
    dataIndex: "mom",
    key: "mom",
    sorter: {
      compare: (a, b) =>
        parseFloat(a.lastPeriodUseE) - parseFloat(b.lastPeriodUseE),
      multiple: 3,
    },
  },
  {
    title: "同比去年用电量 (kWh)",
    dataIndex: "lastYearPeriodUseE",
    key: "lastYearPeriodUseE",
    sorter: {
      compare: (a, b) => a.lastYearPeriodUseE - b.lastYearPeriodUseE,
      multiple: 3,
    },
  },
  {
    title: "同比",
    dataIndex: "yoy",
    key: "yoy",
    sorter: {
      compare: (a, b) => parseFloat(a.yoy) - parseFloat(b.yoy),
      multiple: 4,
    },
  },
];
