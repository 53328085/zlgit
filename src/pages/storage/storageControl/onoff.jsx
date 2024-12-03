import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import {Typography, Image, Form, Space, Button, Input, message, InputNumber} from 'antd'
import {ExclamationCircleFilled} from '@ant-design/icons'
import {StorageControlRuntime} from '@api/api'
 
import imgurl from './icon'
const {Text, Link, Title} = Typography
const {Item} = Form
const Mainbox = styled.div`
    && {
       display: grid;
     //  grid-template-rows: 680px;
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
                .iconsty {
                    color: var(--ant-primary-color);
                    margin-right: 12px;
                    font-size: 22px;
                }
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
                    border: 1px solid var(--ant-primary-color);
                    color: var(--ant-primary-color);
                    .ant-typography {
                        color: var(--ant-primary-color);
                        font-size: 18px;
                    }
                 }
                 .cotrl.on.active { 
                    background-color: var(--ant-primary-color); 
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
const Pinfo = styled.p`
    display: flex;
    align-items: center;
    font-size: 16px;
    margin-left: 32px;
    .iconsty {
                    color: var(--ant-primary-color);
                    margin-right: 12px;
                    font-size: 48px;
                }
`
export default function Manual({projectId,   areaId, systemStatus,  pcsId, getinfo, CModal}) {
  
  const [onoff, setOnoff] = useState(systemStatus)  // 系统状态 1 开机 2 关机
 
  let title = ['', '系统开机', '系统关机'][onoff]
  let msg = ['','当前系统为停机状态，是否要进行开机操作？', '当前系统为开机状态，是否要进行停机操作？'][onoff]
  const rref = useRef()
  const refpcsId = useRef
  // UpdateSiteOnOffGrid
  const updatestate = async (type) => { // 系统开机， 系统关机
     
    if (type === onoff) return
    refpcsId.current = type;
     setOnoff(type)
     rref.current.onOpen() 
  }
   useEffect(()=> {
    setOnoff(systemStatus)
  }, [systemStatus])  
  const onOk = async() => {
      try {
        let {success, errMsg} = await StorageControlRuntime.UpdateSystemStatus(projectId, pcsId, 1)    
        let msg = ['', '系统开机','系统关机'][onoff]
        if (success) { 
            rref.current.onCancel()
           message.success(msg) 
           getinfo()
        }  else {
            setOnoff(onoff== 1 ? 2 : 1) // 出错恢复
            message.error(errMsg || '数据出错')
        }
        
  
      } catch (error) {
        
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
                    <div className={onoff== 1 ? 'cotrl on active' : 'cotrl on' } onClick={() => updatestate(1)}>
                        <Space size={32}>
                        <Image src={onoff==1 ? imgurl.manualon : imgurl.manual} height={42} width={42} preview={false} />
                        <Text>{onoff == 1 ? '系统已开机' : onoff==2 ? '系统开机' : null}</Text>
                        </Space>
                    </div>
                    <div className={onoff == 2 ? 'cotrl off active' : 'cotrl off' } onClick={() => updatestate(1)}>
                    <Space size={32}>
                       <Image src={onoff == 2 ? imgurl.close: imgurl.closed} height={42} width={42} preview={false} />
                        <Text>{onoff == 1 ? '系统停机' : onoff==2 ? '系统已停机' : null}</Text>
                        </Space>
                    </div>
                </div>
                <div className='item'>
                    <Text>{(onoff==1 || onoff==2) && <ExclamationCircleFilled className="iconsty" />} {onoff== 1 ? 
                    '当前系统已开机。' : onoff == 2  ?  '当前系统已停机' : null
                }</Text> 
                </div>
            </div>
          
            </div>
             
       
       
        </div>
     
      <CModal width={554} title={title} ref={rref} onOk={onOk}  mold='cust' >
         <Pinfo style={{lineHeight: '48px', fontSize: '16px'}}><ExclamationCircleFilled  className='iconsty' /> {msg}</Pinfo>
         
     </CModal> 
    </Mainbox>
  )
}
