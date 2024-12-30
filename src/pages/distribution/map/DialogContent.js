import React, { useEffect, useRef, useState } from "react";
import style from './style.module.less'
import { message, Spin, DatePicker, Button, Table } from 'antd'
import { Monitoring } from '@api/api.js'
import { useReactive } from "ahooks";

import CurrentData from './CurrentData'
import WarningRecord from './WarningRecord'
import MonitorTrend from './MonitorTrend'

export default function Index(props) {

    const state = useReactive({
        activeTab: 'current',
        deviceStyle: 1,
        category:'',
    })

    const onChangeTab = val => {
        if (val == state.activeTab) {
            return;
        } else {
            state.activeTab = val
        }
    }

    const getDetails = () => {
            Monitoring.RuntimeDevice.Detail(props.projectId, props.sn).then(res => {
                if (res.success) {
                    state.deviceStyle = res.data.deviceStyle
                    state.category = res.data.category
                    // if (res.data.deviceStyle == 4 && res.data.category == 'ZTWLSENSOR-SL') {
                    //     state.OtherStyle == true
                    // } else {
                    //     state.OtherStyle == false
                    // }
                } else {
                    message.error(res.errMsg)
                }
            })
        }

    useEffect(() => {
            getDetails()
        }, [])

    return (
        <div className={style.dialogContent}>
            <div className={style.tabHeader}>
                <div className={state.activeTab == 'current' ? style.tabBoxB : style.tabBoxW} onClick={() => onChangeTab('current')}>实时数据</div>
                <div className={state.activeTab == 'monitor' ? style.tabBoxB : style.tabBoxW} onClick={() => onChangeTab('monitor')}>监测趋势</div>
                <div className={state.activeTab == 'warning' ? style.tabBoxB : style.tabBoxW} onClick={() => onChangeTab('warning')}>告警记录</div>
            </div>
            <div className={style.tabContent}>
                {
                    state.activeTab == 'current' ? <CurrentData projectId={props.projectId} sn={props.sn} deviceStyle={state.deviceStyle} category={state.category}></CurrentData> : null
                }
                {
                    state.activeTab == 'monitor' ? <MonitorTrend projectId={props.projectId} sn={props.sn} deviceStyle={state.deviceStyle} category={state.category}></MonitorTrend> : null
                }
                {
                    state.activeTab == 'warning' ? <WarningRecord projectId={props.projectId} sn={props.sn}></WarningRecord> : null
                }
            </div>
        </div>
    )
}