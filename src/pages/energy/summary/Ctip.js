import React from 'react'
import styled from 'styled-components'
import {Typography} from 'antd'
const {Text} = Typography
const Box =styled.div`
 && {
    position: absolute;
    left: 32px;
    bottom: 32px;
    display: grid;
    column-gap: 32px;
    grid-template-columns: ${props => `repeat(${props.n}, 140px)`};
    overflow-y: auto;
 }
`
const Itemsty = styled.div`
 && {
      width: 140px;
      height: 180px;
      background-color: rgba(0, 102, 255, 0.56);
     box-sizing: border-box;
      border: 1px solid #0099cc; 
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      padding: 8px;
      p {
        text-align: center;
      }
      .itemtitle {
        font-size: 24px;
        color:#fff;
        margin-bottom: 16px;
      }
      .sub {
        font-size: 12px;
        color: #d7d7d7;
      }
  
       .ant-typography.ant-typography-ellipsis{
        font-size: 18px;
        color: #fff;
      }
 }

`
const Item =({data}) => {
   return (
      <Itemsty>
         <p className='itemtitle'>{data.areaName}</p>
         <p className='sub'>今日能耗(kWh)</p>
          <p className='num'><Text ellipsis={{tooltip: data.todayElectricConsume }}>{data.todayElectricConsume}</Text></p>
          <p className='sub'>本月能耗(kWh)</p>
          <p className='num'><Text ellipsis={{tooltip: data.curMonthElectricConsume }}>{data.curMonthElectricConsume}</Text></p>
      </Itemsty>

   )
}

export default function Index({areaVos}) {
  if(!Array.isArray(areaVos) || areaVos?.length == 0)  return null;
  let n = areaVos?.length
  return (
    <Box n={n}>
        {
            areaVos.map(d =>  <Item data={d} key={d.areaId}/>)
        }
    </Box>
  )
}
