import React, { useEffect, useState, useRef, useMemo,useLayoutEffect } from 'react'
import Pagecount from '@com/pagecontent'
import CustContext from '@com/content.js'
import { Form, Image, message, Input, Select, Button, Checkbox, Divider } from 'antd'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import BlueColumn from '@com/bluecolumn'
import UserTable from '@com/useTable'
import { useReactive, useMemoizedFn, useLatest } from 'ahooks';
import MyModal from '@com/useModal'
import BuildPlan,{EditUser,DeleteModal} from './buildplan'
import editpng from "./imgs/edit.png"
import deletepng from "./imgs/delete.png"
import ExportBtn from "@com/useButton"
import { operationDesigin } from '@api/api'
const MainBox = styled.div`
  background-color: #fff;
  padding:16px;
  border: 1px solid #d7d7d7;
  border-radius: 4px; 
  flex: 1;
  --ant-primary-color:#237ae4;
  --ant-primary-color-hover:#237ae4;
  .title{
    display: flex;
    justify-content: space-between;
  }
  .wd96{
      width: 96px;
    }
  .mgt16{
      margin-top: 16px;
    }
  .pd0{
    padding: 0px !important;
    width: 63px;
    height:92px;
    .ant-checkbox-group{
      padding: 2px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .ant-checkbox-group-item
      {
        width: 16px;
        height:28px ;
        padding: 0;
        margin: 0;
        text-align: center;
        line-height: 28px;
      }
      
    }
    
    .gridrow3{
      display: grid;
      padding: 2px;
      grid-template-columns:59px;
      grid-gap: 2px;
      justify-content: center;
      align-items: center;
      .planclass{
      height: 28px;
      color: #fff;
      line-height:28px;
      &:nth-of-type(1){
        background-color: #6666ff;
      }
      &:nth-of-type(2){
        background-color: #339966;
      }
      &:nth-of-type(3){
        background-color: #cc3333;
      }
      &:nth-of-type(4){
        background-color: #f18509;
      }
    }
    }
    
  }
  .tdstyle{
    position: relative;
    min-height: 93px;
    .textclass{
      position: absolute;
      left: 50%;
      top: 40%;
      transform: translate(-50%,-50%);
      cursor: pointer;
    }
    .imgclass{
      position: absolute;
      bottom: 10px;
      display: flex;
      justify-content: space-around;
      width: 100%;
      cursor: pointer;
  }
  }
  .finaltd{
    cursor: pointer;
  }
 
`
export default function Index() {
  const [form] = Form.useForm()
  const [editUser,setEditUser] = useState()
  const [modalTitle,setModalTitle] = useState(null) 
  const [tabledata, setTableData] = useState([])
  const [userList,setUserList] = useState([])

  const projectId = useSelector(state => state.system.menus.projectId)
  const planRef = useRef() //班次管理
  const palnEditRef = useRef() //班次编辑
  const delRef =useRef()

  const userPlan = useRef()
  const  delId=useRef();
  const addUserEvent =(text,record)=>{
    userPlan.current =record.nos
    setEditUser("")
    setModalTitle("新增值班人员")  
    palnEditRef.current.onOpen()
  }
  
  const editUserEvent =(text,record)=>{
    userPlan.current = record.nos
    delId.current = record.userId
    setEditUser(record)
    setModalTitle("编辑值班人员")
    palnEditRef.current.onOpen()
  }


  const delEvent=(record)=>{
   
    delRef.current.onOpen()
    
    delId.current = record.userId
  }
  let columninit =[
    {
      title: "值班人员",
      dataIndex: "userName",
      key: "userName",
      align: 'center',
      onCell(record, rowIndex) {
        return {
          className: "pd0"
        }
      },
      width: 100,
      render(text,record){
        if(text=="final"){
          return (
            <div className='finaltd' onClick={()=>{addUserEvent(text,record)}}>
              <p>+</p>
              <p>点击新增</p>
            </div>
          )
        }else{ 
          return (
            <div className='tdstyle'>
               <div className='textclass'>{text}</div>
               <div className='imgclass'>
               <img src={editpng} alt="" onClick={()=>{editUserEvent(text,record)}}/> 
               <img src={deletepng} alt="" onClick={()=>{delEvent(record)}}/> 
               </div> 
            </div>
          )
        }
        
      }
    }, 
    {
      
    title: "班次",
    dataIndex: `plan`,
    align: 'center',
    onCell(record, rowIndex) {
      return {
        className: "pd0"
      }
    },
    render(text, record, index) {
      return (
        <div className='gridrow3'>
        <div className='planclass'>早班</div>
        </div>
      )
    }
    }
  ]
  let checkGruopArr =[]
  let checkinitvalue=[]
  for(let i=1;i<=31;i++){
    checkGruopArr.push({
      no1:0,
      no2:0,
      no3:0,
      no4:0,
    })
    checkinitvalue.push([])
  }

  const [columns,setColumns]= useState(columninit)
  const reactiveObj=useReactive({
    plans:[],
  })
  const planListRef =useRef()
  const setUserRef =useRef()
  const GetOperatorEx =async ()=>{
    const res = await operationDesigin.GetOperatorEx(projectId)
    if(res.success){
      setUserList(res.data)
    }else{
      message.error(res.errMsg)
    }
  }
  //获取排班表
  const tabledataRef =useRef()
  const GetDutyUsers =async ()=>{
    const res = await operationDesigin.GetDutyUsers(projectId)
    if(res.success){
      console.log(res)
      const tdata = [
        {
          userName:"final",
          nos:checkGruopArr
        }]
        if(res.data){
          setTableData([...res.data,...tdata])
          tabledataRef.current=[...res.data,...tdata]
          getDuty([...res.data,...tdata])
        }else{
          setTableData([...tdata])
          tabledataRef.current=[...tdata]
          getDuty([,...tdata])
        }
       
    }else{
      message.error(res.errMsg)
    }
  }
  
  //获取班次计划
  const getDuty =async (table)=>{
    const res = await operationDesigin.GetDuty(projectId)
    if(res.success){
      reactiveObj.plans = res.data
      updateTable(res.data,table)
    }else{
      message.error(res.errMsg)
    }
  }
  //保存班次
  const savePlan=async ()=>{
    if(planListRef.current.setDuty){
     const resp =  await planListRef.current.setDuty();
     if(resp){
        planRef.current.onCancel()
        checklist.current = structuredClone(checkGruopArr)
        getDuty()
     }
    }
  }
  //保存单个新增/编辑
  const saveUserPlan =()=>{
    console.log(reactiveObj.plans)
    if(!reactiveObj.plans){
      message.warning("请先创建班次!!!");
      return
    }
    if(setUserRef.current.setUserForm){
      setUserRef.current.setUserForm.validateFields().then(async ()=>{
        const userId =  setUserRef.current.setUserForm.getFieldValue('user')
        if(!editUser){
          const res = await operationDesigin.SetDutyUser({
            userId,
            dutyItems:userPlan.current
          },projectId)
          if(res.success){
            message.success('新增成功')
            palnEditRef.current.onCancel()
            GetDutyUsers()
            GetOperatorEx()
          }else{
            message.error(res.errMsg)
          }
        }else{
          const res = await operationDesigin.EditDutyUser(userPlan.current,{projectId,preUserId:delId.current,userId})
          if(res.success){
            message.success('编辑成功!')
            palnEditRef.current.onCancel()
            GetDutyUsers()
            GetOperatorEx()
          }else{
            message.error(res.errMsg)
          }
        }
        
      })
    }
  }
  //保存全部班次
  const completeEvent=async ()=>{
    if (tabledata.length > 1) {
      const tcdata = tabledata.toSpliced(tabledata.length-1,1)
      const params = tcdata.map(item => ({ userId: item.userId, dutyItems: item.nos }))
      const res = await operationDesigin.SetDutyUsers(params, projectId)
      if (res.success) {
        message.success('保存成功')
        GetDutyUsers()
      } else {
        message.error(res.errMsg)
      }
    }else{
      message.warning("请点击新增排班!!!")
    }
    
  }
  //多选框变更事件
  const checklist= useRef([])
  const changeGroup=(checkValue,record,i,index)=>{
    console.log(checkValue,record,i,index, tabledataRef.current)
    const nois0 = {no1:0,no2:0,no3:0,no4:0}
    for (const key of  checkValue) {
      if(Object.hasOwnProperty.call(nois0, key)){
        nois0[key]=1
      }
    }
    const copytabledatat = structuredClone(tabledataRef.current)
    copytabledatat[index]['nos'][i-1] = nois0
    console.log(copytabledatat,copytabledatat[index]['nos'][i-1],nois0)
    tabledataRef.current = structuredClone(copytabledatat)
    setTableData(structuredClone(copytabledatat))
  }
  const lastcountRef=useRef(0)
  //表格视图更新
  const updateTable=async (plan)=>{
    let count = 0
    let palnobj=[];
    let columnarr=[];
    const copytable =structuredClone(tabledata)
    for (const key in  plan) {
      if ( key.indexOf('no')!==-1 &&plan[key] ) {
        count++;
      }
    }
   if(count==0) {
    count = 3
   }
   console.log(count,lastcountRef.current)
   if(count<lastcountRef.current){
      for(let i=lastcountRef.current;i<=4;i++){
        copytable.forEach(item=>{
          item.nos.forEach(it=>{
            it[`no${i}`] = 0
          })
        })
      }
      setTableData(copytable)
   }
   
   lastcountRef.current = count
 
  
   for (let i=0;i<count; i++){
    palnobj[i] ={
      value:`no${i+1}`,
      label:null
    } 
   }
   columninit[1].render=(text, record, index) =>{
    return (
      <div className='gridrow3'>
      {plan?.name1?<div className='planclass'>{plan.name1}</div>:null}
      {plan?.name2?<div className='planclass'>{plan.name2}</div>:null}
      {plan?.name3?<div className='planclass'>{plan.name3}</div>:null}
      {plan?.name4?<div className='planclass'>{plan.name4}</div>:null}
      </div>
    )
  }

    for (let i = 1; i <=31;i++){
      columnarr.push({
        title: i,
        dataIndex: `date${i}`,
        align: 'center',
        onCell(record, rowIndex) {
          return {
            className: "pd0"
          }
        },
        render(text,record,index) {
          let cheeckvalue =[] 
          for (const key in record.nos[i-1]) {
            if (record.nos[i-1][key] ) {
              cheeckvalue.push(key)
            }
          } 
          return (
            <Checkbox.Group 
            options={palnobj} 
            className='checkGroup' 
            key={`${index}-${i}`}
            value={cheeckvalue}
            onChange={(checkValue)=>{changeGroup(checkValue,record,i,index)}}></Checkbox.Group>
          )
        }
      })
    }
    setColumns([...columninit,...columnarr])
  }
  //删除用户
  const DeleteDutyUser=async ()=>{
    const resp = await operationDesigin.DeleteDutyUser(projectId, delId.current)
    if(resp.success){
      message.success('删除成功!')
      delRef.current.onCancel()
      GetDutyUsers()
      GetOperatorEx()
    }else{
      message.error(resp.errMsg)
    }
  }
  useEffect( () => {
    GetDutyUsers()
    GetOperatorEx()
    
  }, [])
  return (
    <CustContext.Provider >
      <Pagecount bgcolor="#eeeff3" pd={0}>
        <MainBox>
          <BlueColumn name="排班管理"></BlueColumn>
          <Divider dashed style={{ borderColor: '#d7d7d7' }}></Divider>
          <div className='mgt16'>
            <div className='title'>
              <div className='wd96'>
                <Button type="primary" block onClick={() => { planRef.current.onOpen() }}>班次管理</Button>
              </div>
              <div className='wd96'>
                <Button type="primary" block onClick={completeEvent}>完成</Button>
              </div>
            </div>
          </div>
          <div className='mgt16'>
            <UserTable columns={columns} dataSource={tabledata}></UserTable>
          </div>
        </MainBox>
      </Pagecount>
      <MyModal ref={planRef} mold="cust" width={700} onOk={savePlan}>
        <BlueColumn name="创建班次" styled={{ padding: '24px 0px', fontSize: '16px' }}></BlueColumn>
        <BuildPlan ref={planListRef} plansObj={reactiveObj}/>
      </MyModal>
      <MyModal ref={palnEditRef} mold="cust" width={420} onOk={saveUserPlan}>
        <BlueColumn name={modalTitle} styled={{ padding: '24px 0px', fontSize: '16px' }} key={2}></BlueColumn>
        <EditUser editUser={editUser} userList={userList} ref={setUserRef}/>  
      </MyModal>
      <DeleteModal delRef={delRef} name="删除值班人员" content="是否确认删除值班人员" onOk={DeleteDutyUser}/>
    </CustContext.Provider>

  )
}
