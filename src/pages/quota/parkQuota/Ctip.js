import React, {useState} from 'react'
import styled from 'styled-components'
import {Typography, Progress} from 'antd'
import { useTranslation } from "react-i18next"

const {Text} = Typography
const Box =styled.div`
 && {
    position: absolute;
    left: 16px;
    bottom: 32px;
    display: grid;
    column-gap: 16px;
    grid-template-columns: ${props => `repeat(${props.n}, 160px)`};
    max-width: 1304px;
   overflow-x:auto;
 }
`
const Itemsty = styled.div`
 && {
      width: 160px;
      height: 232px;
      background-color: rgba(255, 255, 255, 0.69); 
      border-radius: 5px;
      display: flex;
      flex-direction: column;
      padding:2px;  
      .itemtitle {
        font-size: 14px;
        color:#fff;
        text-align:center;
        margin-bottom:10px;
      }
      .sub {
        font-size: 14px;
        color: ${props=> props.theme.bgcolorfont};
        margin-left:10px;
        white-space: pre-wrap;
        word-wrap: break-word;
      }
  
       .ant-typography{
        font-size: 16px;
        color:${props=> props.theme.bgcolorfont};
        margin-left:10px;
      }
      .progressColor{
        .ant-progress-text{
          color: rgba(255, 0, 0, 1);
        }
        
      }
 }`
  const Item = ({ data }) => {
    const [quotaWarning, setQuotaWarning] = useState(20);
    const { t } = useTranslation("quota")
    //  status 0 正常 1 预警
    return (
      <Itemsty>
        <p className='itemtitle' style={{ backgroundColor: `${ data.status > 0 ? 'rgba(255, 0, 0, 1)' :'rgba(0, 204, 51, 1)' }` }}>{data.areaName}</p>
        <p className='sub'>{t("EnergyConsumptionQuota")} (kWh)</p>
        <p className='num'><Text ellipsis={{ tooltip: data.todayElectricConsume }}>{data.areaQuotaValue}</Text></p>
        <p className='sub'>{t("AccumulatedEnergyConsumption")} (kWh)</p>
        <p className='num'><Text ellipsis={{ tooltip: data.curMonthElectricConsume }}>{data.areaConsumptionValue}</Text></p>
        <p className='sub'>{t("RemainingQuota")} (kWh)</p>
        <p className='num'><Text ellipsis={{ tooltip: data.curMonthElectricConsume }}>{data.areaRemainValue}</Text></p>
        <p className='sub'>{t("RemainingQuota")}</p>
        <Progress
          percent={parseFloat(data.areaRemainRate)}
          className={`${data.status==0 ? '' : 'progressColor'}`}
          trailColor='#ebeef5'
          strokeColor={`${data.status==0 ? 'rgba(0, 204, 51, 1)' : 'rgba(255, 0, 0, 1)'}`}
          style={{ marginLeft: 10, width: 100 }} />
      </Itemsty>

    )
  }
 
export default function Index({areaVos}) {
  if(!Array.isArray(areaVos) || areaVos?.length == 0)  return null;
  let n = areaVos?.length
  return (
    <Box n={n}>
        {
            areaVos.map(d =>  <Item data={d} key={d.quotaAreaId}/>)
        }
    </Box>
  )
}