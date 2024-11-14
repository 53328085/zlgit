import React, { useState, useEffect, useRef, memo, forwardRef, useImperativeHandle } from "react"
import styled from "styled-components";
import {Form, Input, message, Button, Divider, Descriptions} from 'antd'
 
import {Remote } from '@api/api.js'
import redwarn from '@imgs/redwarn.png'
import {CustButton} from '@com/useButton'
 import { useSelector, useDispatch } from "react-redux";
 import {setDeviceState} from "@redux/systemconfig"
const Cdescriptions = styled(Descriptions)`
  && {
    .ant-descriptions-row .ant-descriptions-item-label{
      background-color: #2a2f55;
      padding: 2px 16px;
      height: 32px;
      span {
        color: #fff;
      } 
    }
    .ant-descriptions-row .ant-descriptions-item-content{
      padding: 2px 16px;
      height: 32px;
      &:first-of-type{
        span {
          color: #515151;
        }
      }
      &:last-of-type {
        span {
          color: #237ae4;
        }
      }
    }
  }
`

const Qbutton = styled(Button)`
  && {
    width: 96px;
  height: 32px;
  background-color: #2828a4 !important;
  margin-left: auto;
  &:hover {
    background-color: #0033ff !important;
  }
  } 
 
`

const StatusFrom = styled.div`
  && {
    padding: 32px;
    border: 1px solid #d7d7d7;
    display: grid;
    grid-template-rows: 32px auto 68px;
    row-gap: 32px;
    width: 496px;
    .title {
        border-left: 4px solid #2828a4;
        padding-left: 16px;
        font-size: 16px;
        color: #2a2f55;
        display: flex;
        align-items: center;
    }
    .ant-form-item {
        margin-bottom: 16px;
    }
    .ctrol {
        display: flex;
        justify-content: space-between;
    }
  }

`
const Pending =forwardRef((props, ref) => {
  const [text, setPenging] = useState('操作中请稍后……');
  useImperativeHandle(ref, () => ({
    setPenging(info) {
      console.log(info)
      setPenging(info)
    }
  }))
  return  (<Cdescriptions   layout="vertical" bordered >
  <Cdescriptions.Item label="设备编号">{props.sn}</Cdescriptions.Item>
  <Cdescriptions.Item label="状态">{text}</Cdescriptions.Item>
   
 </Cdescriptions>)
}
)
export default function Control({sn,detail, state,  Custmodal, getDetailData}) { // status 状态 Close, Open
    const dispatch = useDispatch()
    // console.log(detail)  // control: false 不让控制
    const projectId = useSelector(state => state.system.menus.projectId)
    const [form] = Form.useForm()
    const status =detail?.status['1']
 
    const [optype, setOptype] = useState(1)

    const control = useRef();
    const info = useRef()
    const pending = useRef()
    let title = ['合闸提示', '分闸提示'][optype]
  
    const onCtrol = (type) => {
       
       
        setOptype(type)
        control.current.onOpen()
        //setOpen(true)
    }
  let  setResultInfo = useRef({})
  let step = 0 ; // 执行次数
  let timer =null
  const onBatch = async (param) => { // 第三步
     
     
      try {
        let {success, data, errMsg} = await Remote.BatchValveStatus(param)       
        if(success && Array.isArray(data) && data.length >0) {          
           let item = data[0]
         
           if(status == 'Open') { // 合闸
            console.log('Open')
             if (item['status'][0]=='Close' || item['status'][1] == 'Close') {
              
                setResultInfo.current.status = 1;
                
              // setStatus('Close')
                pending.current.setPenging('操作成功')
                channel.postMessage(true);
                
             }else if(item['status'][0]!=='Close' || item['status'][1] !== 'Close' ) {
              
                if(step<10) {
                   timer = setTimeout(() => {
                    onStart({projectId,sns:[sn]})
                    }, 7000*step) 
                   }else {
                    pending.current.setPenging('操作失败')
                    clearTimeout(timer)
                    setResultInfo.current.status = 2
                   }
               
             }
           }else if(status == "Close") { // 分闸
            if (item['status'][0]=='Open' || item['status'][1] == 'Open') {
                console.log('分闸')
              
               // setStatus('Open')
                pending.current.setPenging('操作成功')
                channel.postMessage(true);
                setResultInfo.current.status = 1
             }else if(item['status'][0]!=='Open' || item['status'][1] !== 'Open' ) {
               console.log('Open')
                if(step<10) {
                   timer = setTimeout(() => {
                    onStart({projectId,sns:[sn]})
                    }, 7000*step) 
                   }else {
                    pending.current.setPenging('操作失败')
                    clearTimeout(timer)
                    setResultInfo.current.status = 2
                   }
             }
           }
           if (setResultInfo.current.status == 1 || step == 10) {
            Remote.SetResult([setResultInfo.current], projectId).then(() =>{})
           }
           
          
        }else {
           message.error(errMsg || '数据没有返回')
        }
      } catch (error) {
        console.log(error)
      }

  }
 
  
 
  const onStart = async (params) => { // 第二步
    step++
    try {
      let {success, data, errMsg} = await  Remote.StartBatchValveTask(params) 
      if(success && Array.isArray(data) && data.length > 0) {

        let {errorCode, isOk, sn} = data[0]
        if(errorCode == 0 && isOk) {
            onBatch({projectId,sns:[sn]})
        }else {
            setResultInfo.current.status = 2
            Remote.SetResult([setResultInfo.current], projectId).then().catch()
            pending.current.setPenging('操作失败')
        }
      }else {
        message.error(errMsg || '数据没有返回')
      }
    } catch (error) {
      console.log(error)
    }
   
  }
  const channel = new BroadcastChannel('my-channel')
   const onOk = async () => {  //第一步
    //setPenging('操作中请稍后……')
    control.current.onCancel()
    info.current.onOpen()
  //  pending.current.setPenging('操作中请稍后……')
   // setOpen(false)
   // setResult(true)
   
 
    try {
        let res = {};
        if(optype == 0) {
            res = await  Remote.Close({projectId,sns:[sn]})   
        }else if(optype == 1){
            res = await  Remote.Open({projectId,sns:[sn]})
        }
        if(res.success) {
            // dispatch(setDeviceState(true))
            
            if(Array.isArray(res.data) && res.data.length > 0) {
               let {errorCode, id,sn} = res.data[0];
               setResultInfo.current.id = id
               if(errorCode == 0) {
               
                    onStart({projectId,sns:[sn]})
                
               }else {
                setResultInfo.current.status = 2
                Remote.SetResult([setResultInfo.current], projectId).then().catch()
                pending.current.setPenging('操作失败')
               }

            }else {
                message.error(res.errMsg || '数据没有返回')
            }

        }else {
            message.error(errMsg || '数据出错')
        }


    } catch (error) {
        console.log(error)
    }
      

   }
  
   const onResult = () => {
      
     info.current.onCancel()
     setResultInfo.current ={};
     getDetailData()
   }
   useEffect(() => {
    if(state == 5) {      
       form.setFieldsValue({...detail})
    }
   }, [detail, state])
   

 
   const btstyle = {
    width: '200px', 
    height: '68px', 
    fontSize: '18px',
    border: "none",
    justifyContent: "space-around"
   }
  return (
    <StatusFrom>
      <div className="title">远程控制</div>
      <Form
        name="basic"
        form={form}
        style={{ padding: "32px", border: "1px solid #d7d7d7" }}
        colon={false}
        disabled
      >
        <Form.Item label="设备编号" name="sn">
          <Input />
        </Form.Item>

        <Form.Item label="设备型号" name="category">
          <Input />
        </Form.Item>
        <Form.Item label="设备名称" name="name">
          <Input />
        </Form.Item>
        <Form.Item label="所属网关" name="gateway">
          <Input />
        </Form.Item>
        <Form.Item label="安装地址" name="address">
          <Input />
        </Form.Item>

        <Divider />
        <Form.Item label="当前状态">
         
          {status == "Close" ? (
            <CustButton type="primary" key="close" >合闸</CustButton>
          ) : status == "Open" ? (
            <CustButton type="primary" style={{backgroundColor: "#ff5757", border: "none", color: '#fff'}} key="open" >
              分闸
            </CustButton>
          ) : null}
        </Form.Item>
      </Form>
      <div className="ctrol">
        <CustButton onClick={() => onCtrol(0)}
           src={status=="Open"&&detail.control ? "closea" : 'zha'}
           disabled={status=="Close" || !detail.control}
           imgh="40px"
           style={{...btstyle, 
            backgroundColor: status=="Open"&&detail.control ? "#237ae4" : '#f2f2f2',
            color: status=="Open"&&detail.control ? "#fff" : '#ccc'
             }}>远程合闸</CustButton>
        <CustButton onClick={() => onCtrol(1)}
           src={status=="Close"&&detail.control ? "opena" : 'zha'}
           disabled={status=="Open" ||!detail.control}
           imgh="40px"
           style={{...btstyle, 
            backgroundColor: status=="Close"&&detail.control ? "#ff5757" : '#f2f2f2',
            color: status=="Close"&&detail.control ? "#fff" : '#ccc'
            }}>远程分闸</CustButton>
      </div>
      <Custmodal
        key="control"
        mold="cust"
        type="warn"
        width={592}
        ref={control}
        title={title}
        okText={title?.slice(0, 2)}
        onOk={onOk}
      >
          <>
            {optype == 0 ?
             '合闸后，该电表控制内的所有用电设备将恢复供电，请确认！'
             : '分闸后，将导致该电表控制内的所有用电设备断电，请谨慎操作！'
            } 
          </>
      </Custmodal>
      <Custmodal
      key="info"
      ref={info}
    title="远程控制"
    width={592}
    mold="cust"
    footer={[
      <Qbutton 
       type="primary" 
        onClick={onResult}
      >
        确定
      </Qbutton>,
    ]}
  >
     <Pending ref ={pending} sn={sn} />
  </Custmodal>
    
     
    </StatusFrom>
  );
}
