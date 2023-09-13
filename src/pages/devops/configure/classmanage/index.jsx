import React, { useEffect, useState, useRef, useMemo } from 'react'
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
        background-color: #cc3333;
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
  const planRef = useRef() //班次管理
  const palnEditRef = useRef() //班次编辑
  const delRef =useRef()
  const addUserEvent =(text)=>{
    setEditUser("")
    setModalTitle("新增值班人员")  
    palnEditRef.current.onOpen()
  }
  const editUserEvent =(text)=>{
    setEditUser(text)
    setModalTitle("编辑值班人员")
    palnEditRef.current.onOpen()
  }
  const delEvent=(record)=>{
    console.log(record)
    delRef.current.onOpen()
  }
  const columns = useReactive([
    {
      title: "值班人员",
      dataIndex: "user",
      key: "user",
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
            <div className='finaltd' onClick={()=>{addUserEvent(text)}}>
              <p>+</p>
              <p>点击新增</p>
            </div>
          )
        }else{
         
          return (
            <div className='tdstyle'>
               <div className='textclass'>{text}</div>
               <div className='imgclass'>
               <img src={editpng} alt="" onClick={()=>{editUserEvent(text)}}/> 
               <img src={deletepng} alt="" onClick={()=>{delEvent(record)}}/> 
               </div> 
            </div>
          )
        }
        
      }
    }, {
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
            <div className='planclass'>中班</div>
            <div className='planclass'>晚班</div>
          </div>
        )
      }
    }
  ])
 
  const planName = [{
    label: null,
    value: 1
  }, {
    label: null,
    value: 2
  }, {
    label: null,
    value: 3
  }]
  useEffect(() => {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const days = new Date(year, month, 0).getDate()
    for (let i = 1; i <= days; i++) {
      columns.push({
        title: i,
        dataIndex: `date${i}`,
        align: 'center',
        onCell(record, rowIndex) {
          return {
            className: "pd0"
          }
        },
        render() {
          return (
            <Checkbox.Group options={planName} className='checkGroup'></Checkbox.Group>
          )
        }
      })
    }
    const tdata = [...tabledata, {
      user: '里斯'
    },{
      user:"final"
    }]
    setTableData(()=>tdata)
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
                <Button type="primary" block>完成</Button>
              </div>
            </div>
          </div>
          <div className='mgt16'>
            <UserTable columns={columns} dataSource={tabledata}></UserTable>
          </div>
        </MainBox>
      </Pagecount>
      <MyModal ref={planRef} mold="cust" width={700}>
        <BlueColumn name="创建班次" styled={{ padding: '24px 0px', fontSize: '16px' }}></BlueColumn>
        <BuildPlan />
      </MyModal>
      <MyModal ref={palnEditRef} mold="cust" width={420}>
        <BlueColumn name={modalTitle} styled={{ padding: '24px 0px', fontSize: '16px' }} key={2}></BlueColumn>
        <EditUser editUser={editUser} />  
      </MyModal>
      <DeleteModal delRef={delRef} name="删除值班人员" content="是否确认删除值班人员"/>
    </CustContext.Provider>

  )
}
