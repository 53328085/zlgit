import React, { Fragment, useState, useEffect, useRef } from "react";
import style from './style.module.less'
import {useSelector} from 'react-redux'
import styled from "styled-components";
import {systemConfigInfo, selectProjectId} from '@redux/systemconfig.js'
import Usetable from '@com/useTable'
import { Descriptions } from "antd";
import logo from './images/logo.png'
import firstPage from './images/firstPage.png'
import { Monitoring } from '@api/api.js'

const { RuntimeStatus } = Monitoring.Runtime
const DesItem = styled(Descriptions)`
&& {
 .ant-descriptions-item-label {
   height: 30px;
   padding: 0 16px;
   background-color: transparent;
   color:#515151;
   text-align: center;
 }
 .ant-descriptions-item-content {
   height: 30px;
   color:#515151;
   padding: 0 16px;
   text-align: center;
 }
 .ant-descriptions-title {
   font-weight: normal;
   color:#515151;
 }
}
`
let columns = [
    {
        title: '设备类型',
        dataIndex: 'type',
        key: 'type',
    },
    {
        title: '设备总数',
        dataIndex: 'count',
        key: 'count',
    },
    {
        title: '在线设备',
        dataIndex: 'online',
        key: 'online',
    },
    {
        title: '离线设备',
        dataIndex: 'offline',
        key: 'offline',
    },
    {
        title: '在线率',
        dataIndex: 'rate',
        key: 'rate',
        render: (text) => `${text}%`
    },
]
let columns2 = [
    {
        title: '总计',
        dataIndex: 'count',
        key: 'count',
        render: (_, r) => {
           return   Object.values(r).reduce((c, p) => c+p, 0)
            
        }
    },
    {
        title: '网关',
        dataIndex: 'gatewayCount',
        key: 'gatewayCount',
    },
    {
        title: '电表',
        dataIndex: 'electricMeterCount',
        key: 'electricMeterCount',
    },
    {
        title: '水表',
        dataIndex: 'waterMeterCount',
        key: 'waterMeterCount',
    },
    {
        title: '断路器',
        dataIndex: 'breakerCount',
        key: 'breakerCount',
    },
    {
        title: '传感器',
        dataIndex: 'sensorCount',
        key: 'sensorCount',
    },
    {
        title: '监控',
        dataIndex: 'cameraCount',
        key: 'cameraCount',
    },
]


export default function PageList({reportData}) {
    
    const {chineseTitle} =useSelector(systemConfigInfo)
    const projectId = useSelector(selectProjectId)
    const [reptdata, setRepdata] = useState({})
    let dataSource = [
        {type: '网关', count: reptdata.gatewayCount, online: reptdata.gatewayOnlineCount, offline: reptdata.gatewayOfflineCount, rate: reptdata.gatewayOnlineRate},
        {type: '电表', count: reptdata.electricMeterCount, online: reptdata.electricMeterOfflineCount, offline: reptdata.electricMeterOfflineCount, rate: reptdata.electricMeterOnlineRate},
        {type: '水表', count: reptdata.waterMeterCount, online: reptdata.waterMeterOfflineCount, offline: reptdata.waterMeterOfflineCount, rate: reptdata.waterMeterOnlineRate},
        {type: '断路器', count: reptdata.sensorCount, online: reptdata.sensorOfflineCount, offline: reptdata.sensorOfflineCount, rate: reptdata.sensorOnlineRate}
    ]

    let counts =[
        {
            gatewayCount: reptdata.gatewayCount,
            electricMeterCount: reptdata.electricMeterCount,
             waterMeterCount: reptdata.waterMeterCount,
            breakerCount: reptdata.breakerCount,
             sensorCount: reptdata.sensorCount,
             cameraCount: reptdata.cameraCount
        }
    ]
    const getData = async () => {
        try {
         let {success, data} = await RuntimeStatus({projectId: projectId, areaId: 0})
         if(success && data) {
            setRepdata({...data})

         }else {
            setRepdata({})
         }
        } catch (error) {
            console.log(error)
        }
        
    }
    const Header = () => {
        return (
            <div className={style.pageHeader}>
                <span>{chineseTitle}</span>
                <span className={style.subTitle}>用户分析报告</span>
            </div>
        )
    }
    useEffect(() => {
       getData()


    }, [])


    return (
        <Fragment>
            {!!reportData?<div className={style.report}>
                <div  id='contentPage'>
                <div className={style.firstPage} >
                    <div className={style.header}>
                        <img src={logo} className={style.logo}></img>
                        <span>{chineseTitle}</span>
                    </div>
                    <div className={style.mainTitle}>运行监控报告</div>

                    <div className={style.mainDetail} >

                        <div className={style.detailItem}>项目名称: <span style={{ marginLeft: 18 }}>{reportData.projectName}</span></div>
                        <div className={style.detailItem}>项目地址: <span style={{ marginLeft: 18 }}>{reportData.projectAddress}</span></div>
                        <div className={style.detailItem}>报告日期: <span style={{ marginLeft: 18 }}>{reportData.Date}</span></div>
                    </div>
                    <img src={firstPage} className={style.backgroundImg}></img>
                </div>
                 <div>
                    <div className={style.pages} >
                        <Header></Header>
                        <div className={style.pageContent}>

                                <DesItem title="1.项目概况" bordered size='small' layout="horizontal" column={1}>
                                    <DesItem.Item label="项目名称">{reportData.projectName}</DesItem.Item>
                                    <DesItem.Item label="站点地址">{reportData.projectAddress}</DesItem.Item>
                            </DesItem> 
                            <Usetable dataSource={counts} columns={columns2} size="small" title={() => "2.设备统计"}></Usetable>
                            <Usetable dataSource={dataSource} columns={columns} size="small" title={() => "3.在线率统计"}></Usetable>
                        </div>
                    </div>

                
                </div>
                </div>
            </div>  
            : <div className={style.report}><div className={style.firstPage} >
                    <div className={style.header}>
                        <img src={logo} className={style.logo}></img>
                        <span>{chineseTitle}</span>
                    </div>
                    <div className={style.mainTitle}>运行监控报告</div>
                    <div className={style.mainDetail} >
                        <div className={style.detailItem}>项目名称: <span style={{ marginLeft: 18 }}></span></div>
                        <div className={style.detailItem}>项目地址: <span style={{ marginLeft: 18 }}></span></div>
                        <div className={style.detailItem}>报告日期: <span style={{ marginLeft: 18 }}></span></div>
                    </div>
                    <img src={firstPage} className={style.backgroundImg}></img>
                </div></div>
                }

        </Fragment>
    )
}