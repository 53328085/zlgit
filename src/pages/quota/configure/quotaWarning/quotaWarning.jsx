import React from 'react'
import BlueColumn from '@com/bluecolumn'
import styled from 'styled-components';
import {Divider,InputNumber ,Switch  } from "antd";
const WrapDiv = styled.div`
width:640px;
height:160px;
background-color:#fff;
border:1px solid rgb(215 215 215);
border-radius:4px;
padding:16px;
.fl{
  display: flex;
  margin:0 16px;
  align-items: center;
  justify-content: space-between;
  .sw{
    padding: 0 8px;
  }
}
`
export default function QuotaWarning() {
  return (
    <div>
      <WrapDiv >
        <BlueColumn name="定额预警" />
        <Divider dashed style={{margin: '16px 0',borderColor: 'rgb(215 215 215)'}}></Divider>
        <div className="fl">
          <div>能耗剩余&nbsp;&le; &nbsp;
            <InputNumber 
            formatter={value => `${value}%`}
            parser={value => value?.replace('%', '')} 
            defaultValue={0} keyboard /></div>
          <div>是否预警 &nbsp;<Switch className="sw" checkedChildren="是" unCheckedChildren="否"/></div>
          </div>
       
      </WrapDiv>
    </div>
  )
}
