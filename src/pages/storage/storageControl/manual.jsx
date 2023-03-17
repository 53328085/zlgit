import React from 'react'
import styled from 'styled-components'
import {Typography, Image, Form, Space, Button, Input} from 'antd'
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

                .cotrl {   
                    width: 240px;
                   height: 96px;
                   border: 1px solid #237ae4;
                   border-radius: 4px; 
                   color: #237AE4;
                    display: flex;
                    align-items: center;
                    justify-content: space-around;
                 }
                 .cotrl.disabled {
                    background-color: rgba(242, 242, 242, 1);
                    border: 1px solid rgba(204, 204, 204, 1);  
                    color: #666666;
                    opacity: 0.9;
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
export default function Manual({projectId}) {
  return (
    <Mainbox>
        <div className='top'>
            <div className='topleft'>
            <div className='topleftitem'>
                <div className='item'>
                    <Text>手动切换站点各个子系统的启动停止</Text>
                    <Text>当前运行状态：关机</Text>
                </div>
                <div className='item'>
                    <div className='cotrl'>
                        <Image src={imgurl.coal} height={42} width={42} />
                        <Link>系统关机</Link>
                    </div>
                    <div className='cotrl disabled'>
                       <Image src={imgurl.coal} height={42} width={42} />
                        <Link>系统关机</Link>
                    </div>
                </div>
            </div>
            <div className='topleftitem'>
                <div className='item'>
                    <Text>手动切换站点各个子系统的启动停止</Text>
                    <Text>当前运行状态：关机</Text>
                </div>
                <div className='item'>
                    <div className='cotrl'>
                        <Image src={imgurl.coal} height={42} width={42}  />
                        <Link>系统关机</Link>
                    </div>
                    <div className='cotrl disabled'>
                       <Image src={imgurl.coal} height={42} width={42} />
                        <Link>系统关机</Link>
                    </div>
                </div>
            </div>
            </div>
            <div className='topright'>
                <Formbox layout="inline"  >
                    <Space size={16}>
                        <Item label="当前有功功率">
                            <Input addonAfter="kw" disabled style={{width: '168px'}} /> 
                        </Item>
                        <Item label="设置有功功率">
                            <Input addonAfter="kw" style={{width: '168px'}}  /> 
                        </Item>
                        <Item nostyle>
                            <Button type="primary">确定</Button>
                        </Item>
                    </Space>
                </Formbox>
                <Formbox layout="inline" >
                    <Space size={16}>
                        <Item label="当前有功功率">
                            <Input addonAfter="kw" disabled style={{width: '168px'}} /> 
                        </Item>
                        <Item label="设置有功功率">
                            <Input addonAfter="kw" style={{width: '168px'}}  /> 
                        </Item>
                        <Item nostyle>
                            <Button type="primary">确定</Button>
                        </Item>
                    </Space>
                </Formbox>
            </div>
       
       
        </div>
        <div className='foot'>
            <Space size={16}>
               <Title level={4}>手动模式运行时长：</Title>
               
            </Space>
            <Space>
            <Title level={4}>本次启用时间：</Title>
            </Space>
            <Space size={32}>
                <Bigbutton type='primary'  >启用手动模式</Bigbutton>
                <Bigbutton type='primary'   disabled>停止手动模式</Bigbutton>
            </Space>
        </div>
    </Mainbox>
  )
}
