import React, { useRef, useState } from 'react'
import { Select, Button, Table, Space, Form, Input, Modal, Tree } from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import style from './style.module.less'
import dashed from '@imgs/dashed.png'
import firstwarn from '@imgs/warning.png' 
import UseTransfer from '@com/useTransfer'

export default function Index() {
  
  const [addModal, setAddModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [form] = Form.useForm()
  const Item = Form.Item
  const showAdd = () => {
    setModalTitle('新增线路')
    setAddModal(true)
    form.resetFields();
  }
  const addSon = (record) => {
    setModalTitle('新增线路')
    setAddModal(true)
    form.resetFields();
  }
  const addOk = async () => {
    try {
      const values = await form.validateFields();
      setAddModal(false)
    }catch(errorInfo){}
  }
  const handleCancel = () => {
    setAddModal(false)
  }
  const edit = (record) => {
    console.log(record)
    setModalTitle('编辑线路')
    setAddModal(true)
    form.setFieldsValue(record)
  }

  const [deleteModal, setDeleteModal] = useState(false)
  const deleteOk = () => {
    setDeleteModal(false)
  }
  const handleDelete = () => {
    setDeleteModal(false)
  }
  const deleteRecord = (record) => {
    console.log(record)
    setDeleteModal(true)
  }

  //线路图
  const {TreeNode} = Tree;
  const treeData = [
    {
        title:'线路1',
        key:'1',
        children:[
            {
                title:'线路1.1',
                key:'1.1',
                children:[
                    {
                        title:'线路1.1.1',
                        key:'1.1.1',
                    },{
                        title:'线路1.1.2',
                        key:'1.1.2',
                    },{
                        title:'线路1.1.3',
                        key:'1.1.3',
                    },
                ]
            },{
                title:'线路1.2',
                key:'1.2'
            }
        ]
    },{
        title:'线路2',
        key:'2'
    },{
        title:'线路3',
        key:'3'
    }
  ]
  const onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };

  const nodeTitle = {
    display: 'flex',
    position: 'relative',
    cursor:'default',
  }
  const nodeDevice = {
    position: 'absolute',
    right: 224,
    width: 48,
    height: 20,
    fontSize:'14px',
    color: '#237ae4',
    backgroundColor:'rgba(35, 122, 228, 0.2)',
    border:'1px solid #b3d8ff',
    lineHeight:'20px',
    textAlign:'center'
  }
  const nodeAction = {
    position: 'absolute',
    right: 0,
    width:'208px',
    display:'flex',
    justifyContent:'space-around',
    fontSize:'14px',
  }

  const renderTreeNodes = (data) => {
    let nodeArr = data.map((item) => {
        item.title = (
            <div style={nodeTitle}>
                <span>{item.title}</span>
                <div style={nodeDevice}>1</div>
                <div style={nodeAction}>
                    <span style={{ color:'#237ae4', cursor:'pointer', textDecoration:'underline' }} onClick={()=>addSon(item.key)}>新增</span>
                    <span style={{ color:'#237ae4',  cursor:'pointer', textDecoration:'underline'}} onClick={()=>edit(item.key)}>编辑</span>
                    <span style={{ color:'#237ae4', cursor:'pointer', textDecoration:'underline' }} onClick={()=>settingClick(item.key)}>配置</span>
                    <span style={{ color:'#f33', cursor:'pointer', textDecoration:'underline' }} onClick={()=>deleteRecord(item.key)}>删除</span>
                </div>
            </div>
        )

        if(item.children){
            return (
                <TreeNode title={item.title} key={item.key} dataRef={item}>
                    {renderTreeNodes(item.children)}
                </TreeNode>
            )
        }
        return <TreeNode title={item.title} key={item.key}></TreeNode>
    })
    return nodeArr;
  }
  
  //穿梭框
  const [transTag, setTransTag] = useState('')
  const settingClick =(record) => {
    setTransTag('open');
  }

  const getCloseValue = params => {
    console.log(params);
    setTransTag(params)
  }

  const mainTable = [{
    id:1,
    deviceNumber:'563265532381',
    deviceName:'电表01',
    address:'1号楼B101'
  }]

  const subTable = [
    {
        id:2,
        deviceNumber:'563265532382',
        deviceName:'电表02',
        address:'1号楼B101'
    },
    {
        id:3,
        deviceNumber:'563265532383',
        deviceName:'电表03',
        address:'1号楼B101'
    },
    {
        id:4,
        deviceNumber:'563265532384',
        deviceName:'电表04',
        address:'1号楼B101'
    },
  ]

  const unknownTable = [
    {
        id:5,
        deviceNumber:'563265532385',
        deviceName:'电表05',
        address:'1号楼B101'
    },{
        id:6,
        deviceNumber:'563265532386',
        deviceName:'电表06',
        address:'1号楼B101'
    },{
        id:7,
        deviceNumber:'563265532387',
        deviceName:'电表07',
        address:'1号楼B101'
    },{
        id:8,
        deviceNumber:'563265532388',
        deviceName:'电表08',
        address:'1号楼B101'
    },{
        id:9,
        deviceNumber:'563265532389',
        deviceName:'电表09',
        address:'1号楼B101'
    },{
        id:10,
        deviceNumber:'563265532390',
        deviceName:'电表10',
        address:'1号楼B101'
    },{
        id:11,
        deviceNumber:'563265532311',
        deviceName:'电表11',
        address:'1号楼B101'
    },
  ]

  const columns = [
    {   
        align:'center',
        title: '设备编号',
        dataIndex:'deviceNumber',
        key:'deviceNumber'
    },{
        align:'center',
        title: '设备名称',
        dataIndex:'deviceName',
        key:'deviceName'
    },{
        align:'center',
        title: '安装地址',
        dataIndex:'address',
        key:'address'
    }
]
  const transferTitle = {
    mainTitle:'线路总表',
    subTitle:'线路分表',
    unknownTitle:'未选中设备'
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
            <span>配电房线路图</span>
            <Button type="primary" onClick={()=>showAdd()} style={{marginRight:0}}>
                新增主线
            </Button>
        </div>
        <div className={style.line}>
          <img className={style.lineImg} src={dashed}></img>
        </div>
        <div className={style.lineTree}>
            <div className={style.treeTitle}>
                <span className={style.treeItem}>线路图</span>
                <span className={style.deviceItem}>设备数</span>
                <span className={style.actionItem}>操作</span>
            </div>
            <div className={style.treeContent}>
                {/* <Tree treeData={treeData} defaultExpandAll blockNode onSelect={onSelect}></Tree> */}
                <Tree defaultExpandAll blockNode selectable={false}>{renderTreeNodes(treeData)}</Tree>
            </div>
        </div>
        <div className={`${style.transferPage} ${transTag =='open' ? style.startAnimation : transTag =='close' ? style.endAnimation :''}`} >
          <UseTransfer transferTitle={transferTitle} columns={columns} mainTable={mainTable} subTable={subTable} unknownTable={unknownTable} closeValue={getCloseValue}></UseTransfer>
        </div>
        <Modal className={style.addModal} open={addModal} onOk={addOk} onCancel={handleCancel} width={592} cancelText={'取消'} centered={true} closable={false} maskClosable={false} okText={'确认'} okType={'primary'} >
        <div className={style.addHeader}>{ modalTitle }</div>
        <div className={style.addBody}>
          <Form name='addform' labelCol={{span:5}} form={form} labelAlign={'left'} requiredMark={false} autoComplete='off'>
            <Item label='线路名称' name='name' rules={[{required:true, message:'请输入线路名称'}]}>
              <Input style={{width:'400px'}}></Input>
            </Item>
          </Form>
        </div>
        </Modal>
        <Modal className={style.deleteModal} open={deleteModal} onOk={deleteOk} onCancel={handleDelete} width={512} cancelText={'取消'} centered={true} closable={false} maskClosable={false} okText={'确认'} okType={'primary'} okButtonProps={{danger:true}}>
            <div className={style.deleteHeader}>删除提示</div>
            <div className={style.deleteBody}>
            <img className={style.warnIcon} src={firstwarn}></img>
            <span>是否确认删除选中线路？</span>
            </div>
        </Modal>
      </div>
    </div>
  )
}
