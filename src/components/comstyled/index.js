/**
 * @author zhenglin zhu
 * @description: // 公用的样式组件
 * @date 2022-10-18 09:45
 */
import styled from "styled-components";
import {Input, Select} from 'antd'
const {Search, Password} = Input

const Comipt = styled(Input)`  // 背景色透明
  background-color: transparent !important;
  border: 1px solid #9c9ea4;
  &:focus, &:hover {    
    border-color: #1f83fe !important;
    .ant-input {
      color: #1f83fe;
    }
    .anticon.anticon-user {
      color: #1f83fe !important;
    }
  }
 
  .ant-input-affix-wrapper-status-error {
    background-color: transparent !important;
  }
  .ant-input {
    background-color: transparent;
    color:#999;
  
  } 
 .ant-input::placeholder {
    color: #999;
    }
  input:-internal-autofill-previewed,
  input:-internal-autofill-selected {
    -webkit-text-fill-color: #999 !important;
　　transition: background-color 5000s ease-in-out 0s !important;
  }
`
export const Iptserach = styled(Search)`
 .ant-input-affix-wrapper {
    background-color: transparent !important;
    border: none;
 }
 .ant-input-group-addon {
    background-color: transparent;
 }
 background-color: transparent !important;
 border: 1px solid #9c9ea4;
  &:focus, &:hover {    
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
 color: #999;
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
    border: 1px solid #9c9ea4;
    &:focus, &:hover {    
    border-color: #1f83fe !important;
  }
 }
`