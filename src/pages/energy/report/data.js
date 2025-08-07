export const cols = [ // 实时抄表  
  {
    title: '区域名称',
    dataIndex: 'nodeName',
    key: 'nodeName',
    sorter: (a, b) => a?.nodeName?.localeCompare?.(b?.nodeName)
  },
  {
    title: '设备名称',
    dataIndex: 'name',
    key: "name",
    sorter: (a, b) => a?.name?.localeCompare?.(b?.name)
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
    title: '用能(kWh)',
    dataIndex: 'consume',
    key: "consume",
    sorter: (a, b) => parseFloat(a?.consume) - parseFloat(b?.consume)
  },
  {
    title: '设备编号',
    dataIndex: 'sn',
    key: "sn",
    sorter: (a, b) => a?.sn?.localeCompare?.(b?.sn)
  },
  {
    title: '安装位置',
    dataIndex: 'address',
    key: "address",
    sorter: (a, b) => a?.address?.localeCompare?.(b?.address)
  },
]


export let conscols = [   //  conscols 能耗报表  
  {
    title: '区域名称',
    dataIndex: 'nodeName',
    key: "nodeName",
    fixed: 'left',
    width: 100
  },
  {
    title: '设备名称',
    dataIndex: 'name',
    width: 84,
    key: "name",
    fixed: 'left',
  },
  {
    title: '设备编号',
    dataIndex: 'sn',
    width: 134,
    key: "sn",
    fixed: 'left',
  },
  {
    title: '安装位置',
    dataIndex: 'address',
    key: 'address',
    width: 84,
  },
  {
    title: '能耗(kWh)',
    dataIndex: 'total',
    key: 'total',
    width: 92,
    sorter: (a, b) => parseFloat(a.total) - parseFloat(b.total)
  },
]
const cellstyle = {
  textAlign: "center",
  color: "#fff"
}
export const timecols = [  // 分时能耗 
  {
    title: '区域名称',
    dataIndex: 'nodeName',
    key: "nodeName"
  },
  {
    title: '设备名称',
    dataIndex: 'name',
    key: "name"
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
    key: "address"
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
export const fromlot = [ // 电能报表 
  {
    title: '区域名称',
    dataIndex: 'nodeName',
    key: "nodeName"
  },
  {
    title: '设备名称',
    dataIndex: 'name',
    key: "name"
  }, {
    title: '起始电量',
    dataIndex: 'eStart',
    key: "eStart",
  }, {
    title: '结束电量',
    dataIndex: 'eEnd',
    key: "End",
  }, {
    title: '用能(kWh)',
    dataIndex: 'consume',
    key: "consume",
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
    key: "sn"
  },
  {
    title: '安装位置',
    dataIndex: 'address',
    key: "address"
  },
]
export const shitcols = [  // 班次能耗 
  {
    title: '区域名称',
    dataIndex: 'nodeName',
    key: "nodeName"
  },
  {
    title: '设备名称',
    dataIndex: 'name',
    key: "name"
  },
  {
    title: '编号',
    dataIndex: 'sn',
    key: "sn"
  },
  {
    title: '地址',
    dataIndex: 'address',
    key: "address"
  },
]
export const etabs = [
  { key: '0', label: '实时抄表' },
  { key: '1', label: '能耗报表' },
  { key: '2', label: '分时能耗' },
  { key: '3', label: '分类能耗' },
  { key: '4', label: '电能报表' },
  { key: '5', label: '班次能耗' },
]
export const wtabs = [
  { key: '0', label: '实时抄表' },
  { key: '1', label: '能耗报表' },
  { key: '3', label: '分类能耗' },
  { key: '5', label: '班次能耗' },
]
export const labelStyle = { width: "65px", padding: "4px 16px", background: "#ecf5ff" }
export const contentStyle = { padding: "4px 16px" } 
