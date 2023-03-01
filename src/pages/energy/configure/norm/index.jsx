import React, { useEffect, useRef, useState } from 'react'
import {useSelector} from 'react-redux'
import {selectProjectId} from '@redux/systemconfig.js'
import { Select, Button, Space, message, Form, Input, Table } from 'antd';
import style from './style.module.less'
import SearchTree from '@com/searchTree'
import Custmodl from '@com/useModal'
import dashed from '@imgs/dashed.png'
import { energyQuota } from '@api/api.js'
import { useRequest } from 'ahooks';
import { AreaSetting } from '@api/api.js'

export default function Index() {
  const setRef = useRef()
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm()
  const Item = Form.Item
  const projectId = useSelector(selectProjectId);
  const { QueryAllArea } = AreaSetting
  const { querySpaceTrees, queryRoomQuotas, updateRoomQuotas } = energyQuota

  //园区
  const [areaList, setAreaList] = useState([])
  const [defaultArea, setDefaultArea] = useState()
  const [areaId,setAreaId] = useState(0)
  const getAreaData = () =>{
    return QueryAllArea (projectId, 1).then(res=> {
      let {success, data} = res
      if(success && data){
        setAreaList(data)
        setDefaultArea(data[0].id)
        setAreaId(data[0].id)
      }else{
        messageApi.open({
          type:'error',
          content:res.errMsg
        })
      }
    })
  }

  const { data:AreaData } = useRequest(getAreaData,{
    onSuccess:(result,params) => {}
  })
  const changeArea = (value) => {
    setPageNum(1)
    setAreaId(value)
  }

  const getTreeData = () => {
    return querySpaceTrees(projectId, areaId, '').then(res => {
      if(res.success){
        setTreeData(res.data)
      }else{
        messageApi.open({
          type: 'error',
          content: res.errMsg
        })
      }
    })
  }
  
  const {run: treeRun} = useRequest(getTreeData, {
    manual: true
  })
  useEffect(()=>{
    if(areaId == 0){
      return
    }else{
      setParams([{id:areaId, level: 1}])
      treeRun()
    }
  },[areaId])
  const [treeData, setTreeData] = useState([])
  const fieldNames = {
    title:'name',
    key: 'areaId',
    children: 'nodes'
  }
  //查询表格
  const [params, setParams] = useState([])
  const getFromChild = values => {
    if(values.length == 0){
      setParams([{level: 1, id: areaId}])
    }else{
      let arr = []
      values.map(value => {
        if(checkLeaf(value, treeData)){
          arr.push({
            id: value,
            level: 3
          })
        }
      })
      if(arr.length == 0){return;}
      setParams(arr)
    }  
  }
  const checkLeaf = (value, list) => {
    for(let i = 0 ;i< list.length; i++){
      if(value == list[i].areaId && list[i].nodes){
        return false
      }else if(value != list[i].areaId && list[i].nodes){
        checkLeaf(value, list[i].nodes)
      }else if(value != list[i].areaId && !list[i].nodes){
        return true
      }
    }
  }

  const columns = [
    {
      title:'园区',
      dataIndex:'area',
      key:'area',
      align:'center',
    },{
      title:'建筑物',
      dataIndex:'building',
      key:'building',
      align:'center'
    },{
      title:'房间',
      dataIndex:'room',
      key:'room',
      align:'center'
    },{
      title:'年度综合能耗定额(吨标煤)',
      dataIndex:'quotaComprehensive',
      key:'quotaComprehensive',
      align:'center'
    },{
      title:'年度用电定额(kWh)',
      dataIndex:'quotaElectric',
      key:'quotaElectric',
      align:'center'
    },{
      title:(<div>水(m³)<br/>剩余/定额 </div>),
      dataIndex:'quotaWater',
      key:'quotaWater',
      align:'center'
    },{
      title:(<div>燃气(m³)<br/>剩余/定额 </div>),
      dataIndex:'quotaGas',
      key:'quotaGas',
      align:'center'
    },{
      title:(<div>煤炭(吨)<br/>剩余/定额 </div>),
      dataIndex:'quotaCoal',
      key:'quotaCoal',
      align:'center'
    },{
      title:'操作',
      key: 'action',
      align:'center',
      render: (_, record) => (
        <Space size="middle">
          <span style={{color:'#237ae4', textDecoration:'underline', cursor:'pointer'}} onClick={()=>setAll(record)}>修改</span>
        </Space>)
    }
  ]
  const [dataSource, setDataSource] = useState([])

  const [pageNum, setPageNum] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 10
  const getTableData = () => {
    return queryRoomQuotas(projectId, pageNum, pageSize, params).then(res => {
      if(res.success){
        setDataSource(res.data)
        setTotal(res.total)
      }else{
        messageApi.open({
          type:'error',
          content: res.errMsg
        })
      }
    } )
  }
  const { run: runTable } = useRequest(getTableData,{
    manual: true
  })
  useEffect(()=>{
    if(params.length == 0){
      return
    }else{
      runTable()
    }
  },[params, pageNum])

  const [selectedKeys, setSelectedKeys] = useState([]);
  const onSelect = (newSelectedRowKeys) => {
    setSelectedKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedKeys,
    onChange: onSelect,
  };

  const setAll = (record) => {
    if(record){
      setSelectedKeys([record.id])
      form.setFieldsValue({
        TotalValue: record.quotaComprehensive,
        totalWarningValue: record.totalWarningValue,
        ElectricValue: record.quotaElectric,
        ElectricWarningValue: record.electricWarningValue,
        WaterColdValue: record.quotaWater,
        WaterColdWarningValue: record.waterColdWarningValue,
        GasValue: record.quotaGas,
        GasWarningValue: record.gasWarningValue,
        CoalValue: record.quotaCoal,
        CoalWarningValue: record.coalWarningValue,
      })
    }else if(!record && selectedKeys.length == 0){
      messageApi.open({
        type:'warning',
        content:'请至少选择一项配置项！'
      })
      return;
    }else{
      form.setFieldsValue({
        TotalValue: 2000,
        TotalWarningValue: 1000,
        ElectricValue: 200,
        ElectricWarningValue: 20,
        WaterColdValue: 200,
        WaterColdWarningValue: 20,
        GasValue: 200,
        GasWarningValue: 20,
        CoalValue: 200,
        CoalWarningValue: 20,
      })
    }
    setRef.current.onOpen()
  }
  const onOk = async() => {
    try{
      const values = await form.validateFields();
      let param = [];
      selectedKeys.map(item => {
        param.push({
          areaId,
          areaLevel: 3,
          ...values
        })
      })
      updateRoomQuotas(projectId, param).then(res => {
        if(res.success){
          messageApi.open({
            type:'success',
            content:'方案修改成功!'
          })
        }else{
          messageApi.open({
            type:'error',
            content:res.errMsg
          })
        }
      })
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

  //分页
  const paginationProps = {
    current: pageNum, //当前页码
    pageSize, // 每页数据条数
    // showTotal: () => (
    //   <span>总共{total}项</span>
    // ),
    total, // 总条数
    onChange: page => handlePageChange(page), //改变页码的函数
    hideOnSinglePage: false,
    showSizeChanger: false,
  }
  const handlePageChange = (page) => {
    setPageNum(page)
  }

  return (
    <div>
      {contextHolder}
      <div className={style.header}>
        <span className={style.headerTitle}>园区选择</span>
        <Select
          placeholder="请选择园区"
          size="middle"
          key={defaultArea}
          defaultValue={defaultArea}
          style={{width: '200px'}}
          onChange={changeArea}
        >
          {areaList.map(item => {
            return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
          })}
        </Select>
        <Button type='primary' style={{ position:'absolute', right: 16,width: 96}} onClick={()=> setAll()}>批量配置</Button>
      </div>

      <div className={style.mainContent}>
        <SearchTree treeData={treeData} fieldNames={fieldNames} getValues={getFromChild}></SearchTree>
        <div className={style.rightContent}>
          <Table columns={columns} dataSource={dataSource} bordered rowKey='id' rowSelection={rowSelection} pagination={paginationProps}></Table>
        </div>
      </div>
      <Custmodl title='设置能耗定额' ref={setRef}  mold="cust" width={640} onOk={onOk}>
        <Form name='editform'  form={form}  requiredMark={false} autoComplete='off' style={{display:'flex',justifyContent:'space-between',flexWrap:'wrap'}}>
          <Item label='综合能耗(吨标煤)' labelCol={{span:14}} labelAlign={'left'} name='TotalValue' style={{width: 240}}>
            <Input style={{width:'128px', textAlign:'right'}} disabled></Input>
          </Item>
          <Item label='预警值' name='TotalWarningValue' labelCol={{span:8}} labelAlign={'right'} rules={[{required:true, message:'请输入预警值'},{validator:handelValidate }]}>
            <Input style={{width:'128px', textAlign:'right'}} ></Input>
          </Item>
          <img src={dashed} style={{width:'100%',marginBottom: 16}}></img>
          <Item label='年度用电定额(kWh)' labelCol={{span:14}} labelAlign={'left'} name='ElectricValue' style={{width: 240}} rules={[{required:true, message:'请输入用电定额'}]}>
            <Input style={{width:'128px', textAlign:'right'}}></Input>
          </Item>
          <Item label='预警值' name='ElectricWarningValue' labelCol={{span:8}} labelAlign={'right'} rules={[{required:true, message:'请输入预警值'}]}>
            <Input style={{width:'128px', textAlign:'right'}}></Input>
          </Item>
          <Item label='年度用水定额(m³)' labelCol={{span:14}} labelAlign={'left'} name='WaterColdValue' style={{width: 240}} rules={[{required:true, message:'请输入用水定额'}]}>
            <Input style={{width:'128px', textAlign:'right'}}></Input>
          </Item>
          <Item label='预警值' name='WaterColdWarningValue' labelCol={{span:8}} labelAlign={'right'} rules={[{required:true, message:'请输入预警值'}]}>
            <Input style={{width:'128px', textAlign:'right'}}></Input>
          </Item>
          <Item label='年度用气定额(m³)' labelCol={{span:14}} labelAlign={'left'} name='GasValue' style={{width: 240}} rules={[{required:true, message:'请输入用气定额'}]}>
            <Input style={{width:'128px', textAlign:'right'}}></Input>
          </Item>
          <Item label='预警值' name='GasWarningValue' labelCol={{span:8}} labelAlign={'right'} rules={[{required:true, message:'请输入预警值'}]}>
            <Input style={{width:'128px', textAlign:'right'}}></Input>
          </Item>
          <Item label='年度用煤定额(吨)' labelCol={{span:14}} labelAlign={'left'} name='CoalValue' style={{width: 240}} rules={[{required:true, message:'请输入用煤定额'}]}>
            <Input style={{width:'128px', textAlign:'right'}}></Input>
          </Item>
          <Item label='预警值' name='CoalWarningValue' labelCol={{span:8}} labelAlign={'right'} rules={[{required:true, message:'请输入预警值'}]}>
            <Input style={{width:'128px', textAlign:'right'}}></Input>
          </Item>
        </Form>      
      </Custmodl>
    </div>
  )
}
