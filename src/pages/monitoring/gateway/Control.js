import React, { useState, useEffect, useRef } from "react"
import styled from "styled-components";
import {Form, Input, message, Button, Divider, Descriptions} from 'antd'
import {  useSearchParams } from 'react-router-dom';
import {Remote } from '@api/api.js'
import redwarn from '@imgs/redwarn.png'
import {CustButton} from '@com/useButton'
 
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

export default function Control({sn,detail, state, Custmodal}) { // status 状态 Close, Open
    
    const [form] = Form.useForm()
    let [searchParams, setSearchParams] = useSearchParams()
    
    const [status, setStatus] =useState(searchParams.get("status"))
    const [optype, setOptype] = useState(1)
    const [result, setResult] = useState(false)
    const [pending, setPenging] = useState('')
    let [open, setOpen] = useState(false)
    let title = ['合闸提示', '分闸提示'][optype]
   
    const onCtrol = (type) => {
        setOptype(type)
        setOpen(true)
    }
  let  setResultInfo = useRef({})
  let step = 0 ; // 执行次数
  let timer =null
  const onBatch = async (param) => {
      
      step++
      try {
        let {success, data, errMsg, sn} = await Remote.BatchValveStatus(param)
         console.log('step:'+step)
        if(success && Array.isArray(data) && data.length >0) {          
           let item = data[0]
           if(status == 'Open') {
            console.log('Open')
             if (item['status'][0]=='Open' || item['status'][1] == 'Open') {
              
                setResultInfo.current.status = 1;
                setStatus('Open')
                setPenging('操作成功')
                
             }else if(item['status'][0]!=='Open' && item['status'][1] !== 'Open' ) {
              
                if(step<10) {
                   timer = setTimeout(() => {
                        onBatch()
                    }, 7000*step) 
                   }else {
                    setPenging('操作失败')
                    clearTimeout(timer)
                    setResultInfo.current.status = 2
                   }
               
             }
           }else if(status == "Close") {
            if (item['status'][0]=='Close' || item['status'][1] == 'Close') {
                console.log('Close')
                setStatus('Close')
                setPenging('操作成功')
                setResultInfo.current.status = 1
             }else if(item['status'][0]!=='Close' && item['status'][1] !== 'Close' && step == 10 ) {
                if(step<10) {
                   timer = setTimeout(() => {
                        onBatch()
                    }, 7000*step) 
                   }else {
                    setPenging('操作失败')
                    clearTimeout(timer)
                    setResultInfo.current.status = 2
                   }
             }
           }
           if (setResultInfo.current.status == 1 || step == 10) {
            Remote.SetResult([setResultInfo.current]).then(() =>{})
           }
           
          
        }else {
           message.error(errMsg || '数据没有返回')
        }
      } catch (error) {
        
      }

  }
 
 
 
  const onStart = async (sn) => { // 第二步
    
    try {
      let {success, data, errMsg} = await  Remote.StartBatchValveTask(sn) 
      if(success && Array.isArray(data) && data.length > 0) {

        let {errorCode, isOk, sn} = data[0]
        if(errorCode == 0 && isOk) {
            onBatch([sn])
        }else {
            setResultInfo.current.status = 2
            Remote.SetResult([setResultInfo.current]).then().catch()
            setPenging('操作失败')
        }
      }else {
        message.error(errMsg || '数据没有返回')
      }
    } catch (error) {
      console.log(error)
    }
   
  }

   const onOk = async () => {  //第一步
    setPenging('操作中……')
    setOpen(false)
    setResult(true)
    try {
        let res = {};
        if(optype == 0) {
            res = await  Remote.Close([sn])   
        }else if(optype == 1){
            res = await  Remote.Open([sn])
        }
        if(res.success) {
            if(Array.isArray(res.data) && res.data.length > 0) {
               let {errorCode, id,sn} = res.data[0];
               setResultInfo.current.id = id
               if(errorCode == 0) {
               
                    onStart([sn])
                
               }else {
                setResultInfo.current.status = 2
                Remote.SetResult([setResultInfo.current]).then().catch()
                setPenging('操作失败')
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
      
     setResult(false)
     setResultInfo.current ={};
     setPenging('')
   }
   useEffect(() => {
    if(state == 5) {
       console.log(detail)
       form.setFieldsValue({...detail})
    }
   }, [detail, state])
   const Pending = () => {
        return  (<Descriptions   layout="vertical" bordered>
        <Descriptions.Item label="设备编号">{sn}</Descriptions.Item>
        <Descriptions.Item label="状态">{pending}</Descriptions.Item>
         
       </Descriptions>)
   }
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
            <CustButton type="primary" >合闸</CustButton>
          ) : status == "Open" ? (
            <ButtCustButtonon type="primary" danger>
              分闸
            </ButtCustButtonon>
          ) : null}
        </Form.Item>
      </Form>
      <div className="ctrol">
        <CustButton onClick={() => onCtrol(0)}
           src={status=="Open" ? "closea" : 'zha'}
           disabled={status=="Close"}
           imgh="40px"
           style={{...btstyle, 
            backgroundColor: status=="Open" ? "#237ae4" : '#f2f2f2',
            color: status=="Open" ? "#fff" : '#ccc'
             }}>远程合闸</CustButton>
        <CustButton onClick={() => onCtrol(1)}
           src={status=="Close" ? "opena" : 'zha'}
           disabled={status=="Open"}
           imgh="40px"
           style={{...btstyle, 
            backgroundColor: status=="Close" ? "#ff5757" : '#f2f2f2',
            color: status=="Close" ? "#fff" : '#ccc'
            }}>远程分闸</CustButton>
      </div>
      <Custmodal
        mold="cust"
        type="warn"
        width={592}
        open={open}
        title={title}
        okText={title?.slice(0, 2)}
        onOk={onOk}
      >
        <div
          style={{ display: "flex", alignItems: "center", padding: "0 32px" }}
        >
          <img src={redwarn} style={{ width: "48px" }}></img>
          <p style={{ fontSize: "16px", paddingLeft: "16px" }}>
            {optype == 0 ?
             '合闸后，该电表控制内的所有用电设备将恢复供电，请确认！'
             : '分闸后，将导致该电表控制内的所有用电设备断电，请谨慎操作！'
            } 
          </p>
        </div>
      </Custmodal>
     
      <Custmodal
        title="远程控制"
        width={592}
        open={result}
        mold="cust"
        footer={[
          <Button 
            onClick={onResult}
            style={{
              backgroundColor: "#237AE4",
              color: "#fff",
              width: 96,
              height: 32,
            }}
          >
            确定
          </Button>,
        ]}
      >
         <Pending />
      </Custmodal>
    </StatusFrom>
  );
}
