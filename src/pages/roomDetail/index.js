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
        "ComprehensiveQuota":"0.00", //年度综合定额
        "ComprehensiveQuotaUsed":"0.00",//年度综合定额使用
        "ComprehensiveQuotaLeaved":"0.00",////年度综合定额剩余
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
                    setValues(data[0])
                }else{
                    setValues({
                        "address":"",
                        "energyType":"",
                        "roomName":"",
                        "ComprehensiveQuota":"0.00", //年度综合定额
                        "ComprehensiveQuotaUsed":"0.00",//年度综合定额使用
                        "ComprehensiveQuotaLeaved":"0.00",////年度综合定额剩余
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
        console.log(123)
        runQuery()
    },[type])

    

    const energyData = {
      Name:'月度用电',
      Unit:'用电量(kWh)',
      dateList:['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      valueList:[125.36, 125.36, 321.25, 587.36, 258.14, 298.36, 301.32, 428.69, 298.54, 125.96, 189.15, 315.45,],
    };
    const waterData = {
      Name:'月度用水',
      Unit:'用水量(㎡)',
      dateList:['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      valueList:[125.36, 125.36, 321.25, 587.36, 258.14, 298.36, 301.32, 428.69, 298.54, 125.96, 189.15, 315.45,],
    };
    const gasData = {
      Name:'月度用燃气',
      Unit:'用气量(m³)',
      dateList:['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      valueList:[125.36, 125.36, 321.25, 587.36, 258.14, 298.36, 301.32, 428.69, 298.54, 125.96, 189.15, 315.45,],
    };

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
                            <span>房间地址</span><span>{values.address}</span>
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
                                <span className={style.energyData}>{Number(values.ComprehensiveQuota).toFixed(2)}</span>
                            </div>
                            <div className={style.dataList}>
                                <span>已用能耗</span>
                                <span className={style.energyData}>{Number(values.ComprehensiveQuotaUsed).toFixed(2)}</span>
                            </div>
                            <div className={style.dataList}>
                                <span>剩余能耗</span>
                                <span className={style.energyData}>{Number(values.ComprehensiveQuotaLeaved).toFixed(2)}</span>
                            </div>
                        </div>
                        <div className={style.itemData}>
                            <span>能耗剩余</span>
                            <Progress style={{width:'280px'}} 
                            percent={Number(values.ComprehensiveQuota) > 0 ? (Number(values.ComprehensiveQuotaLeaved)/Number(values.ComprehensiveQuota)).toFixed(2) : 0} 
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