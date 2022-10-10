import React, { useState, useEffect } from 'react'
import style from './style.module.less'
import { Input, Button, Space, Modal, Form, Select } from 'antd'
import Icon, { PlusOutlined } from '@ant-design/icons';
import UserTable from '@com/useTable'
import {Backstage} from '@api/api.js'
import {selectCurProject} from '@redux/user.js'
import {useSelector, useStore, useDispatch} from 'react-redux'
import {useAntdTable} from 'ahooks'

export default function Index() {
  const { Search } = Input;
  const { Option } = Select;
  const [search, setSearch] = useState('');
  const onSearch = (value) => setSearch(value);
  const projectId = useSelector(selectCurProject)?.id;
  const projectName = useSelector(selectCurProject)?.name;
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [dialogTitle, setDialogTitle] = useState('新增房间')
  const [regionOption, setRegionOption] = useState([]);
  const [buildingOption, setBuildingOption] = useState([]);
  const [isbuild, setIsbuild] = useState(true);
  const [floorOption, setFloorOption] = useState([]);
  const [isfloor, setIsfloor] = useState(true);

  useEffect(() =>{
    Backstage.GetProjectRegionList(projectId).then(res => {
      if(res.success && Array.isArray(res.data)){
        setRegionOption(res.data);
      }
    })
  },[])

  let params = {
    pageNum:1,
    pageSize: 15,
    projectId: projectId,
    roomName:search,
  }

  const columns = [
    {
        title:'房间号',
        dataIndex:'name',
    },{
        title:'园区-建筑-楼层',
        dataIndex:'location',
    },{
      title:'房间面积',
      dataIndex:'area',
    },{
      title:'备注',
      dataIndex:'remark',
    },{
      title:'操作',
      key:'action',
      render: (_,record) => <Space>
        <span style={{textDecoration:'underline',cursor:'pointer',color:'#237ae4'}}>编辑</span>
        <span style={{textDecoration:'underline',cursor:'pointer',color:'#f00'}}>删除</span>
      </Space>
    }
  ]

  const getTableData = ({ current, PageSize}) => {
    params = Object.assign({}, params, {PageNum: current, PageSize})
    return Backstage.GetProjectRoom(params).then(res => {
      let {success, data, totalNum} = res;
      if (success && Array.isArray(data)) {
        return {
          total: totalNum,
          list: data
        }
      
      }else {
        return {
          total: 0,
          list: []
        }
      }
    })
  }

  const {tableProps} = useAntdTable(getTableData,{
    refreshDeps: [projectId,search],
    defaultPageSize:15,
  })

  const addRegion = () =>{
    setIsModalOpen(true);
    setDialogTitle('新增房间');
    form.setFieldValue('ProjectName',projectName);
  }

  const onFinish = (value) => {
    console.log(value);
    form.resetFields();
    setIsModalOpen(false);
  }

  const cancel = () =>{
    form.resetFields();
    setIsModalOpen(false);
  }
  const onChangeRegion = (value)=>{
    let param = {
      projectId: projectId,
      regionId: value
    }
    Backstage.GetProjectBuildingList(param).then(res => {
      if(res.success && Array.isArray(res.data)){
        setBuildingOption(res.data);
        setIsfloor(true);
        setIsbuild(false);
        form.setFieldValue('buildingId',null);
        form.setFieldValue('floorId',null);
      }
    })
  }

  const onChangeBuilding = (value)=>{
    let param = {
      projectId: projectId,
      buildingId: value
    }
    Backstage.GetProjectFloorList(param).then(res => {
      if(res.success && Array.isArray(res.data)){
        setFloorOption(res.data);
        setIsfloor(false);
        form.setFieldValue('floorId',null);
      }
    })
  }


    return (
      <div className={style.content}>
        <div className={style.contentHeader}>
          <span >建筑查询</span>
          <Search
            placeholder="请输入房间名称"
            allowClear
            enterButton="查询"
            size="middle"
            onSearch={onSearch}
            style={{width:533,marginLeft:12}}
          />
          <Button onClick={addRegion} type='primary' size='middle' style={{width:96,marginLeft:'auto',marginRight:0}} icon={<PlusOutlined />}>新增</Button>
        </div>
        <UserTable columns={columns} {...tableProps} rowKey='id' />
        <Modal width={440} className='dialogModal' footer={null} closable={false} maskClosable={false} open={isModalOpen}>
                <div className={style.modalTitle}>{dialogTitle}</div>
                <Form form={form}   className={style.dialogForm} onFinish={onFinish} requiredMark={false} >
                    <Form.Item name='name' label='房间号' 
                    rules={[{required: true,message:'请输入房间号'}]}>
                        <Input size='middle' className='input' placeholder='请输入房间号'></Input>
                    </Form.Item>
                    <Form.Item name='regionId' label='所属园区' 
                    rules={[{required: true,message:'请选择园区'}]}>
                        <Select size='middle' className='input' placeholder='请选择园区' onChange={onChangeRegion}>
                          {regionOption.map((item,index)=>{
                            return <Option key={index} value={item.id}>{item.name}</Option>
                          })}
                        </Select>
                    </Form.Item>
                    <Form.Item name='buildingId' label='所属建筑' 
                    rules={[{required: true,message:'请选择建筑'}]}>
                        <Select size='middle' className='input' placeholder='请选择建筑' onChange={onChangeBuilding} disabled={isbuild}>
                          {buildingOption.map((item,index)=>{
                            return <Option key={index} value={item.id}>{item.name}</Option>
                          })}
                        </Select>
                    </Form.Item>
                    <Form.Item name='floorId' label='所属楼层' 
                    rules={[{required: true,message:'请选择楼层'}]}>
                        <Select size='middle' className='input' placeholder='请选择楼层' disabled={isfloor}>
                          {floorOption.map((item,index)=>{
                            return <Option key={index} value={item.id}>{item.name}</Option>
                          })}
                        </Select>
                    </Form.Item>
                    <Form.Item name='area' label='房间面积' 
                    rules={[{required: true,message:'请输入房间面积'}]}>
                        <Input size='middle' className='input' type='number' placeholder='请输入房间面积'></Input>
                    </Form.Item>
                    <Form.Item name='remark' label='备注信息'>
                        <Input size='middle' className='input'></Input>
                    </Form.Item>
                    <Form.Item style={{display:'flex',justifyContent:'flex-end'}}>
                        <Button size="middle"  style={{marginLeft:'auto',marginRight:12}} onClick={cancel}>取消</Button>
                        <Button size="middle" type="primary" htmlType="submit" >
                        保存
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
      </div>
    )
  }