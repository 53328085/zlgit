import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import style from './style.module.less'
import { message } from 'antd'
import Icard from './card'
import { useSelector } from 'react-redux'
import imgurl from './images/index.js'
import breaker from './images/breaker.png'
import chu from './images/chu.svg'
import guang from './images/guang.svg'
import { Monitoring } from '@api/api.js'
import Ichart from '@com/useEcharts/Ichart';
import Titlelayout from '@com/titlelayout';
import { selectProjectId, selectOneLevelDefaultId } from '@redux/systemconfig.js'
import Pagecount from '@com/pagecontent'
import { useNavigate, useOutletContext } from "react-router-dom";
export default function Index() {
  const navigate = useNavigate();
  const projectId = useSelector(selectProjectId)
  let areaId = useSelector(selectOneLevelDefaultId)
  let { exparams } = useOutletContext()
  // let [areaId, setAreaId] = useState(0)
  const statusAttribute = [
    {
      meterType: 0,
      imageUrl: imgurl.gateway,
      name: '网关',
      // deviceCount: 0,
      // onlineCount: 0,
      // offlineCount: 0,
      // onlineRate: '0%',
    }, {
      meterType: 1,
      imageUrl: imgurl.ele,
      name: '电表',
    }, {
      meterType: 2,
      imageUrl: imgurl.water,
      name: '冷水表',
    }, {
      meterType: 3,
      imageUrl: imgurl.gas,
      name: '燃气表',
    }, {
      meterType: 4,
      imageUrl: imgurl.chuan,
      name: '传感器',
    }, {
      meterType: 5,
      imageUrl: imgurl.bian,
      name: '变压器',
    }, {
      meterType: 6,
      imageUrl: imgurl.monitor,
      name: '监控',
    }, {
      meterType: 7,
      imageUrl: imgurl.device,
      name: '热水表',
    }, {
      meterType: 8,
      imageUrl: imgurl.device,
      name: '蒸汽',
    }, {
      meterType: 9,
      imageUrl: imgurl.device,
      name: '煤炭',
    }, {
      meterType: 10,
      imageUrl: imgurl.device,
      name: '燃油',
    }, {
      meterType: 11,
      imageUrl: imgurl.device,
      name: '储能设备',
    }, {
      meterType: 12,
      imageUrl: breaker,
      name: '断路器',
    }, {
      meterType: 13,
      imageUrl: chu,
      name: '触点测温',
    }, {
      meterType: 14,
      imageUrl: guang,
      name: '光纤测温',
    }
  ]

  // let series = [{ type: "line" }]
  // const [eoptions, setEptions] = useState({   //用电量
  //   series,
  //   dataset: {}
  // })

  // const [woptions, setWptions] = useState({   //用水量
  //   series,
  //   dataset: {}
  // })

  let [allCount, setAllCount] = useState(0)
  const [MonitoringData, setMonitoringData] = useState([]);
  const { Runtime: { RuntimeStatusGroup, RuntimeQueryMonthUsage } } = Monitoring
  const getStatusData = () => {//在线情况
    return RuntimeStatusGroup({ projectId, areaId }).then(res => {
      let { success, data } = res
      if (success) {
        setAllCount(data.allCount)
        setMonitoringData(data?.statusItems?.map((item1) => {
          let item2 = statusAttribute.find((item) => item.meterType == item1.meterType);
          return {
            ...item1,
            ...item2,
          };

        }))

      } else {
        message.error(res.errMsg)
      }
    }).catch(e => {
      console.log(e)
    })
  }
  // const getMonthUsage = (type) => {//月用量
  //   return RuntimeQueryMonthUsage({ projectId, areaId, type }).then(res => {
  //     let { success, data } = res
  //     if (success) {
  //       if (data) {
  //         let { eleConsumes = [], waterConsumes = [] } = data
  //         let edataset = {
  //           dimensions: [
  //             { name: 'name', type: 'time' },
  //             { name: "value", displayName: '用电量(kWh)' },
  //           ],
  //           source: eleConsumes,
  //         }
  //         let wdataset = {
  //           dimensions: [
  //             { name: 'name', type: 'time' },
  //             { name: 'value', displayName: '用水量(m³)' },
  //           ],
  //           source: waterConsumes,
  //         }
  //         setEptions({ ...eoptions, dataset: edataset, xAxis: { axisLabel: { interval: 'auto' } } })
  //         setWptions({ ...woptions, dataset: wdataset, xAxis: { axisLabel: { interval: 'auto' } } })
  //       }

  //     } else {
  //       message.error(res.errMsg)
  //     }
  //   }).catch(e => {
  //     console.log(e)
  //   })
  // }
  const toDevicePage = (meterType) => {   
    if (meterType == 6) {
      navigate(`/index/runtimeMonitor/camera`, {
        state: {
          type: 'index', primary: 'runtimeMonitor', title: '视频监控', nested: 'camera'
        }
      })

    } else if (meterType == 0) {
      navigate(`/index/runtimeMonitor/gateway`, {
        state: {
          type: 'index', primary: 'runtimeMonitor', title: '网关监测', nested: 'gateway'
        }
      })
    } else {
       let currdeviceStyle = `deviceStyle_${projectId}`
      window.localStorage.setItem(currdeviceStyle, meterType);
      navigate(`/index/runtimeMonitor/point`, {
        state: {
          type: 'index', primary: 'runtimeMonitor', title: '设备监测', nested: 'point', meterType
        }
      })
    }
  }
  useEffect(() => {
    if (Number.isFinite(areaId) && Number.isFinite(projectId)) {
      getStatusData()
      // getMonthUsage(1)
    }
  }, [areaId, projectId])
  return (
    <Pagecount pd="0" bgcolor="transparent">
      <div className={style.cardList}>
        <Icard img={imgurl.device} title={'设备总数'} value={allCount} key="device" />
        {MonitoringData?.map((item) => (
          <div onClick={() => toDevicePage(item.meterType)}><Icard img={item.imageUrl} title={item.name} value={item.count}
            isShow={true} on={'在线'} off={'离线'} per={'在线率'} onValue={item.onlineCount}
            offValue={item.offlineCount} perValue={item.onlineRate} isRed={true} isGreen={true} isredE={false} after="%" key={item.meterType} />
          </div>))}
      </div>
      {/* <div className={style.content}>
        <Titlelayout title="月度用电量（kWh）" layout="flex" key="electric">
          <div className='flex'>
            <Ichart {...eoptions} />
          </div>
        </Titlelayout>
        <Titlelayout title="月度用水量（(m³)）" layout="flex" key="water">
          <div className='flex'>
            <Ichart {...woptions} />
          </div>
        </Titlelayout>
      </div> */}
    </Pagecount>
  )
}
