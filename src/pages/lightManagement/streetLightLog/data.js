 
export const cols = [
  {
    title: "方案名称",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "绑定路灯数",
    dataIndex: "bindNum",
    key: "bindNum",
  },
  {
    title: "控制成功路灯数",
    dataIndex: "success",
    key: "success",
  },
  {
    title: "控制失败路灯数",
    dataIndex: "fail",
    key: "fail",
  },
  {
    title: "控制成功率(%)",
    dataIndex: "percent",
    key: "percent",
    render: (text) => Number.isFinite(parseFloat(text)) ? text+"%" : "-"
  },
  {
    title: "执行时间",
    dataIndex: "excuteTime",
    key: "excuteTime",
  }, 
];