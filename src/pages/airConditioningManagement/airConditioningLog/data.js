import moment from "moment";
import { Typography } from 'antd'
const { Link } = Typography
export const Radio_Options = [
  {
    label: "自动控制",
    value: "1",
  },
  { label: "手动控制", value: "2" },
];
//空调方案
export const AirScheme = [
  {
    value: "1",
    label: "全部",
  },
  {
    value: "2",
    label: "会议室空调方案",
  },
  {
    value: "3",
    label: "展厅空调方案",
  },
  {
    value: "4",
    label: "产线空调方案",
  },
];
//控制状态
export const incontrol = [
  {
    label: "全部",
    value: "1",
  },
  { label: "成功", value: "2" },
  { label: "失败", value: "3" },
];

export const Init_Value = {
  dtype: "1",
  date: moment(),
};


//空调手动控制记录表格头部
export const AirManualControlTableColumns = [
  {
    title: "设备名称",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "通信地址",
    dataIndex: "address",
    key: "address",
    align: "center",
  },
  {
    title: "安装地址",
    dataIndex: "location",
    key: "location",
  },
  {
    title: "操作类型",
    dataIndex: "operation",
    key: "operation",
  },
  {
    title: "模式",
    dataIndex: "mode",
    key: "mode",
  }, {
    title: "空调温度（℃）",
    dataIndex: "temp",
    key: "temp",
  }, {
    title: "当前室内温度（℃）",
    dataIndex: "currentTemp",
    key: "currentTemp",
  },
  {
    title: "操作人",
    dataIndex: "operator",
    key: "operator",
  },
  {
    title: "控制状态",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "操作时间",
    dataIndex: "time",
    key: "time",
  },
];

//空调自动控制记录表格表头
export const AirAutomaticControlTableColumns =
  ({ OpenAirScheme }) => [
    {
      title: "设备名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "通信地址",
      dataIndex: "address",
      key: "address",
      align: "center",
    },
    {
      title: "安装地址",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "操作类型",
      dataIndex: "operation",
      key: "operation",
    },
    {
      title: "模式",
      dataIndex: "mode",
      key: "mode",
    }, {
      title: "空调温度（℃）",
      dataIndex: "temp",
      key: "temp",
    }, {
      title: "当前室内温度（℃）",
      dataIndex: "currentTemp",
      key: "currentTemp",
    },
    {
      title: "空调方案",
      dataIndex: "operator",
      key: "operator",
      render: (_, record) => {
        return (
          <Link onClick={() => OpenAirScheme(record)}>{record.operator}</Link>
        )
      }
    },
    {
      title: "控制状态",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "操作时间",
      dataIndex: "time",
      key: "time",
    },
  ];


//报警头部初始化信息
export const AlarmHeader = {
  type: null,
  // dateRange:[moment(), moment()]
};
