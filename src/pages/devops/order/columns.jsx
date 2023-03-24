
import {CompleteIcon,ResolveIcon,WaitIcon} from './completeicon'
import React from 'react'



 let  cols = [
    {
        title: '工单编号',
        dataIndex: 'name',
        key: 'name',
        // render:(text,val,index)=>(<a onClick={()=>{console.log(val)}}>{val.sn}</a>)
      },
      {
        title: '告警事件',
        dataIndex: 'content',
        key: 'content',
        width: 124,
        // render:(_,val,index)=>(<div style={{display:'flex',alignItems:'center',justifyContent:'center'}}><CompleteIcon/><span style={{paddingLeft:16}}>已完成</span></div>)
      },
      {
        title: '告警设备名称',
        dataIndex: 'deviceName',
        key: 'deviceName',
      },
      {
        title: '告警地址',
        dataIndex: 'deviceAddress',
        key: 'deviceAddress',
      },
      {
        title: '派单人',
        dataIndex: 'creator',
        key: 'creator',
      },
      {
        title: '派单时间',
        dataIndex: 'createTime',
        key: 'createTime',
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        width:200,
        onCell:(record, index)=>{
      
        
            return {
              style:{
                background: record.state===1?'rgb(255,51,51)':record.state===2?'rgb(0,204,255)':rgb(0,153,102),
                color: '#fff'
              }
          }
          
        
          
          
      },
        render:(text,record)=>{
         return text===1?<div>待处理</div>:text===2?<div>处理中</div>:<div>已完成</div>
        }
      },
     
]
let columns =  cols.map(item=>({...item,align:"center"}))
export  {columns} 