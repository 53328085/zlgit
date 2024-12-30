import React, { useEffect, useRef, useState } from "react";
import style from './style.module.less'
import { message, Spin } from 'antd'
import { Monitoring } from '@api/api.js'
import { useReactive } from "ahooks";


export default function index(props) {

    const { projectId, sn, deviceStyle, category } = props

    const state = useReactive({
        dataList: [],
        updateTime: '',
        OtherStyle: false,
        loading: true,
    })

    

    const getCurrent = () => {
        Monitoring.RuntimeDevice.Current(projectId, sn).then(res => {
            state.loading = false
            if (res.success) {
                state.updateTime = res.data.lastSampleTime
                if (Array.isArray(res.data.fields) && res.data.fields.length > 0) {
                    state.dataList = res.data.fields
                } else {
                    state.dataList = []
                }
            } else {
                message.error(res.errMsg)
            }
        })
    }

    // 断路器状态
    const circuitState = {
        "Close": '合闸',
        'Open': '分闸'
    }
    // 声光报警器状态---ZTWLSENSOR-SL
    const circuitStateOther = {
        "Close": '关闭',
        'Open': '打开'
    }

    useEffect(() => {
        if(deviceStyle == 4 && category == 'ZTWLSENSOR-SL'){
            state.OtherStyle = true
        }else{
            state.OtherStyle = false
        }
        getCurrent()
    }, [])

    return (
        <Spin style={{height: '500px'}} spinning={state.loading}>
            <div className={style.timeLine}>
                <span>设备参数</span>
                <span>{'数据最新更新时间：' + state.updateTime}</span>
            </div>

            <div className={style.dataBottom}>
                {state.dataList.map((item, index) => {
                    return <div key={index} className={style.itemBox}>
                        <div className={style.itemHead}>{item.name}</div>
                        {!state.OtherdeviceStyle ? <div className={style.itemTail}> {circuitState[item.value] || item.value} </div>
                            : <div className={style.itemTail}> {circuitStateOther[item.value] || item.value} </div>}
                    </div>
                })}
            </div>
        </Spin>
    )
}