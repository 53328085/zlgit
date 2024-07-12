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
const columns = [
    {
        dataIndex: "time",
        title: "时间",
        key: 'time',
        width:550,
        onCell: onCell
    },
    {
        dataIndex: "log",
        title: "设备日志",
        key: 'log',
        onCell: onCell
    }
]
const dataSource =[
    {time: new Date().toLocaleTimeString(), log: '断路器合闸'},
    {time: new Date().toLocaleTimeString(), log: '断路器开闸'},
    {time: new Date().toLocaleTimeString(), log: '断路器开闸'}
]

export default function Index() {
  return (
    <Usetable columns={columns}  dataSource={dataSource} istheme />
  )
}
