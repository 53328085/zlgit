import React, { useState, useEffect, useRef, useMemo } from 'react'

import { useNavigate, useOutletContext } from 'react-router-dom'
import { useSelector } from "react-redux"

import { message, Typography, Badge, Empty, Timeline, Carousel } from 'antd'


import { isObject } from "@com/usehandler"
import Pagecount from "@com/pagecontent";

import Titlelayout from "@com/titlelayout";
import Cempty from '@com/useEmpty'
import { themeColor } from '@redux/systemconfig.js'
import { Tabsbox } from "@com/comstyled"
import { Mainbox, Station, CTimeline } from "./style"
import { tabs } from './data'
import { Power, Income, Dischange, Topology } from "./comm"
import { useQuerySiteInfo, useQueryStorageWarning } from './api'
import imgurl from './imgs'
import { Paramscontext } from './context'
const { Link, Paragraph, Text } = Typography



export default function Index() {
  const [tabvalue, setTabvalue] = useState(1)
  let { exparams } = useOutletContext()

  let { areaId, stationName, projectId } = exparams
  const [title, siteId] = useMemo(() => {
    return [`${stationName?.label}(${stationName?.value})`, stationName?.value]
  }, [stationName])

  let { islight } = useSelector(themeColor)

  const navigate = useNavigate()
  const [cardData, setCardData] = useState(null)//卡片数据
  const [warningData, setWarningData] = useState([])//最新告警

  const getsiteData = async () => {
    try {
      let { data, success } = await useQuerySiteInfo({ siteId, projectId, areaId })
      if (success && isObject(data)) {
        setCardData(data)
      } else {
        setCardData({})
      }
    } catch (error) {

    }
  }
  const getwarningData = async () => {
    try {
      let { data, success } = await useQueryStorageWarning({ siteId, projectId, areaId })
      if (success && Array.isArray(data)) {
        setWarningData(data)
      } else {
        setWarningData({})
      }
    } catch (error) {

    }

  }

  useEffect(() => {
    if ([siteId, areaId, projectId].every(item => Number.isInteger(parseInt(item)))) {
      getsiteData()
      getwarningData()
    }

  }, [siteId, areaId, projectId])


  const Comm = {
    1: Power,
    2: Income,
    3: Dischange,

  }[tabvalue]



  const toPage = (key, label) => {
    navigate(`/index/runtimeStorage/${key}`, {
      state: { type: 'index', primary: 'runtimeStorage', title: label, nested: key }
    })
  }



  const ontabChange = (e) => {
    setTabvalue(e)

  }
  return (
    <Pagecount pd={0} bgcolor='transparent'  >
      <Mainbox>
        <Paramscontext.Provider value={{ areaId, stationName, projectId }}>
          <div className="left">
            <Topology />
          </div>
          <div className="right">
            <div className="rightup">
              <Titlelayout title={title} layout="flex" pv="16px">
                <Station>
                  <div className='imgbox'>
                    <img src={cardData?.image || imgurl["bg"]} alt="" className='img' />
                  </div>
                  <div className="right">
                    <div className="part">
                      <div className='value'>{cardData?.storageCapacity}</div>
                      <div className='label'>安装容量(kWh)</div>
                    </div>
                    <div className="part">
                      <div className='value'>{cardData?.runtimeChargeP}</div>
                      <div className='label'>装机功率(kW)</div>
                    </div>
                    <div className="info">
                      <div className='text'><Badge status="processing" /><div className='label'><span>地</span>址</div><span className='value'>{cardData?.address}</span></div>
                      <div className='text'><Badge status="processing" /><div className='label'>投运时间</div><span className='value'>{cardData?.useDate}</span></div>

                    </div>
                  </div>
                </Station>
              </Titlelayout>
              <Titlelayout title='最新告警' extra={<Link underline onClick={() => toPage('alarmMessage', '告警信息')}>查看详情</Link>} pv="16px 16px 0 16px" layout="flex" >

                <CTimeline>
                  <Carousel vertical={true} autoplay style={{ height: 168 }} dots={false} >
                    {
                      warningData?.map?.((item, index) => <Timeline.Item key={item.sn} dot={<Badge status={{ 1: 'error', 1: 'warning', 2: 'default' }[item.level]}></Badge>} >
                        <div className="content">
                          <div className="title">
                            <div className='time'>{item?.warningTime?.slice?.(11)}</div>
                            <Typography.Paragraph ellipsis={{ tooltip: item?.alarmEvent }} className="name">{item?.alarmEvent}</Typography.Paragraph>
                            <Typography.Text type={{ 1: 'danger', 1: 'warning', 2: 'secondary' }[item.level]} style={{ marginLeft: "auto" }}>
                              {
                                new Intl.NumberFormat("zh-Hans-CN-u-nu-hanidec").format(item.level)
                              }级告警</Typography.Text>
                          </div>
                          <div className="des">{item?.name}</div>
                        </div>
                      </Timeline.Item>)
                    }
                  </Carousel>
                </CTimeline>
              </Titlelayout>
            </div>
            <div className="rightdown">
              <Tabsbox defaultActiveKey={1} items={tabs} onChange={ontabChange} />
              <div className="chartbox">
                <Comm />
              </div>
            </div>
          </div>
        </Paramscontext.Provider>
      </Mainbox>
    </Pagecount>

  )
}
