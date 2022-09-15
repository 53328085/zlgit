import React, {useState, useRef, useEffect} from 'react'
import {nanoid} from '@reduxjs/toolkit'
import {Form, Radio, Button, Progress, Image, Card} from 'antd'
import styled from 'styled-components'
import UserSearch from '@com/useSerach'
import CustContext from '@com/content.js'
import Pagecontent from '@com/pagecontent/maincontent'
import {drawEcharts} from '@com/useEcharts'

import Titlelayout from '@com/titlelayout'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'
import imgurl from './icon'
const {Group, Button: Rbutton} = Radio
const Groupbox = styled(Group)`
  position: absolute;
  top:20px;
  right: 20px;
  z-index: 2;
`
const RadioBt = styled(Rbutton)`
  width: 64px;
  &:first-of-type{
    border-radius: 16px 0 0 16px;
  }
  &:last-of-type{
    border-radius: 0 16px 16px 0;
  }
`
const Laybox = styled.div`
  display: grid;
  grid-template-rows: minmax(576px, 1fr) 272px;
  row-gap: 16px;
  flex:1;
  .top {
     display: grid;
     grid-template-columns: 1264px 400px;
     column-gap: 16px;
      .topleft {
        display: grid;
        grid-template-rows: 48px minmax(512px, auto);
        row-gap: 16px;
      }
  }
  .down {
    display: grid;
    grid-template-columns: 432px repeat(6,192px);
    column-gap: 16px;
  }
`
const Custspan = styled.span`
  font-size: 14px;
  color: #515151;
  display: flex;
  justify-content: ${props => props.jc ? 'flex-start' : 'space-between' };
  span{
    color: #999;
    padding-left: 1em;
  }
`
const Ebutton = styled(Button)`
 &, &:hover {height: 32px;
  border: 1px solid #80cc80;
  background-color: #ccffb3;
  color: #339900;
  line-height: 32px;
  font-size: 14px;
  padding-top: 0;
  padding-bottom: 0;
  width: 96px;
 }
`
const Divbox = styled.div`
  display: grid;
  grid-template-columns: 40% 1fr;
  column-gap: 16px;
  margin: 16px 0 40px 0;
  .list {
    display: grid;
    grid-auto-rows: 40px;   
    align-items: flex-end;
    .item {
      display: flex;
      justify-content: space-between;
       span:first-child {
        color: #999;
        font-size: 14px;
      }
        span:last-child {
        color: #515151;
        font-size: 16px;
      }
    }
  }
`
const UDbox = styled.div`
  display: grid;
  grid-template-rows: 64px 1fr;
  row-gap: 16px;
  margin-top: 16px;
  justify-items: center;
  .list {
    display: grid;
    grid-template-rows: repeat(4, 40px);
    justify-self: stretch;
    align-content: flex-end;
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
       span:first-child {
        color: #999;
        font-size: 14px;
      }
        span:last-child {
        color: #515151;
        font-size: 16px;
      }
    }
  }
`
export default function Index() {
  const ref = useRef()
  const pieref = useRef()
  const [form] = Form.useForm()
  const [value, setvalue] = useState('1')
  const tabs = [
    {label: '综合能耗', key: '1' },
    {label: '电', key: '2' },
    {label: '水', key: '3' },
    {label: '燃气', key: '4' },
    {label: '煤炭', key: '5' }
  ]
  const datasetDay = {
    dimensions: ['time', '今日能耗(吨标煤)', '昨日能耗(吨标煤)' ],
    source: [    
      {time: '00:00', '今日能耗(吨标煤)': 56, '昨日能耗(吨标煤)': 96},
      {time: '00:01', '今日能耗(吨标煤)': 46, '昨日能耗(吨标煤)': 36},
      {time: '00:02', '今日能耗(吨标煤)': 36, '昨日能耗(吨标煤)': 46},
      {time: '00:03', '今日能耗(吨标煤)': 56, '昨日能耗(吨标煤)': 96},
      {time: '00:04', '今日能耗(吨标煤)': 56, '昨日能耗(吨标煤)': 36},
      {time: '00:05', '今日能耗(吨标煤)': 46, '昨日能耗(吨标煤)': 36},
      {time: '00:06', '今日能耗(吨标煤)': 36, '昨日能耗(吨标煤)': 46},
      {time: '00:07', '今日能耗(吨标煤)': 50, '昨日能耗(吨标煤)': 26},
      {time: '00:08', '今日能耗(吨标煤)': 66, '昨日能耗(吨标煤)': 26},
      {time: '00:09', '今日能耗(吨标煤)': 58, '昨日能耗(吨标煤)': 56},
      {time: '00:10', '今日能耗(吨标煤)': 46, '昨日能耗(吨标煤)': 76},
      {time: '00:11', '今日能耗(吨标煤)': 18, '昨日能耗(吨标煤)': 26},
    ]
  }
  const datasetMonth = {
    dimensions: ['time', '本月费用(万元)', '上月费用(万元)' ],
    source: [    
      {time: '9-1', '本月费用(万元)': 5600, '上月费用(万元)': 9600},
      {time: '9-2', '本月费用(万元)': 4600, '上月费用(万元)': 3644},
      {time: '9-3', '本月费用(万元)': 3600, '上月费用(万元)': 4644},
      {time: '9-4', '本月费用(万元)': 5611, '上月费用(万元)': 9655},
      {time: '9-5', '本月费用(万元)': 5644, '上月费用(万元)': 3677},
      {time: '9-6', '本月费用(万元)': 4677, '上月费用(万元)': 3633},
      {time: '9-7', '本月费用(万元)': 3688, '上月费用(万元)': 4655},
      {time: '9-8', '本月费用(万元)': 5088, '上月费用(万元)': 2644},
      {time: '9-9', '本月费用(万元)': 6677, '上月费用(万元)': 2641},
      {time: '9-10', '本月费用(万元)': 5866, '上月费用(万元)': 5641},
      {time: '9-11', '本月费用(万元)': 4677, '上月费用(万元)': 7645},
      {time: '9-12', '本月费用(万元)': 1877, '上月费用(万元)': 2645},
    ]
  }
  const datasetYear = {
    dimensions: ['time', '本年费用(万元)', '上年费用(万元)' ],
    source: [    
      {time: '1月', '本年费用(万元)': 56000, '上年费用(万元)': 96000},
      {time: '2月', '本年费用(万元)': 46000, '上年费用(万元)': 36000},
      {time: '3月', '本年费用(万元)': 36000, '上年费用(万元)': 46000},
      {time: '4月', '本年费用(万元)': 56000, '上年费用(万元)': 96000},
      {time: '5月', '本年费用(万元)': 56000, '上年费用(万元)': 36000},
      {time: '6月', '本年费用(万元)': 46000, '上年费用(万元)': 36000},
      {time: '7月', '本年费用(万元)': 36000, '上年费用(万元)': 46000},
      {time: '8月', '本年费用(万元)': 50000, '上年费用(万元)': 26000},
      {time: '9月', '本年费用(万元)': 66000, '上年费用(万元)': 26000},
      {time: '10月', '本年费用(万元)': 58000, '上年费用(万元)': 56000},
      {time: '10月', '本年费用(万元)': 46000, '上年费用(万元)': 76000},
      {time: '12月', '本年费用(万元)': 18000, '上年费用(万元)': 26000},
    ]
  }
 
  const [dataset, setDataset] = useState(datasetDay)
  const pieData = [
        { value: 30, name: '电' },
        { value: 25, name: '水' },
        { value: 25, name: '燃气' },
        { value: 20, name: '煤炭' },
  ]

  useEffect(() => {   
    drawEcharts(ref.current, {dataset,  series: [{ type: 'bar' }, { type: 'bar' }]})
    drawEcharts(pieref.current, {pieData: {data: pieData, total: 100}, type: 3})
  }, [dataset, pieData])
  const changeTime = ({target: {value}}) => {   
     if (value === 'day') setDataset((data) => ({...data, ...datasetDay}))
     if (value == 'month') setDataset((data) => ({...data, ...datasetMonth}))
     if (value == 'year') setDataset((data) => ({...data, ...datasetYear}))
  }
  const Title = ({title, subtitle, jc}) => {
     return  (<Custspan className='t' jc={jc}>{title}<span>{subtitle}</span></Custspan>)
  }
  const testDatas = [
      {
        title: '能耗总量',
        sub: '(吨标煤)',
        cmonth: 200.21,
        smonth: 180.52,
        hb: 8.21,
        tb: 10.21,
        icon: 'z08'
      },
      {
        title: '碳排放量',
        sub: '(吨CO2)',
        cmonth: 200.21,
        smonth: 180.52,
        hb: 8.21,
        tb: 10.21,
        icon: 'z07'
      },
      {
        title: '用电量',
        sub: '(kWh)',
        cmonth: 200.21,
        smonth: 180.52,
        hb: 8.21,
        tb: 10.21,
        icon: 'z06'
      },
      {
        title: '用水量',
        sub: '(m3)',
        cmonth: 200.21,
        smonth: 180.52,
        hb: 8.21,
        tb: 10.21,
        icon: 'z05'
      },
      {
        title: '用燃气量',
        sub: '(m3)',
        cmonth: 200.21,
        smonth: 180.52,
        hb: 8.21,
        tb: 10.21,
        icon: 'z04'
      },
      {
        title: '耗煤量',
        sub: '(吨)',
        cmonth: 200.21,
        smonth: 180.52,
        hb: 8.21,
        tb: 10.21,
        icon: 'z01'
      }
  ]

  return (
    <CustContext.Provider value={{form, names: ['RegioId', 'BuildingId', 'FloorId'], tabs, value, setvalue}}>
    <Laybox>
     <div className='top'>
         <div className='topleft'>
           <UserSearch></UserSearch>
           <Pagecontent>
             <Groupbox defaultValue="day" buttonStyle="solid" size="middle" onChange={changeTime}>
                <RadioBt value="day">本日</RadioBt>
                <RadioBt value="month">本月</RadioBt>
                <RadioBt value="year">本年</RadioBt>              
              </Groupbox>
              <div ref={ref} style={{flex: 1, position: 'relative'}}>
              </div>
           </Pagecontent>
         </div>
          <Titlelayout title={<Title title="能耗总量" />} >
          <Divbox>
              <div style={{display: 'flex', flexDirection: 'column', justifyContent:'flex-end', alignItems:'center'}}>
                 <Image src={imgurl.z08} preview={false} width={80} height={80} />
                 <span style={{color:"#999", marginTop: '10px'}}>(吨标煤)</span>
              </div>
            
              <div className='list'>
                 <div className='item'>
                   <span>今日能耗：</span>
                   <span>1.23</span>
                 </div>
                 <div className='item'>
                   <span>昨日能耗：</span>
                   <span>1.54</span>
                 </div>
                 <div className='item'>
                   <span>同比</span>
                   <span>-1.54%<ArrowDownOutlined style={{color:"#f00"}} /></span>                
                 </div>
                 <div className='item'>
                   <span>环比</span>
                   <span>+1.54%<ArrowUpOutlined style={{color:"#f00"}} /></span>                  
                 </div>
              </div>
            </Divbox> 
             <Titlelayout type="inner" title={<Title title="能耗占比" />} style={{padding: '0px', border: 'none'}}>
                <div style={{width: '368px', height: '284px'}} ref={pieref}>

                </div>

             </Titlelayout>
          </Titlelayout>
     </div>
     <div className='down'>
       <Titlelayout title={<Title title="年度能耗指标" subtitle='吨标煤' jc={true}/>}  extra={<Ebutton>能耗正常</Ebutton>} >
          
           <Divbox>
             <Image src={imgurl.z02} preview={false} width={64} height={64} />
              <div className='list'>
                 <div className='item'>
                   <span>本年度定额能</span>
                   <span>2000.00</span>
                 </div>
                 <div className='item'>
                   <span>本年累计使用</span>
                   <span>1500.00</span>
                 </div>
                 <div className='item'>
                   <span>本年剩余额度</span>
                   <span>500.00</span>
                 </div>
              </div>
            </Divbox> 
           <Progress type="line" strokeWidth={24} percent={30} />
       </Titlelayout>
       {
        testDatas.map(item => (
          <Titlelayout title={<Title title={item.title} subtitle={item.sub} />} key={nanoid()}>
             <UDbox>
              <Image src={imgurl[item.icon]} preview={false} width={64} height={64} />
               <div className='list'>
                  <div className='item'>
                    <span>本月</span>
                    <span>{item.cmonth}</span>
                   </div>
                   <div className='item'>
                    <span>上月</span>
                    <span>{item.smonth}</span>
                   </div>
                   <div className='item'>
                    <span>环比</span>
                    <span>+{item.hb}% { <ArrowUpOutlined style={{color:"#f00"}} />}</span>
                   
                   </div>
                   <div className='item'>
                   <span>同比</span>
                   <span>+{item.tb}% { <ArrowUpOutlined style={{color:"#f00"}} />}</span>                 
                   </div>
               </div>
             </UDbox>
          </Titlelayout>
        ))
       }
     </div>

    </Laybox>
    </CustContext.Provider>
  )
}
