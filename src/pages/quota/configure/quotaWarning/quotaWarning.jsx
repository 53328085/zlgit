import React, { useEffect, useState, useRef } from 'react'
import BlueColumn from '@com/bluecolumn'
import Pagecount from '@com/pagecontent'
import styled from 'styled-components';
import {Divider,InputNumber ,Switch  } from "antd";
import { useSelector } from 'react-redux'
import { QuotaManage } from '@api/api.js'
import Titlelayout from "@com/titlelayout"
const WrapDiv = styled.div`
width:640px;
height:160px;
//background-color:#fff;
//border:1px solid rgb(215 215 215);
//border-radius:4px;
//padding:16px;
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
  const projectId = useSelector(state => state.system.menus.projectId)
  const [dataList,setDataList]=useState({})

  const getData=()=>{
    QuotaManage.QueryProjectQuotaWarn(projectId).then(res=>{
      let { success, data } = res
      if(success){
        setDataList(data)
      }else{
        message.error(res.errMsg)
      }
    })
  }
  const onChange=(value)=>{
    setDataList({...dataList,quotaThreshold:value})
    let params={
      projectId:projectId,
      quotaThreshold:value,
      enable:dataList.enable
    }
    QuotaManage.SaveProjectQuotaWarn(params).then(res=>{
      let { success, data } = res
      if(success){
        getData()
        message.success('保存成功')
      }else{
        message.error(res.errMsg)
      }
    })
  }
  const changeSwitch=(value)=>{
    setDataList({...dataList,enable:value?1:0})
    let params={
      projectId:projectId,
      quotaThreshold:dataList.quotaThreshold,
      enable:value?1:0
    }
    QuotaManage.SaveProjectQuotaWarn(params).then(res=>{
      let { success, data } = res
      if(success){
        getData()
        message.success('保存成功')
      }else{
        message.error(res.errMsg)
      }
    })
  }
  useEffect(() => {
    getData()
  }, [projectId])
  return (
   <Pagecount bgcolor="transparent" pd="0">
    <WrapDiv>
      <Titlelayout title="定额预警" > 
        <div className="fl">
          <div style={{display:'flex',alignItems:'center'}}>{'能耗剩余<='}
            <InputNumber  addonAfter={'%'} style={{width:'120px',marginLeft:'16px'}}
            value={dataList?.energyRemain} keyboard step='0.1' min="0" onChange={onChange}
            max="100" stringMode/></div>
          <div>是否预警 &nbsp;<Switch className="sw" checkedChildren="是" unCheckedChildren="否"
           checked={dataList?.enable} onChange={changeSwitch}/></div>
          </div>
       
      </Titlelayout>
      </WrapDiv>
    </Pagecount>
  )
}
