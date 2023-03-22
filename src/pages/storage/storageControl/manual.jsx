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
       grid-template-rows: 640px 104px;
       column-gap: 16px;
       padding: 16px;
       flex: 1;
       color:#515151;
       .top {
        display: grid;
        grid-template-columns: 544px 1fr;
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
                 .cotrl.active {
                    border: 1px solid #237ae4;
                    background-color: #237ae4;
                   
                    .ant-typography {
                        color: #fff;
                        font-size: 18px;
                    }
                 }
                 .cotrl.disabled {
                    background-color: rgba(242, 242, 242, 1);
                    border: 1px solid rgba(204, 204, 204, 1);  
                    opacity: 0.8;
                    .ant-typography {
                        color: #666666;
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
export default function Manual({projectId, areaId}) {
  const [onoff, setOnoff] = useState()
  const [ongrid, setOngrid] = useState()
  const [pform] = Form.useForm()
  const [qform] = Form.useForm()
  const ontext = onoff == 1 ? '开机': '关机'
  const gridtext = ongrid == 1 ? '并网': '离网'
  const querySiteStatus = async () => {
     let {success, data} = await StorageControlRuntime.QuerySiteStatus(projectId, areaId)
     if(success) {
        let {onOffSwitch, onOffGrid, p, q} = data ;
        setOnoff(onOffSwitch)
        setOngrid(onOffGrid)
        pform.setFieldValue('cp', p)
        qform.setFieldValue('cq',q)
     }
  }
  // UpdateSiteOnOffGrid
  const updatestate = async (type, state) => {
     let handler = ['', 'UpdateSiteSwitchOnOff', 'UpdateSiteOnOffGrid'][type]; // state 1 开， 2 关/离
     if (type == 1) setOnoff(state);
     if (type == 2) setOngrid(state);
     let statev = state == 1  ? 1 : 2;
     let {success, errMsg} = await StorageControlRuntime[handler](projectId, areaId, statev)    
     let msg = ['', ['系统关机成功','系统开机成功'],['系统离线成功','系统并网成功']][type][state]
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
        querySiteStatus()
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
    querySiteStatus()
  }, [areaId])
  return (
    <Mainbox>
        <div className='top'>
            <div className='topleft'>
            <div className='topleftitem'>
                <div className='item'>
                    <Text>手动切换站点各个子系统的启动停止</Text>
                    <Text>当前运行状态：<Link>{ontext}</Link></Text>
                </div>
                <div className='item'>
                    <div className={onoff== 1 ? 'cotrl active' : 'cotrl disabled'} onClick={() => updatestate(1, 1)}>
                        <Space size={32}>
                        <Image src={imgurl.coal} height={42} width={42} preview={false} />
                        <Text>系统开机</Text>
                        </Space>
                    </div>
                    <div className={onoff == 0 ? 'cotrl active' : 'cotrl disabled'} onClick={() => updatestate(1, 0)}>
                    <Space size={32}>
                       <Image src={imgurl.coal} height={42} width={42} preview={false} />
                        <Text>系统关机</Text>
                        </Space>
                    </div>
                </div>
            </div>
            <div className='topleftitem'>
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
            </div>
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
            <Space size={16}>
               <Title level={4}>手动模式运行时长：</Title>
               <Timeipt /><Text>天</Text>
               <Timeipt /><Text>时</Text>
               <Timeipt /><Text>分</Text>
            </Space>
            <Space>
            <Title level={4}>本次启用时间：</Title>
               <Timeipt /><Text>天</Text>
               <Timeipt /><Text>时</Text>
               <Timeipt /><Text>分</Text>
            </Space>
            <Space size={32}>
                <Bigbutton type='primary'  >启用手动模式</Bigbutton>
                <Bigbutton type='primary'   disabled>停止手动模式</Bigbutton>
            </Space>
        </div>
    </Mainbox>
  )
}
