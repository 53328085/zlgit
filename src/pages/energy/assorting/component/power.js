import React from 'react'
import {Power} from "../style"
import  {Typography} from 'antd'
import {CaretUpOutlined, CaretDownOutlined} from '@ant-design/icons'
const {Text} = Typography
export default function Index({data, date,energytype,active,idx}) {   
    let { lastDayPeriodValue, lastMonthPeriodValue, lastYearPeriodValue,mom, yoy,unit } = data;
    let past=['',lastDayPeriodValue, lastMonthPeriodValue, lastYearPeriodValue][date]
    let current = ['', '今日','本月','本年'][date]+['','用电量',"用水量","用气量"][energytype]+ "("+unit+")"
    let pastmsg = ['', '昨日','上月','上年'][date]+['','用电量',"用水量","用气量"][energytype]+ "("+unit+")"
  const currentitem = active==idx ? "active" : ""
  return (
    <Power>
        <div className="powerUp">
            <div className="title">{data?.name}</div>
            <div className="contentwrap"> 
                <div className='content'>
                    <Text className='num' ellipsis={{tooltip: data?.periodValue}}>{data?.periodValue }</Text>
                    <span className='sub'> {current}</span> 
                    </div>
            </div>
        </div>
        <div className={`powerDown ${currentitem}`}>
            <div className='label'>
            {pastmsg}
            </div>
            <Text className="value" ellipsis={{tooltip: past}}>
                 {past}
            </Text>
            <div className="label">
             环比
            </div>
            <div className="value">
           {parseFloat(mom) > 0 ? <CaretUpOutlined style={{color:"rgba(255, 96, 33, 1)"}} /> : <CaretDownOutlined style={{color:"rgba(67, 198, 111, 1)"}} />} {mom}
            </div>
            <div className="label">
             同比
            </div>
            <div className="value">
            {parseFloat(yoy) > 0 ? <CaretUpOutlined style={{color:"rgba(255, 96, 33, 1)"}} /> : <CaretDownOutlined style={{color:"rgba(67, 198, 111, 1)"}} />} {yoy}
            </div>
        </div>

    </Power>
  )
}
