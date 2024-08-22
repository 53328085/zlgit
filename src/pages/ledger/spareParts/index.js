import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import {  Space, Button, message ,InputNumber,Input  } from 'antd'
import { nanoid } from "@reduxjs/toolkit"
import { selectcurlRommid, selectProjectId } from "@redux/systemconfig";
import Titlelayout from '@com/titlelayout'
import Usetable from '@com/useTable'
import { useSelector, useDispatch } from 'react-redux'
import Pagecount from "@com/pagecontent";
import UseModal from '@com/useModal'
import { getInitialProps } from 'react-i18next';
const Mainbox = styled.div`
    && {
      flex: 1;
      display: flex;
      flex-direction: column;
      .content {
        display: grid;
        grid-template-rows: 32px 4px 1fr;
        row-gap: 16px; 
        flex: 1;
        color:#515151;
        padding-top: 16px;
        height: 700px;   
        width: 1650px;
        .top {
            display: flex;
            justify-content: space-between;
            align-items: center;

        }
     
        .ant-form-inline {
          .ant-form-item {
            margin-right: 0;
          }
        }
      }
      .ant-form-item{
        width: 100%;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-direction: row;
        
      }
      .ant-form-item-label{
        width: 100px!important;
        text-align: left;
        margin-right: 16px;
      }
       
       }

`
export default  function Index() {

  const projectId = useSelector(selectProjectId)
  const roomId = useSelector(selectcurlRommid)
  const columns = [
    {
      title: '备件名称',
      dataIndex: 'alarmTime',
      key: 'alarmTime',
      align: 'center'
    },
    {
      title: '备件类型',
      dataIndex: 'level',
      key: 'level',
      align: 'center'
    },
    {
      title: ' 当前库存量',
      dataIndex: 'alarmEvent',
      key: 'alarmEvent',
      align: 'center'
    },
    {
      title: '库存最低标准',
      dataIndex: 'name',
      key: 'name',
      align: 'center'
    },
    {
      title: '库存状态',
      key: 'address',
      align: 'center',
      render: (text, record) => {
         return (text===1?<div style={{display:'flex',alignItems:'center',justifyContent:'center'}}><div style={{width:16,height: 16,backgroundColor:'rgb(244,67,54)',borderRadius:'50%',marginRight:16 }}></div><span>库存量低</span></div>
         :<div style={{display:'flex',alignItems:'center',justifyContent:'center'}}><div style={{width:16,height: 16,backgroundColor:'rgb(2,219,114)',borderRadius:'50%',marginRight:16 }}></div><span>库存正常</span></div>)
         
    }
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Button type='primary' ghost onClick={()=>getOut(record)}>领用</Button>
          <Button type='primary' ghost onClick={()=>getIn(record)}>入库</Button>
        </Space>
      ),
    },
  ]
  const modalRef =useRef()
  const modalRef1 =useRef()
  const [remark,setRemark] = useState('')
  const [num,setNum] = useState('')
  const [remark1,setRemark1] = useState('')
  const [num1,setNum1] = useState('')
  const getOut=(record)=>{
    modalRef.current.onOpen()
  }
  const dispatchOrderOk =()=>{
    if(num==""||num==undefined)
    return message.error('请输入数量')
    message.success('领用成功')
    modalRef.current.onCancel()
  }
  const getIn=(record)=>{
    modalRef1.current.onOpen()
  }
  const dispatchOrderOk1 =()=>{
    if(num1==""||num1==undefined)
    return message.error('请输入数量')
    message.success('入库成功')
    modalRef1.current.onCancel()
  }
  const onChangeNum = (value) => {
    console.log('changed', value);
    setNum(value)
  };
  const onChangeInput = (event) => {
    console.log('changed', event.target.value);
    setRemark(event.target.value)
  };
  const onChangeNum1 = (value) => {
    console.log('changed', value);
    setNum1(value)
  };
  const onChangeInput1 = (event) => {
    console.log('changed', event.target.value);
    setRemark1(event.target.value)
  };
  const [tabledata,setTabledata] = useState([1,2,3])
  
  const [pageInfo,setPageInfo] =useState({
    pageNum:1,
    pageSize:10,
    total:0
  })

  const changePage=(page,pageSize)=>{
    setPageInfo({
      pageNum:page.current,
      pageSize:page.pageSize,
      total:page.total
    })
  }

  const warnPage =async () => {
    let params = {
      projectId,
      pageNum:pageInfo.pageNum ,
      pageSize: pageInfo.pageSize,
      roomId,
    }
   const resp =  await  DistributionRoomRuntime.WarningPage(params)
   if(resp.success){
      if(Array.isArray(resp.data)){
        setTabledata(resp.data)
      }else{
        setTabledata([])
      } 
      setPageInfo({
        pageNum:resp.pageNum,
        pageSize:resp.pageSize,
        total:resp.total,
      })
   }else{
    message.error(resp.errMsg)
   }

  }
  useEffect(() => {
    if(roomId) {
     // warnPage()
    }

  }, [roomId,JSON.stringify(pageInfo) ])

  return (
    <Pagecount bgcolor="transparent" pd="0">
      <Mainbox>       
        <Titlelayout title="" layout="flex">
            <Usetable 
            hbg="#f0f9ff"
            hbc="#515151"
            columns={columns} 
            rowKey={nanoid()} 
            dataSource={tabledata} 
            pagination={{
              current:pageInfo.pageNum,
              pageSize:pageInfo.pageSize,
              total:pageInfo.total
            }}
            onChange={changePage}
            />
            <UseModal 
            ref={modalRef}
            mold = 'cust' 
            okText="确定" 
            onOk={dispatchOrderOk}
            title="备件领用"
            >
                <div style={{margin:'16px 0'}}>
                    <div className='ant-form-item'>
                      <p style={{width:'100px',textAlign:'left'}} className='ant-form-item-label'>当前库存</p>
                      <sapn style={{lineHeight:'32px',height:'32px'}}>100</sapn>
                    </div>
                    <div className='ant-form-item'>
                      <p style={{width:'100px',textAlign:'left'}}  className='ant-form-item-label'>本次领用</p>
                      <InputNumber min={1} max={100} value={num} step={1} onChange={onChangeNum} />
                      <sapn>（个）</sapn>
                    </div>
                    <div className='ant-form-item'>
                      <p style={{width:'100px',textAlign:'left'}}  className='ant-form-item-label'>备注</p>
                      <Input style={{width:'350px'}} placeholder="" value={remark} onChange={onChangeInput}/>
                    </div>
                </div>
            </UseModal>
            <UseModal 
            ref={modalRef1}
            mold = 'cust' 
            okText="确定" 
            onOk={dispatchOrderOk1}
            title="备件入库"
            >
                <div style={{margin:'16px 0'}}>
                    <div className='ant-form-item'>
                      <p style={{width:'100px',textAlign:'left'}} className='ant-form-item-label'>当前库存</p>
                      <sapn style={{lineHeight:'32px',height:'32px'}}>100</sapn>
                    </div>
                    <div className='ant-form-item'>
                      <p style={{width:'100px',textAlign:'left'}}  className='ant-form-item-label'>本次入库</p>
                      <InputNumber min={1} max={100} value={num1} step={1} onChange={onChangeNum1} />
                      <sapn>（个）</sapn>
                    </div>
                    <div className='ant-form-item'>
                      <p style={{width:'100px',textAlign:'left'}}  className='ant-form-item-label'>备注</p>
                      <Input style={{width:'350px'}} placeholder="" value={remark1} onChange={onChangeInput1}/>
                    </div>
                </div>
            </UseModal>
        </Titlelayout>
      </Mainbox>
      </Pagecount>
  )
}
 