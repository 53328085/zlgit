import React, { useRef, useState, useEffect } from 'react'
import { Select, Button, Table, Space, Modal, message } from 'antd';
import style from './style.module.less'
import UseTransfer from '@com/useTransfer'
import { useRequest } from 'ahooks';
import {useSelector} from 'react-redux'
import {utils, writeFile} from 'xlsx'
import {selectProjectId, selectOneLevel, levelDefaultLabel} from '@redux/systemconfig.js'
import { distributionRoom, DistributionMeter } from '@api/api.js'
import { cloneDeep } from 'lodash';

import dashed from '@imgs/dashed.png'
import firstwarn from '@imgs/warning.png' 

export default function Index() {
  const tableRef = useRef()
  const { queryPageRoom } = distributionRoom
  const { queryPageCamera, queryUsedCamera, queryUnusedCamera, configureCamera } = DistributionMeter
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
    setPageNum(1)
    setAreaId(values)
  }
  //配电房下拉框
  const [roomList, setRoomList] = useState([])
  const [defaultRoom, setDefaultRoom] = useState()
  const [roomId, setRoomId] = useState()
  const getRoomData = () => {
    return queryPageRoom( projectId, areaId, 0, 0).then(res => {
      if(res.success){
        setRoomList(res.data)
        setDefaultRoom(res.data.length > 0 ? res.data[0].id : null)
        setRoomId(res.data.length > 0  ? res.data[0].id : null)
        if(res.data.length == 0){
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
    setPageNum(1)
    setDefaultRoom(values)
    setRoomId(values)
  }

  //设备查询
  const [pageNum, setPageNum] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 10
  const getTableData = () => {
    return queryPageCamera(projectId, roomId, pageNum, pageSize).then(res => {
      if(res.success){
        if(res.data){
          setData(res.data)
          setSubTable(res.data)
        }else{
          setData([])
          setSubTable([])
        }
        setTotal(res.total)
      }
    })
  }
  const {run: queryTable } = useRequest(getTableData,{
    manual:true
  })
  useEffect(()=> {
    if(roomId){
      queryTable()
    }
  },[roomId, pageNum])


  const columns = [
    {
      align:'center',
      title: '监控名称',
      dataIndex: 'name',
      key: 'name',
    },
    { 
      align:'center',
      title: '监控类型',
      dataIndex: 'accessMode',
      key: 'accessMode',
      render:(_, record) => {
        let {accessMode} = record || {};
        return  accessMode == 1 ? "云视频监控" : accessMode == 2 ? "本地视频监控" : '';
      }
    },
    {
      title: '监控设备SN',
      dataIndex: 'sn',
      key: 'sn',
      align:'center',
    },{
        title: '监控型号',
        dataIndex: 'category',
        key: 'categoty',
        align:'center',
      },{
        title: '监控设备IP',
        dataIndex: 'ip',
        key: 'ip',
        align:'center',
      },{
        title: '通道号',
        dataIndex: 'channel',
        key: 'channel',
        align:'center',
      },{
        title: '安装地址',
        dataIndex: 'address',
        key: 'address',
        align:'center',
      },{
        title: '监控设备厂商',
        dataIndex: 'manufacturer',
        key: 'manufacturer',
        align:'center',
      },{
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
    deleteArr.map(item => {
      if(item.id = deleteId){
        deleteArr.splice(i, 1)
      }
    })
    let group = []
    if(deleteArr.length > 0){
      deleteArr.map(item => {
        group.push(item.id)
      })
    }
    let data = {
      projectId,
      roomId,
      group
    }
    configureCamera(data).then(res=> {
      if(res.success){
        messageContent('success','设备删除成功!')
        if(subTable.length == 1 && pageNum > 1){
          setPageNum(pageNum  - 1)
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
      queryUnusedCamera(projectId, roomId).then(res => {
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
      params.subData.map(item => {
        group.push(item.id)
      })
    }
    let data = {
      projectId,
      roomId,
      group
    }
    configureCamera(data).then(res=> {
      if(res.success){
        messageContent('success','监控设备配置成功!')
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
        title: '监控设备sn',
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
    subTitle:'配电房监控',
    unknownTitle:'未选中的监控设备'
  }  
  //分页
  const paginationProps = {
    current: pageNum, //当前页码
    pageSize, // 每页数据条数
    total, // 总条数
    onChange: page => handlePageChange(page), //改变页码的函数
    hideOnSinglePage: false,
    showSizeChanger: false,
  }
  const handlePageChange = (page) => {
    setPageNum(page)
  }

  const exportData = () => {
    const params = { raw: true };
    const workbook = utils.book_new(); // 新建工作簿   
    let table = tableRef.current  
    const ws = utils.table_to_sheet(
      // 新建工作表
      table,
      params
    );
    utils.book_append_sheet(workbook, ws, "Sheet1"); // 把工作表添加到工作簿
    let file =  "xlsx";
    writeFile(workbook, '配电房监控.xlsx', { bookType: file }); // 下载
  }

  return (
    <div>
      {contextHolder}
      {transTag =='open' ? <div className={style.mask}></div> : null }
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
          {roomList.map((item) => {
            return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
          })}
        </Select>
      </div>
      <div className={style.mainContent}>
        <div className={style.contentTitle}>
            <span>配电房监控</span>
            <div>
            <Button type="primary" onClick={()=> settingClick()}style={{ width: 96}}>
                选择设备
            </Button>
            <Button type="primary" style={{marginLeft:'16px', width: 96}} onClick={()=>exportData()}>
                导出
            </Button>
            </div>
        </div>
        <div className={style.line}>
          <img className={style.lineImg} src={dashed}></img>
        </div>
        <div className={`${style.transferPage} ${transTag =='open' ? style.startAnimation : transTag =='close' ? style.endAnimation :''}`} >
        <UseTransfer transferTitle={transferTitle} saveValue={getSaveValue} columns={transferColumns} mainTable={mainTable} subTable={subTable} unknownTable={unknownTable} closeValue={getCloseValue}></UseTransfer>
        </div>
      <Table ref={tableRef} style={{marginTop:'16px'}} bordered columns={columns} dataSource={data} rowKey='id' pagination={paginationProps}></Table>
      <Modal className={style.deleteModal} open={deleteModal} onOk={deleteOk} onCancel={handleDelete} width={512} cancelText={'取消'} centered={true} closable={false} maskClosable={false} okText={'确认'} okType={'primary'} okButtonProps={{danger:true}}>
        <div className={style.deleteHeader}>删除提示</div>
        <div className={style.deleteBody}>
          <img className={style.warnIcon} src={firstwarn}></img>
          <span>是否确认在该配电房中删除视频监控设备？</span>
        </div>
      </Modal>
      </div>
    </div>
  )
}
