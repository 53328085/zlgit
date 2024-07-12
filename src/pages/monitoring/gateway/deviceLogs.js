// 设备日志
import React from 'react'
import Usetable from "@com/useTable"
const onCell =(_, index) => {
    if(index%2!=0) {
        return  {
           style: {
            backgroundColor: "#f5f5f5"
           }
        }
    }
}
const columnsLogD = [
    {
      title: '设备编号',
      dataIndex: 'sn',
      key: 'sn',
      
    },
    {
      title: '设备类型',
      dataIndex: 'meterType',
      key: 'meterType',
      
    },
    {
      title: '设备型号',
      dataIndex: 'category',
      key: 'category',
      id: 'id'
    },
 
    {
      title: '安装地址',
      dataIndex: 'address',
      key: 'address',
      
    },
    {
        title: '描述',
        dataIndex: 'content',
        key: 'content',
        
      },
    {
      title: '操作时间',
      dataIndex: 'time',
      key: 'time',
      
    },
    {
      title: '操作者',
      dataIndex: 'creator',
      key: 'creator',
      id: 'id'
    },
  ];
 

 
export default function Index({logdata={}}) {
  return (
    <Usetable columns={columnsLogD}  {...logdata} istheme onCell={onCell} />
  )
}
