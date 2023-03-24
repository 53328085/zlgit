import React, { useEffect, useState } from 'react'
import { useRequest } from 'ahooks';
import { Select, Button, Table, Space, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import {useSelector} from 'react-redux'
import {utils, writeFile} from 'xlsx'
import {selectProjectId, selectOneLevel} from '@redux/systemconfig.js'
import { distributionRoom } from '@api/api.js'
import style from './style.module.less'
import dashed from '@imgs/dashed.png'
import firstwarn from '@imgs/warning.png' 

export default function Index() {
  const projectId = useSelector(selectProjectId);
  //园区选择
  const areaList = useSelector(selectOneLevel)
  const [defaultArea, setDefaultArea] = useState(areaList[0]?.id || undefined)
  const [areaId,setAreaId] = useState(areaList[0]?.id || undefined)
  const handleChange = (values) => {
    setPageNum(1)
    setAreaId(values)
  }
  //配电房下拉框
  const { queryPageRoom } = distributionRoom
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
    }else{
      if(areaId == 0 || !areaId){
        return
      }else{
        queryRoom()
      }
    }
  },[areaId])
  const ChangeRoom = values => {
    setPageNum(1)
    setDefaultRoom(values)
    setRoomId(values)
  }

  const columns = [
    {
      align:'center',
      title: '园区名称',
      dataIndex: 'regionName',
      key: 'regionName',
    },
    { 
      align:'center',
      title: '配电房名称',
      dataIndex: 'distributionName',
      key: 'distributionName',
    },
    {
      title: '配电房地址',
      dataIndex: 'distributionAddress',
      key: 'distributionAddress',
      align:'center',
    },{
      title: '备注',
      dataIndex: 'tag',
      key: 'tag',
      align:'center',
    },
    {
      title: '操作',
      key: 'action',
      align:'center',
      render: (_, record) => (
        <Space size="middle">
          <span className={style.editText} onClick={() => edit(record)}>编辑</span>
          <span className={style.deleteText} onClick={() => deleteRecord(record)}>删除</span>
        </Space>
      ),
    },
  ];

  const data = []


  const showAdd = () => {
    if(areaId == 0 || !areaId){
      message.warning('请先选择园区!')
      return;
    }
    window.open(`/topology`, '_blank')
  }

  const edit = (record) => {
    console.log(record)
    sessionStorage.setItem('chartData', JSON.stringify(record))
    window.open(`/topology`, '_blank')
  }

  const [deleteModal, setDeleteModal] = useState(false)
  const deleteOk = () => {
    setDeleteModal(false)
  }
  const handleDelete = () => {
    setDeleteModal(false)
  }
  const deleteRecord = (record) => {
    setDeleteModal(true)
  }

  return (
    <div>
      <div className={style.header}>
        <span className={style.headerTitle}>园区选择</span>
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
        <div className={style.contentTitle}>配电系统图</div>
        <div className={style.line}>
          <img className={style.lineImg} src={dashed}></img>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={()=>showAdd()}>
        新增
      </Button>
      <Table style={{marginTop:'16px'}} columns={columns} bordered dataSource={data} rowKey='id'></Table>
      <Modal className={style.deleteModal} open={deleteModal} onOk={deleteOk} onCancel={handleDelete} width={512} cancelText={'取消'} centered={true} closable={false} maskClosable={false} okText={'确认'} okType={'primary'} okButtonProps={{danger:true}}>
        <div className={style.deleteHeader}>删除提示</div>
        <div className={style.deleteBody}>
          <img className={style.warnIcon} src={firstwarn}></img>
          <span>是否确认删除配电系统图？</span>
        </div>
      </Modal>
      </div>
    </div>
  )
}
