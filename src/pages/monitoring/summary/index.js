import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import style from './style.module.less'
import { message } from 'antd'
import Icard from './card'
import { useSelector } from 'react-redux'
import imgurl from './images/index.js'
import breaker from './images/breaker.png'
import { Monitoring } from '@api/api.js'
import Ichart from '@com/useEcharts/Ichart';
import Titlelayout from '@com/titlelayout';
import { selectProjectId, selectOneLevelDefaultId } from '@redux/systemconfig.js'
import Pagecount from '@com/pagecontent'
const CardList = styled.div`
   
     display: grid;
    grid-template-columns: repeat(4, 404px);
    grid-template-rows: repeat(2, 124px);
    row-gap: 20px;
    justify-content: space-between;
`
export default function Index() {
  const projectId = useSelector(selectProjectId)
  let areaId = useSelector(selectOneLevelDefaultId)
  // let [areaId, setAreaId] = useState(0)
  let [statistics, setStatistics] = useState({})
  let [status, setStatus] = useState({})



  let series = [{ type: "line" }]
  const [eoptions, setEptions] = useState({   //用电量
    series,
    dataset: {}
  })

  const [woptions, setWptions] = useState({   //用水量
    series,
    dataset: {}
  })

  const { Runtime: { RuntimeStatistics, RuntimeStatus, RuntimeQueryMonthUsage } } = Monitoring
  const getData = () => {//设备统计
    return RuntimeStatistics({ projectId, areaId }).then(res => {
      let { success, data } = res
      if (success) {
        setStatistics(data)
      } else {
        message.error(res.errMsg)
      }
    }).catch(e => {
      console.log(e)
    })
  }
  const getStatusData = () => {//在线情况
    return RuntimeStatus({ projectId, areaId }).then(res => {
      let { success, data } = res
      if (success) {
        setStatus(data)
      } else {
        message.error(res.errMsg)
      }
    }).catch(e => {
      console.log(e)
    })
  }
  const getMonthUsage = (type) => {//月用量
    return RuntimeQueryMonthUsage({ projectId, areaId, type }).then(res => {
      let { success, data } = res
      if (success) {
        if (data) {
          let { eleConsumes = [], waterConsumes = [] } = data
          let edataset = {
            dimensions: [
              { name: 'name', type: 'time' },
              { name: "value", displayName: '用电量(kWh)' },
            ],
            source: eleConsumes,
          }
          let wdataset = {
            dimensions: [
              { name: 'name', type: 'time' },
              { name: 'value', displayName: '用水量(m³)' },
            ],
            source: waterConsumes,
          }
          setEptions({ ...eoptions, dataset: edataset, xAxis: { axisLabel: { interval: 'auto' } } })
          setWptions({ ...woptions, dataset: wdataset, xAxis: { axisLabel: { interval: 'auto' } } })
        }

      } else {
        message.error(res.errMsg)
      }
    }).catch(e => {
      console.log(e)
    })
  }
  useEffect(() => {
    if (Number.isFinite(areaId) && Number.isFinite(projectId)) {
      getData()
      getStatusData()
      getMonthUsage(1)
    }
  }, [areaId, projectId])
  return (
    <Pagecount pd="0" bgcolor="transparent">
      <div className={style.cardList}>
        {statistics.deviceCount != 0 ? <Icard img={imgurl.device} title={'设备总数'} value={statistics.deviceCount} key="device" /> : null}
        {statistics.sensorCount != 0 ? <Icard img={imgurl.chuan} title={'传感器数量'} value={statistics.sensorCount} key="chuan" /> : null}
        {statistics.transformerCount != 0 ? <Icard img={imgurl.bian} title={'变压器数量'} value={statistics.transformerCount} key="bian" /> : null}
        {statistics.onlineMonitorCount != 0 ? <Icard img={imgurl.monitor} title={'监控数量'} value={statistics.monitorCount}
          isShow={true} on={'云监控'} off={'本地监控'} per={''} onValue={statistics.onlineMonitorCount}
          offValue={statistics.localMonitorCount} key="monitor" />
          : null}
        {status.gatewayCount != 0 ? <Icard img={imgurl.gateway} title={'网关'} value={status.gatewayCount}
          isShow={true} on={'网关在线'} off={'网关离线'} per={'在线率'} onValue={status.gatewayOnlineCount}
          offValue={status.gatewayOfflineCount} perValue={status.gatewayOnlineRate} isRed={true} isGreen={true} isredE={false} after="%" key="gateway" />
          : null}
        {status.electricMeterCount != 0 ? <Icard img={imgurl.ele} title={'电表'} value={status.electricMeterCount}
          isShow={true} on={'电表在线'} off={'电表离线'} per={'电表告警'} onValue={status.electricMeterOnlineCount}
          offValue={status.electricMeterOfflineCount} perValue={status.electricMeterAlarmCount} isRed={true} isGreen={true} isredE={true} key="ele" />
          : null}
        {status.waterMeterCount != 0 ? <Icard img={imgurl.water} title={'水表'} value={status.waterMeterCount}
          isShow={true} on={'水表在线'} off={'水表离线'} per={'在线率'} onValue={status.waterMeterOnlineCount}
          offValue={status.waterMeterOfflineCount} perValue={status.waterMeterOnlineRate} isRed={true} isGreen={true} isredE={false} after="%" key="water" />
          : null}
        {status.breakerCount != 0 ? <Icard img={breaker} title={'断路器'} value={status.breakerCount}
          isShow={true} on={'断路器在线'} off={'断路器离线'} per={'在线率'} onValue={status.breakerOnlineCount}
          offValue={status.breakerOfflineCount} perValue={status.breakerOnlineRate} isRed={true} isGreen={true} isredE={false} after="%" key="breaker" />
          : null}
        {/*   <Icard img={imgurl.gas} title={'燃气表'} value={status.gasCount}
          isShow={true} on={'燃气表在线'} off={'燃气表离线'} per={'在线率'} onValue={status.gasOnlineCount}
          offValue={status.gasOfflineCount} perValue={status.gasOnlineRate} isRed={true} isGreen={true} isredE={false} after="%" /> */}
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
