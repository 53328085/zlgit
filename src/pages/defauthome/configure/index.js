import React, {useRef, useEffect} from 'react'
import {Image, Timeline} from 'antd'
import {useSelector} from 'react-redux'
import {Liquid} from "@ant-design/charts"
import {selectCurProject} from '@redux/user.js'
import styled from 'styled-components';
import {ExclamationCircleFilled} from '@ant-design/icons'
import Titlelayout from '@com/titlelayout';
import {drawEcharts} from '@com/useEcharts'
import company from '../company.png'
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
   .tips {
    display: flex;
    justify-items: center;
    padding: 16px 0 0 16px;
    color: "#515151"  
   }
  
  `
const Mainbox = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 1fr 248px;
 column-gap: 16px;
 height: 142px;
 align-items: stretch;
 justify-items: center;
 .alarm {
   display: grid;
   grid-template-rows: repeat(2, 52px);
   row-gap: 16px;
   div {
    padding-left: 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
     &:first-of-type {
      border-left: 2px solid #f8857d;
     }
     &:last-of-type {
      border-left: 2px solid #5d9fff;
     }
   }
 }
 
 .list {
   display: grid;
   grid-template-rows: repeat(4, 26px);
   color: #666;  
   align-items: center;
   row-gap: 8px;   
   padding: 0;
   span {
    line-height: 22px;
    b{
      font-size: 8px;
      padding-right: 1em;
    }
    &:first-child b{
     color: #237Ae4
    }
    &:nth-of-type(2) b {
      color: #325dca
    }
    &:nth-of-type(3) b {
      color: #008000;
    }
    &:last-child {
      
      b {
        color:#333;
      }
    }
   }
 }
`
const Divorder = styled.div`
  display: grid;
  grid-template-columns: 40% 1fr;
  column-gap: 16px;
  grid-template-rows: 126px;
  padding-top: 16px;
  .order {
   text-align: center; 
   p:last-of-type {     
      font-size: 32px;
      color:#515151;
      line-height: 80px;
   }

 }
 .list {
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  align-items: flex-start;
  div {
    display: flex;
    justify-content: space-between;
    &:first-of-type span:first-child{
       color: #ff3333;
    }
    &:nth-of-type(2) span:first-child{
       color: #ff6600;
    }
    &:last-of-type span:first-child{
       color: #009900;
    }
  }
 }
`
const Timelinebox = styled(Timeline)`
 min-height: 142px;
   padding-top: 16px;
  .ant-timeline-item {
    padding-bottom: 8px;
  }
  .title {
    color:#1e1e1e;
  }
  .content {
    font-size: 12px;
    color:#6b6b6b;
  }
`
const Imgbox = styled(Image)`
  position: absolute;
  top: -24px;
`
const fs = {
  hv: '24px',
  fc: '#333'
}
const DemoLiquid = () => {
  const config = {
    percent: 0.4,
    outline: {
      border: 2,
      distance: 2,
    },
    wave: {
      length: 128,
    },
  
      statistic: {
        title: {
          formatter: () => '今日告警',
          style: {
            fontSize: 14,
            color: '#333',
            
          }
        },
        
        content: {
          style: {
            fontSize: 14,
            color: '#fff'
          },
          customHtml: () => {
            return <span>30次</span>
          }
        }
      }
   
  };
  return <Liquid {...config} />;
};
const option = (name, color, type="line") =>  ({
  xAxis: {   
    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月','9月','10月','11月','12月']
  },
  series: [
    {
      data: [150, 230, 224, 218, 135, 147, 460, 224, 218, 135, 147, 460],
      type,
      name 
    }
  ],
  grid:{
    // 图表 grid
    left: "0px",
    right: "0",
    top: "30px",
    bottom: "0px",
    containLabel: true,
  },
  color 
});
const datasetMonth = {
  dimensions: ["time", "2020", "2019"],
  source: [
    { time: "1月", "2020": 5600, "2019": 9600 },
    { time: "2月", "2020": 4600, "2019": 3644 },
    { time: "3月", "2020": 3600, "2019": 4644 },
    { time: "4月", "2020": 5611, "2019": 9655 },
    { time: "5月", "2020": 5644, "2019": 3677 },
    { time: "6月", "2020": 4677, "2019": 3633 },
    { time: "7月", "2020": 3688, "2019": 4655 },
    { time: "8月", "2020": 5088, "2019": 2644 },
    { time: "9月", "2020": 6677, "2019": 2641 },
    { time: "10月", "2020": 5866, "2019": 5641 },
    { time: "11月", "2020": 4677, "2019": 7645 },
    { time: "12月", "2020": 1877, "2019": 2645 },
  ],
};
const tdrawEcharts = (c, option) => {
  return drawEcharts(c, {...option, type:2 })
}
const gauge = {
 
tooltip: {
    trigger: 'item'
  },
  legend: {
    top: 'auto',
    bottom: 0,
    icon: 'none',
    formatter: function (name) {
      return  '本月最大负荷率:89.2% 发生时间： 2022-7-21 12:32:12'; 
    },   
  },
  tooltip: {
    trigger: 'item'
  },
  series: [ 
    {
      title: {

      },
      name: '实时负荷率',
      type: 'gauge',
      progress: {
        show: true
      },
      detail: {
        valueAnimation: true,
        formatter: '{value}'
      },
      data: [
        {
          value: 65.2,
          name: '负荷率%'
        }
      ],
    }
  ]
}
const pieData = [
  { value: 30, name: "组合式电气火灾监测器" },
  { value: 25, name: "智能微断" },
  { value: 25, name: "导轨表" },
  { value: 20, name: "其他" },
];
const pietmData = [
  { value: 30.4, name: "尖占比" },
  { value: 25.7, name: "峰占比" },
  { value: 25.6, name: "平占比" },
  { value: 20.7, name: "谷占比" },
];
export default function DefaultHome(){
  const curProject = useSelector(selectCurProject)
  const eref = useRef(null)
  const wref = useRef(null)
  const gref = useRef(null)
  const cref = useRef(null)
  const mref = useRef(null)
  const guref = useRef(null)
  const wnref = useRef(null)
  const tmref = useRef(null)
  useEffect(() => {
    tdrawEcharts(eref.current, option('用电量', ["#5e92f9"]))
    tdrawEcharts(wref.current, option('用水量', ["#099c9c"]))
    tdrawEcharts(gref.current, option('用燃气量', ["#ff6803"]))
    tdrawEcharts(cref.current, option('碳排放量', ["#5e92f9"], 'bar'))
    drawEcharts(mref.current, {dataset: datasetMonth, series: [{ type: "bar" }, { type: "bar" }],  grid:{
      // 图表 grid
      left: "0px",
      right: "0",
      top: "30px",
      bottom: "0px",
      containLabel: true,
    }, })
    drawEcharts(guref.current,  {...gauge, type: 2})
    drawEcharts(wnref.current,  {pieData: {data: pieData, radius: '75%', },legend: {
      top: 'auto',
      bottom: 0,
    }, type: 3})
    drawEcharts(tmref.current,  {pieData: {data: pietmData, total: 102.4}, type: 3})
  }, [])
  
  return (
   
      <Divbox> 
         <Titlelayout title={'公司信息'}  {...fs}>
          <Mainbox>
              <div className='list'>
                  <span><b>■</b>测点数量：2563</span> 
                  <span><b>■</b>网关数量：2563</span> 
                  <span><b>■</b>张某/135897754</span> 
                  <span><b>■</b>浙江省杭州市滨江区月明路560号 </span> 
              </div>
              <Imgbox src={company} preview={false} width={248} height={168}   />
          </Mainbox>
          </Titlelayout>
         <Titlelayout title={'今日告警'} {...fs}>
        <Mainbox>
          <div style={{width: '112px', height: '112px'}}>
              <DemoLiquid></DemoLiquid>
              
          </div>
          <div className='alarm'>
             <div>
                 <span>未确认 10%</span>
                 <span>3 条</span>
             </div>
             <div>
                 <span>已确认 90%</span>
                 <span>27 条</span>
             </div>
          </div>
        </Mainbox>
         </Titlelayout>
         <Titlelayout title={'工单信息'} {...fs}>
            <Divorder>
               <div className='order'>
                  <p>本月工单数</p>
                  <p>100</p>
               </div>
               <div className='list'>
                   <div>
                      <span>未分派</span>
                      <span>30</span>
                      <span>30.0%</span>
                    </div>  
                    <div>
                      <span>已分派</span>
                      <span>12</span>
                      <span>12.0%</span>
                    </div> 
                    <div>
                      <span>已处理</span>
                      <span>58</span>
                      <span>28.0%</span>
                    </div> 
               </div>
               </Divorder>
         </Titlelayout>
         <Titlelayout title={'最新告警'} {...fs}>
         <Timelinebox>
          <Timeline.Item>
              <div>
                <p className='title'>13:48:55  设备过温</p>
                <p className='content'>正泰物联滨江园区-研发1号楼-12层-401    SN 102362256232</p>
              </div>
          </Timeline.Item>
          <Timeline.Item>
              <div>
                <p className='title'>13:20:23  设备过温</p>
                <p className='content'>正泰物联滨江园区-研发1号楼-12层-403    SN 102362256238</p>
              </div>
          </Timeline.Item>
          <Timeline.Item>
              <div>
                <p className='title'>13:20:23  设备过流</p>
              
              </div>
          </Timeline.Item>         
        </Timelinebox>
           
         </Titlelayout>
         <Titlelayout title={'用电量'} {...fs}>
             <div ref={eref} style={{width: '422px', height: '142px'}}></div>
         </Titlelayout>
         <Titlelayout title={'用水量'} {...fs}>
         <div ref={wref} style={{width: '422px', height: '142px'}}></div>
         </Titlelayout>
         <Titlelayout title={'用燃气量'} {...fs}>
         <div ref={gref} style={{width: '422px', height: '142px'}}></div>
         </Titlelayout>
         <Titlelayout title={'碳排放量'} {...fs}>
         <div ref={cref} style={{width: '422px', height: '142px'}}></div>
         </Titlelayout>
         <Titlelayout title={'月度能耗趋势'} {...fs}>
         <div ref={mref} style={{width: '422px', height: '358px'}}>

         </div>
         </Titlelayout>
         <Titlelayout title={'实时负荷率'} {...fs}>
         <div ref={guref} style={{width: '422px', height: '358px'}}>

          </div>
         </Titlelayout>
         <Titlelayout title={'报警分布'} {...fs}>
         <div ref={wnref} style={{width: '422px', height: '358px'}}>

         </div>
         </Titlelayout>
         <Titlelayout title={'分时电量分析'} {...fs}>
         <div ref={tmref} style={{width: '422px', height: '300px'}}>

         </div>
         <div className='tips'>
           
         <ExclamationCircleFilled style={{color: '#467cfd', fontSize: '32px'}} />  <p style={{paddingLeft: '32px'}}> 当前时段内,峰电量占总电量37%,占比较大。<br/>

            请合理利用峰谷用电。</p>
         </div>
         </Titlelayout>      
      </Divbox>
    
  )
}
