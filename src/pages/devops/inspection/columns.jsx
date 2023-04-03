
import {ProcessIcon,ResolveIcon,WaitIcon} from './completeicon'
import React from 'react'


const flexcss ={
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}
 let  cols = [
    {
        title: '巡检工单',
        dataIndex: 'name',
        key: 'name',
        width:350
        // render:(text,val,index)=>(<a onClick={()=>{console.log(val)}}>{val.sn}</a>)
      },
      {
        title: '巡检时间',
        dataIndex: 'createTime',
        key: 'createTime',
        // render:(_,val,index)=>(<div style={{display:'flex',alignItems:'center',justifyContent:'center'}}><CompleteIcon/><span style={{paddingLeft:16}}>已完成</span></div>)
      },
      {
        title: '巡检名称',
        dataIndex: 'planName',
        key: 'planName',
      },
      {
        title: '巡检区域',
        dataIndex: 'area',
        key: 'area',
      },
      {
        title: '巡检任务',
        dataIndex: 'planContent',
        key: 'planContent',
      },
      // {
      //   title: '巡检周期',
      //   dataIndex: 'cycle',
      //   key: 'cycle',
      //   render(text){
      //   return  text===1?'日':text===2?'周':text===3?'年':'/'
      //   }
      // },
      {
        title: '巡检人员',
        dataIndex: 'operator',
        key: 'operator',
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        width:200,
      //   onCell:(record, index)=>{
      //       return {
      //         style:{
      //           background: record.state===1?'rgb(255,51,51)':record.state===2?'rgb(0,204,255)':rgb(0,153,102),
      //           color: '#fff'
      //         }
      //     }   
      // },
        render:(text,record)=>{
         return text===1?<div style={flexcss}><WaitIcon/>待处理</div>:(text===2||text===3)?<div style={flexcss}><ProcessIcon/>处理中</div>:<div style={flexcss}><ResolveIcon/>已完成</div>
        }
      },
     
]
let columns =  cols.map(item=>({...item,align:"center"}))
export  {columns} 