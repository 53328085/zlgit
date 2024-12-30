import React, { useEffect, useRef, useState } from "react";
import style from './style.module.less'
import { message, Spin, DatePicker, Button, Select } from 'antd'
import { Monitoring } from '@api/api.js'
import { useReactive } from "ahooks";
import moment from "moment";
import { isObject, disabledDate } from "@com/usehandler"
import { SearchOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import { drawEcharts } from "@com/useEcharts"

export default function Index(props) {
    const { RangePicker } = DatePicker;
    const dateFormat = 'YYYY-MM-DD HH:mm:ss'
    const { projectId, sn, deviceStyle, category } = props

    const now = new Date();
    const year = now.getFullYear();
    const month = ('0' + (now.getMonth() + 1)).slice(-2);
    const day = ('0' + now.getDate()).slice(-2);
    const hours = ('0' + now.getHours()).slice(-2);
    const minutes = ('0' + now.getMinutes()).slice(-2);
    const seconds = ('0' + now.getSeconds()).slice(-2);

    const defaultStartTime = `${year}-${month}-${day} 00:00:00`
    const defaultEndTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`

    const state = useReactive({
        displaypoint: false,
        startTime: '',
        endTime: '',
        deviceStyle: '',
        pointList: [],
        selectedPoint: '',
        chartTitle: '',
    })


    const changeDate = (date, dateString) => {
        state.startTime = dateString[0]
        state.endTime = dateString[1]
    }

    const onSearch = () => {
        if (state.startTime == '' || state.endTime == '') {
            message.error('请选择完整日期!');
            return;
        }
        if (state.selectedPoint == '') {
            message.error('请选择测点！')
            return;
        }
        let params = {
            ProjectId: projectId,
            SN: sn,
            Point: state.selectedPoint,
            Start: state.startTime,
            End: state.endTime,
        }

        Monitoring.RuntimeDevice.HistoryPointTrend(params).then(res => {
            if (res.success) {
                if (res.data) {
                    state.chartTitle = res.data.description + '(' + res.data.unit + ')'
                    if (res.data.data && Array.isArray(res.data.data)) {
                        setTimeout(() => { drawEchartsData(res.data.data, res.data.sn) }, 100)
                    }
                }
            } else {
                message.error(res.errMsg)
            }
        })
    }

    const analysisRef = useRef()

    const drawEchartsData = (data, point) => {
        let dimensions = ['time', point]
        let source = []
        data.map((item, index) => {
            let value = {}
            value['time'] = item.x
            value[point] = item.y
            source.push(value)
        })

        let dataset = {
            dimensions,
            source
        }
        drawEcharts(analysisRef.current, {
            dataset: dataset,
            series: [{
                type: "line", areaStyle: null, showSymbol: true, symbol:'none'
            },],
            grid: {
                top: '30px',
                left: 0,
                right: 0,
                bottom: '30px',
                containLabel: true,
            },
            legend: {
                top: 0,
                right: 16,
                icon: 'rect', //rect
                itemHeight: 2,
                itemWidth: 24,
                itemGap: 30,
            }
        })
    }

    const handleChangePoint = value => {
        state.selectedPoint = value
    }

    const getPointList = () => {
        Monitoring.GetPointList({ projectId, category }).then(res => {
            if (res && Array.isArray(res)) {
                state.pointList = res
            } else {
                state.pointList = []
                message.error('暂无测点')
            }
        })
    }

    useEffect(() => {
        getPointList()
        state.startTime = defaultStartTime
        state.endTime = defaultEndTime
    }, [])

    return (
        <div className={style.warningContent}>
            <div className={style.warnHeader}>
                <RangePicker showTime defaultValue={[moment(defaultStartTime, dateFormat), moment(defaultEndTime, dateFormat)]} format={dateFormat} onChange={changeDate}></RangePicker>
                <Select showSearch style={{ width: '200px', marginLeft: '16px' }} placeholder='请选择测点' onChange={handleChangePoint} optionLabelProp="label">
                    {
                        state.pointList.map((item, index) => {
                            return <Option value={item.name} label={item.description + '(' + item.alias + ')'} key={index}>
                                <span>{item.description + '(' + item.alias + ')'}</span>
                            </Option>
                        })
                    }
                </Select>
                <Button style={{ marginLeft: 16, width: 96, height: 32 }} type="primary" onClick={onSearch} icon={<SearchOutlined />}>查询</Button>
            </div>
            <div className={style.chartBox}>
                <div>{state.chartTitle}</div>
                <div style={{ width: "980px", height: '450px' }} ref={analysisRef}></div>
            </div>
        </div>
    )
}