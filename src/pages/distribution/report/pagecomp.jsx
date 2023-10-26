import moment from 'moment'
import React,{useContext} from 'react'
import styled from 'styled-components'
import CusContext from '@com/content'

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
export default function pagecomp({title="配电监控管理平台 ",time=moment().format('YYYY-MM月'),children}) {

  const {active,datevalue} = useContext(CusContext)
  const dates = active===1?moment(datevalue).format('YYYY-MM月'):moment(datevalue).format('YYYY年')
  return (
    <PageDiv>
      <div className="headercss">
        <div>{title}</div>
        <div>本期报告分析周期为：{dates}</div>
      </div>
      <div className='contentcss'>
      {children}
      </div>
  
    </PageDiv>
  )
}
 
   