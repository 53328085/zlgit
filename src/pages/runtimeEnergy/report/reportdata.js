 
 
export const cols = (startDate, endDate) => {
 
  return [ // 实时抄表  
    {
      title: '设备编号',
      dataIndex: 'sn',
      key: "sn",
      sorter: (a, b) => a?.sn?.localeCompare?.(b?.sn)
    },
    {
      title: '设备名称',
      dataIndex: 'name',
      key: "name",
      sorter: (a, b) => a?.name?.localeCompare?.(b?.name),
      ellipsis:true
    },
    {
      title: '区域名称',
      dataIndex: 'nodeName',
      key: 'nodeName',
      sorter: (a, b) => a?.nodeName?.localeCompare?.(b?.nodeName),
      ellipsis:true
    },
    {
      title: '安装位置',
      dataIndex: 'address',
      key: "address",
      sorter: (a, b) => a?.address?.localeCompare?.(b?.address),
      ellipsis:true
    },
    {
      title: '开始日期',
      dataIndex: 'startDate',
      key: "startDate",
      render: (text, record, index) => startDate
    },
    {
      title: '结束日期',
      dataIndex: 'startDate',
      key: "startDate",
      render: (text, record, index) => endDate
    },
    {
      title: '起始读数',
      dataIndex: 'start',
      key: "start",
    }, {
      title: '结束读数',
      dataIndex: 'end',
      key: "end",
    },
    {
      title:  '用能(kWh)',
      dataIndex: 'consume',
      key: "consume",
      sorter: (a, b) => parseFloat(a?.consume) - parseFloat(b?.consume)
    },
    
  ]
 
}
 
 
export let conscols = [   //  conscols 能耗报表  
  {
    title: '区域名称',
    dataIndex: 'nodeName',
    key: "nodeName", 
    width: 100, 
    ellipsis:true, 
   // sorter: (a, b) => a?.nodeName?.localeCompare?.(b?.nodeName),
    
  },
  {
    title: '设备名称',
    dataIndex: 'name',
    width: 84,
    key: "name",
    fixed: 'left',
    ellipsis:true, 
   // sorter: (a, b) => a?.name?.localeCompare?.(b?.name),
  },
  {
    title: '设备编号',
    dataIndex: 'sn',
    width: 134,
    key: "sn",
    fixed: 'left',
    
    
  },
  {
    title: '安装地址',
    dataIndex: "address",
    key: "address",
    width: 84,
    ellipsis:true,
    fixed:"left", 
  },
  {
    title: '总用能',
    dataIndex: 'total',
    key: "total",
    width: 92,
    sorter: (a, b) => parseFloat(a?.total) - parseFloat(b?.total),
  },
   {
    title: '综合倍率',
    dataIndex: 'ratio',
    key: "ratio",
  },
  {
    title: '起始读数',
    key: "sr", 
     hidden:true,
    
  },{
    title: '结束读数',
    key: "er", 
     hidden:true,
   
  },{
    title: '用能',
    key: "pw", 
     hidden:true,
  }, 
]
export const Nhconfig ={  // 能耗表格配置
  nodeName:{
    disable:true,
     fixed:'left',
  },
  name: {
    disable:true,
     fixed:'left',
  },
  sn:{
    disable:true,
     fixed:'left',
  },
  total:{
    disable:true,
    fixed:'left',
  },
 address:{
   show:false,
   fixed:'left',
 },
 ratio:{
  show:false
 },
 sr:{
  show:false,
 },
 er:{
  show:false,
 },
 pw:{
   
  disable:true,
 },
 
}

 
const cellstyle = {
  textAlign: "center",
  color: "#fff"
}
export const timecols = [  // 分时能耗 
  {
    title: '区域名称',
    dataIndex: 'nodeName',
    key: "nodeName",
    ellipsis:true
  },
  {
    title: '设备名称',
    dataIndex: 'name',
    key: "name",
    ellipsis:true    
  },
  {
    title: '总计(kWh)',
    dataIndex: 'e',
    key: "e",
    onHeaderCell: () => ({
      style: {
        background: "#000",
        ...cellstyle
      }
    })
  },
  {
    title: '峰(kWh)',
    dataIndex: 'e2',
    key: "e2",
    onHeaderCell: () => ({
      style: {
        background: "#f33",
        ...cellstyle
      }
    })
  },
  {
    title: '平(kWh)',
    dataIndex: 'e3',
    key: "e3",
    onHeaderCell: () => ({
      style: {
        background: "#f90",
        ...cellstyle
      }
    })
  },
  {
    title: '谷(kWh)',
    dataIndex: 'e4',
    key: "e4",
    onHeaderCell: () => ({
      style: {
        background: "#093",
        ...cellstyle
      }
    })
 
  },
  {
    title: '费用',
    dataIndex: 'cost',
    key: "cost"
  },
  {
    title: '设备编号',
    dataIndex: 'sn',
    key: "sn"
  },
  {
    title: '安装位置',
    dataIndex: 'address',
    key: "address",
    ellipsis:true
  },
]
 
export const typecols = [  // 分类能耗 
  {
    title: '能耗类型',
    dataIndex: 'type',
    key: "type"
  },
  {
    title: '子类型',
    dataIndex: 'subType',
    key: "subType"
  },
  {
    title: '能耗(kWh)',
    dataIndex: 'consume',
    key: "consume"
  },
  {
    title: '同比',
    dataIndex: 'yoy',
    key: "yoy"
  },
  {
    title: '环比',
    dataIndex: 'mom',
    key: "mom"
  },
]
export const fromlot = [ // 电能报表 /账单报表
  {
    title: '区域名称',
    dataIndex: 'nodeName',
    key: "nodeName",
    ellipsis:true,
    sorter: (a, b) => a?.nodeName?.localeCompare?.(b?.nodeName),
  },
  {
    title: '设备名称',
    dataIndex: 'name',
    key: "name",
    ellipsis:true,
    sorter: (a, b) => a?.name?.localeCompare?.(b?.name),
  }, {
    title: '起始电量',
    dataIndex: 'eStart',
    key: "eStart",
  }, {
    title: '结束电量',
    dataIndex: 'eEnd',
    key: "eEnd",
  }, {
    title: '用能(kWh)',
    dataIndex: 'consume',
    key: "consume",
    sorter: (a, b) => parseFloat(a?.consume) - parseFloat(b?.consume)
  }, {
    title: '起始读数',
    dataIndex: 'start',
    key: "start",
  }, {
    title: '结束读数',
    dataIndex: 'end',
    key: "end",
  },
  {
    title: '倍率',
    dataIndex: 'magnification',
    key: "magnification",
  },
  {
    title: '设备编号',
    dataIndex: 'sn',
    key: "sn",
    sorter: (a, b) => a?.sn?.localeCompare?.(b?.sn),
  },
  {
    title: '安装位置',
    dataIndex: 'address',
    key: "address",
    ellipsis:true,
    sorter: (a, b) => a?.address?.localeCompare?.(b?.address),
  },
]
export const Zdconfig ={  // 账单表格配置
  nodeName:{
    disable:true,
    
  },
  name: {
    disable:true,
    
  },
  sn:{
    disable:true,
    
  }, 
 address:{
   show:false,
 
 },
 eStart:{
  show:false,
 },
 eEnd:{
  show:false,
 },

 start:{
  show:false,
 },
 end:{
  show:false,
 },
  magnification:{
  show:false
 },
 consume:{
  show:true,
 },
 
}

  export const shitcols ={  // 班次能耗 
 0: {
    title: '区域名称',
    dataIndex: 'nodeName',
    key: "nodeName",
    width:140,
    sorter: (a, b) => a?.nodeName?.localeCompare?.(b?.nodeName),
  },
 1: {
    title: '设备名称',
    dataIndex: 'name',
    key: "name",
    ellipsis:true,
    width:140,
    sorter: (a, b) => a?.name?.localeCompare?.(b?.name),
  },
 2: {
    title: '设备编号',
    dataIndex: 'sn',
    key: "sn",
    width:100,
  },
  3: {
    title: '用能',
    dataIndex: 'consume',
    key: "consume",
    width:100,
    sorter: (a, b) => parseFloat(a?.consume) - parseFloat(b?.consume)
  },
 4: {
    title: '安装地址',
    dataIndex: 'address',
    key: "address",
    ellipsis:true,
    width:140,
    sorter: (a, b) => a?.address?.localeCompare?.(b?.address),
  },
  length: 5
  }

export const Cscol = { //  参数报表--电
 0:{
    title: '区域名称',
    dataIndex: 'nodeName',
    key: "nodeName",
    fixed:'left',
    ellipsis:true,
    width:140,
  },
 1: {
    title: '设备名称',
    dataIndex: 'name',
    key: "name",
    fixed:'left',
    ellipsis:true,
    width:140,
  }, 
  2:{
    title: '设备编号',
    dataIndex: 'sn',
    key: "sn",
    ellipsis:true,
    fixed:'left',
    width:100,
  },
  3:{
    title: '安装位置',
    dataIndex: 'address',
    key: "address",
    ellipsis:true,
     fixed:'left',
     width:140,
  },
   4: {
    title: '电量(kWh)',
    dataIndex: 'power',
    key: "power",
    fixed:'left',
    ellipsis:true,
    width:100,
  },
  
  
  length: 5
}
export const CscolW = { //  参数报表--水
 
 0: {
    title: '设备名称',
    dataIndex: 'name',
    key: "name",
    fixed:'left',
    ellipsis:true,
    width:140,
  }, 
  1:{
    title: '设备编号',
    dataIndex: 'sn',
    key: "sn",
    ellipsis:true,
    fixed:'left',
    width:140,
  }, 
  
  length: 2
}
 export const Csconfig ={  // 参数表格配置
  nodeName:{
    show:false,
    
  },
  name: {
    disable:true,
    
  },
  sn:{
    disable:true,
    
  }, 
 address:{
   show:false,
 
 },
 
  power:{
  disable:true
 },
 
 
}
export const labelStyle = { width: "65px", padding: "4px 16px", background: "#ecf5ff" }
export const contentStyle = { padding: "4px 16px" } 
export const reportTypeopt=[
  {
    label: "总用电报表",
    value: 1
  },
  {
    label: "反向有功报表",
    value: 2
  },
  {
    label: "正向有功报表",
    value: 3
  },
]
//1.总用电报表  2.反向有功报表 3.正向有功报表


export const tabs =[
  {label:'早班',key:"1"},
  {label:'中班',key:"2"},
  {label:'晚班',key:"3"}
]

export const CstbTitle = {
  1:["用电量-总","用电量-尖","用电量-峰","用电量-平","用电量-谷","用电量-深谷","反向用电量-总"],
  2:["组合","正向","反向",],
  3:["A相","B相","C相"],
  4:["A相","B相","C相"],
  5:["总","A相","B相","C相","当前正向有功总需量"],
  6:["总","A相","B相","C相" ],
  7:["总","A相","B相","C相" ],
}

export const defaultfilteredValue ={
  1:["用电量-总","用电量-尖","用电量-峰","用电量-平","用电量-谷" ],
  2:["组合","正向","反向",],
  3:["A相","B相","C相"],
  4:["A相","B相","C相"],
  5:["总","A相","B相","C相" ],
  6:["总","A相","B相","C相" ],
  7:["总","A相","B相","C相" ],
}

export const Xlcos = { //  最大需量
 0: {
    title: '设备名称',
    dataIndex: 'name',
    key: "name",
    fixed:'left',
    ellipsis:true,
    width:140,
   // onCell:(_,index)=> ({rowSpan: index % 2 === 0 ? 2 : 0 })
  }, 
  1:{
    title: '设备编号',
    dataIndex: 'sn',
    key: "sn",
    ellipsis:true,
    fixed:'left',
    width:140,
   // onCell:(_,index)=> ({rowSpan: index % 2 === 0 ? 2 : 0 })
  }, 
  2:{
    title: '需量类型',
    dataIndex: 'type',
    key: "type",
    ellipsis:true,
    fixed:'left',
    width:200,
    filters:[
      {
        text:"正向有功总需量（kW）",
        value:"正向有功总需量（kW）"
      },
      {
        text:"反向有功总需量（kW）",
        value:"反向有功总需量（kW）"
      }
    ],
    onFilter: (value, record) => {
        return record?.type?.indexOf?.(value) == 0
    },
    defaultFilteredValue: ["正向有功总需量（kW）","反向有功总需量（kW）"]
  }, 
  
  length: 3
}