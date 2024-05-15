import React, {useState, useEffect} from 'react'
 
 
import {  Space} from 'antd';
import { EnergyQuotaRuntime } from '@api/api.js'
import {useSelector} from 'react-redux'
import {selectProjectId} from '@redux/systemconfig.js'
import CustomProgress from '@com/useProgress'
import { Link } from 'react-router-dom';
import {useAntdTable} from 'ahooks'
import UserTable from "@com/useTable";
import Titlelayout from '@com/titlelayout';
import {Serach} from '@com/comstyled'

export default function MainPage(props){
   
  const [searchData, setSearchData] = useState('')
  
  const { queryRoomQuota } = EnergyQuotaRuntime
  const projectId = useSelector(selectProjectId);
  const onSearch = values => { 
    setSearchData(values) 
  }

  //表格数据
 
  const columns = [
    {
      title:'园区',
      dataIndex:'areaName',
      key:'areaName',
      align:'center',
      render: (_, record) => (
        <Space size="middle">
          <span>{props.areaName}</span>
        </Space>)
    },{
      title:'建筑物',
      dataIndex:'buildingName',
      key:'buildingName',
      align:'center'
    },{
      title:'房间',
      dataIndex:'roomName',
      key:'roomName',
      align:'center',
      render: (_, record) => (
        <Space size="middle">
          <Link 
         
          to={{pathname:'/roomDetail', search:JSON.stringify({id:record.roomId,
            areaName:props.areaName, 
            buildingName: encodeURIComponent(record.buildingName), 
            roomName: encodeURIComponent(record.roomName),
            comprehensiveQuota: record.comprehensiveQuota,
            comprehensiveQuotaLeaved: record.comprehensiveQuotaLeaved
          })}} 
          target='_blank'
          state={props.areaName} 
          style={{color:'#237ae4', cursor:'pointer', textDecoration:'underline'}}
          >{record.roomName}</Link>
        </Space>)
    },{
      title:'综合能耗用能剩余',
      key: 'action',
      align:'center',
      width:'258px',
      render: (_, record) => (
        <Space size="middle">
          <CustomProgress progress={parseInt(record.comprehensiveQuota) > 0 ? ((Number(record.comprehensiveQuotaLeaved)/Number(record.comprehensiveQuota)) * 100) : 0 }></CustomProgress>
        </Space>)
    },{
      title:(<div>年度综合能耗<br/>剩余/定额(吨标煤)</div>),
      key:'quotaComprehensive',
      width:'157px',
      align:'center',
      render: (_, record) => (
        <Space size="middle">
          <span>{record.comprehensiveQuotaLeaved + '/' + record.comprehensiveQuota}</span>
        </Space>)
    },{
      title:(<div>年度电(kWh)<br/>剩余/定额 </div>),
      dataIndex:'quotaElectric',
      key:'quotaElectric',
      width:'157px',
      align:'center',
      render: (_, record) => (
        <Space size="middle">
          <span>{record.electricQuotaLeaved + '/' + record.electricQuota}</span>
        </Space>)
    },{
      title:(<div>水(m³)<br/>剩余/定额 </div>),
      dataIndex:'quotaWater',
      key:'quotaWater',
      width:'157px',
      align:'center',
      render: (_, record) => (
        <Space size="middle">
          <span>{record.waterQuotaLeaved + '/' + record.waterQuota}</span>
        </Space>)
    },{
      title:(<div>燃气(m³)<br/>剩余/定额 </div>),
      dataIndex:'quotaGas',
      key:'quotaGas',
      width:'157px',
      align:'center',
      render: (_, record) => (
        <Space size="middle">
          <span>{record.gasQuotaLeaved + '/' + record.gasQuota}</span>
        </Space>)
    },{
      title:(<div>煤炭(吨)<br/>剩余/定额 </div>),
      dataIndex:'quotaCoal',
      key:'quotaCoal',
      width:'157px',
      align:'center',
      render: (_, record) => (
        <Space size="middle">
          <span>{record.coalQuotaLeaved + '/' + record.coalQuota}</span>
        </Space>)
    }
  ]
  

  const getRoomTable = () => {
  if(!isFinite(props.areaId) || !isFinite(projectId)) return;
   return  queryRoomQuota(projectId, props.areaId, searchData).then(res => {
      let {success, data} = res
      if(success){
         return {
           list: Array.isArray(data) ? data : [],
           total: Array.isArray(data) ? data.length : 0,
         }
      }else{
        return {
          list: [],
          total: 0
        }
      }
    })
  }
  const {tableProps} = useAntdTable(getRoomTable, {
    refreshDeps: [projectId, props.areaId, searchData]
  })
 

  return (
    <Titlelayout title={<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}><span>房间查询</span><Serach
    size="middle"
    placeholder="输入房间号查询"
    style={{ width: "340px" }}
    allowClear
    enterButton="查询"
    onSearch={onSearch}    
  /></div>} layout="flex" bordered="n" pv="0">
      <div style={{display: 'flex', flex: 1, paddingTop: '16px'}}>
          <UserTable {...tableProps} columns={columns} rowKey='roomId' scroll={{y: 650}} pagination={false} />
      </div>
    </Titlelayout>
  )
}