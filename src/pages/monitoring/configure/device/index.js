import React, { useEffect, useState } from 'react'
import CustContext from '@com/content.js'
import Pagecount from '@com/pagecontent'
import GateWay from './gateway'
import Electric from './electric'
import Water from './water'
import Fire from './fire'
import Sensor from './sensor'
import Transform from './transform'
import Video from './video'
import HotWater from './hotwater'
import Generic from './Generic' // 新增加的设备类型通用
import Circuit from './Circuit'
import Shock from './shock'
import Fiber from './fiber'
import Flowmeter from './flowmeter' //流量计
import Microcomputer from './microcomputer' //微机保护
import AirConditioning from './airConditioning' //空调
import Light from './light' //空调
import IntelligentControl from './intelligentControl' //智能控制
import Pv from './pv' //光伏设备
import { Monitoring } from '@api/api.js'
import { message } from 'antd'
const { DeviceTypeManager: { AllDeviceStyle, }, DeviceManager: { OneLevel } } = Monitoring

export default function Index() {
  const [value, setvalue] = useState('0')

  const [Coms, setComs] = useState([
    <GateWay />,
  ])
  const [tabs, setTabs] = useState([
    { key: '0', label: '网关' },
  ])
  let dataProps = {
    value,
    setvalue,
    tabs,
    tabwidth: "120px",
    tabgap: 8,
  }


  const getAllDeviceStyle = async () => {
    const resp = await AllDeviceStyle()
    if (resp.success && Array.isArray(resp.data)) {
      const data = resp.data
      let arr = [<GateWay />]

      for (let k of data) {
        if (k.deviceStyle === 1) {
          arr[1] = <Electric deviceStyle={k.deviceStyle} />
        } else if (k.deviceStyle === 2) {
          arr[2] = <Water deviceStyle={k.deviceStyle} />
        }
        else if (k.deviceStyle === 3) {
          arr[3] = <Fire deviceStyle={k.deviceStyle} />
        } else if (k.deviceStyle === 4) {
          arr[4] = <Sensor deviceStyle={k.deviceStyle} />
        } else if (k.deviceStyle === 5) {
          arr[5] = <Transform deviceStyle={k.deviceStyle} />
        } else if (k.deviceStyle === 6) {
          arr[6] = <Video deviceStyle={k.deviceStyle} />
        }else if (k.deviceStyle === 7) {
          arr[7] = <HotWater deviceStyle={k.deviceStyle} />
        } else if (k.deviceStyle > 7) {
          let i = Number(k.deviceStyle)
          i == 12 ? arr[i] = <Circuit deviceStyle={k.deviceStyle} name={k.name} /> :
            i == 13 ? arr[i] = <Shock deviceStyle={k.deviceStyle} name={k.name} /> :
              i == 14 ? arr[i] = <Fiber deviceStyle={k.deviceStyle} name={k.name} /> :
                i == 18 ? arr[i] = <Flowmeter deviceStyle={k.deviceStyle} name={k.name} /> :
                i == 19 ? arr[i] = <Pv deviceStyle={k.deviceStyle} name={k.name} /> :
                  i == 20 ? arr[i] = <Microcomputer deviceStyle={k.deviceStyle} name={k.name} /> :
                    i == 21 ? arr[i] = <AirConditioning deviceStyle={k.deviceStyle} name={k.name} /> :
                      i == 22 ? arr[i] = <Light deviceStyle={k.deviceStyle} name={k.name} /> :
                        i == 23 ? arr[i] = <IntelligentControl deviceStyle={k.deviceStyle} name={k.name} /> :
                          arr[i] = <Generic deviceStyle={k.deviceStyle} name={k.name} key={k.deviceStyle} />
        }
      }

      const tabs = data.map(it => {
        if (it.state === 1) {
          return { key: it.deviceStyle.toString(), label: it.name }
        }

      })

      //   console.log(tabs)
      // tabs.pop()
      setTabs([{ key: '0', label: '网关' },
      ...tabs
      ])

      setComs([...arr])

    }
  }
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
