import moment from "moment";
import { Typography } from 'antd'
const { Link } = Typography
export const Radio_Options = [
  {
    label: "自动控制",
    value: 0,
  },
  { label: "手动控制", value: 1 },
];
//控制状态
export const incontrol = [
  {
    label: "全部",
    value: 0,
  },
  { label: "成功", value: 1 },
  { label: "失败", value: 2 },
];

export const Init_Value = {
  dtype: 1,
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
    dataIndex: "csn",
    key: "csn",
    align: "center",
  },
  {
    title: "安装地址",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "操作类型",
    dataIndex: "ioName",
    key: "ioName",
  },
  {
    title: "模式",
    dataIndex: "workModeName",
    key: "workModeName",
  },
  {
    title: "风速",
    dataIndex: "windSpeedName",
    key: "windSpeedName",
  },
  {
    title: "空调温度（℃）",
    dataIndex: "temperatureName",
    key: "temperatureName",
  }, {
    title: "当前室内温度（℃）",
    dataIndex: "ambientTemp",
    key: "ambientTemp",
  },
  {
    title: "操作人",
    dataIndex: "sourceName",
    key: "sourceName",
  },
  {
    title: "控制状态",
    dataIndex: "resultDesc",
    key: "resultDesc",
    render: (_, record) => {
      return (<span style={{ color: record.resultDesc == '失败' ? '#ff0000fe' : '' }}>{record.resultDesc}</span>)
    }
  },
  {
    title: "操作时间",
    dataIndex: "createTime",
    key: "createTime",
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
      dataIndex: "csn",
      key: "csn",
      align: "center",
    },
    {
      title: "安装地址",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "操作类型",
      dataIndex: "ioName",
      key: "ioName",
    },
    {
      title: "模式",
      dataIndex: "workModeName",
      key: "workModeName",
    },
    {
      title: "风速",
      dataIndex: "windSpeedName",
      key: "windSpeedName",
    },
    {
      title: "空调温度（℃）",
      dataIndex: "temperature",
      key: "temperature",
    }, {
      title: "当前室内温度（℃）",
      dataIndex: "ambientTemp",
      key: "ambientTemp",
    },
    {
      title: "空调方案",
      dataIndex: "sourceName",
      key: "sourceName",
      render: (_, record) => {
        return (
          <Link onClick={() => OpenAirScheme(record)}>{record.sourceName}</Link>
        )
      }
    },
    {
      title: "控制状态",
      dataIndex: "resultDesc",
      key: "resultDesc",
      render: (_, record) => {
        return (<span style={{ color: record.resultDesc == '失败' ? '#ff0000fe' : '' }}>{record.resultDesc}</span>)
      }
    },
    {
      title: "操作时间",
      dataIndex: "createTime",
      key: "createTime",
    },
  ];


//报警头部初始化信息
export const AlarmHeader = {
  type: null,
  // dateRange:[moment(), moment()]
};
