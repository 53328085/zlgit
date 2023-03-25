import React, { useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import BlueColumn from '@com/bluecolumn'
import { Select, Divider, Input, Button, message,Form,Switch,DatePicker  } from 'antd'
import Modal from '@com/useModal'
import { useSelector } from 'react-redux'
import Table from '@com/useTable'
import { operationDesigin } from '@api/api'

export default function Index() {
  const ContainerDiv = styled.div`
      border: 1px solid #d7d7d7;
      background-color: #fff;
      height: 100%;
      padding: 16px;
      .flexcss{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        .btnflex{
          display: flex;
          div:nth-of-type(1){
            margin-right: 16px;
          }
          .btncss{
            width: 96px;
            height: 32px;
            background-color: #237ae4;
            border-radius: 2px;
            color: #fff;
            text-align: center;
            line-height: 32px;
            cursor: pointer;
            &:hover{
              opacity: .7;
            }
          }
        }
      }
      
  `
  const [tableParams, setTableParams] = useState({
    pageNum: 1,
    pageSize: 10
  })
  const addmodalRef = useRef()
  const onelevel = useSelector(state => state.system.onelevel);
  const projectId = useSelector(state => state.system.menus.projectId)
  const options = onelevel.length > 0 ? useMemo(() => ([{ name: onelevel[0]?.levelName, id: 0 }, ...onelevel]), [onelevel]) : []
  const columns = [
    { title: onelevel[0]?.levelName, dataIndex: '' },
    { title: '巡检计划名称', dataIndex: '' },
    { title: '计划内容', dataIndex: '' },
    { title: '计划开始日期', dataIndex: '' },
    { title: '计划结束日期', dataIndex: '' },
    { title: '巡检周期', dataIndex: '' },
    { title: '创建日期', dataIndex: '' },
    { title: '巡检人', dataIndex: '' },
    { title: '操作', dataIndex: '',render(){
      return <span style={{color:'#ff0000',textDecoration:'underline'}}>删除</span>
    } }
  ]
  //获取设备
  const getInspectionPlanPage= async () => {
    let params = {
      projectId,
      ...tableParams,

    }
    const res = await operationDesigin.InspectionPlanPage(params)
    if (res.success) {

    } else {
      message.error(res.errMsg)
    }
  }
  //打开新增
  const openAdd=()=>{
    addmodalRef.current.onOpen()
  }
  const search = () => { }
  useEffect(() => {
    getInspectionPlanPage()
  }, [])
  return (
    <ContainerDiv>

      <div className='flexcss'>
        <BlueColumn name="设备管理" />
        <div className='btnflex'>
          <div className='btncss' onClick={openAdd}>
            新增
          </div>
          <div className='btncss'>
            导出
          </div>
        </div>


      </div>
      <Table columns={columns}></Table>
      <Modal mold ='cust' ref={addmodalRef} width={538}>
      <BlueColumn name="新建巡检计划" styled={{padding:'16px 0',color:"#237ae4",fontSize: 16}}/>
      <AddPlan />
      </Modal>
      
    </ContainerDiv>
  )
}

//新增巡检计划组件
let AddPlan =()=>{
  const [form] = Form.useForm()
  const onelevel = useSelector(state => state.system.onelevel);
  const arealist = onelevel.length>0?[{name:onelevel[0].levelName,id:0},...onelevel]:[]
  const dateopts = [{label:'每日',value:1},{label:'每周',value:2},{label:'每月',value:3}]
  const [dateCycle,setDataCycle]=useState(1)
  let capitalAr = '一二三四五六七'.split('')
  const time = []
  useMemo(()=>{
    for(let i=0; i<24; i++){
      time.push({
        label:`${i<=9?'0'+i:i}:00`,
        value:i
      })
    }
  },[dateCycle])
 
  const weekCycle=[];
  useMemo(()=>{
    for(let i=0;i<7;i++) {
      weekCycle.push({
        label:`周${capitalAr[i]}`,
        value:i+1
      })
    }
  },[dateCycle])
  
  const monthCycle =[]
  useMemo(()=>{
    for(let i=0;i<28;i++) {
      monthCycle.push({
        label:`${i+1}号`,
        value:i+1
      })
    }
  },[dateCycle])
  
  const changeCycle=(v)=>{
    form.setFieldValue('date',null)
    setDataCycle(v)
  }
  useEffect(()=>{
 
  },[])

  return (
   
      <Form 
      form={form}
      colon={false}
      labelAlign='left'
      labelCol={{span:4}}
      initialValues={{
        cycle:1
      }}
      >
        <Form.Item label={onelevel.length>0?onelevel[0].levelName:'园区名称'}>
          <Select 
          options={arealist} 
          fieldNames={{label:'name',value:'id'}}></Select>
        </Form.Item>
        <Form.Item label="计划名称">
          <Input></Input>
        </Form.Item>
        <Form.Item label="计划内容">
          <Input></Input>
        </Form.Item>
        <Form.Item label="巡检周期" name="cycle">
          <Select 
          options={dateopts}
          onChange={changeCycle}
          ></Select>
        </Form.Item>
        <Form.Item label="巡检日期" name="date">
        <Select options = {dateCycle==1?time:dateCycle==2?weekCycle:dateCycle==3?monthCycle:[]} ></Select>
        </Form.Item>
        <Form.Item label="开始周期">
          <DatePicker style={{width:'100%'}}></DatePicker>
        </Form.Item>
        <Form.Item label="结束周期">
          <DatePicker style={{width:'100%'}}></DatePicker>
        </Form.Item>
        <Form.Item label="巡检人">
          <Select></Select>
        </Form.Item>
        <Form.Item label="是否启用">
          <Switch  checkedChildren="启用" unCheckedChildren="停用"/>
        </Form.Item>
        <Form.Item label="创建日期">
        </Form.Item>
      </Form>
    
  )
}
