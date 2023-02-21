import React, { useRef, useState } from 'react'
import { Select, Button, Table, Space, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import style from './style.module.less'
import dashed from '@imgs/dashed.png'
import firstwarn from '@imgs/warning.png' 
import UseTransfer from '@com/useTransfer'

export default function Index() {
  const columns = [
    {
      align:'center',
      title: '园区名称',
      dataIndex: 'regionName',
      key: 'regionName',
    },
    { 
      align:'center',
      title: '安装地址',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '传感器型号',
      dataIndex: 'sensorType',
      key: 'sensorType',
      align:'center',
    },{
        title: '传感器编号',
        dataIndex: 'sensorNumber',
        key: 'sensorNumber',
        align:'center',
      },{
        title: '传感器名称',
        dataIndex: 'sensorName',
        key: 'sensorName',
        align:'center',
      },{
        title: '所属网关',
        dataIndex: 'gateway',
        key: 'gateway',
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
          <span className={style.deleteText} onClick={() => deleteRecord(record)}>删除</span>
        </Space>
      ),
    },
  ];

  const data = [
    {
      id: 1,
      regionName:'正泰物联杭州园区',
      address:'1号楼B2配电房',
      sensorType:'ZTWLSENEOR-S',
      sensorNumber:'220500991',
      sensorName:'烟感传感器',
      gateway:'/',
      tag:''
    },{
      id: 2,
      regionName:'正泰物联杭州园区',
      address:'1号楼B2配电房',
      sensorType:'ZTWLSENEOR-W',
      sensorNumber:'220500992',
      sensorName:'水浸传感器',
      gateway:'/',
      tag:''
    },{
        id: 3,
        regionName:'正泰物联杭州园区',
        address:'1号楼B2配电房',
        sensorType:'ZTWLSENEOR-TH',
        sensorNumber:'220500993',
        sensorName:'温湿度传感器',
        gateway:'/',
        tag:''
      }
  ]

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

  //穿梭框
  const mainTable = []
  const [subTable, setSubTable] = useState([])
  const unknownTable = []
  const [transTag, setTransTag] = useState('')
  const settingClick =() => {
    setTransTag('open');
    setSubTable([...data])
  }

  const getCloseValue = params => {
    setTransTag(params)
  }

  const transferColumns = [
    {   
        align:'center',
        title: '设备编号',
        dataIndex:'sensorNumber',
        key:'sensorNumber'
    },{
        align:'center',
        title: '设备名称',
        dataIndex:'sensorName',
        key:'sensorName'
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
  return (
    <div>
      <div className={style.header}>
        <span className={style.headerTitle}>园区选择</span>
        <Select
          placeholder="请选择园区"
          size="middle"
          defaultValue="1"
          style={{width: '200px'}}
        >
          <Option value="1">正泰物联全部园区</Option>
          <Option value="2">正泰物联滨江园区</Option>
          <Option value="3">正泰物联温州园区</Option>
        </Select>
        <div className={style.division}></div>
        <Select
          placeholder="请选择配电房"
          size="middle"
          defaultValue="1"
          style={{width: '240px'}}
        >
          <Option value="1">正泰大厦1号楼低压配电房</Option>
          <Option value="2">正泰大厦2号楼低压配电房</Option>
          <Option value="3">正泰大厦3号楼低压配电房</Option>
          <Option value="4">正泰大厦4号楼低压配电房</Option>
        </Select>
      </div>
      <div className={style.mainContent}>
        <div className={style.contentTitle}>
            <span>配电房传感器</span>
            <div>
            <Button type="primary" onClick={()=> settingClick()}>
                选择设备
            </Button>
            <Button type="primary" style={{marginLeft:'16px',marginRight:16}}>
                批量导入
            </Button>
            <Button type="primary" >
                导出
            </Button>
            </div>
        </div>
        <div className={style.line}>
          <img className={style.lineImg} src={dashed}></img>
        </div>
        <div className={`${style.transferPage} ${transTag =='open' ? style.startAnimation : transTag =='close' ? style.endAnimation :''}`} >
        <UseTransfer transferTitle={transferTitle} columns={transferColumns} mainTable={mainTable} subTable={subTable} unknownTable={unknownTable} closeValue={getCloseValue}></UseTransfer>
        </div>
      <Table style={{marginTop:'16px'}} bordered columns={columns} dataSource={data} rowKey='id'></Table>
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
