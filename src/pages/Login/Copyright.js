import React from 'react'
import {Button} from 'antd'
import {useSelector} from 'react-redux'
import {selectCurProject} from '../../redux/user'
import { systemConfigInfo } from "@redux/systemconfig";
import styled from 'styled-components';
const Cfooter = styled.div`
  && {
    display: flex;
    height: 24px;
    background-color: #141437;
    font-size: 12px;
    color: #ccc;
    justify-content: center;
    align-items: center;
    padding: 0;
    .record {
        height: 24px;
        line-height: 24px;
        padding:  0 1px;
        border-radius: 0px;
        border: none;
        font-size: 12px;
        padding-left: 1em;
    }
    span {
      display: flex;     
      
      align-items: center;

    }
 
  }


`
export default function Footer() {
  const config = useSelector(systemConfigInfo)    
  
  const copyright =config?.copyright || `COPYRIGHT  ${config?.companyName} ALL RIGHTS RESERVED`
  
 
  return (
    <Cfooter>
    <span>
      {copyright}
      <Button href="https://beian.miit.gov.cn/" ghost className="record">{config?.recordNo}</Button>
    </span>
     </Cfooter>
  )
}
