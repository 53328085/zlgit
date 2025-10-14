import React, { useEffect, useState } from 'react'
import styled, {css} from 'styled-components'
import { useNavigate, useOutletContext } from "react-router-dom";
import { message } from 'antd'
import Icard from './card'
import { useSelector } from 'react-redux'
import imgurl from './images/index.js'
import { Monitoring } from '@api/api.js'
import {CustTransO, i18t, i18warning} from "@com/useButton"
import { selectProjectId, selectOneLevelDefaultId, adaptation,themeColor } from '@redux/systemconfig.js'
import Pagecount from '@com/pagecontent'
import CommItem from "@com/commItem"
import {isLightColor, isObject} from "@com/usehandler"
import Bgi from "./images/bgi.png"
const sty =css`
grid-template-columns: repeat(auto-fill, minmax(304px, 1fr));
`
const Mainbox =styled.div`
display: grid;
grid-template-columns: repeat(auto-fill, minmax(404px, 1fr));
    justify-content: space-between;
   
gap: 16px;
${props=> props.laptop ? sty : null}


`

export default function Index() {
  const navigate = useNavigate();
  const projectId = useSelector(selectProjectId)
  let areaId = useSelector(selectOneLevelDefaultId)
  let {laptop} = useSelector(adaptation)

  let {primaryderived} = useSelector(themeColor)  
  const statusAttribute = [
    {
      meterType: 0,
      imageUrl: imgurl.gateway,
      name: i18t("comm","gateway"),
    }, {
      meterType: 1,
      imageUrl: imgurl.ele,
      name: i18t("comm","energyMeter"),
    }, {
      meterType: 2,
      imageUrl: imgurl.water,
      name:i18t("comm","coldWaterMeter"),
    }, {
      meterType: 3,
      imageUrl: imgurl.device,
      name: i18t("comm","gasMeter"),
    }, {
      meterType: 4,
      imageUrl: imgurl.chuan,
      name:i18t("comm","sensor"),
    }, {
      meterType: 5,
      imageUrl: imgurl.bian,
      name: i18t("comm","transformer"),
    }, {
      meterType: 6,
      imageUrl: imgurl.monitor,
      name:i18t("comm","monitor"),
    }, {
      meterType: 7,
      imageUrl: imgurl.hotWater,
      name: i18t("comm","hotWaterMeter"),
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
      imageUrl: imgurl.breaker,
      name:i18t("comm","breaker"),
    }, {
      meterType: 13,
      imageUrl: imgurl.chu,
      name: '触点测温',
    }, {
      meterType: 14,
      imageUrl: imgurl.guang,
      name: '光纤测温',
    }, {
      meterType: 15,
      imageUrl: imgurl.device,
      name: '直流屏',
    }, {
      meterType: 16,
      imageUrl:imgurl.device,
      name: '出线柜',
    }, {
      meterType: 17,
      imageUrl: imgurl.device,
      name: '电能质量分析仪',
    }, {
      meterType: 18,
      imageUrl: imgurl.flowmeter,
      name:i18t("comm","flowmeter"),
    },{
      meterType: 20,
      imageUrl: imgurl.mic,
      name: '微机保护',
    },
    {
      meterType: 21,
      imageUrl: imgurl.aircotrl,
      name: '空调控制',
    },
    {
      meterType: 22,
      imageUrl: imgurl.light,
      name: '路灯控制',
    },
    {
      meterType: 23,
      imageUrl: imgurl.device,
      name: '智能控制',
    },
  ]

  

  let [allCount, setAllCount] = useState(0)
  const [MonitoringData, setMonitoringData] = useState([]);
  const { Runtime: { RuntimeStatusGroup, RuntimeQueryMonthUsage } } = Monitoring
  const getStatusData = () => {//在线情况 
    RuntimeStatusGroup({ projectId, areaId }).then(res => {
      let { success, data } = res
      if (success && isObject(data)) {
        setAllCount(data.allCount)
        let datas = []
        if(Array.isArray(data.statusItems) && data.statusItems?.length > 0) {
         datas =  data.statusItems.map((item1) => {
            let item2 = statusAttribute.find((item) => item.meterType == item1.meterType);
            return {
              ...item1,
              ...item2,
            };
          })           
        }

        setMonitoringData(datas) 
        console.log(datas)
      } else {        
         if(!success) message.error(res.errMsg)
      }
    }).catch(e => {
      console.log(e)
    })
  }
  
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
      <Mainbox laptop={laptop} >
      <CommItem  img={imgurl.device} title={i18t("overview","total")} value={allCount} key="device" />       
        {(MonitoringData?.length >  0) && MonitoringData?.map((item) => (
          <div onClick={() => toDevicePage(item.meterType)} key={item.meterType}>
            <CommItem img={item.imageUrl} title={item.name} value={item.count} 
          //   devicename={item.name}
            isShow={true} on={i18t("overview","online")} off={i18t("overview","offline")} per={i18t("overview","rate")} onValue={item.onlineCount}
            offValue={item.offlineCount} perValue={item.onlineRate} isRed={true} isGreen={true} isredE={false} after="%"  />
          </div>))}
      </Mainbox>
    </Pagecount>
  )
}
