import React, {useCallback,useEffect,useRef, useState} from "react";
import styled, {css} from "styled-components";
import {useSelector} from 'react-redux'
import { Button, Dropdown, Menu, Upload, Typography, message,Radio, Form, DatePicker} from "antd";
import {CaretDownFilled, CloseOutlined} from '@ant-design/icons'
import {useTranslation} from 'react-i18next' 
import moment from "moment";
import i18 from '../../i18n'
import icon from "./icon";
import {hextodec} from '@com/usehandler'
import { themeColor } from "@redux/systemconfig";
import GouIcon from '@imgs/gou.png'
import CModal from "@com/useModal";
 
const {Link} = Typography
// 按钮圆角一般6px,  高度28px及一下4px 陈舒映

const Normal = styled.div`
width: ${props => props.wh || "72px"};
height: 24px;  
display: flex;
align-items: center;
justify-content: center;
font-size: 14px;
border: 1px solid transparent;
border-radius: 4px;
padding: 0 8px;
transition: all 0.3s;
`
const Dot = styled.div`
&&{
  width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 1px solid ${props =>   props.theme.successColor };  
          background-color:  ${props =>   props.theme.successColor} ;
         background-image: url(${GouIcon});
         background-position:  center;
         background-size: 8px;
         background-repeat: no-repeat;
         margin-right: 8px;
          
} 
           
`
const Udot = styled.div`
&&{
  width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 1px solid ${props =>   props.theme.errorColor };  
          background-color:  ${props =>   props.theme.errorColor} ; 
         margin-right: 8px;
         position: relative;
         &::before{
           content: "\\005F";
           position: absolute;
           transform: translate(-50%, -50%);
           color:#fff;
         }
          
} 
           
`
// 已确认、未确认  盘面图监控页面
const confirmsty = css`
${props => props.state== 1 ? props.theme.successColor : props.theme.errorColor }
`
const Confirm = styled(Normal)`
   color: ${confirmsty};
   border-color:${confirmsty};
   background-color: rgba(${props=> props.r}, ${props=> props.g}, ${props=> props.b}, ${props=> props.opac});
   justify-content: flex-start;
   padding-right: 4px;
   
`
const Config = styled(Normal)`
   color: ${props => props.color};
   border-color:${props => props.color};
   background-color: rgba(${props=> props.r}, ${props=> props.g}, ${props=> props.b}, ${props=> props.opac || props.theme.opacity});
   cursor: pointer;  
   &:hover{
     color: #fff;
     background-color: rgba(${props=> props.r}, ${props=> props.g}, ${props=> props.b}, ${props=> props.opac*2.5|| props.theme.opacity*2.5});;
   }
`
export  const Ptag = styled(Normal)`
   background-color: ${props=> props.theme.primaryderived};
   color: #fff;
  // border-color:#409eff;
   transition:  all 0.3s;
   &:hover{
    cursor: pointer;
    background-color: ${props=> props.theme.primaryColor};
    border-color:${props=> props.theme.primaryColor} ;
    color:#fff;
   }

`
export  const Wtag = styled(Normal)`
   background-color: rgba(254,240,240,1);
   color: #f35656;
   border-color:rgba(251,200,200,1);
   transition:  all 0.3s;
   &:hover{
    cursor: pointer;
    background-color: rgba(240,60,60,1);
    border-color:rgba(240,60,60,1) ;
    color:#fff;
   }

`

export const i18warning = (text) => {  //  出错提示
    let msg = text || i18.t("dataerr", {ns: "comm"})  
    message.warning(msg)
  
}
export const i18success = (type) => {  //  成功提示
  
  let text = {
    save: "savesuccessfully",
    edit: "Editsuccessfully",
    modify: "modifysuccessfully",
    delete: "successfullydelete",
    new:"newsuc",
    stop:  "Deactivatedsuccessfully",
    enable: "Enabledsuccessfully",
  }[type]
  let msg =  i18.t(text, {ns: "comm"})
  message.success(msg)

}
export const i18t = function(ns,text, params={text:""}) { // 名称空间， key, 其他配置参数
  let {param='', ...rest} = params;
  try {
     
      return i18.t(text, {ns,param, ...rest})
   
  } catch (error) {
    console.log(error)
  }
 
}


const Custbtn = styled(Button).attrs((props) => ({
  type: props.type || "primary",
}))`
  && {
    width: ${props => props.wh || '96px'};
    height: 32px;  
    border-radius: 6px; 
    padding: 8px;
    text-align: left;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  img {
    height: ${props => props.imgh || '16px'}; 
    margin-right: 8px;
  }
`;
Custbtn.defaultProps={
  wh: '96px'
}
const Deltbtn = styled(Button)`
  && {
    width: 96px;
    height: 32px;
    background: #F5212D;
    border-color: #F5212D;
    border-radius: 2px;
    color: #fff;
    padding: 8px;
    text-align: left;
    display: flex;
    align-items: center;
  }
  &&:hover {
    background-color: #F74D57;
    border-color: #F74D57;
    color: #fff;
  }
  &&:active,
  &&:focus {
    background-color: #C41A24;
    border-color: #C41A24;
    color: #fff;
  }
  &&[disabled] {
    background-color: #C8C9CC;
    border-color: #C8C9CC;
  }
  img {
    height: 16px;
    margin-right: 8px;
  }
`;
const Wegbtn = styled(Button)`
  && {
    width: 96px;
    height: 32px;   
    background-image: url(${props => icon[props.weg]});
    background-size: 16px;
    background-repeat: no-repeat;
    background-position: 8px;
    border-color: #AEAEAE;
    border-radius: 2px;
    color: #AEAEAE;
    padding: 8px 8px 8px 32px;
    text-align: left;
    display: flex;
    align-items: center;
    
  }

  &&:hover:not([other]) {       
    background-image: url(${props => icon[`${props.weg}h`]});
    border-color: ${props => props.theme.primaryColor || "#237ae4" };
    color:${props => props.theme.primaryColor || "#237ae4" };
  }

  &&:active,
  &&:focus {
    background-color: ${props => props.theme.primaryColor || "#237ae4" };;
    background-image: url(${props => icon[`${props.weg}s`]});
    border-color: ${props => props.theme.primaryColor || "#237ae4" };;
    color: #fff;
  }
  &&[disabled] {
    background-color: #C8C9CC;
    border-color: #C8C9CC;
  }
  img {
    height: 16px;
    margin-right: 8px;
  }
`;
const Cmenu = styled(Menu)`
  padding: 0;
  border-radius: 0;
`
const CmenuItem = styled(Menu.Item)`
 // padding: 8px;
  background-color: #f2f2f2;
  color:#666;
  height: 32px;
  padding-left: 32px;
  background-image: url(${props => icon[props.type]});
  background-size: 16px;
  background-position: 8px;
  background-repeat: no-repeat;
  &&>span {
     display: flex;
     align-items: center;
     height: 32px; 
     
  }
&&:hover{
  background-color: ${props => props.theme.primaryColor || "#2374e4" };
  color:#fff;
  background-image: url(${props => icon[`${props.type}h`]});
}
`
export function RadioT(props) {
  let { text='模式', onChange, ...rest} =  props
  const {t} = useTranslation("comm");
  return (
    <Radio.Group
    onChange={onChange}
    defaultValue="card"
    buttonStyle="solid"
    {...rest}
  >
    <Radio.Button
      style={{ width: "96px", marginLeft: 16, textAlign: "center" }}
      value="card"
    >
      {t("card", {text})}
    </Radio.Button>
    <Radio.Button
      style={{ width: "96px", textAlign: "center" }}
      value="list"
    >
    {t("list", {text})}
    </Radio.Button>
  </Radio.Group>
  )
}
export function ChartList(props) {
  let { text='模式', onChange, ...rest} =  props
  const {t} = useTranslation("comm");
  return (
    <Radio.Group
    onChange={onChange}
    defaultValue="chart"
    buttonStyle="solid"
    {...rest}
  >
    <Radio.Button
      style={{ width: "96px", marginLeft: 16, textAlign: "center" }}
      value="chart"
    >
      {t("chart", {text})}
    </Radio.Button>
    <Radio.Button
      style={{ width: "96px", textAlign: "center" }}
      value="list"
    >
    {t("list", {text})}
    </Radio.Button>
  </Radio.Group>
  )
}
export function CustTransO(props) {   //通用  文字/数字翻译
  let {text:txt, ns="overview", param='', val, params={}} = props 
  const {t} = useTranslation([ns]);
  return (
    <>
     {t(txt, {param,val, ...params})}
    </>
  )
}
 
const Menus = (print) => {
  return (
  <Cmenu>
    <CmenuItem key="prints" type="prints" onClick={() => print(1)}  > 
        单页打印
    </CmenuItem>
    <CmenuItem key="printa" type="printa" onClick={() =>  print(2)} > 
        全部打印 
    </CmenuItem>
  </Cmenu>
)}

export function ConfirmBtn(props) {  //  盘面图监控 确认、未确认  "confirm": "noconfirm",  
  let {text, ns="button", state=1,opac=0.5,wh="80px", ...other} = props  // state=1 确认
  let {errorColor,successColor, primaryColor} = useSelector(themeColor)
  let rgb = state==1 ?  hextodec(successColor) : hextodec(errorColor);
  
  const {t} = useTranslation();
   return <Confirm r={rgb[0]} g={rgb[1]} b={rgb[2]} state={state} opac={opac} wh={wh} {...other} >
            {state==1 ? <Dot /> : <Udot />}  {t(text,{ns})}
           </Confirm>
}
export function TreeBtn(props) {  //  树形按钮 / 状态
  let {text, params={}, ns="button", type=1,opac,wh="80px", ...other} = props  // type： 1  主要， 2 成功 3 错误色（删除） 4 离线（失效）等
  let {errorColor,successColor, primaryColor,offlineColor="#C4D0DE"} = useSelector(themeColor)
  let color = {
    1: primaryColor,
    2: successColor,
    3: errorColor,
    4: offlineColor
  }[type]
  let rgb = hextodec(color);
  
  const {t} = useTranslation();
   return <Config r={rgb[0]} g={rgb[1]} b={rgb[2]} color={color}  opac={opac} wh={wh} {...other} >
             {t(text,{ns,...params})}
           </Config>
}

export function TreeBtnN(props) {  // 树形按钮  普通
  let {text, ns="button",...other} = props 
  const {t} = useTranslation();
   return <Ptag {...other}>
            {t(text,{ns})}
           </Ptag>
}
export function TreeBtnW(props) {  // 树形按钮 删除
  let {text, ns="button",...other} = props 
  const {t} = useTranslation();
   return <Wtag {...other}>
            {t(text,{ns})}
           </Wtag>
}

export function CustLink(props) { // 通用方式
  let {text, ns="button",...other} = props 
  const {t} = useTranslation();
  return (
    <Link underline {...other}>
     {t(text, {ns})}
    </Link>
  )
}
export function CustButtonT(props) { // 通用方式按钮 通用翻译
  let {src,text,ns="button",param={}, ...other} = props 
  const {t} = useTranslation()
  return (
    <Custbtn {...other}>
     {src ? <img src={icon[src]} width={props.width} /> : null}
     {t(text, {ns},{...param})}
    </Custbtn>
  )
}
export function CustButton(props) { // 通用方式按钮
  let {src, ...other} = props 
  return (
    <Custbtn {...other}>
     {src ? <img src={icon[src]} width={props.width} /> : null}
      {props.children}
    </Custbtn>
  )
}
export function SaveButton(props) {
  const {isicon=true} = props
  return (
    <Custbtn {...props}>
      {isicon && <img src={icon.save} />}
      {i18.t('save', {ns: "button"})}
    </Custbtn>
  );
  }

export function CancelButton(props) {
  const {isicon=true} = props
  return (
    <Custbtn type="default" {...props}>      
      {i18.t('back', {ns: "button"})}
    </Custbtn>
  );
}
export function SerachButton(props) {
  return (
    <Custbtn {...props}>
      <img src={icon.serach} />
      {i18.t('search', {ns: "button"})}
    </Custbtn>
  );
}
export function RefreshButton(props) {
  return (
    <Custbtn {...props}>
      <img src={icon.refresh} />
      {i18.t('refresh', {ns: "button"})}
    </Custbtn>
  );
}
export function NewButton(props) {
  return (
    <Custbtn {...props}>
      <img src={icon.new} />
      {i18.t('new', {ns: "button"})}
    </Custbtn>
  );
}
export function ChangeButton(props) {
  return (
    <Custbtn {...props}>
      <img src={icon.change} />
      {i18.t('change', {ns: "button"})}
    </Custbtn>
  );
}
export function UnbindingButton() {
  return (
    <Custbtn>
      <img src={icon.unbinding} />
      {i18.t('unbind', {ns: "button"})}
    </Custbtn>
  );
}
export function ImportButton(props) {
  return (
    <Custbtn {...props}>
      <img src={icon.import} />
      {i18.t('import', {ns: "button"})}
    </Custbtn>
  );
}

export function ImportConfigurationFile(props) {
  return (
    <Custbtn wh="auto" {...props}>
      {i18.t('ImportConfigurationFile', {ns: "button"})}
    </Custbtn>
  );
}
export function ExportButton(props) {  
  return (
    <Custbtn {...props}>
      <img src={icon.export}  />
      {i18.t('export', {ns: "button"})}
    </Custbtn>
  );
}
export function AllExportButton(props) {
  return (
    <Custbtn wh="auto" {...props}>
      <img src={icon.export} />
      {i18.t('batchImport', {ns: "button"})}
    </Custbtn>
  );
}
export function PrintButton(props) {
  return (
    <Dropdown overlay={Menus(props.print)}>
      <Custbtn>
        <img src={icon.print} />
        {i18.t('print', {ns: "button"})}
        <CaretDownFilled/>
      </Custbtn>
    </Dropdown> 
  );
}

export function ExportExcel({tb,  single=false,defined=false,setIsrange,getDates,value, ...other}) {
 const mref= useRef()
 const [form] = Form.useForm()
 const [dates, setDates] = useState(null)
 const onOk=async()=> {
    try {
      await form.validateFields()
      tb.current.downloadAll()
      setIsrange({range:false})
      mref.current.onCancel()
    } catch (e) {
      Promise.reject()
    }
 }
 const disabledDate = (current) => { // 限制选择范围
  if (!dates) {
    return false;
  }
  const tooLate = dates[0] && current.diff(dates[0], 'days') > 31;
  const tooEarly = dates[1] && dates[1].diff(current, 'days') > 31;
  const date = current && current > moment().endOf("day");
  return !!tooEarly || !!tooLate || !!date
};
 const onClick =useCallback(({key}) => {
      
     if (key == '1') {
      tb.current.download()
     }else if(key == '2') {
      tb.current.downloadAll()
     }else if(key=="3") {
      let obj={range:true}
      setIsrange(obj)
      mref.current.onOpen()
     }
  }, [tb])
  const items = [
    {
      key: '1',
      label:   <Link> {i18.t('exportCurPage', {ns: "button"})}</Link>,
      
         
    },
    defined ?  {
      key: '3',
      label: <Link> {i18.t('Customexports', {ns: "button"})}</Link>,
    
    } : null,
    single ? null : {
      key: '2',
      label: <Link> {i18.t('exportAll', {ns: "button"})}</Link>,
    
    },
  ]
  useEffect(()=> {
    if(defined && Array.isArray(value)){
      form.setFieldValue("date", value)
    }

  },[defined,value])
  return (
    <div>
    <Dropdown menu={{items, onClick}} {...other}>
        <Custbtn >
      <img src={icon.export}  />
      {i18.t('export', {ns: "button"})}
    </Custbtn>
    </Dropdown>
    <CModal width={485} title={i18.t('Customexports', {ns: "button"})} ref={mref} onOk={onOk}  mold='cust' >
    <Form form={form} layout="vertical">
       <Form.Item label="请选择数据导出时间段" name="date"  rules={[{
        required:true,
        message:"请选择数据导出时间段"
       }]}>
       <DatePicker.RangePicker 
       disabledDate={disabledDate} 
       onChange={getDates}
       onCalendarChange={(val) => setDates(val)}
         format="YYYY-MM-DD HH:mm"
       showTime={{
        format: 'HH:mm',
        minuteStep:15
      }}
       ></DatePicker.RangePicker>
       </Form.Item>
    </Form>
</CModal>
</div>
  );
}

export function AccountButton() {
  return (
    <Custbtn>
      <img src={icon.account} />
      {i18.t('openAccount', {ns: "button"})}
    </Custbtn>
  );
}
export function ConfigButton() {
  return (
    <Custbtn>
      <img src={icon.config} />
      {i18.t('configure', {ns: "button"})}
    </Custbtn>
  );
}
export function OpenButton() {
  return (
    <Custbtn>
      <img src={icon.open} />
      {i18.t('openAll', {ns: "button"})}
    </Custbtn>
  );
}
export function CloseButton(props) {
  return (
    <Custbtn {...props}>
      <img src={icon.close} />
      {i18.t('closeAll', {ns: "button"})}
    </Custbtn>
  );
}
export function DelButton(props) {
  return (
    <Deltbtn {...props}>
      <CloseOutlined style={{fontSize: '16px'}} />
      {i18.t('delete', {ns: "button"})}
    </Deltbtn>
  );
}

export function WegButton(props) {
  return (
    <Wegbtn {...props}> 
       {props.children}
    </Wegbtn>
  );
}
