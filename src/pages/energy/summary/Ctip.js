import React from 'react'
import styled from 'styled-components'
import { Typography } from 'antd'
const { Text } = Typography
const Box = styled.div`
 && {
  position: absolute;
  width: 1152px;
  left: 32px;
  bottom: 32px;
  display: grid;
  column-gap: 32px;
  grid-template-columns: ${props => `repeat(${props.n}, 160px)`};
  overflow-x: auto;
 }
`
const Itemsty = styled.div`
&& {
  width: 160px;
  height: 272px;
  background-color: rgba(0, 102, 255, 0.556);
  box-sizing: border-box;
  border: 1px solid rgba(0, 153, 204, 1); 
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  color: #e4e4e4;
  p {
    text-align: center;
  }
  .num {
    color: #fff;
  }
  .monthElectric{
    border-bottom: 1px dotted #eeeeee;
    width: 144px;
  }
  .itemtitle {
    font-size: 18px;
    color:#fff;
    font-weight: bold;
  }
  .sub {
    font-size: 12px;
   
  }

   .ant-typography.ant-typography-ellipsis{
    font-size: 18px;
    color: #fff;
  }
  .percentage{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 8px;
    width: 160px;
    color: #fff;
  }
}

`
const Item = ({ data }) => {
  return (
    <Itemsty>
      <div className='monthElectric'>
        <p className='itemtitle'><Text ellipsis={{ tooltip: data.name }}>{data.name}</Text></p>
        <p className='sub'>本月用电(kWh)</p>
        <p className='num'><Text ellipsis={{ tooltip: data.e }}>{data.e}</Text></p>
      </div>

      <p className='sub'>本月分时用电占比</p>
      <div className='percentage'>
        <p className='type'>尖 {data.e1}</p>
        <p className='num'>{data.e1Percent}</p>
      </div>
      <div className='percentage'>
        <p className='type'>峰 {data.e2}</p>
        <p className='num'>{data.e2Percent}</p>
      </div>
      <div className='percentage'>
        <p className='type'>平 {data.e3}</p>
        <p className='num'>{data.e3Percent}</p>
      </div>
      <div className='percentage'>
        <p className='type'>谷 {data.e4}</p>
        <p className='num'>{data.e4Percent}</p>
      </div>
      <div className='percentage'>
        <p className='type'>深谷 {data.e5}</p>
        <p className='num'>{data.e5Percent}</p>
      </div>
    </Itemsty>

  )
}

export default function Index({ areaVos }) {
  if (!Array.isArray(areaVos) || areaVos?.length == 0) return null;
  let n = areaVos?.length
  return (
    <Box n={n}>
      {
        areaVos.map(d => <Item data={d} key={d.areaId} />)
      }
    </Box>
  )
}
