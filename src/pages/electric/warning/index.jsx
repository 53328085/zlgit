import React,{useEffect, useState} from 'react'
import { Form, Select, Button, Checkbox, message } from 'antd'
import WarnContent from './warncontent'
import style from './style.module.less'
import styled,{css} from 'styled-components'
import { useSelector } from 'react-redux'
import total from '../imgs/total.png'
import first from '../imgs/first.png'
import second from '../imgs/second.png'
import third from '../imgs/third.png'
import {warnDetail} from '@api/api'
import {  selectOneLevelDefaultId, selectProjectId,adaptation } from '@redux/systemconfig.js'
import Pagecount from '@com/pagecontent' 
const sty=css`
padding: 0 8px;
font-size: 16px;

 span {
    font-size: 14px;
 }
`
const Diversty = styled.div`
&&{
    border: 1px solid #d7d7d7;
        background: #fff;
        border-radius: 4px;
        display: flex;
        align-items: center;
        padding: 0 16px;
        font-size: 18;
        justify-content: space-evenly;
        span{
            font-size: 16px;
        }
    ${props => props.laptop ? sty : null}
}
`

const Mainbxox = styled.div`
&& {
  flex: 1;
  display: grid;
  grid-template-rows: 94px 1fr ;
  row-gap: 16px;
  .warning {
    display: grid;
    grid-template-columns: repeat(4, 1fr);    //${props => props.laptop ? "repeat(4, 1fr)" : "repeat(4, 320px)"};
    column-gap: 16px;
    height: 94px;
    grid-template-rows: 1fr;
    .item{
      height: inherit;
      background-color: #fff;
      padding: 16px;
      align-items: center;
      column-gap: 16px;
      display: flex;
      border-radius: 8px;
      .itemvalue {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          color: #3E4043;
          font-size: 16px;
          .name{
            padding-right: 1em;
          }
          .num {
            color: #1977FF;
            font-size: 31px;
            
          } 
      }
    }
  }
}
`
export default function Index() {
    const projectId = useSelector(selectProjectId)
    const areaId = useSelector(selectOneLevelDefaultId);
    const {laptop} = useSelector(adaptation);
    const [form] = Form.useForm()
    const [warndata,setWarndata]=useState(null)
    //获取告警
    const warnTotal = async () => {
        let param={
            projectId,
            areaId,
        }
        const res = await warnDetail.QueryWarningStatistics(param)
        if(res.success){
            setWarndata(res.data)
        }else{
            message.error(res.errMsg)
        }
    }
   
    useEffect(()=>{
        
        if(Number.isFinite(areaId)){
            warnTotal() 
        }
       
    },[areaId])
    return (
        <Pagecount bgcolor="transparent" pd="0"> 
           <Mainbxox laptop={laptop}>          
            <div className='warning'>
                <Card count={warndata?.allCnt} />
                <Card png={first} count={warndata?.levelOneCnt} percent={warndata?.levelOneRate} name="一级告警"/>
                <Card png={second} count={warndata?.levelTwoCnt} percent={warndata?.levelTwoRate} name="二级告警"/>
                <Card png={third} count={warndata?.levelThreeCnt} percent={warndata?.levelThreeRate} name="三级告警"/>
            </div>

            <WarnContent style={style} form={form}/>
            </Mainbxox> 
        </Pagecount>
    )
}

let Card = ({ png = total ,count=0,percent,name="告警总数"}) => {
    let per = parseFloat(percent)
    return (
        <div className='item'>
            <img src={png} alt="" />
             <div className='itemvalue'>
                 <div><span className='name'>{name}</span>{ !isNaN(per) ? `${percent}%` : null}</div> 
                 <span className='num'>{count}</span>
             </div>
        </div>
    )
}
