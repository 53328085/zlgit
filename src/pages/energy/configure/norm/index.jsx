import React, { useRef, useState } from 'react'
import {useSelector} from 'react-redux'
import {selectProjectId} from '@redux/systemconfig.js'
import { Select, Button, Space, message, Form, Input, Table } from 'antd';
import style from './style.module.less'
import SearchTree from '@com/searchTree'
import Custmodl from '@com/useModal'
import dashed from '@imgs/dashed.png'
import { energyQuota } from '@api/api.js'
import { useRequest } from 'ahooks';

export default function Index() {
  const setRef = useRef()
  const [form] = Form.useForm()
  const Item = Form.Item
  const projectId = useSelector(selectProjectId);
  const { querySpaceTrees, queryRoomQuotas, updateRoomQuotas } = energyQuota

  const getTreeData = () => {
    return querySpaceTrees(projectId, 4).then(res => {
      if(res.success){}
    })
  }
  const {run: treeRun} = useRequest(getTreeData)
  const [treeData, setTreeData] = useState([
    {
      name:'正泰物联杭州园区',
      id:'1',
      childs:[{
        name:'研发1号楼',
        id:'1-1',
        childs:[{
          name:'1层',
          id:'1-1-1'
        }]
      },]
    }
  ])
  const fieldNames = {
    title:'name',
    key: 'id',
    children: 'childs'
  }

  const columns = [
    {
      title:'园区',
      dataIndex:'areaName',
      key:'areaName',
      align:'center',
    },{
      title:'建筑物',
      dataIndex:'buildingName',
      key:'buildingName',
      align:'center'
    },{
      title:'房间',
      dataIndex:'roomName',
      key:'roomName',
      align:'center'
    },{
      title:'年度综合能耗定额(吨标煤)',
      dataIndex:'energyOfYear',
      key:'quotaOfYear',
      align:'center'
    },{
      title:'年度用电定额(kWh)',
      dataIndex:'elecOfYear',
      key:'elecOfYear',
      align:'center'
    },{
      title:(<div>水(m³)<br/>剩余/定额 </div>),
      dataIndex:'waterQuota',
      key:'waterQuota',
      align:'center'
    },{
      title:(<div>燃气(m³)<br/>剩余/定额 </div>),
      dataIndex:'gasQuota',
      key:'gasQuota',
      align:'center'
    },{
      title:(<div>煤炭(吨)<br/>剩余/定额 </div>),
      dataIndex:'coalQuota',
      key:'coalQuota',
      align:'center'
    },{
      title:'操作',
      key: 'action',
      align:'center',
      render: (_, record) => (
        <Space size="middle">
          <span style={{color:'#237ae4', textDecoration:'underline', cursor:'pointer'}}>修改</span>
        </Space>)
    }
  ]

  const dataSource = [];
  const [selectedKeys, setSelectedKeys] = useState([]);
  const onSelect = (newSelectedRowKeys) => {
    setSelectedKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedKeys,
    onChange: onSelect,
  };

  const setAll = () => {
    form.setFieldsValue({
      totalEnergy: 2000,
      totalEnergyWarning: 1000,
      totalElec: 200,
      totalElecWarning: 20,
      totalWater: 200,
      totalWaterWarning: 20,
      totalGas: 200,
      totalGasWarning: 20,
      totalCoal: 200,
      totalCoalWarning: 20,
    })
    setRef.current.onOpen()
  }
  const onOk = async() => {
    try{
      const values = await form.validateFields();
      setRef.current.onCancel()
    }catch(errorInfo){}
    
  }

  const handelValidate = (rule, value, callback) => {
    if(!Number.isNaN(Number(value))){
      callback()
    }else{
      callback('值只能为数字！')
    }
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
        <Button type='primary' style={{ position:'absolute', right: 16,width: 96}} onClick={()=> setAll()}>批量配置</Button>
      </div>

      <div className={style.mainContent}>
        <SearchTree treeData={treeData} fieldNames={fieldNames}></SearchTree>
        <div className={style.rightContent}>
          <Table columns={columns} dataSource={dataSource} bordered rowKey='id' rowSelection={rowSelection}></Table>
        </div>
      </div>
      <Custmodl title='设置能耗定额' ref={setRef}  mold="cust" width={640} onOk={onOk}>
        <Form name='editform'  form={form}  requiredMark={false} autoComplete='off' style={{display:'flex',justifyContent:'space-between',flexWrap:'wrap'}}>
          <Item label='综合能耗(吨标煤)' labelCol={{span:14}} labelAlign={'left'} name='totalEnergy' style={{width: 240}}>
            <Input style={{width:'128px', textAlign:'right'}} disabled></Input>
          </Item>
          <Item label='预警值' name='totalEnergyWarning' labelCol={{span:8}} labelAlign={'right'} rules={[{required:true, message:'请输入预警值'},{validator:handelValidate }]}>
            <Input style={{width:'128px', textAlign:'right'}} ></Input>
          </Item>
          <img src={dashed} style={{width:'100%',marginBottom: 16}}></img>
          <Item label='年度用电定额(kWh)' labelCol={{span:14}} labelAlign={'left'} name='totalElec' style={{width: 240}} rules={[{required:true, message:'请输入用电定额'}]}>
            <Input style={{width:'128px', textAlign:'right'}}></Input>
          </Item>
          <Item label='预警值' name='totalElecWarning' labelCol={{span:8}} labelAlign={'right'} rules={[{required:true, message:'请输入预警值'}]}>
            <Input style={{width:'128px', textAlign:'right'}}></Input>
          </Item>
          <Item label='年度用水定额(m³)' labelCol={{span:14}} labelAlign={'left'} name='totalWater' style={{width: 240}} rules={[{required:true, message:'请输入用水定额'}]}>
            <Input style={{width:'128px', textAlign:'right'}}></Input>
          </Item>
          <Item label='预警值' name='totalWaterWarning' labelCol={{span:8}} labelAlign={'right'} rules={[{required:true, message:'请输入预警值'}]}>
            <Input style={{width:'128px', textAlign:'right'}}></Input>
          </Item>
          <Item label='年度用气定额(m³)' labelCol={{span:14}} labelAlign={'left'} name='totalGas' style={{width: 240}} rules={[{required:true, message:'请输入用气定额'}]}>
            <Input style={{width:'128px', textAlign:'right'}}></Input>
          </Item>
          <Item label='预警值' name='totalGasWarning' labelCol={{span:8}} labelAlign={'right'} rules={[{required:true, message:'请输入预警值'}]}>
            <Input style={{width:'128px', textAlign:'right'}}></Input>
          </Item>
          <Item label='年度用煤定额(吨)' labelCol={{span:14}} labelAlign={'left'} name='totalCoal' style={{width: 240}} rules={[{required:true, message:'请输入用煤定额'}]}>
            <Input style={{width:'128px', textAlign:'right'}}></Input>
          </Item>
          <Item label='预警值' name='totalCoalWarning' labelCol={{span:8}} labelAlign={'right'} rules={[{required:true, message:'请输入预警值'}]}>
            <Input style={{width:'128px', textAlign:'right'}}></Input>
          </Item>
        </Form>      
      </Custmodl>
    </div>
  )
}
