import React, { useRef, useState, useEffect, useCallback } from 'react'
import { Select, Button, Space, message } from 'antd';
import style from './style.module.less'
import UseTransfer from '@com/useTransfer'
import { useRequest, useAntdTable } from 'ahooks';
import {useSelector} from 'react-redux'
 
import {selectProjectId, selectOneLevel, levelDefaultLabel} from '@redux/systemconfig.js'
import { distributionRoom, DistributionMeter } from '@api/api.js'
import { cloneDeep } from 'lodash';
import Usetable from '@com/useTable'
import dashed from '@imgs/dashed.png'
import {  ExportExcel} from '@com/useButton'
import CModal from '@com/useModal'
export default function Index() {
  const tableRef = useRef()
  const { queryPageRoom } = distributionRoom
  const { queryPageSensor, queryUnusedSensor, configureSensor } = DistributionMeter
  const [messageApi, contextHolder] = message.useMessage();
  const messageContent = (type, content)=>{
    messageApi.open({
      type,
      content
    })
  }
  const projectId = useSelector(selectProjectId);
  //园区选择
  const areaList = useSelector(selectOneLevel)
  const levelName = useSelector(levelDefaultLabel) || '园区'
  const [defaultArea, setDefaultArea] = useState(areaList[0]?.id || undefined)
  const [areaId,setAreaId] = useState(areaList[0]?.id || undefined)
  const handleChange = (values) => {
    
    setAreaId(values)
  }
  //配电房下拉框
  const [roomList, setRoomList] = useState([])
  const [defaultRoom, setDefaultRoom] = useState()
  const [roomId, setRoomId] = useState()
  const getRoomData = () => {
    return queryPageRoom( projectId, areaId, 0, 0).then(res => {
      if(res.success){
        if(Array.isArray(res.data) && res.data?.length > 0) {
          setRoomList(res.data)
          setDefaultRoom(res.data[0].id)
          setRoomId(res.data[0].id)
        }else {
          setRoomList([])
          setDefaultRoom(null)
          setRoomId(null)
          messageApi.open({
            type: 'warning',
            content:"当前园区没有配电房"
          })
        }
        
      }else{
        messageApi.open({
          type:'error',
          content:res.errMsg
        })
      }
    })
  }
  const { run : queryRoom } = useRequest(getRoomData,{
    manual: true,
  })
  useEffect(()=>{
    if(areaList.length == 0 || !areaList){
      message.error('当前项目尚未配置园区!')
      return;
    }
    if(areaId == 0 || !areaId){
      return
    }else{
      queryRoom()
    }
  },[areaId])
  const ChangeRoom = values => {
    
    setDefaultRoom(values)
    setRoomId(values)
  }

  //设备查询
 
  const [total, setTotal] = useState(0)
  const pageSize = 10
  const getTableData = ({current, pageSize}) => {
    if(!roomId)  return  new Promise((resolve) => {
      setSubTable([])
      setTotal(0)
      resolve({
       list: [],
       total: 0
     })

 })
    return queryPageSensor(projectId, roomId, current, pageSize).then(res => {
      if(res.success){
        if(Array.isArray(res.data)){
         // setData(res.data)
          setSubTable(res.data)
        }else{
          setData([])
          setSubTable([])
        }
        setTotal(res.total)
      }else {
        setTotal(0)
      }
    })
  }
  const {tableProps} = useAntdTable(getTableData,{
    refreshDeps: [roomId],
    defaultPageSize: 14
  })
/*   useEffect(()=> {
    if(roomId){
      queryTable()
    }
  },[roomId, pageNum]) */

  const columns = [
    {
      align:'center',
      title: '传感器编号',
      dataIndex: 'sn',
      key: 'sn',
    },{
      align:'center',
      title: '传感器名称',
      dataIndex: 'name',
      key: 'name',
    },{
      align:'center',
      title: '传感器型号',
      dataIndex: 'category',
      key: 'category',
    },{
      align:'center',
      title: '安装地址',
      dataIndex: 'address',
      key: 'address',
      width: 480
    },{
      align:'center',
      title: '所属网关',
      dataIndex: 'gatewayName',
      key: 'gatewayName',
      render: (_, record) => (
        <Space size="middle">
          <span>{record.gatewayName == ''? '/' : record.gatewayName}</span>
        </Space>
      ),
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      align:'center',
    },
    {
      title: '操作',
      key: 'action',
      align:'center',
      render: (_, record) => (
        <Space size="middle">
          <span className={style.deleteText} onClick={() => deleteRecord(record)}>删除</span>
        </Space>
      ),
    },
  ];

  const [data, setData] = useState([])
  const [deleteModal, setDeleteModal] = useState(false)
  const [deleteId, setDeleteId] = useState()
  const deleteOk = () => {
    let deleteArr = cloneDeep(subTable)
    deleteArr.map((item, index) => {
      if(item.id = deleteId){
        deleteArr.splice(index, 1)
      }
    })
    let group = []
    if(deleteArr.length > 0){

      deleteArr.map(item => {
       // group.push(item.id)
       group.push(item.sn)
      })
    }
    let data = {
      projectId,
      roomId,
      sns:group
    }
    configureSensor(data).then(res=> {
      if(res.success){
        messageContent('success','设备删除成功!')
        if(subTable.length == 1 && pageNum > 1){
          
        }else{
          queryTable()
        }
        setDeleteModal(false)
      }else{
        messageContent('error', res.errMsg)
      }
    })
    
  }
  const handleDelete = () => {
    setDeleteModal(false)
  }
  const deleteRecord = (record) => {
    setDeleteId(record.id)
    setDeleteModal(true)
  }

  //穿梭框
  const [transTag, setTransTag] = useState('')
  const settingClick =() => {
    if(areaId == 0 || !areaId){
      message.warning('请先选择园区!')
      return;
    }
    if(roomId){
      queryUnusedSensor(projectId, roomId).then(res => {
        let { success, data } = res
        if(success){
          if(data){
            setUnknownTable(data)
          }else{
            setUnknownTable([])
          }
          setTransTag('open');
        }else{
          messageContent('error', res.errMsg)
        }
      })
    }else{
      messageContent('warning', '请先选择配电房')
    }
  }
  const  getSaveValue = params => {
    let group = []
    if(params.subData.length > 0){
      console.log(params.subData)
      params.subData.map(item => {
        group.push(item.sn)
      })
    }
    let data = {
      projectId,
      roomId,
      sns:group
    }
    configureSensor(data).then(res=> {
      if(res.success){
        messageContent('success','传感器设备配置成功!')
        queryTable()
        setTransTag('close')
      }else{
        messageContent('error', res.errMsg)
      }
    })
  }

  const getCloseValue = params => {
    setTransTag(params)
  }

  const mainTable = []
  const [subTable, setSubTable]= useState([])
  const [unknownTable, setUnknownTable] = useState([])
  const transferColumns = [
    {   
        align:'center',
        title: '设备编号',
        dataIndex:'sn',
        key:'sn'
    },{
        align:'center',
        title: '设备名称',
        dataIndex:'name',
        key:'name'
    },{
        align:'center',
        title: '安装地址',
        dataIndex:'address',
        key:'address'
    }
    ]

  const transferTitle = {
    mainTitle:'',
    subTitle:'配电房传感器',
    unknownTitle:'未选中的传感器设备'
  }  
 

 
  const onExport =useCallback(async () => { 
    console.log(total)
   return getTableData({current: 1, pageSize: total})
}, [total, roomId])
  return (
    <div>
      {transTag =='open' ? <div className={style.mask}></div> : null }
      {contextHolder}
      <div className={style.header}>
        <span className={style.headerTitle}>{levelName + '选择'}</span>
        <Select
          placeholder="请选择园区"
          size="middle"
          key={defaultArea}
          defaultValue={defaultArea}
          style={{width: '200px'}}
          onChange={handleChange}
        >
          {areaList.map(item => {
            return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
          })}
        </Select>
        <div className={style.division}></div>
        <Select
          placeholder="请选择配电房"
          size="middle"
          // key={defaultRoom}
          // defaultValue={defaultRoom}
          value={defaultRoom}
          style={{width: '200px'}}
          onChange={ChangeRoom}
        >
          {roomList?.map((item) => {
            return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
          })}
        </Select>
      </div>
      <div className={style.mainContent}>
        <div className={style.contentTitle}>
            <span>配电房传感器</span>
            <Space size={16}>
            <Button type="primary" onClick={()=> settingClick()}style={{ width: 96}}>
                选择设备
            </Button>
            <ExportExcel tb={tableRef} />
            </Space>
        </div>
        <div className={style.line}>
          <img className={style.lineImg} src={dashed}></img>
        </div>
        <div className={`${style.transferPage} ${transTag =='open' ? style.startAnimation : transTag =='close' ? style.endAnimation :''}`} >
        <UseTransfer transferTitle={transferTitle} saveValue={getSaveValue} columns={transferColumns} mainTable={mainTable} subTable={subTable} unknownTable={unknownTable} closeValue={getCloseValue}></UseTransfer>
        </div>
      <Usetable ref={tableRef} style={{marginTop:'16px'}}   columns={columns}   rowKey='id'  {...tableProps} sheetName="传感器管理" onExport={onExport}></Usetable>
      <CModal title="删除提示" open={deleteModal} onOk={deleteOk} onCancel={handleDelete} width={512} maskClosable={false} mold="cust" type="warn">
         是否确认在该配电房中删除该传感器？ 
       
      </CModal>
      </div>
    </div>
  )
}
