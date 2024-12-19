import React, { useEffect, useState } from 'react'
import styled, {css} from 'styled-components'
import { useNavigate, useOutletContext } from "react-router-dom";
import { message } from 'antd'
import Icard from './card'
import { useSelector } from 'react-redux'
import imgurl from './images/index.js'
import breaker from './images/breaker.png'
import chu from './images/chu.svg'
import guang from './images/guang.svg'
import { Monitoring } from '@api/api.js'

import { selectProjectId, selectOneLevelDefaultId, adaptation,themeColor } from '@redux/systemconfig.js'
import Pagecount from '@com/pagecontent'

import {isLightColor} from "@com/usehandler"
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
.cardItem{
      // width: 404px;
       height: 124px;
       // background-color: #fff;
       // border: 1px solid rgb(215, 215, 215);
       background-color: ${props => props.theme.primaryderived || '#ffffff'};

        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
      //  background-image: url(${Bgi});
        background-size: 100% 100%;
        position: relative;
        cursor: pointer;
        padding: 12px 12px 12px 24px;
        column-gap: 12px;
        .cardImgBox{
            width: 64px;
            height: 64px;
         
            background-color: ${props => props.theme.primaryderived || '#ffffff'}; // var(--ant-primary-color) ;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .cardImg{
            width: 40px;
            // height: 40px;
            // border: 2px solid #fff;
            // margin-left: 24px;
            // background-color: #237ae4;
            //  border-radius: 50%;
        }
        .ItemValue{
            flex: auto;
            text-align: left;
            .valueTitle{
                font-size: 14px;
                color: ${props => props.islight ? "#333" : "#fff"} ;
            }
            .valueData{
                //margin-top: 10px;
                font-size: 28px;
                color: ${props => props.islight ? "#515151" : "#fff"} ;
            }
        }
        .boxCard{
            flex: auto;
            height: 112px;
           
            background-color: rgba(242, 242, 242, 0.75);
            border: 1px solid rgb(228,228,228);
            display: flex;
           
            justify-content: space-around;
            flex-direction: column;
            padding: 16px;
            p{
               
                display: flex;
            align-items: center;
            justify-content: space-between;
            span{
             
            }
            .on{
              color: ${props => props.theme.successColor || '#52c41a'};
              font-size: 14px;
            }
            .off{
              color: ${props => props.theme.warningColor || '#faad14'};
              font-size: 14px;
            }
            }
        }
    }
    .orderData{
        width: 400px;
        height: 96px;
        background-color: #fff;
        border: 1px solid rgb(215, 215, 215);
        border-radius: 4px;
        display: flex;
        align-items: center;
        .orderItem{
            width: 133px;
            height: 85px;
            border-right: 1px dashed #d7d7d7;
            display: flex;
            flex-direction: column;
            align-items: center;
            &:nth-child(3){
                border: none;
            }
            .itemTitle{
                font-size: 14px;
                color: ${props => props.islight ? "#333" : "#fff"};
            }
            .waitOrder, .duringOrder, .waitInspection{
                background-repeat: no-repeat;
                background-size: 100% 100%;
                width: 48px;
                height: 48px;
                line-height: 48px;
                text-align: center;
                font-size: 24px;
                color: #fff;
                margin-top: 10px;
            }
        }
    }

`

export default function Index() {
  const navigate = useNavigate();
  const projectId = useSelector(selectProjectId)
  let areaId = useSelector(selectOneLevelDefaultId)
  let {laptop} = useSelector(adaptation)

  let {primaryderived} = useSelector(themeColor)
  
  let islight = isLightColor(primaryderived)
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
      <Mainbox laptop={laptop} islight={islight}>
        <Icard img={imgurl.device} title={'设备总数'} value={allCount} key="device"  />
        {MonitoringData?.map((item) => (
          <div onClick={() => toDevicePage(item.meterType)}>
            <Icard img={item.imageUrl} title={item.name} value={item.count} 
            isShow={true} on={'在线'} off={'离线'} per={'在线率'} onValue={item.onlineCount}
            offValue={item.offlineCount} perValue={item.onlineRate} isRed={true} isGreen={true} isredE={false} after="%" key={item.meterType} />
          </div>))}
      </Mainbox>
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
