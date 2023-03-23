import React, {useState, useEffect} from 'react'
import style from './style.module.less';
import { Input, Button, Table, message, Space } from 'antd';
import { EnergyQuotaRuntime } from '@api/api.js'
import {useSelector} from 'react-redux'
import {selectProjectId} from '@redux/systemconfig.js'
import CustomProgress from '@com/useProgress'
import { Link } from 'react-router-dom';
export default function MainPage(props){
  const { Search } = Input;
  const [searchData, setSearchData] = useState('')
  const { queryRoomQuota } = EnergyQuotaRuntime
  const projectId = useSelector(selectProjectId);
  const [messageApi, contextHolder] = message.useMessage();
  const messageContent = (type, content) => {
    messageApi.open({
      type,
      content,
    })
  }
  const onSearch = values => {
    setSearchData(values)
    getRoomTable(projectId, props.areaId, values)
  }

  //表格数据
  const [tableData, setTableData] = useState([])
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
            buildingName:record.buildingName, 
            roomName:record.roomName,
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
  const [pageNum, setPageNum] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 20
  const paginationProps = {
    current: pageNum, //当前页码
    pageSize, // 每页数据条数
    showTotal: () => (
      <span>总共{total}项</span>
    ),
    total, // 总条数
    onChange: page => handlePageChange(page), //改变页码的函数
    hideOnSinglePage: false,
    showSizeChanger: false,
  }
  const handlePageChange = (page) => {
    setPageNum(page)
  }

  const getRoomTable = (projectId, areaId, search) => {
    queryRoomQuota(projectId, areaId, search).then(res => {
      let {success, data} = res
      if(success){
        if(data){
          setTableData(data)
        }
      }else{
        messageContent('error', res.errMsg)
      }
    })
  }

  useEffect(()=> {
    if(props.areaId == 0) return;
    setSearchData('')
    getRoomTable(projectId, props.areaId, '')
  },[props.areaId])

  return (
    <div>
      {contextHolder}
      <div className={style.mainContent}>
        <div className={style.contentTitle}>
          <span>定额能耗</span>
          <div className={style.roomSearch}>
            <span style={{marginRight: 16,whiteSpace:'nowrap'}}>房间查询</span>
            <Search placeholder="输入房间号查询" allowClear enterButton="查询" size="middle" onSearch={onSearch} style={{width: 370 }}/>
          </div>
        </div>
        <div className={style.tableList}>
          <Table size='small' bordered dataSource={tableData} columns={columns} rowKey='roomId' scroll={{y: 650}} pagination={false} />
        </div>
      </div>
    </div>
  )
}