import React, { useEffect, useRef, useState, useCallback } from 'react'
import { DatePicker, Table, Radio, Select, Button, message } from "antd";
import UserTable from "@com/useTable";
import { useReactive } from "ahooks";
import moment from "moment";
import dayjs from 'dayjs';
import { ExportExcel, CustButton, ExportButton } from '@com/useButton'
import { HistoricalModal } from "./style";
import HistoricalEcharts from './historicalEcharts.js';
const HistoricalDataModal = (props) => {
    console.log(props, props.modalType)
    const { modalType } = props
    const state = useReactive({
        devices: [],
        snGroup: [],
        timeType: 1,
        xAxis: [],
        alltableData: [],
        detailtableData: [],
        tableData: [],
        current: 1,
        pageSize: 10,
        disabled: false,
        groupName: '',
        btnLength: [1, 2, 3],
        active: 0,
        chartsOpts: {
            type: 1,
        },
    });
    const tableRef = useRef()
    const today = moment().startOf('day');
    const tmonth = moment().startOf('month')
    const tyear = moment().startOf('year')
    const params = useReactive({
        siteId: 1,
        structureIds: [],
        type: 1,
        startDate: moment(today).format('YYYY-MM-DD'),
        endDate: moment(today).format('YYYY-MM-DD'),
    });

    const options = [
        {
            label: '图表模式',
            value: 1,
        },
        {
            label: '列表模式',
            value: 2,
        },
    ];

    const columns = [
        {
            title: "时间",
            dataIndex: `time`,
            align: 'center',
            width: 120,
            sorter: (a, b) => {
                const aTime = a.time.split(':').map(Number);
                const bTime = b.time.split(':').map(Number);
                return aTime[0] * 60 + aTime[1] - (bTime[0] * 60 + bTime[1]);
            },
            sortDirections: ['ascend', 'descend'],
        }, {
            title: "发电量 (kWh)",
            dataIndex: `kWh`,
            align: 'center',
            sorter: (a, b) => a.kWh - b.kWh,
        }, {
            title: "天气状态",
            dataIndex: `weather`,
            align: 'center',
            render(_, record) {
                return (
                    <div>{record.weather == 1 ? '晴' :
                        record.weather == 2 ? '多云' :
                            record.weather == 3 ? '雨' :
                                '未知'}</div>
                )
            }
        }
    ]
    const tabledata = [
        {
            time: "00:00",
            kWh: "2250.54",
            weather: 1,
        }, {
            time: "01:00",
            kWh: "22",
            weather: 1,
        }, {
            time: "02:00",
            kWh: "111",
            weather: 2,
        }, {
            time: "03:00",
            kWh: "222",
            weather: 3,
        }, {
            time: "04:00",
            kWh: "3333",
            weather: 3,
        }, {
            time: "00:00",
            kWh: "2250.54",
            weather: 1,
        }, {
            time: "01:00",
            kWh: "22",
            weather: 1,
        }, {
            time: "02:00",
            kWh: "111",
            weather: 2,
        }, {
            time: "03:00",
            kWh: "222",
            weather: 3,
        }, {
            time: "04:00",
            kWh: "3333",
            weather: 3,
        }, {
            time: "00:00",
            kWh: "2250.54",
            weather: 1,
        }, {
            time: "01:00",
            kWh: "22",
            weather: 1,
        }, {
            time: "02:00",
            kWh: "111",
            weather: 2,
        }, {
            time: "03:00",
            kWh: "222",
            weather: 3,
        }, {
            time: "04:00",
            kWh: "3333",
            weather: 3,
        }
    ]
    const changephysical1 = (e) => {

    }
    const changeTime = (e) => {
        console.log(e)
        params.type = parseInt(e)
        if (params.type == 1) {
            params.startDate = moment(today).format('YYYY-MM-DD')
            params.endDate = moment(today).format('YYYY-MM-DD')
        } else if (params.type == 2) {
            params.startDate = moment(tmonth).format('YYYY-MM') + '-01'
            params.endDate = moment(tmonth).format('YYYY-MM') + '-01'
        } else if (params.type == 3) {
            params.startDate = moment(today).format('YYYY') + '-01-01'
            params.endDate = moment(today).format('YYYY') + '-01-01'
        } else {
            params.startDate = moment(today).format('YYYY-MM-DD')
            params.endDate = moment(today).format('YYYY-MM-DD')
        }
    }//切换日月年

    const onChangeDate = (date, dateString) => {
        if (!dateString) return;
        if (params.type == 1) {
            params.startDate = dateString
            params.endDate = dateString
        } else if (params.type == 2) {
            params.startDate = dateString + '-01'
            params.endDate = dateString + '-01'
        } else if (params.type == 3) {
            params.startDate = dateString + '-01-01'
            params.endDate = dateString + '-01-01'
        } else {
            params.startDate = dateString[0]
            params.endDate = dateString[1]
        }
    };
    const disabledDate = (current) => {
        return current > dayjs().endOf('day');
    };
    const onexprot = useCallback(() => {
    })
    return (
        <HistoricalModal>
            <div className='searchBox'>
                <div className='physical'>
                    {modalType == 1 ?
                        <Select defaultValue={1} style={{ width: 196, marginRight: 16 }} onChange={changephysical1}
                            options={[
                                { value: 1, label: '电压', },
                                { value: 2, label: '电流', },
                            ]}
                        /> :
                        <Select defaultValue={1} style={{ width: 196, marginRight: 16 }} onChange={changephysical1}
                            options={[
                                { value: 1, label: '总有功功率', },
                                { value: 2, label: '电压', },
                                { value: 3, label: '电流', },
                                { value: 4, label: '频率', },
                            ]}
                        />}
                </div>
                <div className='timeBox'>
                    <Select defaultValue={1} style={{ width: 96, marginRight: 16 }} onChange={changeTime}
                        options={[
                            { value: 1, label: '日', },
                            { value: 2, label: '月', },
                            { value: 3, label: '年' },
                            // { value: '4', label: '自定义' },
                        ]}
                    />
                    {params.type == 1 ? <DatePicker style={{ width: 196 }} onChange={onChangeDate} defaultValue={moment(today)} disabledDate={disabledDate} /> :
                        params.type == 2 ? <DatePicker style={{ width: 196 }} onChange={onChangeDate} defaultValue={moment(tmonth)} picker='month' disabledDate={disabledDate} /> :
                            params.type == 3 ? <DatePicker style={{ width: 196 }} onChange={onChangeDate} picker='year' defaultValue={moment(tyear)} disabledDate={disabledDate} /> : null
                        // <RangePicker style={{ width: 196 }} onChange={onChangeDate} defaultValue={[moment(today), moment(today)]} disabledDate={disabledDate} />
                    }
                    <Radio.Group
                        block
                        options={options}
                        optionType="button"
                        buttonStyle="solid"
                        style={{ marginRight: 16, marginLeft: 16 }}
                        value={state.timeType}
                        onChange={(e) => {
                            state.timeType = e.target.value
                        }}
                    />
                    {/* tb={tableRef} */}
                    {/* <ExportExcel ></ExportExcel> */}
                    <ExportButton onClick={onexprot} disabled={state.timeType == 1} />
                </div>
            </div>
            {state.timeType == 1 ?
                <div className='echarts'>
                    <HistoricalEcharts />
                </div> :
                <div className='table'>
                    <UserTable scroll={{ y: 280 }} columns={columns} dataSource={tabledata} ref={tableRef}
                        summary={(pageData) => {
                            let eleTotal = 0
                            pageData?.forEach(({ kWh }) => {
                                eleTotal = Math.round((eleTotal + Number(kWh)) * 100) / 100
                            });

                            return (
                                <Table.Summary fixed>
                                    <Table.Summary.Row style={{ backgroundColor: "#f6f6f6", textAlign: "center" }}>
                                        <Table.Summary.Cell index={0} >汇总</Table.Summary.Cell>
                                        <Table.Summary.Cell index={1} colSpan={2} >{eleTotal}</Table.Summary.Cell>
                                    </Table.Summary.Row>
                                </Table.Summary>)
                        }}>
                    </UserTable>
                </div>}
        </HistoricalModal>
    )
}
export default HistoricalDataModal;