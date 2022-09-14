import React, {useState, useRef, useEffect} from 'react'
import {Form, Radio, Button, Progress } from 'antd'
import styled from 'styled-components'
import UserSearch from '@com/useSerach'
import CustContext from '@com/content.js'
import Pagecontent from '@com/pagecontent/maincontent'
import {drawEcharts} from '@com/useEcharts'
import { data } from 'browserslist'
import Titlelayout from '@com/titlelayout'
import { ConsoleSqlOutlined } from '@ant-design/icons'
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
  grid-template-rows: minmax(576px, 1fr) 432px;
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
    row-gap: 16px;
  }
`
const Custspan = styled.span`
  font-size: 14px;
  color: #515151;
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
export default function Index() {
  const ref = useRef()
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


  useEffect(() => {   
    drawEcharts(ref.current, {dataset,  series: [{ type: 'bar' }, { type: 'bar' }]})
  }, [dataset])
  const changeTime = ({target: {value}}) => {
    console.log(value)
     if (value === 'day') setDataset((data) => ({...data, ...datasetDay}))
     if (value == 'month') setDataset((data) => ({...data, ...datasetMonth}))
     if (value == 'year') setDataset((data) => ({...data, ...datasetYear}))
  }
  const Title = ({title, subtitle}) => {
     return  (<Custspan className='t'>{title}<span>{subtitle}</span></Custspan>)
  }
 const propgress = (percent, successPrercent) => {
  console.log(percent)
  console.log(successPrercent)
  return percent +"%"
 }
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
          <div>
             
          </div>
     </div>
     <div className='down'>
       <Titlelayout title={<Title title="年度能耗指标" subtitle='吨标煤'/>}  extra={<Ebutton>能耗正常</Ebutton>} >
           <Progress type="line" strokeWidth={24} percent={30} format={propgress} />
       </Titlelayout>

     </div>

    </Laybox>
    </CustContext.Provider>
  )
}
