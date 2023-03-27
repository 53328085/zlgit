import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import BlueColumn from '@com/bluecolumn'
import { Select, Divider, Input, Button, message,Form,Switch,DatePicker  } from 'antd'
import Modal from '@com/useModal'
import { useSelector } from 'react-redux'
import Table from '@com/useTable'
import { operationDesigin } from '@api/api'
import moment from 'moment'
import WarningPng from '@imgs/warning.png'
import style from './style.module.less'
import { current } from '@reduxjs/toolkit'

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
    current: 1,
    pageSize: 10
  })
  const [userList,setUserList] = useState()//运维人员列表
  const [tableData,setTableData] = useState()
  const addmodalRef = useRef() //modal的ref
  const addformRef = useRef() //addform的ref
  const delModalRef=useRef() //del
  const tableRef = useRef() //table
  const onelevel = useSelector(state => state.system.onelevel);
  const projectId = useSelector(state => state.system.menus.projectId)
  const options = onelevel.length > 0 ? useMemo(() => ([{ name: onelevel[0]?.levelName, id: 0 }, ...onelevel]), [onelevel]) : []
  const columns = [
    { title: onelevel[0]?.levelName, dataIndex: 'area' },
    { title: '巡检计划名称', dataIndex: 'name' },
    { title: '计划内容', dataIndex: 'content' },
    { title: '计划开始日期', dataIndex: 'startTime' },
    { title: '计划结束日期', dataIndex: 'endTime' },
    { title: '巡检周期', dataIndex: 'cycle' },
    { title:'巡检日期',dataIndex:'timeS'},
    { title: '创建日期', dataIndex: 'createTime' },
    { title: '巡检人', dataIndex: 'operator' },
    { title: '操作', dataIndex: '',render(text){
      return <span style={{color:'#ff0000',textDecoration:'underline',cursor:'pointer'}} onClick={()=>openDel(text)}>删除</span>
    }}
  ]
  let planId;
  //获取设备
  const getInspectionPlanPage= async (pageNum) => {
    let params = {
      projectId,
      pageNum:pageNum?pageNum:tableParams.current,
      pageSize:tableParams.pageSize
    }
    const res = await operationDesigin.InspectionPlanPage(params)
    if (res.success) {
      setTableData([...res.data])
      setTableParams({
        current:res.pageNum,
        pageSize:res.pageSize,
        total:res.total
      })
    } else {
      message.error(res.errMsg)
    }
  }
  //查询运维人员
  const getQueryProjectMaintenance=async()=>{
   const res = await operationDesigin.QueryProjectMaintenance(projectId)
   if(res.success){
    setUserList([...res.data])
   }else{
    message.error(res.errMsg)
   }
  }
  //打开新增
  const openAdd=async ()=>{
    addmodalRef.current.onOpen()
    
  }
  //确认新增
  const confirmAdd =async ()=>{
   const flag = await addformRef.current.getInsertInspectionPlan()
   if(flag){
    getInspectionPlanPage()
    addmodalRef.current.onCancel()
   }
  }
  //打开删除
  const openDel =(text)=>{
    delModalRef.current.onOpen()
    planId=text.id
  }
  //确认删除
  const delOk=async()=>{
   const {success,errMsg} =  await operationDesigin.DeleteInspectionPlan({
      projectId,
      planId
    })
    if(success){
      message.success('删除成功')
      delModalRef.current.onCancel()
      getInspectionPlanPage(1)
    }else{
      message.error(errMsg)
    }
  }
  const changePage=(page)=>{
      getInspectionPlanPage(page.current)
  }
  const search = () => { }
  useEffect(() => {
    getInspectionPlanPage()
    getQueryProjectMaintenance()
  }, [])

  return (
    <ContainerDiv>

      <div className='flexcss'>
        <BlueColumn name="设备管理" />
        <div className='btnflex'>
          <div className='btncss' onClick={openAdd}>
            新增
          </div>
          <div className='btncss' onClick={()=>{tableRef.current.download()}}>
            导出
          </div>
        </div>
      </div>
      <div style={{height:770,display:'flex'}}>
        <Table columns={columns} dataSource={tableData} pagination={tableParams} ref={tableRef} onChange={changePage}></Table>
      </div>
      <Modal mold ='cust' ref={addmodalRef} width={538} onOk={confirmAdd}>
      <BlueColumn name="新建巡检计划" styled={{padding:'16px 0',color:"#237ae4",fontSize: 16}}/>
      <AddPlan projectId={projectId} ref={addformRef} userList={userList}/>
      </Modal>
      <DeleteModal delModalRef={delModalRef} name="删除巡检计划" content="确认是否要删除巡检计划？" onOk={delOk}/>
    </ContainerDiv>
  )
}

//新增巡检计划组件
let AddPlan =forwardRef(
  ({projectId,userList},ref)=>{
    const [form] = Form.useForm()
    const onelevel = useSelector(state => state.system.onelevel);
    const arealist = onelevel.length>0?[{name:onelevel[0].levelName,id:0},...onelevel]:[]
    const dateopts = [{label:'每日',value:1},{label:'每周',value:2},{label:'每月',value:3}]
    const [dateCycle,setDataCycle]=useState(1)
    const mapuserlist =userList.map(it=>({...it,label:it.nickName+"/"+it.mobile}))
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
    
    //开始时间禁用
    const disabledStartDate = (current) => {
      return current && current > form.getFieldValue('endtime');
    }
    //结束时间禁用
    const disabledEndDate = (current) => {
      return current && current < form.getFieldValue('starttime');
    }
    //新增巡检计划
    const getInsertInspectionPlan=()=>{
      return new Promise(async(resolve,reject)=>{
        const {areaId,userId,name,content,cycle,date,starttime,endtime}= form.getFieldsValue()
        let params ={
          projectId,
          areaId,
          userId,
          name,
          content,
          cycle,
          time:date,
          startTime:moment(starttime).format('YYYY-MM-DD'),
          endTime:moment(endtime).format('YYYY-MM-DD'),
        }
        const res =await operationDesigin.InsertInspectionPlan(params)
        if(res.success){
          message.success('新增巡检计划成功')
          resolve(true)
        }else{
          message.error(res.errMsg)
          reject(false)
        }
      })
     
    }
    const changeCycle=(v)=>{
      form.setFieldValue('date',null)
      setDataCycle(v)
    }
    useImperativeHandle(ref,()=>({
      getInsertInspectionPlan
    }))
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
          <Form.Item label={onelevel.length>0?onelevel[0].levelName:'园区名称'} name="areaId">
            <Select 
            options={arealist} 
            fieldNames={{label:'name',value:'id'}}></Select>
          </Form.Item>
          <Form.Item label="计划名称" name="name">
            <Input></Input>
          </Form.Item>
          <Form.Item label="计划内容" name="content">
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
          <Form.Item label="开始周期" name="starttime">
            <DatePicker style={{width:'100%'}} disabledDate={disabledStartDate}></DatePicker>
          </Form.Item>
          <Form.Item label="结束周期" name="endtime">
            <DatePicker style={{width:'100%'}} disabledDate={disabledEndDate}></DatePicker>
          </Form.Item>
          <Form.Item label="巡检人" name="userId">
            <Select options={mapuserlist} fieldNames={{value:'id'}}></Select>
          </Form.Item>
        </Form>
      
    )
  }
)
//删除组件
let DeleteModal = ({ delModalRef, name = '', content = '', ...other }) => {
  return (

      <Modal mold='cust' ref={delModalRef} {...other} className={style.DelModal}>
      <BlueColumn name={name} styled={{ padding: '24px 0px', color: '#ff4d4f' }} bg={{ backgroundColor: '#ff4d4f' }}></BlueColumn>
      <div>
        <img src={WarningPng} style={{ margin: '0 32px', width: 48, height: 48 }}></img>
        <span>{content}</span>
      </div>
    </Modal>

    
  )
}
