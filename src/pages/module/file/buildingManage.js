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
  const defaultStyle = {
    width:232
  };
  const [search, setSearch] = useState('');
  const onSearch = (value) => setSearch(value);
  const projectId = useSelector(selectCurProject)?.id;
  const projectName = useSelector(selectCurProject)?.name;
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [dialogTitle, setDialogTitle] = useState('新增建筑')
  const [regionOption, setRegionOption] = useState([]);

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
    region:0,
    projectId: projectId,
    buildingName:search,
  }

  const columns = [
    {
        title:'园区名称',
        dataIndex:'regionName',
    },{
        title:'建筑号',
        dataIndex:'buildingNo',
    },{
      title:'建筑名称',
      dataIndex:'name',
    },{
        title:'楼层范围',
        dataIndex:'floorRange',
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
    return Backstage.GetProjectBuilding(params).then(res => {
      let {success, data, totalNum} = res;
      console.log(data)
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
    setDialogTitle('新增建筑');
  }

  const onChangeRegion = (value) => {
    console.log(value)
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
  const validateMode = (rule, value, callback) => {
    let phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!phoneReg.test(value)) {
     callback('请输入正确手机号');
    } else {
        callback();
    }
  };


    return (
      <div className={style.content}>
        <div className={style.contentHeader}>
          <span >建筑查询</span>
          <Search
            placeholder="请输入建筑名称"
            allowClear
            enterButton="查询"
            size="middle"
            onSearch={onSearch}
            style={{width:533,marginLeft:12}}
          />
          <Button onClick={addRegion} type='primary' size='middle' style={{width:96,marginLeft:'auto',marginRight:0}} icon={<PlusOutlined />}>新增</Button>
        </div>
        <UserTable columns={columns} {...tableProps} rowKey='id' />
        <Modal width={1072} className='dialogModal' footer={null} closable={false} maskClosable={false} open={isModalOpen}>
          <div className={style.modalTitle}>{dialogTitle}</div>
          <Form form={form}   className={style.dialogForm} onFinish={onFinish} requiredMark={false} >
            <Form.Item name='regionId' label='所属园区' rules={[{required: true,message:'请选择园区'}]}>
              <Select size='middle' style={defaultStyle}  placeholder='请选择园区' onChange={onChangeRegion}>
                {regionOption.map((item,index)=>{
                  return <Option key={index} value={item.id}>{item.name}</Option>
                })}
              </Select>
            </Form.Item>
            <Form.Item name='buildingNum' label='建筑号' rules={[{required: true,message:'请输入建筑号'}]}>
              <Input size='middle' style={defaultStyle} placeholder='请输入建筑号'></Input>
            </Form.Item>
            <Form.Item name='buildingName' label='建筑名称' rules={[{required: true,message:'请输入建筑名称'}]}>
              <Input size='middle' style={defaultStyle} placeholder='请输入建筑名称'></Input>
            </Form.Item>
            <Form.Item name='upFloor' label='地上层数' rules={[{required: true,message:'请输入地上层数'}]}>
              <Input size='middle' type='number' style={defaultStyle} placeholder='请输入地上层数'></Input>
            </Form.Item>
            <Form.Item name='downFloor' label='地下层数' rules={[{required: true,message:'请输入地下层数'}]}>
              <Input size='middle' type='number' style={defaultStyle} placeholder='请输入地下层数'></Input>
            </Form.Item>
            <Form.Item name='lng' label='坐标经度' rules={[{required: true,message:'请输入坐标经度'}]}>
              <Input size='middle' disabled style={defaultStyle} placeholder='请输入坐标经度'></Input>
            </Form.Item>
            <Form.Item name='lat' label='坐标纬度' rules={[{required: true,message:'请输入坐标纬度'}]}>
              <Input size='middle' disabled style={defaultStyle} placeholder='请输入坐标纬度'></Input>
            </Form.Item>
            <Form.Item name='remark' label='备注信息'>
              <Input size='middle' style={defaultStyle} ></Input>
            </Form.Item>
            <Form.Item style={{display:'flex',justifyContent:'flex-end'}}>
              <Button size="middle"  style={{marginLeft:'auto',marginRight:12}} onClick={cancel}>取消</Button>
              <Button size="middle" type="primary" htmlType="submit" >保存</Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }