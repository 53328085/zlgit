import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {Typography, Image, Form, Space, Button, Input, message, InputNumber} from 'antd'
import {ExclamationCircleFilled} from '@ant-design/icons'
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
        grid-template-columns: 554px 1fr;
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
export default function Manual({projectId, mode, areaId, startTime, p, q, getinfo, CModal}) {
  const [onoff, setOnoff] = useState(mode) 
  const [pform] = Form.useForm()
  const [qform] = Form.useForm()
  console.log('q', q)
  // UpdateSiteOnOffGrid
  const updatestate = async () => { //开启手动模式、关闭手动模式
     
    if (isNaN(onoff)) return
   
     let {success, errMsg} = await StorageControlRuntime.UpdateHandModeStatus(projectId, areaId, onoff)    
     let msg = ['','开启手动模式','关闭手动模式'][onoff]
     if (success) {
        message.success(msg) 
        getinfo()
     }  
     !success && message.error(errMsg || '数据出错')
  }
  const  Updatedata = async (type) => {
    console.log('p', type)
    try {
        let  value;
    if (type == 0) {
        let {p} = pform.getFieldsValue()
        value = p
    }else if(type == 1){
        let {q} =qform.getFieldsValue()
        value = q
    }
     
     if (isNaN(value)) return message.info('请输入数值')
    let handler = ['UpdateP', 'UpdateQ'][type]
     let msg = ['设置有功功率成功', '设置无关功率成功'][type]
    let {success, errMsg} =  await StorageControlRuntime[handler](projectId, areaId, value)
     success && custMsg({content: msg, onClose: () => {
        getinfo()
     }})
      
     
    } catch (error) {
       console.log(error) 
    }
    
     
  }
 
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
                        <Image src={onoff==1 ? imgurl.manualon : imgurl.manual} height={42} width={42} preview={false} />
                        <Text>系统开机</Text>
                        </Space>
                    </div>
                    <div className={onoff == 2 ? 'cotrl off active' : 'cotrl off' } onClick={() => setOnoff(2)}>
                    <Space size={32}>
                       <Image src={onoff == 2 ? imgurl.close: imgurl.closed} height={42} width={42} preview={false} />
                        <Text>系统停机</Text>
                        </Space>
                    </div>
                </div>
                <div className='item'>
                    <Text>{(onoff==1 || onoff==2) && <ExclamationCircleFilled style={{color: '#237ae4', marginRight: '12px', fontSize: '22px'}}/>} {onoff== 1 ? 
                    '注意：当前为自动运行模式，开启手动模式后自动运行模式将会被停止。' : onoff == 2  ?  '注意：当前为手动运行模式，关闭手动模式后自动运行模式将会被激活。' : null
                }</Text> 
                </div>
            </div>
          
            </div>
             
       
       
        </div>
     
       {/*    <CModal width={554} title="重置密码" ref={rref} onOk={restOk}  mold='cust' >
         <p>账号： <Link>{Record.name}</Link>， 密码将被重置为<Link>{newpwd.current}</Link></p>
         
     </CModal>  */}
    </Mainbox>
  )
}
