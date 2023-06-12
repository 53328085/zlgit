/**
 * @author zhenglin zhu
 * @description: // 公用的styled样式组件
 * @date 2022-10-18 09:45
 */
import styled, {css} from "styled-components";
import {Input, Select, DatePicker, Radio} from 'antd'
const {Search, Password, TextArea} = Input

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
  && {
    color: #999;   
    width: ${props => props.w || 'auto'} ;
   

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