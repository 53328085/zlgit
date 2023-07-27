import React, { useState, useEffect } from "react"
import styled from "styled-components";
import {Form, Input, message, Button, Divider, Descriptions} from 'antd'
import {Remote } from '@api/api.js'
import redwarn from '@imgs/redwarn.png'
import Custmodal from '@com/useModal'
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

export default function Control({sn,detail,status}) {
    const [form] = Form.useForm()
    const [state, setState]= useState(status)
    const [optype, setOptype] = useState(1)
    const [result, setResult] = useState(false)
    const [pending, setPenging] = useState('操作中……')
    let [open, setOpen] = useState(false)
    let title = ['合闸提示', '分闸提示'][optype]
   
    const onCtrol = (type) => {
        setOptype(type)
        setOpen(true)
    }
  let  setResultInfo = {}
  const remoteOp = async (sn) => {
    let snlist = []
    try {
      let {success, data, errMsg} = await  Remote.StartBatchValveTask(sn) 
      if(success && Array.isArray(data) && data.length > 0) {
        let {errorCode, isOk, sn} = data[0]
        if(errorCode == 0 && isOk) {
          snlist.push(sn)
        }else {
            setResultInfo.status = 2
            Remote.SetResult([setResultInfo]).then().catch()
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
               setResultInfo.id = id
               if(errorCode == 0) {
                 remoteOp([sn])
               }else {
                setResultInfo.status = 2
                Remote.SetResult([setResultInfo]).then().catch()
                setPenging('操作失败')
               }

            }else {
                message.error(res.errMsg || '数据没有返回')
            }

        }else {
            message.error(errMsg || '数据出错')
        }


    } catch (error) {
        
    }
      

   }
   const onResult = () => {
     setResult(false)
   }
   useEffect(() => {
    if(state == 5) {
       console.log(detail)
       form.setFieldsValue({...detail})
    }
   }, [detail, state])
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
        <Form.Item noStyle>
          <span>当前状态</span>
          {status == "Close" ? (
            <Button type="primary">合闸</Button>
          ) : state == "Open" ? (
            <Button type="primary" danger>
              分闸
            </Button>
          ) : null}
        </Form.Item>
      </Form>
      <div className="ctrol">
        <Button onClick={() => onCtrol(1)}>远程合闸</Button>
        <Button onClick={() => onCtrol(2)}>远程分闸</Button>
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
            分闸后，将导致该电表控制内的所有用电设备断电， 请谨慎操作！
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
        <Descriptions   layout="vertical" bordered>
            <Descriptions.Item label="设备编号">{sn}</Descriptions.Item>
            <Descriptions.Item label="状态">{pending}</Descriptions.Item>
             
      </Descriptions>
      </Custmodal>
    </StatusFrom>
  );
}
