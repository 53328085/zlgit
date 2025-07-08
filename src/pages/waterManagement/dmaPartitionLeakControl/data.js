import moment from "moment";
export const Radio_Options = [
  {
    label: "本级管网漏损",
    value: "1",
  },
  { label: "分区报警", value: "2" },
];
export const Date_Value = [
  {
    label: "日",
    value: "1",
  },
  { label: "月", value: "2" },
  { label: "年", value: "3" },
];

export const Init_Value = {
  dtype: "1",
  date: moment(),
};
//仪表盘数据
export const Guage_Data = {
  series: [
    {
      type: "gauge",
      startAngle: 180,
      endAngle: 0,
      center: ["50%", "75%"],
      radius: "120%",
      min: 0,
      max: 100,
      splitNumber: 4,
      axisLabel: {
        interval: 2, // 每隔2个刻度显示一个标签(0=全部显示,1=隔一个显示,2=隔两个显示)
        distance: 5,
        fontSize: 10,
        formatter: function (val) {
          //解决刻度的值为浮点数问题
          return Math.ceil(val);
        },
      },
      axisLine: {
        lineStyle: {
          width: 10,
          color: [
            [0.33, "#3d94ff"],
            [0.66, "#ffac2a"],
            [1, "#ff2a2a"],
          ],
        },
      },

      pointer: {
        icon: "path://M12.8,0.7l12,40.1H0.7L12.8,0.7z",
        length: "50%",
        width: 6,
        offsetCenter: [0, "-10%"],
        itemStyle: {
          color: "auto",
        },
      },
      axisTick: {
        distance: 0,
        length: 5,
        lineStyle: {
          color: "auto",
          width: 2,
        },
      },
    

      splitLine: {
        length: 0,
        lineStyle: {
          color: "auto",
          width: 3,
        },
      },

      title: {
        offsetCenter: [0, "-10%"],
        fontSize: 10,
      },
      detail: {
        fontSize: 20,
        offsetCenter: [0, "25%"],
        valueAnimation: true,
        formatter: function (value) {
          return value + "%";
        },
        color: "#000",
      },
      data: [
        {
          value: 0,
          name: "",
        },
      ],
    },
  ],
};
export const Type_Options = [
  {
    label: "图表模式",
    value: "1",
  },
  { label: "列表模式", value: "2" },
];
//双柱状图数据
export const Double_Option = {
  // 共享的 legend 配置
  legend: {
    data: ["漏损量", "漏损率", "分区供水量","分区用水量"], // 两个图表共用的图例项
    top: 0, // 图例位置
  },

  // 定义两个图表的位置和大小
  grid: [
    // 上方图表 grid 配置
    {
      top: 30, // 距离顶部距离
      height: "40%", // 高度占比
      left: "5%", // 左右边距
      right: "1%",
    },
    // 下方图表 grid 配置
    {
      top: "50%", // 位置在上图下方
      height: "40%",
      left: "5%",
      right: "1%",
      bottom: "0%",
    },
  ],

  // x轴配置 (两个独立的x轴)
  xAxis: [
    // 上方图表的x轴
    {
      type: "category",
      data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
      gridIndex: 0, // 关联到第一个grid
      axisLabel: { interval: 0 },
    },
    // 下方图表的x轴
    {
      type: "category",
      data: ["一月", "二月", "三月", "四月", "五月", "六月"],
      gridIndex: 1, // 关联到第二个grid
      axisLabel: { interval: 0 },
    },
  ],

  // y轴配置 (两个独立的y轴)
  yAxis: [
    // 上方图表的y轴
    {
      type: "value",
      gridIndex: 0,
      name: "漏损量",
      nameLocation: "middle",
      nameGap: 45,
    },
    // 下方图表的y轴
    {
      type: "value",
      gridIndex: 1,
      name: "水量",
      nameLocation: "middle",
      nameGap: 45,
    },
  ],

  // 系列数据配置
  series: [
    // 上方图表的数据系列
    {
      name: "数据A",
      type: "bar",
      xAxisIndex: 0, // 使用第一个x轴
      yAxisIndex: 0, // 使用第一个y轴
      data: [120, 132, 101, 134, 90, 230, 210],
      symbol: "circle",
      symbolSize: 8,
    },
    {
      name: "数据B",
      type: "bar",
      xAxisIndex: 0,
      yAxisIndex: 0,
      data: [220, 182, 191, 234, 290, 330, 310],
      symbol: "circle",
      symbolSize: 8,
    },

    // 下方图表的数据系列
    {
      name: "数据A",
      type: "bar",
      xAxisIndex: 1, // 使用第二个x轴
      yAxisIndex: 1, // 使用第二个y轴
      data: [1200, 1600, 1500, 1800, 2000, 1900],
      symbol: "circle",
      symbolSize: 8,
    },
    {
      name: "数据C",
      type: "bar",
      xAxisIndex: 1,
      yAxisIndex: 1,
      data: [800, 900, 1000, 1100, 1200, 1300],
      symbol: "circle",
      symbolSize: 8,
    },
  ],
};

export const TbHeader = [
  {
    title: "时间点",
    dataIndex: "partitionTime",
    key: "partitionTime",
    sorter: {
      compare: (a, b) => a.partitionTime - b.partitionTime,
      multiple: 1,
    },
  },
  {
    title: "分区供水量（m³）",
    dataIndex: "supplyValue",
    key: "supplyValue",
    sorter: {
      compare: (a, b) => a.supplyValue - b.supplyValue,
      multiple: 2,
    },
  },
  {
    title: "分区用水量（m³）",
    dataIndex: "useValue",
    key: "useValue",
    sorter: {
      compare: (a, b) => a.useValue - b.useValue,
      multiple: 3,
    },
  },
  {
    title: "漏损水量（m³）",
    dataIndex: "leakageValue",
    key: "leakageValue",
    sorter: {
      compare: (a, b) => a.leakageValue - b.leakageValue,
      multiple: 4,
    },
  },
  {
    title: "漏损率（%）",
    dataIndex: "leakageRate",
    key: "leakageRate",
    sorter: {
      compare: (a, b) => a.leakageRate - b.leakageRate,
      multiple: 5,
    },
  },
  {
    title: "抄见率（%）",
    dataIndex: "readingRate",
    key: "readingRate",
    sorter: {
      compare: (a, b) => a.readingRate - b.readingRate,
      multiple: 6,
    },
  },
];
//分区报警表格头部
export const PartitionAlarmTableColumns = [
  {
    title: "触发报警规则",
    dataIndex: "alarmType",
    key: "alarmType",
  },
  {
    title: "报警级别",
    dataIndex: "level",
    key: "level",
    align: "center",
  },
  {
    title: "首次报警时间",
    dataIndex: "firstAlarmTime",
    key: "firstAlarmTime",
  },
  {
    title: "最新报警时间",
    dataIndex: "latestAlarmTime",
    key: "latestAlarmTime",
  },
  {
    title: "报警重复次数",
    dataIndex: "repeatTimes",
    key: "repeatTimes",
  },
];

//分区报警表格数据
export const PartitionAlarmTableData = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["nice", "developer"],
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["loser"],
  },
];

//报警等级
export const AlarmLevel = [
  {
    value: null,
    label: "全部",
  },
  {
    value: "1",
    label: "一级（特别严重）",
  },
  {
    value: "2",
    label: "二级（严重）",
  },
  {
    value: "3",
    label: "三级（较重）",
  },
  {
    value: "4",
    label: "四级（一般）",
  },
];

//报警头部初始化信息
export const AlarmHeader = {
  type: null,
  // dateRange:[moment(), moment()]
};
