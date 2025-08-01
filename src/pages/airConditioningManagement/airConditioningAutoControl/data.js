export const schemeNameData = ["温度上下限", "无人关闭", "超时关闭", "关窗提醒", "合理控温"]
export const airTypeOptions = [
  { label: "全部", value: 0 },
  { label: "分体式空调", value: 1 },
  { label: "多联机空调", value: 3 },
  { label: "中央空调面板", value: 4 },
];
export const cols = [
  {
    title: "园区名称",
    dataIndex: "areaName",
    key: "areaName",
  },
  {
    title: "空调名称",
    dataIndex: "conditionerName",
    key: "conditionerName",
  },
  {
    title: "空调型号",
    dataIndex: "model",
    key: "model",
  },
  {
    title: "通信地址",
    dataIndex: "csn",
    key: "csn",
  },
  {
    title: "所属网关",
    dataIndex: "gsn",
    key: "gsn",
  },
  {
    title: "所属计量设备",
    dataIndex: "msn",
    key: "msn",
  },
  {
    title: "安装地址",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "空调类型",
    dataIndex: "typeName",
    key: "typeName",
    render: (type) => airTypeOptions.find((a) => a.value == type)?.label,
  },
  {
    title: "备注",
    dataIndex: "remark",
    key: "remark",
  },
];