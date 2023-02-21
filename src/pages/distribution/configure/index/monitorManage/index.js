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
      title: '监控名称',
      dataIndex: 'monitorName',
      key: 'monitorName',
    },
    { 
      align:'center',
      title: '监控类型',
      dataIndex: 'monitorType',
      key: 'monitorType',
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
        dataIndex: 'IP',
        key: 'IP',
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
        dataIndex: 'company',
        key: 'company',
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
      monitorName:'1#配电房监控',
      monitorType:'本地监控',
      sn:'562323',
      category:'OKL-21',
      IP:'192.168.2.157',
      channel: 1,
      address:'1号楼低压配电房天花板',
      company:'大华技术股份有限公司',
      tag:'/'
    },{
        id: 2,
        monitorName:'1#配电房监控',
        monitorType:'云监控',
        sn:'562324',
        category:'BB563',
        IP:'20.102.5.25',
        channel: 2,
        address:'2号楼低压配电房天花板',
        company:'海康威视',
        tag:'/'
    }
  ]

  const showAdd = () => {}

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
  const [transTag, setTransTag] = useState('')
  const settingClick =() => {
    setTransTag('open');
  }

  const getCloseValue = params => {
    console.log(params);
    setTransTag(params)
  }

  const mainTable = []
  const subTable=[...data]
  const unknownTable = []
  const transferColumns = [
    {   
        align:'center',
        title: '监控设备sn',
        dataIndex:'sn',
        key:'sn'
    },{
        align:'center',
        title: '设备名称',
        dataIndex:'monitorName',
        key:'monitorName'
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
            <span>配电房监控</span>
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
