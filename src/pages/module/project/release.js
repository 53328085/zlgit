import React, { useEffect, useRef, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import styled from 'styled-components'
import { useRequest, useCountDown } from 'ahooks';
import {Image, Tag, Switch, Typography, message, Space, Button, Divider, Input} from 'antd'
import {ProjectSetting, Login} from '@api/api.js'
import {useSelector, useDispatch} from 'react-redux'
 import {selectUser, userRest} from '@redux/user.js'
import {manager } from '@redux/user'  
import { getpublishState, publishState, systemConfigRest,adaptation} from '@redux/systemconfig.js'  
import log from '@imgs/log.png'
import {useTranslation} from "react-i18next"
 
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
    column-gap:  ${props => props.theme.laptop ? "16px" : "32px"};
    .content {
       display: grid;
       align-content: space-between;
       .upper {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
         .left {
            display: grid;
            grid-template-columns: ${props => props.theme.laptop ? 'repeat(6, auto)' : 'repeat(5, auto) 2px auto'} ;
            grid-template-rows: 32px;
            column-gap: ${props => props.theme.laptop ? "12px" : "16px"};
         }
         .right {
            
            display: flex;
           justify-content: space-between;
           column-gap: 16px;
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
  const {t} =useTranslation("common","comm")
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
 const  locale =useSelector(state => state.system.iszhCN)
 const {laptop} = useSelector(adaptation)
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
     <Button style={{width: 'auto'}} onClick={() => getCode()} disabled={countdown !== 0}>        
           {countdown === 0 ? t("common:ObtainCode") : ` ${Math.round(countdown / 1000)}s`}
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
      return message.warning('请输入验证码')
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
     if (!projectName.current.trim()) return message.warning('请输入短信验证码')
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
  <Title level={4}>{t("common:UnpublishUser")}</Title>
  <Paragraph>1、{t("common:UnpublishEditable")}</Paragraph>
  <Paragraph>2、{t("common:UnpublishInEditable")}</Paragraph>

  </>
   :
   <>
  <Title level={4}>{t("common:PublishingProject")}</Title>
  <Paragraph>{t("common:ManagementSettings")}</Paragraph>
  <Paragraph>{t("common:MessageLock")}</Paragraph>
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
                 <Tagbox>{t("common:ApplicationModule")}({item.templateCnt})</Tagbox>
                 <Tagbox>{t("common:DevicesNumber")}({item.meterCnt})</Tagbox>
                 <Tagbox>{t("common:GatewaysNumber")}({item.gatewayCnt})</Tagbox>
                 <Tagbox>{t("common:EnergyType")}({item.gatewayCnt})</Tagbox>
                {laptop ? null : <Divider type='vertical' style={{margin: 0, height: '36px', borderLeftStyle: 'dotted', borderLeftWidth: '2px'}}></Divider>} 
                 <Tagbox>{t("common:ProjectValidityPeriod")}&nbsp;{item.validStageTime?.slice(0,10)}</Tagbox>
                 </div>
                 <div className="right" >
                 <Switch key={stateV.current}  checkedChildren={t("comm:Published")}  unCheckedChildren={t("comm:Unpublished")} style={{alignSelf: 'center'}} defaultChecked={item.state == 1}    onChange={(checked) => onChange(checked, item)} />
                 {(!ismanager && !publish) && <Link underline type="danger" onClick={() => onDel(item)}>{t("common:DeleteItem")}</Link>}
                 </div>
            </div>
            <div className="lower">
               <Text type='secondary'>{t("common:CreationTime")}：</Text>
               <Text type='secondary'>{t("common:Founder")}：</Text> 
               <Text type='secondary' >{t("common:ProjectManager")}:</Text>  
               <Text type='secondary'>{t("common:ProjectAddress")}：</Text>
               <Text type='secondary'>{t("common:ProjectStatus")}：</Text>
               <Text type='secondary' ellipsis>{item.createTime}</Text>
               <Text type='secondary' ellipsis>{item.creator}</Text>
               <Text type='secondary' ellipsis>{item.manager}/{item.mobile}</Text>
               <Text type='secondary' ellipsis>{item.address}</Text>              
               <Text type='secondary' ellipsis style={{color: item.state == 1 ? '#1890FF' : ''}}>&#9679;&nbsp;{item.state == 1 ? t("comm:Published") : t("comm:Unpublished")}</Text>
            </div>    
        </div>
    </Itembox>
  )
  return  <Maibox>
           {data?.list.map(item => <Item item={item} key={item.id} />)} 
           <CModal ref={modal} title={curProject.title} mold='cust' onOk={onOk} width={640}>
           <div>
               { 
                publishing
               }
              <Paragraph> <Space size={16}><Text style={{width: 'auto', display: 'inline-block'}}>{t("common:AdministratorMobileNumber")}</Text> <Button style={{width: '148px'}} disabled={!phone}>{phone}</Button><Countdown mobile={curProject.mobile} /></Space></Paragraph>
              <Paragraph><Space size={16}><Text style={{width: 'auto', display: 'inline-block'}}>{t("common:SMSVerificationCode")}</Text> <Input style={{width: '148px'}} placeholder={t("common:EnterCode")} onChange={onCodeChange} /></Space></Paragraph>
              <Paragraph> <Text type="danger" strong>{t("common:caution")}</Text></Paragraph>
              </div>
            
           </CModal>

           <CModal ref={delmodal} title={t("common:DeleteItem")} mold='cust' onOk={delProject} width={640} type="warn" warnimg={false}
           styles={{
            body:{
              padding: "32px"
            }
           }}
           >
               <div>
                 <Title level={4}>{t("common:Noticeproject")}</Title>
                 <Paragraph>{t("common:delaccounts")}</Paragraph>
                 <Paragraph>{t("common:delfiles")}</Paragraph>
                 <Paragraph>{t("common:deldata")}</Paragraph>
                 <Paragraph> <Text type="danger" strong>{t("common:caution")}</Text></Paragraph>
                 <Paragraph>{t("common:delcontent")}</Paragraph>
                 <Paragraph> <Space size={16}><Text style={{width: 'auto', display: 'inline-block'}}>{t("common:LoginMoblie")}</Text> <Button style={{width: '148px'}}>{loguerphone}</Button><Countdown mobile={logMobile} /></Space></Paragraph>
                 <Paragraph><Space size={16}><Text style={{width: 'auto', display: 'inline-block'}}>{t("common:SMSVerificationCode")}</Text> <Input style={{width: 'auto'}} placeholder={t("common:EnterCode")} onChange={projectNameChange} /></Space></Paragraph>
              {/*    <Paragraph>请在下方输入框中输入项目名称以确定操作</Paragraph>               
                 <Paragraph><Input style={{width: '422px'}}   onChange={projectNameChange} allowClear /></Paragraph> */}
               
               </div>
           </CModal>
         </Maibox>
}
