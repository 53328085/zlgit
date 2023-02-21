import React, { useRef, useState } from 'react'
import { Select, Button, Table, Space, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import style from './style.module.less'
import dashed from '@imgs/dashed.png'
import firstwarn from '@imgs/warning.png' 

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

  const data = [
    {
      id: 1,
      regionName:'正泰杭州园区',
      distributionName:'1号楼低压配电房',
      distributionAddress:'1号楼高压配电房',
      tag:'一次图'
    },{
      id: 2,
      regionName:'正泰杭州园区',
      distributionName:'2号楼低压配电房',
      distributionAddress:'2号楼高压配电房',
      tag:'一次图'
    }
  ]


  const showAdd = () => {}

  const edit = (record) => {
    console.log(record)
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
        <div className={style.contentTitle}>配电系统图</div>
        <div className={style.line}>
          <img className={style.lineImg} src={dashed}></img>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={()=>showAdd()}>
        新增
      </Button>
      <Table style={{marginTop:'16px'}} columns={columns} dataSource={data} rowKey='id'></Table>
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
