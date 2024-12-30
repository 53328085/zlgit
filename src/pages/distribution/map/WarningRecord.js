import React, { useEffect, useRef, useState } from "react";
import style from './style.module.less'
import { message, Spin, DatePicker, Button, Table } from 'antd'
import { Monitoring } from '@api/api.js'
import { useReactive } from "ahooks";
import moment from "moment";
import { SearchOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';

export default function index(props) {
    const { RangePicker } = DatePicker;
    const dateFormat = 'YYYY-MM-DD HH:mm:ss'

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
        loading: false,
        tableList: [],
        startTime: '',
        endTime: '',
    })

    const columnsLog = [
        {
            title: '告警时间',
            dataIndex: 'createTime',
            key: 'sn',
            id: 'id'
        },
        {
            title: '告警事件',
            dataIndex: 'name',
            key: 'sn',
            id: 'id'
        },
        {
            title: '告警内容',
            dataIndex: 'content',
            key: 'sn',
            id: 'id'
        },
    ];

    const changeDate = (date, dateString) => {
        state.startTime = dateString[0]
        state.endTime = dateString[1]
    }

    const onSearch = () => {
        let params = {
            projectId: props.projectId,
            sn: props.sn,
            pageNum: 1,
            pageSize: 10000,
            start: state.startTime,
            end: state.endTime
        }
        Monitoring.RuntimeDevice.AlarmPage(params).then(res => {
            if (res.success) {
                if (res.data && Array.isArray(res.data)) {
                    state.tableList = res.data
                } else {
                    state.tableList = []
                }
            } else {
                message.error(res.errMsg)
            }
        })
    }

    useEffect(() => {
        state.startTime = defaultStartTime
        state.endTime = defaultEndTime
    }, [])


    return (
        <div className={style.warningContent}>
            <div className={style.warnHeader}>
                <RangePicker showTime defaultValue={[moment(defaultStartTime, dateFormat), moment(defaultEndTime, dateFormat)]} format={dateFormat} onChange={changeDate}></RangePicker>
                <Button style={{ marginLeft: 16, width: 96, height: 32 }} type="primary" onClick={onSearch} icon={<SearchOutlined />} >查询</Button>
            </div>
            <div>
                <Table scroll={{ y: 500 }} columns={columnsLog} dataSource={state.tableList} rowKey={columnsLog => columnsLog.id} hbc="#515151"></Table>
            </div>
        </div>
    )
}