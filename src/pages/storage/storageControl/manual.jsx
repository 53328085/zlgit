import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {Typography, Image, Form, Space, Button, Input, message, InputNumber} from 'antd'
import {StorageControlRuntime} from '@api/api'
import {custMsg}  from '@com/usehandler'
import imgurl from './icon'
const {Text, Link, Title} = Typography
const {Item} = Form
const Mainbox = styled.div`
    && {
       display: grid;
       grid-template-rows: 576px 104px;
       row-gap: 16px;
       padding-bottom: 16px;
       flex: 1;
       color:#515151;
       .top {
        display: grid;
        grid-template-columns: 544px 1fr;
        background-color: #fff;
        padding: 32px;
        .topleft {
            grid-auto-rows: 144px;
            row-gap: 64px;
            display: grid;
        .topleftitem {
            display: grid;
            grid-template-rows: 32px 96px;
            row-gap: 16px; 
            .item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                 .ant-typography{
                    font-size: 16px;
                 }
                .cotrl {   
                    width: 240px;
                    height: 96px;
                    border-radius: 4px; 
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 200ms;
                 }
                 .cotrl.on {
                    border: 1px solid #237ae4;
                    color: #237ae4;
                    .ant-typography {
                        color: #237ae4;
                        font-size: 18px;
                    }
                 }
                 .cotrl.on.active { 
                    background-color: #237ae4; 
                    .ant-typography {
                        color: #fff;
                        font-size: 18px;
                    }
                 }
                 .cotrl.off {
                    border: 1px solid #ff5757;
                   
                    .ant-typography {
                        color: #ff5757;
                        font-size: 18px;
                    }
                 }
                 .cotrl.off.active {
                    background-color:  #ff5757;
                    .ant-typography {
                        color: #fff;
                        font-size: 18px;
                    }
                 }
                }
            }
          }
          .topright {
            display: grid;
            grid-template-columns: 1fr;
            grid-auto-rows: 36px;
            row-gap: 16px;
            padding-right: 64px;
            justify-items: flex-end;
          }
        }
        .foot {
            display: flex;
            justify-content: space-between;
            background-color: #fff;
            padding: 0 16px 0 32px;
            align-items: center;
            .start {
                width: 368px;
                height: 48px; 
                background-color: rgba(242, 242, 242, 1);
                box-sizing: border-box;
                border-width: 1px;
                border-style: solid;
                border-color: rgba(215, 215, 215, 1);
                display: flex;
                align-items: center;
                font-size: 16px;
                color: #515151;
                padding: 16px;
                span {
                    color:#666;
                }
            }
        }
       }
`
const Formbox = styled(Form)`
    && {
        display: flex;
        justify-content: flex-end;
    }
`
const Bigbutton = styled(Button)`
    width: 200px;
    height: 72px;
    font-size: 18px;
    border-radius: 4px;
`
const Timeipt = styled(Input)`
    && {
        width: 52px;
    height: 40px; 
    background-color: rgba(242, 242, 242, 1); 
    border: 1px solid rgba(215, 215, 215, 1); 
    color: #333333;
    border-radius: 0px;
    box-shadow: none;
    }
`
export default function Manual({projectId, areaId, startTime, p, q}) {
  const [onoff, setOnoff] = useState() 
  const [pform] = Form.useForm()
  const [qform] = Form.useForm()
 
  // UpdateSiteOnOffGrid
  const updatestate = async (state) => { //开启手动模式、关闭手动模式
     
   
   
     let {success, errMsg} = await StorageControlRuntime.UpdateHandModeStatus(projectId, areaId, statev)    
     let msg = ['','开启手动模式','关闭手动模式'][state]
     success && message.success(msg)
     !success && message.error(errMsg || '数据出错')
  }
  const  Updatedata = async (type) => {
    try {
        let  value;
    if (type == 0) {
        let {p} = pform.getFieldsValue()
        value = p
    }else if(type == 1){
        let {q} =qform.getFieldsValue()
        value = q
    }
     console.log(Number(value))
     if (isNaN(value)) return message.info('请输入数值')
    let handler = ['UpdateP', 'UpdateQ'][type]
     let msg = ['设置有功功率成功', '设置无关功率成功'][type]
    let {success, errMsg} =  await StorageControlRuntime[handler](projectId, areaId, value)
     success && custMsg({content: msg, onClose: () => {
        
     }})
      
     
    } catch (error) {
       console.log(error) 
    }
    
     
  }
  const querySiteDateAndMode= async () => {
     await StorageControlRuntime.QuerySiteDateAndMode(projectId,areaId)
  }
  useEffect(() => {
    querySiteDateAndMode()
    
  }, [areaId])
  return (
    <Mainbox>
        <div className='top'>
            <div className='topleft'>
            <div className='topleftitem'>
                <div className='item'>
                    <Text>手动切换站点各个子系统的启动停止</Text> 
                </div>
                <div className='item'>
                    <div className={onoff== 1 ? 'cotrl on active' : 'cotrl on' } onClick={() => setOnoff(1)}>
                        <Space size={32}>
                        <Image src={imgurl.coal} height={42} width={42} preview={false} />
                        <Text>开启手动模式</Text>
                        </Space>
                    </div>
                    <div className={onoff == 2 ? 'cotrl off active' : 'cotrl off' } onClick={() => setOnoff(2)}>
                    <Space size={32}>
                       <Image src={imgurl.coal} height={42} width={42} preview={false} />
                        <Text>关闭手动模式</Text>
                        </Space>
                    </div>
                </div>
            </div>
           {/*  <div className='topleftitem'>
                <div className='item'>
                    <Text>手动切换站点各个子系统的启动停止</Text>
                    <Text>当前运行状态：<Link>{gridtext}</Link></Text>
                </div>
                <div className='item'>
                    <div className={ongrid== 1 ? 'cotrl active' : 'cotrl disabled'} onClick={() => updatestate(2, 1)}>
                    <Space size={32}>
                        <Image src={imgurl.coal} height={42} width={42} preview={false}  />
                        <Text>系统并网</Text>
                        </Space>
                    </div>
                    <div className={ongrid== 0 ? 'cotrl active' : 'cotrl disabled'} onClick={() => updatestate(2, 0)}>
                    <Space size={32}>
                       <Image src={imgurl.coal} height={42} width={42} preview={false}  />
                        <Text>系统离网</Text>
                        </Space>
                    </div>
                </div>
            </div> */}
            </div>
            <div className='topright'>
                <Formbox layout="inline" form={pform} >
                    <Space size={16}>
                        <Item label="当前有功功率" name="cp">
                            <Input addonAfter="kw" disabled style={{width: '168px'}} /> 
                        </Item>
                        <Item label="设置有功功率" name="p">
                          <InputNumber  step="0.01" min={0.01} precision={2} addonAfter="kw" style={{width: '168px'}}  /> 
                        </Item>
                        <Item nostyle>
                            <Button type="primary" onClick={() => Updatedata(0)}>确定</Button>
                        </Item>
                    </Space>
                </Formbox>
                <Formbox layout="inline" form={qform}>
                    <Space size={16}>
                        <Item label="当前无功功率" name="cq">
                            <Input addonAfter="kw" disabled style={{width: '168px'}} /> 
                        </Item>
                        <Item label="设置无功功率" name="sq">
                        <InputNumber  step="0.01" min={0.01} precision={2} addonAfter="kw" style={{width: '168px'}}  /> 
                        </Item>
                        <Item nostyle>
                            <Button type="primary" onClick={() => Updatedata(1)}>确定</Button>
                        </Item>
                    </Space>
                </Formbox>
            </div>
       
       
        </div>
        <div className='foot'>
             <div className='start'>
                <strong>本次启用时间：</strong>  <span>{startTime}</span>
             </div>
          
            <Bigbutton type='primary'  >确认</Bigbutton>
               
        </div>
    </Mainbox>
  )
}
