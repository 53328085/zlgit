
import {CompleteIcon,ResolveIcon,WaitIcon} from './completeicon'
import React from 'react'



 let  cols = [
    {
        title: '工单编号',
        dataIndex: 'number',
        key: 'number',
        // render:(text,val,index)=>(<a onClick={()=>{console.log(val)}}>{val.sn}</a>)
      },
      {
        title: '状态',
        dataIndex: 'alarmTime',
        key: 'alarmTime',
        width: 124,
        render:(_,val,index)=>(<div style={{display:'flex',alignItems:'center',justifyContent:'center'}}><CompleteIcon/><span style={{paddingLeft:16}}>已完成</span></div>)
      },
      {
        title: '所属项目',
        dataIndex: 'customer',
        key: 'customer',
      },
      {
        title: '所属区域/建筑/楼层',
        dataIndex: 'place',
        key: 'place',
      },
      {
        title: '安装地址',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '设备类型',
        dataIndex: 'category',
        key: 'category',
      },
      {
        title: '设备编号',
        dataIndex: 'sn',
        key: 'sn',
      },
      {
        title: '事件信息',
        key: 'option',
        align:'center',
        render:(_,val)=>(
            <span >过温  65℃</span>
        ),
      },
      {
        title: '派单人/派单时间',
        key: 'deteail',
        align:'center',
        render: (_, record) => (
            <span >AAA   2020/11/30 09:12:36</span>
        ),
      },
]
let columns =  cols.map(item=>({...item,item,align:"center"}))
export  {columns} 