/**
 * @author zhenglin zhu
 * @description: // 公用的styled样式组件
 * @date 2022-10-18 09:45
 */
import styled, {css} from "styled-components";
import {Input, Select, DatePicker, Radio, Form, Button, Checkbox, Spin, Divider} from 'antd'
import {useTranslation} from "react-i18next"

const {Search, Password, TextArea} = Input
const { Item } = Form;
const $color= '#237AE4'
export const Ipticon = styled.span`
  display: inline-block;
  width: 32px;
  height: 32px;
  
  background-size: 32px 32px;
  transition: all 0.3s;
  overflow: hidden;
`;
const normal = css`
    background-color: transparent !important; // 背景色透明
    border: 1px solid #9c9ea4;
    color:#fff;
    input::placeholder {
      color: #999;
    }
`
const active = css` //  :focus, :hover  
   input:focus:not(.ant-input-disabled), input:hover:not(.ant-input-disabled) {    
      border-color: #1f83fe !important;
      color: #1f83fe;
  }
`
const formMixin = css`
    background-color: transparent !important; // 背景色透明
    border: 1px solid #9c9ea4; 
    color: #fff;
    input::placeholder {
      color: #999;
    }
    &&:focus:not(.ant-input-disabled), &&:hover:not(.ant-input-disabled) {    
      border-color: #1f83fe !important;
      color: #1f83fe;
   
    
  }
  
`
export const Comtext = styled(TextArea)`
 && {
    ${formMixin}
    ${active}
    height: ${({h}) => h || 'auto'};
 }
   
`
export const Comipt = styled(Input)`  
 
    ${formMixin}
    ${active}
  .anticon.anticon-user {
      color: #1f83fe !important;
  }
  .ant-input-affix-wrapper-status-error {
    background-color: transparent !important;
  }
  input:-internal-autofill-previewed,
  input:-internal-autofill-selected {
    -webkit-text-fill-color: #999 !important;
　　transition: background-color 5000s ease-in-out 0s !important;
  }
`
export const CdatePicker = styled(DatePicker)`

&& {
  ${formMixin}
  width: 200px;
  .ant-picker-input >input{
      color:#fff;
      ${active}
  }
}
`
export const Iptserach = styled(Search)`
&& {
  border-radius: 4px;
    overflow: hidden;
}
 .ant-input-affix-wrapper {
    background-color: transparent !important;
    border: none;
    height: 40px;
   
 }
 .ant-input-group-addon {
    background-color: transparent;
 }
 background-color: transparent !important;
 border: 1px solid #8091b2;
  &:focus:not(.ant-input-disabled), &:hover:not(.ant-input-disabled) {    
    border-color: #1f83fe !important;
    .ant-input {
      color: #1f83fe;
    }    
  }
 .ant-input-group>.ant-input-group-addon:last-child {
    left: 0px;
  }

  .ant-input {
    background-color: transparent;
    color:#999;
  
  } 
 .ant-input::placeholder {
    color: #999;
    }
    .ant-input-clear-icon, .anticon.ant-input-clear-icon {
        color: #999;
        &:focus, &:hover {
            color:  #1f83fe;
        }
    }
  input:-internal-autofill-previewed,
  input:-internal-autofill-selected {
    -webkit-text-fill-color: #999 !important;
　　transition: background-color 5000s ease-in-out 0s !important;
  }
`
export const Cselect = styled(Select)`
  &:focus,
  &:hover {
    border-color: #1f83fe !important;  
    .ant-input {
      color: #1f83fe;
    }
  }
  && {
    color: #999;     
    border-radius: 4px;
    overflow: hidden;
  }
  
 &:hover,&:focus {
    color: #1f83fe;
 }
 .ant-select-arrow {
    color: #999;
    &:hover,&:focus {
    color: #1f83fe;
 }
 }

 &:not(.ant-select-customize-input) .ant-select-selector {
    background-color: transparent;
    border: 1px solid #8091b2;
    border-radius: 4px;
    overflow: hidden;
    height: ${props => props.h || 'auto'} !important ;
    &:focus, &:hover {    
    border-color: #1f83fe !important;
    
  }
 }
`
 
export const Logselect = styled(Select)`
  ${Ipticon} {
    background-image: url(${(props) => props.url});
    background-size: 32px 32px;
  }
  &:focus,
  &:hover {
    border-color: #1f83fe !important;
    ${Ipticon} {
      background-image: url(${(props) => props.aurl});
      background-size: 32px 32px;
    }
    .ant-input {
      color: #1f83fe;
    }
  }
  && {
    color: #999;   
    width: ${props => props.w || 'auto'} ;
    height: ${props => props.h || 'auto'} ;

    border-radius: 4px;
    overflow: hidden;
    .ant-select-selection-placeholder, .ant-select-selection-item{
       line-height: 42px;
       padding-left: 56px;
     }
   
     .ant-select-arrow{
       left: 16px;
       right: 0px
     }
  }
  
 &:hover,&:focus {
    color: #1f83fe;
 }
 .ant-select-arrow {
    color: #999;
    &:hover,&:focus {
    color: #1f83fe;
 }
 }

 &:not(.ant-select-customize-input) .ant-select-selector {
    background-color: transparent;
    border: 1px solid #8091b2;
    border-radius: 4px;
    overflow: hidden;
    height: ${props => props.h || 'auto'} !important ;
    &:focus, &:hover {    
    border-color: #1f83fe !important;
    
  }
 }
`

export const Cradiogroup = styled(Radio.Group)`

 && {
  display: grid;
  grid-template-columns: repeat(4, 96px);
  grid-auto-rows: auto;
  gap: 16px;
  .ant-radio-button-wrapper {
    margin: 0px;
    color: #333;
    font-size: 14px;
    width: 96px;
    height: 32px;
    line-height: 32px;
    background-color: transparent;
    border: 1px solid #ccc;
    transition: all 0.3s;
    display: flex;
    justify-content: center;
    border-radius: 2px;
   &:not(:first-child)::before {
     display: none;
   }
   &:hover{
      border: 1px solid rgba(35,122,228,1);
      color: rgba(35,122,228,1);
      .ant-radio-button {
        border-color: rgba(35,122,228,1);
    }
    }
  }
  .ant-checkbox-disabled+span {
    color: #fff;
  }
  .ant-radio-button-wrapper-checked.ant-radio-button-wrapper {
    color:#fff;
    background-color: #237ae4;
    border-color: #237ae4;
  }
 
 
 }
`
export const Borderleft = styled.div`
   display: flex;
   height: 32px;
   align-items: center;
   padding-left: 16px;
   border-left: 4px solid ${props => props.theme.primaryColor};
`
export const Itembox = styled(Item)`
 
  .ant-input-affix-wrapper-lg {
    height: 48px;
  }
`;
 
export const Logipt = styled(Input)`
  font-size: 14px;
  background-color: transparent !important;
  border: 1px solid #9c9ea4;
  border-radius: 4px;
  ${Ipticon} {
    background-image: url(${(props) => props.url});
  }
  &:focus,
  &:hover {
    border-color:  #1f83fe !important; // ${props => props?.theme?.primaryColor?.toUpperCase()!=$color ? props.theme.primaryColor : '#1f83fe !important'};
    ${Ipticon} {
      background-image: url(${(props) => props.aurl});
    }
    .ant-input {
      color:  #1f83fe !important; // ${props => props?.theme?.primaryColor?.toUpperCase()!=$color ? props.theme.primaryColor : '#1f83fe !important'};;
    }
  }
  && {
    .ant-input-prefix {
      margin-right: 16px;
    }
  }
  .ant-input-affix-wrapper-status-error {
    background-color: transparent !important;
  }
  .ant-input {
    background-color: transparent;
    color: #999;
  }
  .ant-input::placeholder {
    color: #999;
  }
  input:-internal-autofill-previewed,
  input:-internal-autofill-selected {
    -webkit-text-fill-color: #999 !important;
    　　transition: background-color 5000s ease-in-out 0s !important;
  }
`;
export const Logpsd = styled(Input.Password)`
  background-color: transparent !important;
  border: 1px solid #9c9ea4;
  font-size: 14px;
  border-radius: 4px;
  ${Ipticon} {
    background-image: url(${(props) => props.url});
  }
  &:focus,
  &:hover {
    border-color: #1f83fe !important;
    ${Ipticon} {
      background-image: url(${(props) => props.aurl});
    }
    .ant-input {
      color: #1f83fe;
    }
    .ant-input-password-icon.anticon {
      color: #1f83fe !important;
    }
  }
  && {
    .ant-input-prefix {
      margin-right: 16px;
    }
  }
  .ant-input-password-icon.anticon {
    color: #999;
  }
  .ant-input-affix-wrapper-status-error {
    background-color: transparent !important;
  }
  .ant-input {
    background-color: transparent;
    color: #999;
  }
  .ant-input::placeholder {
    color: #999;
  }
`;
 export const Logck = styled(Checkbox)`
  display: flex;
  align-items: center;
  &:hover {
    .ant-checkbox:hover {
      border-color: #9c9ea4;
    }
  }
  .ant-checkbox + span {
    padding-left: 0;
    padding-right: 0;
    color: #999;
    font-size: 16px;
  }
  .ant-checkbox-checked .ant-checkbox-inner:after {
    transform: rotate(45deg) scale(2) translate(-25%, -50%);
  }
  .ant-checkbox {
    width: 32px;
    height: 32px;
    margin-right: 16px;
    top: 0px;
    .ant-checkbox-input,
    .ant-checkbox-inner {
      width: inherit;
      height: inherit;
      background-color: transparent;
    }
    .ant-checkbox-inner {
      border-color: #9c9ea4;
      background-color: transparent;
      &:hover {
        border-color: #9c9ea4;
      }
    }
    .ant-checkbox-inner::after {
      left: 25%;
    }
  }
`;

export const Logbtn = styled(Button)`
  border-color: rgba(0,102,204,1);
  background-color: rgba(0,51,255,0.6);
  font-size: 18px;
  color: #fff;
  &:hover, &:active, &:focus {   
    background-color:  rgba(0,51,255,0.8);
    color: #fff;
  }
`;
 
export const Serach =(props) => {
  const {t} = useTranslation('button')
  return <Input.Search   allowClear enterButton={<Button style={{width: '80px'}}>{t("button:search")}</Button>} {...props}  />
}
/* export const Serach = styled(Input.Search)`    
 && {
  border-radius: 4px;
  overflow: hidden;
}
 .ant-input-affix-wrapper {
    background-color: transparent !important;
    border: none;
    height: 32px;
    &:hover {
      border-color: transparent;
      border-right-width: 0;
      box-shadow: none;
    }
 }
 
 .ant-input-group-addon {
    background-color: transparent;
 }
 background-color: transparent !important;
 border: 1px solid #d7d7d7;
  &:focus:not(.ant-input-disabled), &:hover:not(.ant-input-disabled) {    
    border-color: #1f83fe !important;
    .ant-input {
      color: #1f83fe;
    }    
  }
 .ant-input-group>.ant-input-group-addon:last-child {
    left: 0px;
  }

  .ant-input {
    background-color: transparent;
    color:#999;
  
  } 
 .ant-input::placeholder {
    color: #999;
    }
    .ant-input-clear-icon, .anticon.ant-input-clear-icon {
        color: #999;
        &:focus, &:hover {
            color:  #1f83fe;
        }
    }
    .ant-btn.ant-btn-primary.ant-input-search-button{
        width: 80px;
        background-color: #f5f7fa;
        color:#515151;
        border-color: transparent;
     }
  input:-internal-autofill-previewed,
  input:-internal-autofill-selected {
    -webkit-text-fill-color: #999 !important;
　　transition: background-color 5000s ease-in-out 0s !important;
  }
` */
 
  export const Cspin =  (props) => {

    return (<Spin {...props}  wrapperClassName="spincsut">
           {props.children}
          </Spin>)
  }
  const Normal = styled.div`
   width: ${props => props.wh || "72px"};
   height: 24px;
   display: flex;
   align-items: center;
   justify-content: center;
   font-size: 14px;
   border: 1px solid transparent;
   border-radius: 2px;
`
export  const Ptag = styled(Normal)`
   background-color: #ecf5ff;
   color: #409eff;
   border-color:#409eff;
   transition:  all 0.3s;
   &:hover{
    cursor: pointer;
    background-color: rgb(64,158,255);
    border-color:rgb(64,158,255) ;
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
    background-color: rgb(240,60,60,1);
    border-color:rgb(240,60,60,1) ;
    color:#fff;
   }

`
export const Cdivider = ({
  margin=0, 
  borderColor="#d7d7d7",
  height="32px",
   type="v", 
   ...rest
  } ) => {
   if(type == 'v') {
     return <Divider type="vertical" style={{ margin,borderColor, height}} {...rest} dashed />
   }else if(type == 'h') {

     return  <Divider type="horizontal" style={{ margin,borderColor }} {...rest} dashed />
   }
 
}
export   const Radiogroup = styled(Radio.Group)`
  && {
    .ant-radio-button-wrapper.ant-radio-button-wrapper-in-form-item {
      width: ${props => props.wh || '96px'};
      text-align: center;
      &:first-child {
        border-radius: 16px 0 0 16px;
      }
     &:last-child {
      border-radius: 0 16px 16px 0;
     }
    }
  }

`