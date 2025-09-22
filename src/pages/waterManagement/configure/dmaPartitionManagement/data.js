 
export const options = [
  {
    label: "全部", value:0,
  },
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
    value: 1
  },
  {
    label: "DMA",
    value: 2
  },

]
export const rateType =[
  {
    label: "按天生成",
    value: 2
  },
  {
    label: "按月生成",
    value: 3
  },

]
export const iscomputer =[
  {
    label: "计算",
    value: 1
  },
  {
    label: "不计算",
    value: 2
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
export const custvalidfn = (filed) => {
  return  ({getFieldValue})=>  ({
    validator(_, value) {
      let minValue =  getFieldValue(filed)
      if( value &&  minValue) {
         if(value > minValue) {
          return Promise.resolve()
         }else {
          return Promise.reject("最大值必须大于最小值")
         }
      }
    }
  })
}
export const unbindcols = [
  {
    title: "表具名称",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "表具编号",
    dataIndex: "sn",
    key: "sn",
  },
  {
    title: "表具型号",
    dataIndex: "category",
    key: "category",
  },
  {
    title: "安装地址",
    dataIndex: "address",
    key: "address",
  },
]
export const purpose=[
 {
  label: "管理总表",
  value:1,
 },
 {
  label: "管理分表",
  value:3,
 },
 {
  label: "用水表",
  value:2,
 }
]
export const direction =[
  {
    label: "进水",
    value:1,
   },
   {
    label: "出水",
    value:2,
   }
]
export const userType=[
  {
    label: "住户表",
    value:1,
  },
  {
    label: "商铺",
    value:2,
  }, 
  {
    label: "消防",
    value:3,
  },
  {
    label: "绿化",
    value:4,
  },
  {
    label: "物业",
    value:5,
  }
]

export const bindcols = [
  {
    title: "表具编号",
    dataIndex: "sn",
    key: "sn",
    sorter:true,
  },
  {
    title: "表具名称",
    dataIndex: "name",
    key: "name",
    sorter:true
  },
  {
    title: "表具用途",
    dataIndex: "meterPurpose",
    key: "meterPurpose",
    render: (t) => purpose?.find(o=>o.value==t)?.label
  },
  {
    title: "供水方向",
    dataIndex: "waterSupplyDirection",
    key: "waterSupplyDirection",
    render: (t, row) => row.meterPurpose==1 ? direction?.find(o=>o.value==t)?.label : ""
  },
 /*  {
    title: "清洗区间",
    dataIndex: "",
    key: "waterSupplyDirection",
    render: (t) => direction?.find(o=>o.value==t)?.value
  }, */
  {
    title: "用水类型",
    dataIndex: "waterType",
    key: "waterType",
    render: (t) => userType?.find(o=>o.value==t)?.label
  },
  {
    title: "表具型号",
    dataIndex: "category",
    key: "category",
  },
  {
    title: "安装地址",
    dataIndex: "address",
    key: "address",
    sorter:true,
  },
]