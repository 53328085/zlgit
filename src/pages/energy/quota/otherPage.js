import React, {useState, useEffect} from 'react'
import style from './style.module.less';

import {Button, Progress, message } from 'antd';
import {useSelector} from 'react-redux'
import {selectProjectId} from '@redux/systemconfig.js'
 
import Ichart  from '@com/useEcharts/Ichart';
import area from './img/area-1.png'
import { useRequest } from 'ahooks';
import { EnergyQuotaRuntime } from '@api/api.js'
 

export default function Index(props){
    const [options, setOptions] = useState({
        type: 3,
        pieData: { data: [], total: '100%', radius: ["50%",  "65%"] },
        legend: {
          top: 16,
          orient: 'vertical',
          left: 'left'
        },
        grid: {
          containLabel: true,
          left: 0,
          right: 0,
        }
      })
    const { queryQuotaOverview } = EnergyQuotaRuntime
    const projectId = useSelector(selectProjectId);
    const [itemData, setItemData] = useState({
        areaYearQuota: '0.00',
        areaYearQuotaLeaved:'0.00',
        areaYearQuotaLeavedPercent: 0,
        areaYearQuotaUsed: '0.00',
        buildingQuotas:[],
        buildingConsumeDistribution:[],
        buildingCount:0,
        roomCount: 0
    })
 
    const toMainPage = ()=>{
        props.sendToIndex(false);
    }
    const getOverview = () => {
        return queryQuotaOverview(projectId, props.areaId).then(res => {
            let {success, data} = res
            if(success){
                if(data){
                    let {buildingConsumeDistribution} = data
                    data.areaYearQuotaLeavedPercent = parseFloat(data.areaYearQuotaLeavedPercent)
                    setItemData(data)
                    setOptions({...options, pieData: {
                        ...options.pieData,
                        data: Array.isArray(buildingConsumeDistribution)?buildingConsumeDistribution : []
                       }})
                }
            }else{
                setOptions({...options, pieData: {
                    ...options.pieData,
                    data: []
                   }})
                message.error(res.errMsg || '数据出错')
            }
        })
    }
    const {run: runQuery} = useRequest(getOverview, {
        manual: true
    })

    useEffect(()=> {
        if(props.areaId == 0 || !props.areaId) return;
        runQuery()
    },[props.areaId])

    return (
            <div className={style.content}>
                <div className={style.contentLeft}>
                    <div className={style.item}>
                        <div className={style.itemTitle}>
                            <span>园区项目年度能耗指标</span>
                            <span style={{color:'#999',marginLeft:'auto',marginRight: 0}}>(吨标煤)</span>
                        </div>
                        <div className={style.itemData}>
                            <div className={style.dataItem}>
                                <span className={style.listTitle}>本年定额能耗</span>
                                <span className={style.listValue}>{itemData.areaYearQuota }</span>
                            </div>
                            <div className={style.dataItem}>
                                <span className={style.listTitle}>本年累计使用</span>
                                <span className={style.listValue}>{itemData.areaYearQuotaUsed}</span>
                            </div>
                            <div className={style.dataItem}>
                                <span className={style.listTitle}>本年剩余额度</span>
                                <span className={style.listValue}>{itemData.areaYearQuotaLeaved}</span>
                            </div>
                        </div>
                        <div className={style.progress}>
                            <span className={style.quota}>指标剩余</span>
                            <Progress style={{width:'252px'}} percent={itemData.areaYearQuotaLeavedPercent} trailColor='#ebeef5' strokeWidth={20} />
                        </div>
                    </div>
                    <div className={style.item}>
                        <div className={style.itemTitle}>
                            <span>园区能耗分布</span>
                        </div>
                        <div style={{width:288,height:256, display: 'flex'}}>
                           <Ichart {...options} />
                        </div>
                    </div>
                    <Button type='primary' style={{width: 288, height: 40}} onClick={toMainPage}>查看房间能耗详情</Button>
                </div>
                <div className={style.contentRight}>
                    <img src={area} className={style.area}></img>
                    {/* <div className={style.mask}></div> */}
                    <div className={style.imgData}>
                        <span style={{width: 200, paddingLeft: 16}}>{props.areaName}</span>
                        <span style={{width: 80}}>建筑物</span>
                        <span style={{width: 60}}>{itemData.buildingCount} 幢</span>
                        <span style={{width: 60}}>房间</span>
                        <span>{itemData.roomCount} 间</span>
                    </div>
                </div>
            </div>
       
        
    )
}