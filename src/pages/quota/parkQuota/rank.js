import React, {useState} from 'react'
import styled from 'styled-components'
import { useTranslation } from "react-i18next"
import {Progress} from 'antd'
import Titlelayout from '@com/titlelayout';
import Flow from './flow'
const Rankbox=styled.div`
  display: grid;
  flex:1;
  grid-template-rows: 172px minmax(580px, 1fr);
  row-gap: 16px;
  color:#363636;
  //padding-top: 16px;
  .totalNum{
    display: flex;
    justify-content: space-between;
    color: #1b1b1b;
    font-size: 28px;
    .sub{
        font-size: 16px;
        color: #666;
    }
  }
  .nameinfo{
    display: flex;
    justify-content: space-between;
    color: #363636;
    padding-bottom: 4px;
  }
  .rankwrap {
    flex:1;
    display: grid;
    grid-template-rows: 1fr 188px;
    row-gap: 16px;
    padding-top: 16px;
   .ranklist {
    display: flex;
    flex-direction: column;
    row-gap: 16px;
    overflow-y: auto;
  }
}

`
const CProgress = styled(Progress)`
 && {
  .ant-progress-show-info{
    .ant-progress-outer {
      margin-right: 0;
      padding-right: 0;
    }
  
   

  }
  .ant-progress-text {
    position: absolute;
    left: 2em;
    top: 5px;
    font-size: 14px;
    color: ${props => props.percent >= 18 ? '#fff' : '#515151'};
  }
}
`
export default function Index({ parkAnnualQuota=[],  
    quotaRemainRanking}) {
    const { t } = useTranslation("quota")
    const [quotaWarning, setQuotaWarning] = useState(20);
    const park = Array.isArray(parkAnnualQuota) ? parkAnnualQuota : []
  return (
    <Rankbox>
         <Titlelayout title={t("TotalAnnualQuota")}>
          {
            park.map(p => ( 
              <>
            <div className="totalNum" key={p?.quotaAreaId}>
             <span>{p?.areaQuotaValue}</span> <span className='sub'>(kWh)</span></div>
            <div className='nameinfo' ><span>{p?.areaName}</span><span>剩余：{p?.areaRemainValue} kWh</span> </div>
            <CProgress   percent={parseFloat(p?.areaRemainRate)}
              strokeColor={p.status==1 ?'rgba(255, 0, 0, 1)': 'rgba(0, 204, 51, 1)'} trailColor='#ebeef5' strokeWidth={20}   /></>)
            )
         
          }
        </Titlelayout>
        <Titlelayout title={t("QuotaSurplusRanking")} layout="flex" >
            <div className='rankwrap'>
          <div className='ranklist'>
          {
            quotaRemainRanking?.map((item, index) => (
              <div    key={item.quotaAreaId}>
                <div className='nameinfo'><span>{item.areaName}</span><span>剩余：{item.areaRemainValue} kWh</span> </div>
                <CProgress   percent={parseFloat(item?.areaRemainRate)}
                  strokeColor={item.status ==0 ?  'rgba(0, 204, 51, 1)' : 'rgba(255, 0, 0, 1)' } trailColor='#ebeef5' strokeWidth={20}   />
              </div>
            ))}
            </div>
            <Flow /> 
            </div>
        </Titlelayout>
      </Rankbox> 
    
  )
}
