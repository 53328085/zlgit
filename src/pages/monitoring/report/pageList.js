import React, { Fragment, useState, useEffect } from "react";
import style from './style.module.less'
import {useSelector} from 'react-redux'
import {systemConfigInfo} from '@redux/systemconfig.js'
import { drawEcharts } from '@com/useEcharts'
import { Table } from "antd";
import logo from './images/logo.png'
import firstPage from './images/firstPage.png'

export default function PageList(props) {
    const {chineseTitle} =useSelector(systemConfigInfo)
    const Header = () => {
        return (
            <div className={style.pageHeader}>
                <span>{chineseTitle}</span>
                <span className={style.subTitle}>用户分析报告</span>
            </div>
        )
    }

    const datasetDay = {
        dimensions: ["time", "日用电量(kWh)",],
        source: [],
    };//props.query?.eleConsums
    const [dataset, setDataset] = useState(datasetDay);
    useEffect(() => {
        if (props.query) {
            let arr = []
            for (let i = 0; i < props.query.eleConsums.length; i++) {
                arr.push({
                    time: props.query.eleConsums[i].name,
                    "日用电量(kWh)": props.query.eleConsums[i].value,
                })
            }
            setDataset(() => ({ dimensions: ["time", "日用电量(kWh)"], source: arr }))
        }
    }, [props.query]);
    const datasetLine = {
        dimensions: ["time", "tokyo",],
        source: [
            { time: "Jan", "tokyo": 3699.23 },
            { time: "Feb", "tokyo": 5500.36 },
            { time: "Mar", "tokyo": 5062.25 },
            { time: "Apr", "tokyo": 4412.36 },
            { time: "May", "tokyo": 3427.85 },
            { time: "Jun", "tokyo": 3787.65 },
            { time: "Jul", "tokyo": 5058.96 },
            { time: "Aug", "tokyo": 6333.23 },
            { time: "Sep", "tokyo": 5425.63 },
            { time: "Oct", "tokyo": 6874.59 },
            { time: "Nov", "tokyo": 7125.36 },
            { time: "Dec", "tokyo": 7423.25 },
        ],
    };

    const datasetLoad = {
        dimensions: ["time", "max", "min"],
        source: [
            { time: "Jan", "max": 7, "min": 3.9 },
            { time: "Feb", "max": 6.9, "min": 4.2 },
            { time: "Mar", "max": 9.5, "min": 5.7 },
            { time: "Apr", "max": 14.5, "min": 8.5 },
            { time: "May", "max": 18.4, "min": 11.9 },
            { time: "Jun", "max": 21.5, "min": 15.2 },
            { time: "Jul", "max": 25.2, "min": 17 },
            { time: "Aug", "max": 26.5, "min": 16.6 },
            { time: "Sep", "max": 23.3, "min": 14.2 },
            { time: "Oct", "max": 18.3, "min": 10.3 },
            { time: "Nov", "max": 13.9, "min": 6.6 },
            { time: "Dec", "max": 9.6, "min": 4.8 },
        ],
    };

    const datasetPF = {
        dimensions: ["time", "max", "min"],
        source: [
            { time: "09/01", "max": 415.92, "min": 215.36 },
            { time: "09/02", "max": 402.32, "min": 207.38 },
            { time: "09/03", "max": 398.21, "min": 254.36 },
            { time: "09/04", "max": 354.21, "min": 300.35 },
            { time: "09/05", "max": 409.25, "min": 278.63 },
            { time: "09/06", "max": 411.25, "min": 269.36 },
            { time: "09/07", "max": 365.98, "min": 241.37 },
            { time: "09/08", "max": 333.25, "min": 298.41 },
            { time: "09/09", "max": 384.63, "min": 268.41 },
            { time: "09/10", "max": 399.98, "min": 259.39 },
            { time: "09/11", "max": 409.12, "min": 244.15 },
            { time: "09/12", "max": 410.97, "min": 365.85 },
        ],
    };

    useEffect(() => {
        let currChart = document.getElementById('currChart')
        drawEcharts(currChart, {
            dataset,
            series: [{ type: "line" }],
        })

        let lineChart = document.getElementById('lineChart')
        drawEcharts(lineChart, {
            dataset: datasetLine,
            series: [{ type: "bar" }],
        })

        let dailyLoad = document.getElementById('dailyLoad')
        drawEcharts(dailyLoad, { dataset: datasetLoad, series: [{ type: 'line' }, { type: 'line' }] })

        let powerFactor = document.getElementById('powerFactor')
        drawEcharts(powerFactor, { dataset: datasetPF, series: [{ type: 'line' }, { type: 'line' }] })
    })

    const dataSource = [{
        key: 1,
        name: '1# T5变压器',
        max: 429.92,
        min: 24.26,
        avg: 201.96
    }, {
        key: 2,
        name: '2# T6变压器',
        max: 429.92,
        min: 24.26,
        avg: 201.96
    }, {
        key: 3,
        name: '3# T8变压器',
        max: 429.92,
        min: 24.26,
        avg: 201.96
    }]

    const columns = [{
        title: '变压器名称',
        dataIndex: 'name'
    }, {
        title: '最大负荷(kW)',
        dataIndex: 'max'
    }, {
        title: '最小负荷(kW)',
        dataIndex: 'min'
    }, {
        title: '平均负荷(kW)',
        dataIndex: 'avg'
    }]

    const limitData = [{
        key: 1,
        name: '进线1#',
        type: '越限告警',
        parameter: 'A相电压',
        limit: 240.00,
        count: 4
    }, {
        key: 2,
        name: '出线2#',
        type: '越限告警',
        parameter: 'B相电压',
        limit: 240.00,
        count: 9
    }, {
        key: 3,
        name: '出线3#',
        type: '越限告警',
        parameter: 'C相电流',
        limit: 120.00,
        count: 1
    }]

    const limitColumns = [{
        title: '监测点',
        dataIndex: 'name'
    }, {
        title: '类型',
        dataIndex: 'type'
    }, {
        title: '参数',
        dataIndex: 'parameter'
    }, {
        title: '限制',
        dataIndex: 'limit'
    }, {
        title: '次数',
        dataIndex: 'count'
    }]

    const deflectionData = [{
        key: 1,
        name: '1#门禁',
        type: '状态变化',
        parameter: '门禁',
        value: '开',
        count: 4
    }, {
        key: 2,
        name: '1#门禁',
        type: '状态变化',
        parameter: '门禁',
        value: '关',
        count: 4
    }, {
        key: 3,
        name: '水浸传感器',
        type: '状态变化',
        parameter: '水浸',
        value: '有水',
        count: 1
    }, {
        key: 4,
        name: '烟雾传感器',
        type: '状态变化',
        parameter: '烟雾',
        value: '有烟',
        count: 1
    }]

    const deflectionColumns = [{
        title: '监测点',
        dataIndex: 'name'
    }, {
        title: '类型',
        dataIndex: 'type'
    }, {
        title: '参数',
        dataIndex: 'parameter'
    }, {
        title: '值',
        dataIndex: 'value'
    }, {
        title: '次数',
        dataIndex: 'count'
    }]

    return (
        <Fragment>
            {props.display?<div className={style.report}>
                <div  id='contentPage'>
                <div className={style.firstPage} >
                    <div className={style.header}>
                        <img src={logo} className={style.logo}></img>
                        <span>{chineseTitle}</span>
                    </div>
                    <div className={style.mainTitle}>运行监控报告</div>
                    <div className={style.mainDetail} >
                        <div className={style.detailItem}>项目名称: <span style={{ marginLeft: 18 }}>{props.coverData?.ProjectName}</span></div>
                        <div className={style.detailItem}>项目地址: <span style={{ marginLeft: 18 }}>{props.coverData?.Address}</span></div>
                        <div className={style.detailItem}>报告日期: <span style={{ marginLeft: 18 }}>{props.coverData?.Date}</span></div>
                    </div>
                    <img src={firstPage} className={style.backgroundImg}></img>
                </div>
                 <div>
                    <div className={style.pages} >
                        <Header></Header>
                        <div className={style.pageContent}>
                            <div className={style.mainTitle}>1.配电房概况</div>
                            <div className={style.tableList}>
                                <div className={style.tableItem}>
                                    <span className={style.tableTitle}>站点名称</span><span className={style.tableValue}>正泰物联</span>
                                </div>
                                <div className={style.tableItem}>
                                    <span className={style.tableTitle}>站点地址</span><span className={style.tableValue}>浙江省杭州市滨江区月明路560号</span>
                                </div>
                                <div className={style.tableItem}>
                                    <span className={style.tableTitle}>配电房容量</span><span className={style.tableValue}>6000 KVA</span>
                                </div>
                                <div className={style.tableItem}>
                                    <span className={style.tableTitle}>电压等级</span><span className={style.tableValue}>0.4 KV</span>
                                </div>
                                <div className={style.tableItem}>
                                    <span className={style.finalTitle}>变压器数</span><span className={style.finalValue}>3台</span>
                                </div>
                            </div>
                            <div className={style.mainTitle}>2.用电量分析</div>
                            <div className={style.mainText}>该变配电站监测周期内总耗电量{props.query?.e}kW·h， 日平均耗电量{props.query?.avgE}kW·h，单日最大耗电量{props.query?.maxE}kW·h，日耗电情况详见下图:</div>
                            <div className={style.currChart} id="currChart"></div>
                        </div>
                    </div>

                    <div className={style.pages}>
                        <Header></Header>
                        <div className={style.pageContent}>
                            <div className={style.mainTitle}>3. 线路能耗情况</div>
                            <div className={style.lineChart} style={{ width: '100%' }} id="lineChart"></div>
                            <div className={style.mainTitle}>4. 变压器运行情况</div>
                            <Table dataSource={dataSource} columns={columns} pagination={false} bordered className={style.tableStyle}  ></Table>
                        </div>
                    </div>

                    <div className={style.pages}>
                        <Header></Header>
                        <div className={style.pageContent}>
                            <div className={style.mainTitle}>4.1 1#变压器</div>
                            <div className={style.subtitle}>4.1.1 日负荷分析</div>
                            <div id="dailyLoad" style={{ width: 525, height: 262 }}></div>
                            <div className={style.mainText}>本监测周期内，最大负荷424.90kW, 发生于2021-08-23 10:50, 最小负荷27.88kW， 发生于2021-08-21 14:50， 平均负荷207.38kW。</div>
                            <div className={style.subtitle}>4.1.2 功率因数分析</div>
                            <div id="powerFactor" style={{ width: 525, height: 262 }}></div>
                            <div className={style.mainText}>本监测周期内，最大功率因数0.98， 发生于2021-08-26 17:30， 最小功率因数0.51， 发生于2021-08-26 18:30， 平均功率因数0.84。</div>
                        </div>
                    </div>

                    <div className={style.pages}>
                        <Header></Header>
                        <div className={style.pageContent}>
                            <div className={style.mainTitle}>5. 事件统计</div>
                            <div className={style.subtitle}>5.1 遥测越限事件</div>
                            <div className={style.mainText}> 本监测周期内经运维平台统计共发生23次遥测越限事件，统计数据如下：</div>
                            <Table dataSource={limitData} columns={limitColumns} bordered pagination={false} style={{ width: 525 }}></Table>
                        </div>
                    </div>

                    <div className={style.pages}>
                        <Header></Header>
                        <div className={style.pageContent}>
                            <div className={style.subtitle}>5.2 遥测变位事件</div>
                            <div className={style.mainText}>本监测周期内经运维平台统计共发生23次遥测越限事件，统计数据如下</div>
                            <Table dataSource={deflectionData} columns={deflectionColumns} bordered pagination={false} style={{ width: 525 }}></Table>
                        </div>
                    </div>

                    <div className={style.pages}>
                        <Header></Header>
                        <div className={style.pageContent}>
                            <div className={style.mainTitle}>6. 报警信息</div>
                            <div className={style.mainText}>本周期内，该变配电站共出现报警信息11条；未处理 8条；进行中的工单3条。</div>
                            <div className={style.mainTitle}>7. 现场运维情况</div>
                            <div className={style.mainText}>本周期内，该变配电站共完成巡检0次，巡检过程未发现缺陷。</div>
                        </div>
                    </div>
                </div>
                </div>
            </div>:<div className={style.report}><div className={style.firstPage} >
                    <div className={style.header}>
                        <img src={logo} className={style.logo}></img>
                        <span>{chineseTitle}</span>
                    </div>
                    <div className={style.mainTitle}>运行监控报告</div>
                    <div className={style.mainDetail} >
                        <div className={style.detailItem}>项目名称: <span style={{ marginLeft: 18 }}>{props.coverData?.ProjectName}</span></div>
                        <div className={style.detailItem}>项目地址: <span style={{ marginLeft: 18 }}>{props.coverData?.Address}</span></div>
                        <div className={style.detailItem}>报告日期: <span style={{ marginLeft: 18 }}>{props.coverData?.Date}</span></div>
                    </div>
                    <img src={firstPage} className={style.backgroundImg}></img>
                </div></div>}

        </Fragment>
    )
}