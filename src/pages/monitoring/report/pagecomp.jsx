 import styled from 'styled-components'
import React, {useRef} from 'react'
 import {Descriptions} from 'antd'
import Page from "@com/reportPrint/page"
 
import Usetable from '@com/useTable'
import {useSelector} from 'react-redux'
import {currProject,deviceStyle} from '@redux/systemconfig.js'
 
const DesItem = styled(Descriptions)`
&& {
  margin-bottom: 32px;
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
       font-size: 18px;
       margin-bottom: 16px;
    }
    .text {
      font-size: 16px;
      text-indent: 2em;
    }
   }

`
let columns = [
  {
      title: '设备类型',
      dataIndex: 'name',
      key: 'name',
  },
  {
      title: '设备总数',
      dataIndex: 'count',
      key: 'count',
  },
  {
      title: '在线设备',
      dataIndex: 'onlineCount',
      key: 'onlineCount',
  },
  {
      title: '离线设备',
      dataIndex: 'offlineCount',
      key: 'offlineCount',
  },
  {
      title: '在线率',
      dataIndex: 'onlineRate',
      key: 'onlineRate',
      render: (text) => `${text}%`
  },
]
let columns2 = [
  {
      title: '总计',
      dataIndex: 'count',
      key: 'count',
      render: (_, r) => {
         return   Object.values(r).reduce((c, p) => c+p, 0)
          
      }
  },
  {
      title: '网关',
      dataIndex: 'gatewayCount',
      key: 'gatewayCount',
  },
  {
      title: '电表',
      dataIndex: 'electricMeterCount',
      key: 'electricMeterCount',
  },
  {
      title: '水表',
      dataIndex: 'waterMeterCount',
      key: 'waterMeterCount',
  },
  {
      title: '断路器',
      dataIndex: 'breakerCount',
      key: 'breakerCount',
  },
  {
      title: '传感器',
      dataIndex: 'sensorCount',
      key: 'sensorCount',
  },
  {
      title: '监控',
      dataIndex: 'cameraCount',
      key: 'cameraCount',
  },
]
 
 
export default function pagecomp({data}) {
  let  {allCount, statusItems}= data?.constructor===Object ? data : {} ;

  const {address, projectName} = useSelector(currProject)  
  const DeviceStyle = useSelector(deviceStyle) 

  let item = {}
  statusItems?.forEach(e => {
    item[e.meterType] = e.count;
  }) 
  item.total = allCount
  let totals = [item];

  let colums = statusItems?.map(s => {
    if(s.meterType ==0) {
      return {dataIndex: s.meterType, title: '网关', key:s.meterType }
    }else {
      let name = DeviceStyle?.find(d => d.deviceStyle == s.meterType)?.name;
      if(name)    return {dataIndex: s.meterType, title: name, key:s.meterType }
    }
    
  })
  colums = [{dataIndex: 'total', title: '总数', key: 'total'}, ...colums]
  let dataSource = statusItems?.map(s => {
    if(s.meterType ==0) {
      return {...s, name: '网关'}
    }else {
      let name = DeviceStyle?.find(d => d.deviceStyle == s.meterType)?.name;
      if(name) return {...s, name}
    }
   
  })
  console.log(dataSource)
/*   let counts =[
    {
        gatewayCount: reptdata.gatewayCount,
        electricMeterCount: reptdata.electricMeterCount,
         waterMeterCount: reptdata.waterMeterCount,
        breakerCount: reptdata.breakerCount,
         sensorCount: reptdata.sensorCount,
         cameraCount: reptdata.cameraCount
    }
]
let dataSource = [
  {type: '网关', count: reptdata.gatewayCount, online: reptdata.gatewayOnlineCount, offline: reptdata.gatewayOfflineCount, rate: reptdata.gatewayOnlineRate},
  {type: '电表', count: reptdata.electricMeterCount, online: reptdata.electricMeterOnlineCount, offline: reptdata.electricMeterOfflineCount, rate: reptdata.electricMeterOnlineRate},
  {type: '水表', count: reptdata.waterMeterCount, online: reptdata.waterMeterOnlineCount, offline: reptdata.waterMeterOfflineCount, rate: reptdata.waterMeterOnlineRate},
  {type: '断路器', count: reptdata.breakerCount, online: reptdata.breakerOnlineCount, offline: reptdata.breakerOfflineCount, rate: reptdata.breakerOnlineRate},
  {type: '传感器', count: reptdata.sensorOnlineCount, online: reptdata.sensorOnlineCount, offline: reptdata.sensorOfflineCount, rate: reptdata.sensorOnlineRate }
] */
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
        <Usetable dataSource={totals} columns={colums} size="small" title={() => "2.设备统计"} key="statistic" style={stye} flex="none" tfs="18px"></Usetable>
                            
        <Usetable dataSource={dataSource} columns={columns} size="small" title={() => "3.在线率统计"} key="online" style={stye} flex="none" tfs="18px"></Usetable>
         </Main> 
      </Page>
      </>
  )
}
 
   