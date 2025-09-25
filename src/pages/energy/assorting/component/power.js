import React from 'react'
import {Power} from "../style"
import  {Typography} from 'antd'
import {CaretUpOutlined, CaretDownOutlined} from '@ant-design/icons'
const {Text} = Typography
export default function Index() {
  return (
    <Power>
        <div className="powerUp">
            <div className="title">全部用电</div>
            <div className="contentwrap"> 
                <div className='content'>
                    <Text className='num'>12233333</Text>
                    <span className='sub'>今日用电量(kWh)</span> 
                    </div>
            </div>
        </div>
        <div className="powerDown">
            <div className='label'>
            昨日用电量(kWh)
            </div>
            <Text className="value">
                123123123
            </Text>
            <div className="label">
             环比
            </div>
            <div className="value">
            <CaretUpOutlined /> -28%
            </div>
            <div className="label">
             同比
            </div>
            <div className="value">
             <CaretDownOutlined/>   +28%
            </div>
        </div>

    </Power>
  )
}
