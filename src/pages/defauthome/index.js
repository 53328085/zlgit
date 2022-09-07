import React from 'react'
import {Layout} from 'antd'
import styled from 'styled-components';
import Icard from './card'

const Divbox = styled.div`
 // flex: 1;
  height: max-content;
 //  min-height: 0;
   display: grid;
   grid-template-columns: repeat(4, 456px);
   grid-template-rows: repeat(2, 200px) 416px;
   gap: 16px;
   background-color: #135abd;
   padding: 24px;
  
  `


export default function DefaultHome(){
  return (
   
      <Divbox> 
         <Icard custTitle={'公司信息'} />
         <Icard custTitle={'今日告警'} />
         <Icard custTitle='工单信息' />
         <Icard custTitle='最新告警' />
         <Icard custTitle={'用电量'} />
         <Icard custTitle={'用水量'} />
         <Icard custTitle={'用燃气量'} />
         <Icard custTitle={'碳排放量'} />
         <Icard custTitle={'月度能耗趋势'} height={'417px'} />
         <Icard custTitle={'实时负荷率'} height={'417px'} />
         <Icard custTitle={'报警分布'} height={'417px'} />
         <Icard custTitle={'分时能量分析'} height={'417px'} />
      </Divbox>
    
  )
}
