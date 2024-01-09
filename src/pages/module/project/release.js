import React, { useEffect, useRef, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import styled from 'styled-components'
import { useRequest, useCountDown } from 'ahooks';
import {Image, Tag, Switch, Typography, message, Space, Button, Divider, Input} from 'antd'
import {ProjectSetting, Login} from '@api/api.js'
import {useSelector, useDispatch} from 'react-redux'
 import {selectUser, userRest} from '@redux/user.js'
import {manager } from '@redux/user'  
import { getpublishState, publishState, systemConfigRest} from '@redux/systemconfig.js'  
import log from '@imgs/log.png'
 
 
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
export default function Release({CModal, projectId}) { 
  const dispatch = useDispatch()
  const modal = useRef(null)
  const delmodal = useRef(null)
  const projectName = useRef('')
  const {publishProject, queryProjectPublishInfo, DeleteProject} = ProjectSetting 
  const [phone, setPhone] = useState([]);
  const navigate = useNavigate()
 // const [moblies, setMoblie] = useState();
 const {mobile: logMobile} = useSelector(selectUser)
 const publish = useSelector(publishState)
 const [loguerphone, setLoguerphoe] = useState('') 
 const [mobile, setMobile] = useState()
 const ismanager = useSelector(manager)
  const code =useRef();
  const stateV = useRef('');
  
  const [curProject, setCurProject] = useState({});
  const getData = () => {
    return  queryProjectPublishInfo(projectId).then(res => {
      let {success, data } = res
    
      if (success && data) {  
      
        return {
          total: 1,   // 返回的是对象
          list: [data]
        }
      
      }else {
        //setMobile()
        return {
          total: 0,
          list: []
        }
      }
    })
  }
  const {data , error, loading, refresh} = useRequest(getData, {
   // onSuccess: (data) => {  },
  //  onError: (e) => message.warning(e.message || '数据出错'),
  })
  
  const onChange = async (f, {id, state, mobile}) => {  
    console.log(mobile)
    setCurProject({id, state, mobile})
  //  stateV.current = state;
    let title = state == 1 ? '项目取消发布' : '项目发布'
    setCurProject({id, state, mobile, title})
    
    if(state ==0 && mobile?.length < 11) return message.warning("手机号码无效") // 手机号码为管理员的
   // setTitle(text)
 //  setCurProject(id)     
  //   setMobile(mobile)
    let phone
    if (mobile) {
      phone = mobile?.split('');
      phone.splice(3, 4, '*', '*', "*", "*" ).join();
    }
    setPhone(phone)
    modal.current.onOpen() 
  };

 const Countdown = ({mobile}) => { // 获取验证吗
   console.log('mobile', mobile)
 // if (!mobile) return message.warning('手机号码不能为空, 请先设置项目管理员手机号码')
  const getCode = async () => {
    const {data, success,errMsg} = await Login.GetVerification(mobile)
    if (success) {
      setTargetDate(Date.now() + 1000*60)
    }else {
      message.warning(errMsg || "数据出错")
    }
 }
  const [targetDate, setTargetDate] = useState(0)
  const [countdown] = useCountDown({
    targetDate
  })  
 
  return (
     <Button style={{width: '112px'}} onClick={() => getCode()} disabled={countdown !== 0}>        
           {countdown === 0 ? '获取验证码' : ` ${Math.round(countdown / 1000)}s`}
     </Button>
     )
}
const onCodeChange = (e) => {
   code.current = e.target.value;
   console.log(code.current);
}
const onOk =async () => { // 发布 // 取消发布
   
  try {
    if (!code.current) {
      return message.warning('请输入验证吗')
    }
    let state = parseInt(curProject.state) === 1 ? 0 : 1
    const {success} = await publishProject({projectId: curProject.id, state, code: code.current, moble: curProject.mobile})
   
    if (success) {
      dispatch(getpublishState(state))
      code.current = ''
      modal.current.onCancel();
      message.success(curProject.state === 1 ?   '取消发布成功' : '发布成功')
      refresh()
    } 
  } catch (error) {
    console.log(error)
  }
  
}
const projectNameChange = (e) => {
  projectName.current = e.target.value
}

// 删除 start 
const onDel = (item) => {
  //  logMobile
    let phone = logMobile?.split('');
     phone.splice(3, 4, '*', '*', "*", "*" ).join();
     setLoguerphoe(phone)
     setCurProject(item)
     delmodal.current.onOpen()
  
   
}
const delProject = async () => {

 
  try {
     if (!projectName.current.trim()) return message.warning('请输入短信验证吗')
    const {success, errMsg}  = await  DeleteProject(curProject.id, logMobile, projectName.current);
    if (success) {
     
      delmodal.current.onCancel()
      window.location.href = "/"
    //  dispatch(userRest())
     // dispatch(systemConfigRest())
      message.success("删除成功")
      /* message.success({
        content: '删除成功',
        duration: 2,
        onClose: () => {
          window.location.href = "/"
        }
      }) */
    
      
    
     
    
     //navigate("/login")
     //window.location.href=new URL(window.location.href).hostname
    }else {
     return message.warning(errMsg || '数据出错')
    }
  
  } catch (error) {
    console.log(error)
  }
 
}
 
const publishing = (
  <>
  {
  curProject.state == 1 ? 
    <>
  <Title level={4}>取消发布项目时 用户需知</Title>
  <Paragraph>1、项目取消发布后，项目管理中的各项设置将处于可编辑状态</Paragraph>
  <Paragraph>2、项目取消发布后，设备及网关档案将处于可编辑状态</Paragraph>

  </>
   :
   <>
  <Title level={4}>发布项目时 用户需知</Title>
  <Paragraph>1、项目发布后，将锁定项目管理中的各项设置</Paragraph>
  <Paragraph>2、项目发布后，将锁定设备及网关档案</Paragraph>
  </>
  }
   </>
)

  const Item =({item}) =>  (
    <Itembox>
        <Image src={item.imageBase64 || log} width={160} height={112} preview={false}></Image>
        <div className='content'>
            <div className="upper">
                <div className='left'>
                 <Tagbox><Text ellipsis={{tooltip: (<span>{item.name}</span>)}}>{item.name}</Text></Tagbox>
                 <Tagbox>应用模块({item.templateCnt})</Tagbox>
                 <Tagbox>设备数量({item.meterCnt})</Tagbox>
                 <Tagbox>网关数量({item.gatewayCnt})</Tagbox>
                 <Tagbox>能源种类({item.gatewayCnt})</Tagbox>
                 <Divider type='vertical' style={{margin: 0, height: '36px', borderLeftStyle: 'dotted', borderLeftWidth: '2px'}}></Divider>
                 <Tagbox>项目有效期&nbsp;{item.validStageTime?.slice(0,10)}</Tagbox>
                 </div>
                 <div className='right'>
                 <Switch key={stateV.current}  checkedChildren="发布"  unCheckedChildren="未发布" style={{alignSelf: 'center'}} defaultChecked={item.state == 1}    onChange={(checked) => onChange(checked, item)} />
                 {(!ismanager && !publish) && <Link underline type="danger" onClick={() => onDel(item)}>删除项目</Link>}
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
           <CModal ref={modal} title={curProject.title} mold='cust' onOk={onOk}>
           <div>
               { 
                publishing
               }
              <Paragraph> <Space size={16}><Text style={{width: '90px', display: 'inline-block'}}>管理员手机号</Text> <Button style={{width: '148px'}} disabled={!phone}>{phone}</Button><Countdown mobile={curProject.mobile} /></Space></Paragraph>
              <Paragraph><Space size={16}><Text style={{width: '90px', display: 'inline-block'}}>短信验证吗</Text> <Input style={{width: '148px'}} placeholder='请输入短信验证吗' onChange={onCodeChange} /></Space></Paragraph>
              <Paragraph> <Text type="danger" strong>请谨慎操作！</Text></Paragraph>
              </div>
            
           </CModal>

           <CModal ref={delmodal} title='删除项目' mold='cust' onOk={delProject} width={640} type="warn" warnimg={false} bodyStyle={{padding: "32px"}}>
               <div>
                 <Title level={4}>删除项目时 用户需知：</Title>
                 <Paragraph>1、删除项目后会同步删除所有项目下员工及管理员账号；</Paragraph>
                 <Paragraph>2、删除项目后会同步删除项目下所有区域、设备、网关档案；</Paragraph>
                 <Paragraph>3、删除项目后将清除所有设备历史数据；</Paragraph>
                 <Paragraph> <Text type="danger" strong>请谨慎操作！</Text></Paragraph>
                 <Paragraph>该操作不可逆，一旦操作成功，应用内所有内容将被删除。</Paragraph>
                 <Paragraph> <Space size={16}><Text style={{width: '120px', display: 'inline-block'}}>登录用户手机号</Text> <Button style={{width: '148px'}}>{loguerphone}</Button><Countdown mobile={logMobile} /></Space></Paragraph>
                 <Paragraph><Space size={16}><Text style={{width: '120px', display: 'inline-block'}}>短信验证吗</Text> <Input style={{width: '148px'}} placeholder='请输入短信验证吗' onChange={projectNameChange} /></Space></Paragraph>
              {/*    <Paragraph>请在下方输入框中输入项目名称以确定操作</Paragraph>               
                 <Paragraph><Input style={{width: '422px'}}   onChange={projectNameChange} allowClear /></Paragraph> */}
               
               </div>
           </CModal>
         </Maibox>
}
