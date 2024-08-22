import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import {  Space, Button, message ,InputNumber,Input,Select,DatePicker  } from 'antd'
import { nanoid } from "@reduxjs/toolkit"
import { selectcurlRommid, selectProjectId } from "@redux/systemconfig";
import Titlelayout from '@com/titlelayout'
import Usetable from '@com/useTable'
import { useSelector, useDispatch } from 'react-redux'
import Pagecount from "@com/pagecontent";
import UseModal from '@com/useModal'
import { getInitialProps } from 'react-i18next';
import {useOutletContext} from 'react-router-dom' 

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
  let {setCustview} = useOutletContext()
const { RangePicker } = DatePicker;

    useEffect(() => {
      setCustview(<Button style={{position:'absolute',right:'130px'}} type="primary" onClick={getRecord}>出入库记录</Button>);
      return () => {
        setCustview(undefined)
      }
     }, []) 
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
  const modalRefRecord= useRef()
const getRecord=()=>{
  modalRefRecord.current.onOpen()
}
const [beiType,setBeiType]=useState(0)
const [beiName,setBeiName]=useState(0)
const changeType=(e)=>{
  console.log(e)
  setBeiType(e)
}
const changeName=(e)=>{
  console.log(e)
  setBeiName(e)
}
const [rangeTime,setRangeTime]=useState([])
const changeTime=(dates, dateStrings)=>{
  console.log(dates, dateStrings)
  setRangeTime(dateStrings)
}
// 禁止选择今天的日期之前的日期
const disabledDate = (current) => {
  // Can not select days before today and today
  return current && current > moment().endOf('day');
};
const columnsRecord = [
  {
    title: '日期时间',
    dataIndex: 'alarmTime',
    key: 'alarmTime',
    align: 'center'
  },
  {
    title: '领用人',
    dataIndex: 'level',
    key: 'level',
    align: 'center'
  },
  {
    title: ' 备件名称',
    dataIndex: 'alarmEvent',
    key: 'alarmEvent',
    align: 'center'
  },
  {
    title: '备件类型',
    dataIndex: 'name',
    key: 'name',
    align: 'center'
  }, {
    title: '操作',
    dataIndex: 'name',
    key: 'name',
    align: 'center'
  }, {
    title: '数量',
    dataIndex: 'name',
    key: 'name',
    align: 'center'
  }, {
    title: '备注',
    dataIndex: 'name',
    key: 'name',
    align: 'center'
  },
]
const [tabledataRecord,setTabledataRecord] = useState([{name:1}])
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
            <UseModal width={1469} height={697}
  ref={modalRefRecord}
  mold = 'cust'
  custft={false}
  footer={false}
  title="出入库记录"
  closable
  >
      <div style={{margin:'16px 0',width:'1410px',height:'600px'}}>
          <div style={{display: 'flex', flexWrap: 'nowrap', justifyContent: 'space-between',flexDirection: 'row',marginBottom: '16px'}}>
           <div style={{display: 'flex', flexWrap: 'nowrap', flexDirection: 'row'}}>
           <div style={{marginRight: '16px'}}>
           <span style={{marginRight: '16px'}}>备件类型</span>
            <Select style={{ width: 112 }} defaultValue={0} options={[
              {deviceStyleName: '全部', id: 0},{deviceStyleName: '常用品', id: 1}
            ]} fieldNames={{label: 'deviceStyleName', value: 'id'}} onChange={changeType}></Select>
           </div>
           <div> <span style={{marginRight: '16px'}}>备件名称</span>
            <Select style={{ width: 112 }} defaultValue={0} options={[
              {deviceStyleName: '全部', id: 0},{deviceStyleName: '绝缘靴', id: 1},{deviceStyleName: '绝缘手套', id: 2}
            ]} fieldNames={{label: 'deviceStyleName', value: 'id'}} onChange={changeName}></Select></div>
           </div>
            <div>
              <span style={{marginRight: '16px'}}>操作时间</span>
              <RangePicker format='YYYY-MM-DD'   onChange={changeTime} disabledDate={disabledDate}/>
            </div>
          </div>
          <Usetable 
            hbg="#f0f9ff"
            hbc="#515151"
            columns={columnsRecord} 
            dataSource={tabledataRecord} 
            />
      </div>
  </UseModal>
        </Titlelayout>
      </Mainbox>
      </Pagecount>
  )
}
 