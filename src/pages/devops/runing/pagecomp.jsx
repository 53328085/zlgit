 import styled from 'styled-components'
import React from 'react'
 import {Descriptions} from 'antd'
import Page from "@com/reportPrint/page"
 
import Usetable from '@com/useTable'
import {useSelector} from 'react-redux'
import {currProject} from '@redux/systemconfig.js'
import fine from './fine.svg'
const DesItem = styled(Descriptions)`
&& {
  margin-bottom: 24px;
 .ant-descriptions-item-label {
   height: 30px;
   padding: 0 16px;
  
   text-align: center;
   min-width: 120px;
   background: transparent;
 }
 .ant-descriptions-item-content {
   height: 30px;
   color:#515151;
   padding: 0 16px;
 }
 .ant-descriptions-header {
  margin-bottom: 10px;
 .ant-descriptions-title {
   font-weight: normal;
   color:#515151;
   font-size: 14px;
 }

}
}
`
const Main =styled.div`
   && {
    color: #515151;
    display: flex;
    flex-direction: column;
    flex: 1;
    .title {
       font-size: 16px;
       margin-bottom: 12px;
    }
    .text {
      font-size: 16px;
      text-indent: 2em;
    }
    .fine {
      display: flex;
      width: 284px;
      height: 64px;
      align-items: center;
      background: url(fine) var(--ant-primary-color);
      background-position: 32px center;
      font-size: 28px;
      padding-left: 32px;
      color: #fff;
      img {
        margin-right: 32px;
      }
    }
   }

`
let columns = [
  {
      title: '一级告警',
      dataIndex: 'one',
      key: 'one',
  },
  {
      title: '二级告警',
      dataIndex: 'two',
      key: 'two',
  },
  {
      title: '三级告警',
      dataIndex: 'three',
      key: 'three',
  },
]
let columns2 = [
  {
      title: '待处理',
      dataIndex: 'wait',
      key: 'wait',
  },
  {
      title: '处理中',
      dataIndex: 'process',
      key: 'process',
  },
  {
      title: '已完成',
      dataIndex: 'finish',
      key: 'finish',
  },
  {
    title: '完成率',
    dataIndex: 'perce',
    key: 'perce',
    render: (_, recoder) => {
        return recoder.all == 0 ? '0%' :  parseFloat((recoder.finish / recoder.all)*100).toFixed(2)+"%"
    }
  },
]
let columns3= [
  {
      title: '待处理',
      dataIndex: 'wait',
      key: 'wait',
  },
  {
      title: '处理中',
      dataIndex: 'process',
      key: 'process',
  },
  {
      title: '已完成',
      dataIndex: 'finish',
      key: 'finish',
  },
  {
    title: '完成率',
    dataIndex: 'perce',
    key: 'perce',
    render: (_, recoder) => {
        return recoder.all == 0 ? '0%' :  parseFloat((recoder.finish / recoder.all)*100).toFixed(2)+"%"
    }
  },
]
 
export default function pagecomp({data}) {
  const {alarm={}, inspec={}, order={}, error=0} = data || {}
  
  const {address, projectName} = useSelector(currProject)  
 
 
 const stye ={
  marginBottom: '32px',
 }
  return (
      <>
      <Page key="a"> 
        <Main> 
          <p  className='title'>1.项目概况</p>    
        <DesItem title=""  bordered size='small' column={1}>
          <DesItem.Item label="项目名称" key="name">{projectName}</DesItem.Item>
          <DesItem.Item label="项目地址" key="address">{address}</DesItem.Item>
        </DesItem> 
        <Usetable dataSource={[alarm]} columns={columns} size="small" title={() => <><p>2.告警事件统计</p><p style={{fontSize: "small",  marginTop: "12px"}}>本监测周期内经运维平台统计共发生-次告警，统计数据如下：</p></>} key="online" style={stye} flex="none" tfs="18px" hbg="#ecf5ff" hbc="#515151"></Usetable>
        <Usetable dataSource={[order]} columns={columns2} size="small" title={() => <><p>3.工单事件统计</p><p style={{fontSize: "small", marginTop: "12px"}}>本监测周期内经运维平台统计共生成-次工单，统计数据如下：</p></>} key="statistic" style={stye} flex="none" tfs="18px" hbg="#ecf5ff" hbc="#515151"></Usetable>
        <Usetable dataSource={[inspec]} columns={columns3} size="small" title={() => <><p>4.巡检任务统计</p><p style={{fontSize: "small", marginTop: "12px"}}>本监测周期内经运维平台统计共产生-次巡检任务，统计数据如下：</p></>} key="statistic" style={stye} flex="none" tfs="18px" hbg="#ecf5ff" hbc="#515151"></Usetable>                   
      
         </Main> 
      </Page>
      <Page key="b">
        <Main>
      <p  className='title'>5.现场运维情况</p>    
       { error > 0  ? <p> 本周期内发现{error}个错误</p>
          :  <div style={{display: 'flex', justifyContent: 'center', alignItems: 'flex-end',   padding: '64px 0px'}}>
                <div className='fine'><img src={fine} height={48} /> <span>良好</span></div> 
             </div> 
             }
             </Main>
      </Page>
      </>
  )
}
 
   