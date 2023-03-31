import moment from 'moment'
import React from 'react'
import styled from 'styled-components'


export default function pagecomp({title="电气安全运行分析报告",time=moment().format('YYYY-MM月'),children}) {
  const PageDiv=styled.div`
  width:562px;
  height:802px;
  margin: 0 auto 24px;
  border: 1px solid #ccc;
  background-color: #fff;
  display:flex;
  flex-direction: column;
 .headercss{
    width: 558px;
    height:36px;
    margin:auto;
    background-color:#237ae4;
    margin-top: 1px;
    display:flex;
    justify-content:space-between;
    color: #fff;
    align-items:center;
    padding:0 6px;
    flex-shrink: 0;
    
 }
 .contentcss{
  padding: 24px;
  flex:1
 }
`
  return (
    <PageDiv>
      <div className="headercss">
        <div>{title}</div>
        <div>本期报告分析周期为：{time}</div>
      </div>
      <div className='contentcss'>
      {children}
      </div>
  
    </PageDiv>
  )
}
 
   