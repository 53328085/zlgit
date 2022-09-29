import React from 'react'
import styled from 'styled-components'
import {Image, Tag, Switch, Typography} from 'antd'
import log from './log.png'
const Itembox = styled.div`
    display: grid;
    grid-template-columns: 160px 1fr;
    grid-template-rows: 112px;
    border-bottom: 1px dotted #dedede;   
    column-gap: 32px;
    .content {
       display: grid;
       align-content: space-between;
       .upper {
          display: flex;
          justify-content: space-between;
         .left {
            display: grid;
            grid-template-columns: repeat(6, 120px) 180px 64px 170px;
            grid-template-rows: 32px;
            column-gap: 16px;
         }
         .right {
            width: 170px;
            display: flex;
           justify-content: space-between;
           align-items: center;
         }
       }
       .lower {
        display: grid;
        grid-auto-rows: 22px;
        grid-template-columns: repeat(3, minmax(175px,auto)) 1fr 170px;
        column-gap: 16px;
       }
    }
`
const Tagbox = styled(Tag)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0px;
  background-color: #f7f7f7;
  border-color: #ebebeb;
  font-size: 14px;
`
export default function Item({item={}}) {
  let {imageBase64, projectValidStageTime, createTime, creator, projectManager, address, enabled} = item
  const {Text} = Typography
  const logo = () => (imageBase64 && `data:image/png;base64,${item.imageBase64}`) || log
 
  return (
    <Itembox>
        <Image src={logo()} width={160} height={112} preview={false}></Image>
        <div className='content'>
            <div className="upper">
                <div className='left'>
                 <Tagbox>正泰物联</Tagbox>
                 <Tagbox>应用模块(4)</Tagbox>
                 <Tagbox>设备数量(50)</Tagbox>
                 <Tagbox>网关数量(4)</Tagbox>
                 <Tagbox>传感器(412)</Tagbox>
                 <Tagbox>视频监控(4)</Tagbox>
                 <Tagbox>项目有效期&nbsp;{projectValidStageTime.slice(0,10)}</Tagbox>
                 </div>
                 <div className='right'>
                 <Switch checkedChildren="发布" unCheckedChildren="未发布" defaultChecked style={{alignSelf: 'center'}} />
                 <Text underline type="danger">删除项目</Text>
                 </div>
            </div>
            <div className="lower">
               <Text type='secondary'>创建时间：</Text>
               <Text type='secondary'>创建人：</Text> 
               <Text type='secondary'>项目管理员：</Text>  
               <Text type='secondary'>项目地址：</Text>
               <Text type='secondary'>项目状态：</Text>
               <Text type='secondary' ellipsis>{createTime}</Text>
               <Text type='secondary' ellipsis>{creator}</Text>
               <Text type='secondary' ellipsis>{projectManager}</Text>
               <Text type='secondary' ellipsis>{address}</Text>              
               <Text type='secondary' ellipsis style={{color: item.enabled ? '#1890FF' : ''}}>&#9679;&nbsp;{item.enabled == 1 ? '已启用' : '未启用'}</Text>
            </div>    
        </div>
    </Itembox>
  )
}
