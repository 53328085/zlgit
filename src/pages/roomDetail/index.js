import React, {useState, useEffect} from 'react'
import style from './style.module.less'
import logo from './images/logo.png'
import {Progress, Radio, message} from 'antd';
import BarChart from './barchart';
import Ringchart from './ringchart';
import LineChart from './linechart';
import { useLocation } from 'react-router';
import {useSelector} from 'react-redux'
import {selectProjectId} from '@redux/systemconfig.js'
import { EnergyQuotaRuntime } from '@api/api.js'
import { useRequest } from 'ahooks';

export default function Index(){
    let location = useLocation()
    let search = location.search.substr(1, location.search.length)
    const searchObj = JSON.parse(decodeURI(search))
    let roomId = searchObj.id
    const address = searchObj.areaName + '-' +searchObj.buildingName + '-' + searchObj.roomName
    const comprehensiveQuota = searchObj.comprehensiveQuota || 0
    const comprehensiveQuotaLeaved = searchObj.comprehensiveQuotaLeaved || 0
    const comprehensiveQuotaUsed = parseFloat(comprehensiveQuota) - parseFloat(comprehensiveQuotaLeaved)
    const projectId = useSelector(selectProjectId);
    const { queryQueryRoomDetail } = EnergyQuotaRuntime
    const [type, setType] = useState(1)
    const onChange = val=>{
        setType(val)
    }
    const [values, setValues] = useState({
        "address":"",
        "energyType":"",
        "roomName":"",
        "proportion":[],
        "detail":{
            "x":[],
            "y":[]
        },
        "detailEletric":{
            "x":[],
            "y":[]
        },
        "detailWater":{
            "x":[],
            "y":[]
        },
        "detailGas":{
            "x":[],
            "y":[]
        }
    }) 
    const getroomDetail = () => {
        return queryQueryRoomDetail(projectId, roomId, type).then(res => {
            let { success, data } = res
            if(success){
                if(data){
                    setValues(data)
                }else{
                    setValues({
                        "address":"",
                        "energyType":"",
                        "roomName":"",
                        "proportion":[],
                        "detail":{
                            "x":[],
                            "y":[]
                        },
                        "detailEletric":{
                            "x":[],
                            "y":[]
                        },
                        "detailWater":{
                            "x":[],
                            "y":[]
                        },
                        "detailGas":{
                            "x":[],
                            "y":[]
                        }
                    })
                }
            }else{
                message.error(res.errMsg)
            }
        })
    }
    const { run: runQuery } = useRequest(getroomDetail,{
        manual: true
    })

    useEffect(()=>{
        runQuery()
    },[type])

    return <div className={style.roomDetail}>
        <div className={style.header}>
            <img className={style.logo} src={logo}></img>
            <span className={style.mainTitle}>智慧能源服务管理平台</span>
            <span className={style.subTitle}>房间能耗</span>
        </div>

        <div className={style.content}>
            <div className={style.contentTop}>
                <div className={style.topLeft}>
                    <div className={style.leftItem}>
                        <div className={style.itemTitle}><span>房间基本信息</span></div>
                        <div className={style.itemData}>
                            <span>房间地址</span><span>{address}</span>
                        </div>
                        <div className={style.itemData}>
                            <span>能耗种类</span><span>{values.energyType}</span>
                        </div>
                    </div>
                    <div className={style.leftItem}>
                        <div className={style.itemTitle}><span>能耗指标</span><span className={style.state}>能耗正常</span></div>
                        <div className={style.itemData}>
                            <div className={style.dataList}>
                                <span>定额能耗(吨标煤)</span>
                                <span className={style.energyData}>{Number(comprehensiveQuota).toFixed(2)}</span>
                            </div>
                            <div className={style.dataList}>
                                <span>已用能耗</span>
                                <span className={style.energyData}>{Number(comprehensiveQuotaUsed).toFixed(2)}</span>
                            </div>
                            <div className={style.dataList}>
                                <span>剩余能耗</span>
                                <span className={style.energyData}>{Number(comprehensiveQuotaLeaved).toFixed(2)}</span>
                            </div>
                        </div>
                        <div className={style.itemData}>
                            <span>能耗剩余</span>
                            <Progress style={{width:'280px'}} 
                            percent={Number(comprehensiveQuota) > 0 ? (Number(comprehensiveQuotaLeaved)/Number(comprehensiveQuota)).toFixed(2) : 0} 
                            trailColor='#ebeef5' strokeWidth={20} />
                        </div>
                    </div>
                </div>
                <div className={style.topRight}>
                    <div className={style.itemTitle}>
                        <span>综合能耗</span>
                        <Radio.Group size='middle' style={{marginLeft:'auto',marginRight: 12}} defaultValue={1} buttonStyle="solid" onChange={e =>onChange(e.target.value)}>
                            <Radio.Button value={1}>本日</Radio.Button>
                            <Radio.Button value={2}>本月</Radio.Button>
                            <Radio.Button value={3}>本年</Radio.Button>
                        </Radio.Group>
                    </div>
                    <BarChart barData = { values.detail }></BarChart>
                </div>
            </div>
            <div className={style.contentBottom}>
                <Ringchart ringData = {values.proportion}></Ringchart>
                <LineChart lineData = { values.detailEletric } Unit={'用电量(kWh)'} Name={type==1?'本日用电' : type ==2 ?'月度用电' :'年度用电'}></LineChart>
                <LineChart lineData = { values.detailWater } Unit={'用水量(m³)'} Name={type==1?'本日用水' : type ==2 ?'月度用水' :'年度用水'}></LineChart>
                <LineChart lineData = { values.detailGas } Unit={'用气量(m³)'} Name={type==1?'本日用燃气' : type ==2 ?'月度用燃气' :'年度用燃气'}></LineChart>
            </div>
        </div>
    </div>
}