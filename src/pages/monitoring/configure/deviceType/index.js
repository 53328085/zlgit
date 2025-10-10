import React, { useEffect, useMemo, useState } from 'react'
import CustContext from '@com/content.js'
import Pagecount from '@com/pagecontent'
import { Monitoring } from '@api/api.js'
import style from './style.module.less'
import GateWay from './gateway'
import Electric from './electric'
import Water from './water'
import Fire from './fire'
import Sensor from './sensor'
import Transform from './transform'
import Video from './video'
import Energy from './energy'
import Circuit from './circuit' // 断路器
import Hotwate from './hotWate' // 热水
import Steam from './steam' // 蒸汽
import Coal from './coal' // 煤炭
import Fuel from './fuel' // 燃油
import Shock from './shock' //触点
import Fiber from './fiber' //光纤
import DCScreen from './dcScreen' //直流屏
import OutgoingCabinet from './outgoingCabinet' //出线柜
import PowerQualityAnalyzer from './powerQualityAnalyzer' //电能质量分析仪
import Flowmeter from './flowmeter' //流量计
import Microcomputer from './microcomputer' //微机保护
import AirConditioning from './airConditioning' //空调
import Pv from './pv'
import { message } from 'antd'
export default function Index() {
  const [value, setvalue] = useState('0')
  const [tabs, setTabs] = useState([{ key: '0', label: '网关类型', }])
  const { DeviceTypeManager: { AllDeviceStyle } } = Monitoring;



  let dataProps = {
    value,
    setvalue,
    tabs,
    tabwidth: "120px",
    tabgap: 8,
  };
  let Coms = [
    <GateWay />,
    <Electric />,
    <Water />,
    <Fire />,
    <Sensor />,
    <Transform />,
    <Video />,
    <Hotwate />,
    <Steam />,
    <Coal />,
    <Fuel />,
    <Energy />,
    <Circuit />,
    <Shock />,
    <Fiber />,
    <DCScreen />,//直流屏[暂时没有涉及]
    <OutgoingCabinet />,//出线柜
    <PowerQualityAnalyzer />,//电能质量分析仪
    <Flowmeter />,//流量计
    <Pv />, //光伏设备类型
    <Microcomputer />, //微机保护
    <AirConditioning />, //空调
    <Electric />,//路灯控制器
    <Electric />,//智能控制
    
  ]
  const getAllDeviceStyle = async () => {
    try {
      const result = await AllDeviceStyle()
      const { data, errMsg, success } = result;
      if (success) {
        if (Array.isArray(data)) {
          console.log(59, data)
          let arr = data.map(item => {
            if (item.state === 1) {
              return {
                key: `${item.deviceStyle}`,
                label: `${item.name}类型`
              }
            }

          })
          let list = arr.filter(it => it)
          console.log(69, arr)
          list.unshift({ key: '0', label: '网关类型' })
          console.log(list)
          setTabs(list)
          dataProps = { ...dataProps, list }
          console.log(dataProps)
        }
      } else {
        message.error(errMsg)
      }
    } catch (e) { console.log(e) }

  }
  // const emptyarr = new Array(4).fill(<></>)

  useEffect(() => {
    getAllDeviceStyle()
  }, [])

  return (
    <CustContext.Provider value={dataProps}>
      <Pagecount>
        {Coms[Number(value)]}
      </Pagecount>
    </CustContext.Provider>

  )
}
