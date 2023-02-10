import React from 'react'
import styled from 'styled-components'
import { useRequest } from 'ahooks';
import {Image, Tag, Switch, Typography, message} from 'antd'
import {useSelector} from 'react-redux'
import {selectProjectId} from '@redux/systemconfig.js'
import {ProjectSetting} from '@api/api.js'
import log from './log.png'
const Maibox = styled.div`
  display: grid;
  grid-auto-rows: 145px;
  row-gap: 32px;
`
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
export default function Release({item={}}) {
  const projectId = useSelector(selectProjectId)
  const {publishProject, queryProjectPublishInfo} = ProjectSetting 
  const {Text} = Typography
  const logo = () => (imageBase64 && `data:image/png;base64,${item.imageBase64}`) || log;
  
  const getData = () => {
    return  queryProjectPublishInfo(projectId).then(res => {
      let {success, data } = res
    
      if (success && data) {
        console.log('ssss')
        return {
          total: 1,   // 返回的是对象
          list: [data]
        }
      
      }else {
        return {
          total: 0,
          list: []
        }
      }
    })
  }
  const {data , error, loading, refresh} = useRequest(getData)
  
  const onChange = async (f, id) => {
    try {
      if (f) {
         const {success} = await publishProject({projectId: id, state: Number(f)})
         success ? refresh() : message.warning('数据出错' || errMsg)
       } 
    } catch (error) {
      
    }
   
  };
  const Item =({item}) =>  (
    <Itembox>
        <Image src={item.imageBase64 || log} width={160} height={112} preview={false}></Image>
        <div className='content'>
            <div className="upper">
                <div className='left'>
                 <Tagbox>正泰物联</Tagbox>
                 <Tagbox>应用模块(4)</Tagbox>
                 <Tagbox>设备数量(50)</Tagbox>
                 <Tagbox>网关数量(4)</Tagbox>
                 <Tagbox>传感器(412)</Tagbox>
                 <Tagbox>视频监控(4)</Tagbox>
                 <Tagbox>项目有效期&nbsp;{item.validStageTime?.slice(0,10)}</Tagbox>
                 </div>
                 <div className='right'>
                 <Switch checkedChildren="发布" unCheckedChildren="未发布" defaultChecked={item.state != 0} style={{alignSelf: 'center'}} onChange={(f) => onChange(f, item.id)} />
                 <Text underline type="danger">删除项目</Text>
                 </div>
            </div>
            <div className="lower">
               <Text type='secondary'>创建时间：</Text>
               <Text type='secondary'>创建人：</Text> 
               <Text type='secondary'>项目管理员：</Text>  
               <Text type='secondary'>项目地址：</Text>
               <Text type='secondary'>项目状态：</Text>
               <Text type='secondary' ellipsis>{item.createTime}</Text>
               <Text type='secondary' ellipsis>{item.creator}</Text>
               <Text type='secondary' ellipsis>{item.projectManager}</Text>
               <Text type='secondary' ellipsis>{item.address}</Text>              
               <Text type='secondary' ellipsis style={{color: item.state == 1 ? '#1890FF' : ''}}>&#9679;&nbsp;{item.state == 1 ? '已发布' : '未发布'}</Text>
            </div>    
        </div>
    </Itembox>
  )
  return  <Maibox>{data?.list.map(item => <Item item={item} key={item.id} />)} </Maibox>
}
