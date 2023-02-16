import React, { useEffect, useRef, useState} from 'react'
import styled from 'styled-components'
import { useRequest, useCountDown } from 'ahooks';
import {Image, Tag, Switch, Typography, message, Space, Button, Divider, Input} from 'antd'
import {useSelector} from 'react-redux'
import {selectProjectId} from '@redux/systemconfig.js'
import {ProjectSetting, Login} from '@api/api.js'
//import CModal from '@com/useModal'
import log from './log.png'
 
 
const { Title, Text, Paragraph, Link } = Typography;
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
            grid-template-columns: repeat(5, 120px) 2px 180px;
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
export default function Release({CModal}) {
  const projectId = useSelector(selectProjectId)
  const modal = useRef(null)
  const {publishProject, queryProjectPublishInfo, DeleteProject} = ProjectSetting 
  const [phone, setPhone] = useState([]);
  const [moblies, setMoblie] = useState();
  const [code, setCode] = useState();
  const [curProjectId, setCurProject] = useState();
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
  
  const onChange = async (f, {id, mobile}) => { 
    setCurProject(id)
    try {
      if (f) {
         const {success} = await publishProject({projectId: id, state: Number(f)})
         success ? refresh() : message.warning('数据出错' || errMsg)
       } else {
           mobile='13800000000'
           setMoblie(mobile);
          let phone = '13800000000'?.split('');
           phone.splice(3, 4, '*', '*', "*", "*" ).join();
          
          setPhone(phone)
          modal.current.onOpen()
       }
    } catch (error) {
      console.log(error);
    }
   
  };

 const Countdown = () => { // 获取验证吗
  const getCode = async () => {
    const {data, success} = await Login.GetVerification(moblies)
    if (success) {
      setCode(data)
      setTargetDate(Date.now() + 1000*60)
    }
 }
  const [targetDate, setTargetDate] = useState(0)
  const [countdown] = useCountDown({
    targetDate
  })  
  useEffect(() => {
    return () => setCode(null)
  })
  return (
     <Button style={{width: '112px'}} onClick={() => getCode()} disabled={countdown !== 0}>        
           {countdown === 0 ? '获取验证码' : ` ${Math.round(countdown / 1000)}s`}
     </Button>
     )
}
const onOk =async () => { // 取消发布
  try {
    if (!code) {
      return message.warning('请输入验证吗')
    }
    const {success} = await publishProject({projectId: curProjectId, state: 0})
    if (success) {
      message.success('取消发布成功')
    }
  } catch (error) {
    
  }
  
}
const delProject = async (id) => {
  try {
    const {success, errMsg}  = await  DeleteProject(id);
    success ? message.success('删除成功') && refresh() : message.warning(errMsg || '数据出错')
    
  } catch (error) {
    
  }
 
}
 useEffect(()=> {
  return () => {
    setCurProject(null)
  }
 })
  const Item =({item}) =>  (
    <Itembox>
        <Image src={item.imageBase64 || log} width={160} height={112} preview={false}></Image>
        <div className='content'>
            <div className="upper">
                <div className='left'>
                 <Tagbox>{item.name}</Tagbox>
                 <Tagbox>应用模块({item.templateCnt})</Tagbox>
                 <Tagbox>设备数量({item.meterCnt})</Tagbox>
                 <Tagbox>网关数量({item.gatewayCnt})</Tagbox>
                 <Tagbox>能源种类({item.gatewayCnt})</Tagbox>
                 <Divider type='vertical' style={{margin: 0, height: '36px', borderLeftStyle: 'dotted', borderLeftWidth: '2px'}}></Divider>
                 <Tagbox>项目有效期&nbsp;{item.validStageTime?.slice(0,10)}</Tagbox>
                 </div>
                 <div className='right'>
                 <Switch checkedChildren="发布" unCheckedChildren="未发布" defaultChecked={item.state != 0} style={{alignSelf: 'center'}} onChange={(f) => onChange(f, item)} />
                 <Link underline type="danger" onClick={() => delProject(item.id)}>删除项目</Link>
                 </div>
            </div>
            <div className="lower">
               <Text type='secondary'>创建时间：</Text>
               <Text type='secondary'>创建人：</Text> 
               <Text type='secondary' >项目管理员:</Text>  
               <Text type='secondary'>项目地址：</Text>
               <Text type='secondary'>项目状态：</Text>
               <Text type='secondary' ellipsis>{item.createTime}</Text>
               <Text type='secondary' ellipsis>{item.creator}</Text>
               <Text type='secondary' ellipsis>{item.manager}/{item.mobile}</Text>
               <Text type='secondary' ellipsis>{item.address}</Text>              
               <Text type='secondary' ellipsis style={{color: item.state == 1 ? '#1890FF' : ''}}>&#9679;&nbsp;{item.state == 1 ? '已发布' : '未发布'}</Text>
            </div>    
        </div>
    </Itembox>
  )
  return  <Maibox>
           {data?.list.map(item => <Item item={item} key={item.id} />)} 
           <CModal ref={modal} title="项目取消发布" mold='cust' onOk={onOk}>
               <div>
                 <Title level={4}>取消发布项目时 用户需知</Title>
                 <Paragraph>1、项目取消发布后，项目管理中的各项设置将处于可编辑状态</Paragraph>
                 <Paragraph>2、项目取消发布后，设备及网关档案将处于可编辑状态</Paragraph>
                 <Paragraph> <Space size={16}><Text style={{width: '90px', display: 'inline-block'}}>管理员手机号</Text> <Button style={{width: '148px'}}>{phone}</Button><Countdown /></Space></Paragraph>
                 <Paragraph><Space size={16}><Text style={{width: '90px', display: 'inline-block'}}>短信验证吗</Text> <Input style={{width: '148px'}} placeholder='请输入短信验证吗'></Input></Space></Paragraph>
               </div>
           </CModal>
         </Maibox>
}
