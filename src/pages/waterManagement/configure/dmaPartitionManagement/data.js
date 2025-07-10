 
export const options = [
  {
    label: "区域", value:1,
  },
  {
    label: "园区", value:2,
  },
  {
    label: "工厂", value:3,
  },
  {
    label: "医院", value:4,
  },
  {
    label: "学校", value:5,
  },
  {
    label: "单位", value:6,
  },
  {
    label: "社区", value:7,
  },
  {
    label: "楼宇", value:8,
  },
  {
    label: "小区", value:9,
  }
]
export const cols = [
  {
    title: "分区名称",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "分区编号",
    dataIndex: "code",
    key: "code",
    sorter: true,
  },
  {
    title: "分区级别",
    dataIndex: "level",
    key: "level",
    sorter: true,
  },
  {
    title: "分区类型",
    dataIndex: "partitionType",
    key: "partitionType",
    render:(text) => {
       return options.find(o => o.value==text)?.label ?? ""
    }
  },
  {
    title: "管理总表（只）",
    dataIndex: "manageMeterNumber",
    key: "manageMeterNumber",
  },
  {
    title: "管理分表（只）",
    dataIndex: "LargeConsumerNumbe",
    key: "LargeConsumerNumbe",
  },
  {
    title: "用水表（只）",
    dataIndex: "waterMeterNumber",
    key: "waterMeterNumber",
  },
/*   {
    title: "下级分区",
    dataIndex: "typeName",
    key: "typeName",
  },  */
];
 
export const loptions = [
  {
    label: '全部',
    value: '0',
  },
  {
    label: '一级',
    value: '1',
  },
  {
    label: '二级',
    value: '2',
  },
  {
    label: '三级',
    value: '3',
  },
  {
    label: '四级',
    value: '4',
  },
];
export const tabs =[
  { key: '1', label: '分区档案' },
  { key: '2', label: '关联表具' },
  { key: '3', label: '报警配置' },
]
export const rules = [
  {
    required: true
  }
]
export const partType =[
  {
    label: "普通",
    value: "1"
  },
  {
    label: "DMA",
    value: "2"
  },

]
export const rateType =[
  {
    label: "按天生成",
    value: "1"
  },
  {
    label: "按月生成",
    value: "2"
  },

]
export const iscomputer =[
  {
    label: "计算",
    value: "1"
  },
  {
    label: "不计算",
    value: "2"
  },

]
export const alarmoption =[
  {
    label: "一级(特别严重)",
    value: "1"
  },
  {
    label: "二级(严重)",
    value: "2"
  },
  {
    label: "三级(较重)",
    value: "3"
  },
  {
    label: "一般",
    value: "4"
  },
]