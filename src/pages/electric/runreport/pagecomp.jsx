 import styled from 'styled-components'
import React,{useRef} from 'react'
 import {Descriptions} from 'antd'
import Page from "@com/reportPrint/page"
import Ichart from '@com/useEcharts/Ichart'
import fine from './fine.svg'

const DesItem = styled(Descriptions)`
&&.bgsty {
  .ant-descriptions-item-label {
    background-color: #f60;
    color: #fff;
  }
}
&& {
  margin-bottom: 32px;
 .ant-descriptions-item-label {
   height: 30px;
   padding: 0 16px;
  
   text-align: center;
   min-width: 120px;
   background: transparent;
 }
 .ant-descriptions-item-content {
   height: 30px;
   color:#515151;
   padding: 0 16px;
   text-align: center;
 }
 .ant-descriptions-header {
  margin-bottom: 10px;
 .ant-descriptions-title {
   font-weight: normal;
   color:#515151;
   font-size: 14px;
 }
}
}

`
const Main =styled.div`
   && {
    color: #515151;
    display: flex;
    flex-direction: column;
    flex: 1;
    .title {
       font-size: 14px;
       margin-bottom: 8px;
    }
    .text {
      font-size: 16px;
      text-indent: 2em;
    }
    .suggest {
      display: flex;
      flex:1;
      text-indent: 2.5em;
    }
    .fine {
      display: flex;
      width: 284px;
      height: 64px;
      align-items: center;
      background: url(fine) #237ae4 ;
      background-position: 32px center;
      font-size: 28px;
      padding-left: 32px;
      color: #fff;
      img {
        margin-right: 32px;
      }
    }
   }

`

 
 
export default function pagecomp({data, params}) {
  let {alarmTypeGroup} = data.constructor===Object ? data : {} ;
  let {type} = params?? {}
  let text = type==2 ? '日' : '月'
 
   let epoption = useRef({
    pieData: { data: Array.isArray(alarmTypeGroup) ? alarmTypeGroup : [], total: "100%", radius: '65%', },
    type: 3,
    legend: {
      bottom: 0,
      top: 'auto',
      icon: "circle"
    },
    grid: {
      bottom: 20
    }
  })
 
 
  
 
 

  const labsty = {
     background: "#f60",
     color: "#fff"
  }
  /*
 alarmCnt 报警总数
: 
732
   i 电流
   u 电压
   ir 剩余电流
   t 温度
   smoke
     */
  return (
      <>
      <Page key="a"> 
        <Main> 
      <p  className='title'>1.项目概况</p>    
        <DesItem title=""  bordered size='small' column={1}>
          <DesItem.Item label="项目名称">{data.project}</DesItem.Item>
          <DesItem.Item label="项目地址">{data.address}</DesItem.Item>
        </DesItem> 
        <p  className='title'>2.电气安全详情</p> 
        <DesItem title=""  bordered size='small' layout="vertical" column={3} className="bgsty">
          <DesItem.Item label="总报警次数" labelStyle={labsty}>{data.alarmCnt}</DesItem.Item>
          <DesItem.Item label="最大电量">{data.iMaxContent}</DesItem.Item>
          <DesItem.Item label="最大电压">{data.uMaxContent}</DesItem.Item>
          <DesItem.Item label="剩余电流">{data.irMaxContent}</DesItem.Item>
          <DesItem.Item label="最高温度">{data.tMaxContent}</DesItem.Item>
          <DesItem.Item label="烟雾报警">{data.smokeAlarmCnt}</DesItem.Item>
        </DesItem> 
        <p  className='title'>2.1告警类型分布</p> 
        <div style={{flex: 1, display: 'flex', flexDirection: "column"}}>              
              <Ichart {...epoption.current}  tip={`${data.project}${text}告警类型分布`} />
         </div>
         </Main> 
      </Page>
      <Page key="b">
        <Main>
            <p  className='title'>3.电量监控</p> 
            <DesItem title=""  bordered size='small' column={1}>
              <DesItem.Item label="最大电流发生时间">{data.iMaxTime}</DesItem.Item>
              <DesItem.Item label="最大电流发生位置">{data.iMaxAddress}</DesItem.Item>
              <DesItem.Item label="最大电流值">{data.iMaxContent}</DesItem.Item>
            </DesItem> 
            <p  className='title'>4.电压监控</p> 
            <DesItem title=""  bordered size='small' column={1}>
              <DesItem.Item label="最大电压发生时间">{data.uMaxTime}</DesItem.Item>
              <DesItem.Item label="最大电压发生位置">{data.uMaxAddress}</DesItem.Item>
              <DesItem.Item label="最大电压值">{data.uMaxContent}</DesItem.Item>
            </DesItem> 
            <p  className='title'>5.剩余电流监控</p> 
            <DesItem title=""  bordered size='small' column={1}>
              <DesItem.Item label="最大剩余电流发生时间">{data.irMaxTime}</DesItem.Item>
              <DesItem.Item label="最大剩余电流发生位置">{data.irMaxAddress}</DesItem.Item>
              <DesItem.Item label="最大剩余电流值">{data.irMaxContent}</DesItem.Item>
            </DesItem> 
            <p  className='title'>6.温度监控</p> 
            <DesItem title=""  bordered size='small' column={1}>
              <DesItem.Item label="最高温度发生时间">{data.tMaxTime}</DesItem.Item>
              <DesItem.Item label="最高温度发生位置">{data.tMaxAddress}</DesItem.Item>
              <DesItem.Item label="最高温度值">{data.tMaxContent}</DesItem.Item>
            </DesItem> 
        </Main>
      </Page>
       <Page key="c">
          <Main>
             <p  className='title'>7.本周期用电安全监测综合分析:</p> 
             <div style={{display: 'flex', justifyContent: 'center', alignItems: 'flex-end',   padding: '64px 0px'}}>
                <div className='fine'><img src={fine} height={48} /> <span>良好</span></div> 
             </div> 
             <p className='title'>建议:</p>
             <div  className='suggest'>
                 {data.suggest}
             </div>
          </Main>
       </Page>
      </>
  )
}
 
   