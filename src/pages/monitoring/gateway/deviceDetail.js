import { React, useState, useEffect, useRef } from "react";
import style from './style.module.less'
import { useSelector } from 'react-redux'
import imgurl from './images/index.js'
import { Pagination, message, DatePicker, Button, Radio } from 'antd'
import { SearchOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router';
import { Monitoring } from '@api/api.js'
import { Link, useNavigate } from 'react-router-dom'
import { drawEcharts } from '@com/useEcharts'
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
import { selectProjectId } from '@redux/systemconfig.js'
import Table from '@com/useTable'
import Item from "antd/lib/list/Item";
import moment from "moment";

export default function GatewayDetail(props) {
    let location = useLocation()
    let search = location.search.substr(4, location.search.length)
    console.log(search)
    const projectId = useSelector(selectProjectId)
    const { RangePicker } = DatePicker;
    // const [messageApi, contextHolder] = message.useMessage();
    const { RuntimeDevice: { Statistics, Overview, CategoryImages, Detail, Current, HistoryTrend, HistoryTable, EnergyActuary, EnergyReport, AlarmPage } } = Monitoring
    let [state, setstate] = useState(1)
    let [detail, setDetail] = useState({})
    let [current, setCurrent] = useState({})
    const elref = useRef(null)
    const vlref = useRef(null)
    const alref = useRef(null)
    const energyref = useRef(null)
    let [reportTypeTime, setreportTypeTime] = useState(1)
    let year = new Date().getFullYear()
    let month = new Date().getMonth() + 1
    let day = new Date().getDate()
    let date = year + '-' + (month > 10 ? month : '0' + month) + '-' + (day > 10 ? day : '0' + day)
    let [dataList, setdataList] = useState([])
    let [dateValue, setdateValue] = useState(date)
    let [dataSourceLog, setdataSourceLog] = useState([])
    let [trend, settrend] = useState(1)
    let [energyReport, setEnergyReport] = useState({})
    let [xline, setxline] = useState([])
    let [yline, setyline] = useState([])
    let [yline1, setyline1] = useState([])
    let [yline2, setyline2] = useState([])
    let [yline3, setyline3] = useState([])
    let [yline4, setyline4] = useState([])
    let [actuary, setactuary] = useState({})
    let dataToday = new Date()
    let [startTime, setstartTime] = useState(dataToday)
    let [endTime, setendTime] = useState(dataToday)
    let [alarmPage, setalarmPage] = useState()
    let [startTimeAlarm, setstartTimeAlarm] = useState(dataToday)
    let [endTimeAlarm, setendTimeAlarm] = useState(dataToday)
    const onchangeTab = val => {
        setstate(val)
        if (val == 3) {
            getEnergyReport()
        } else if (val == 2) {
            getHistoryTrend()
            getHistoryTable()
        }
    }//切换tab
    const disabledDate = (current) => {
        return current && current > dayjs().endOf('day');
    };
    const range = (start, end) => {
        const result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    };
    const disabledRangeTime = (_, type) => {
        if (type === 'start') {
            return {
                disabledHours: () => range(0, 60),
                disabledMinutes: () => range(0, 60),
                disabledSeconds: () => [55, 56],
            };
        }
        return {
            disabledHours: () => range(0, 60).splice(4, 20),
            disabledMinutes: () => range(0, 60),
            disabledSeconds: () => [55, 56],
        };
    };
    const getData = () => {//设备详情
        return Current(projectId, search).then(res => {
            let { success, data } = res
            if (success) {
                setCurrent(data)
                setdataList(data.fields)
            } else {
                message.error(res.errMsg)
            }
        })
    }
    const getDetailData = () => {//设备详情
        return Detail(projectId, search).then(res => {
            let { success, data } = res
            if (success) {
                setDetail(data)
            } else {
                message.error(res.errMsg)
            }
        })
    }

    let paramsTrend = {
        sn: search,
        start: startTime,
        end: endTime
    }
    const [historyTrend,sethistoryTrend]=useState({Data:[],Header:[]})
    const getHistoryTrend = () => {//
        return HistoryTrend(paramsTrend).then(res => {
            let { success, data } = res
            if (success) {
                sethistoryTrend(data)
                console.log(JSON.parse(data))
                charts()
            } else {
                message.error(res.errMsg)
            }
        })
    }
    const getHistoryTable = () => {//
        return HistoryTable(paramsTrend).then(res => {
            let { success, data } = res
            if (success ) {
                //setDetail(data)

                console.log(JSON.parse(data))
                // charts()
            } else {
                message.error(res.errMsg)
            }
        })
    }

    const getEnergyTrend = () => {//
        return EnergyActuary(projectId, search).then(res => {
            let { success, data } = res
            if (success) {
                setactuary(data)
            } else {
                message.error(res.errMsg)
            }
        })
    }
    let [pageNum,setPageNum]=useState(1)
    let [totalalarm,settotalalarm]=useState(1)
    let paramsAlarm = {
        projectId:projectId,
        sn: search,
        start: startTimeAlarm,
        end: endTimeAlarm,
        pageSize:12,
        pageNum:pageNum
    }
    
    const getAlarmPage = () => {//
        return AlarmPage(paramsAlarm).then(res => {
            let { success, data } = res
            if (success) {
                setalarmPage(data)
                settotalalarm(res.total)
            } else {
                message.error(res.errMsg)
            }
        })
    }
    const onChangePageLog=(page,pageSize)=>{
        console.log(page)
        setPageNum(page)
    }
    let paramsReport = {
        projectId: projectId,
        sn: search,
        type: reportTypeTime,
        date: dateValue
    }

    const getEnergyReport = () => {//
        return EnergyReport(paramsReport).then(res => {
            let { success, data } = res
            if (success) {
                setEnergyReport(data)
                let x = []
                let y = []
                let y1 = []
                let y2 = []
                let y3 = []
                let y4 = []
                data.Data.map((item) => { x.push(item.Time) })
                data.Data.map((item) => { y.push(item.E) })
                data.Data.map((item) => { y1.push(item.E1) })
                data.Data.map((item) => { y2.push(item.E2) })
                data.Data.map((item) => { y3.push(item.E3) })
                data.Data.map((item) => { y4.push(item.E4) })
                setxline(x)
                setyline(y)
                setyline1(y1)
                setyline2(y2)
                setyline3(y3)
                setyline4(y4)
                console.log(xline, yline)
                if (xline && yline) {
                    tdrawEcharts(energyref.current, option("用电量-总(kWh)", "用电量-尖(kWh)", "用电量-峰(kWh)", "用电量-平(kWh)", "用电量-谷(kWh)"))
                }
            } else {
                message.error(res.errMsg)
            }
        })
    }
    const datasetMonthV = {
        dimensions: ["Time", "Ua","Ub","Uc"],
        source: historyTrend.Data?historyTrend.Data:[],
    };
    const datasetMonthA = {
        dimensions: ["Time", "Ia","Ib","Ic"],
        source:historyTrend.Data?historyTrend.Data:[],
    };
    const datasetMonthE = {
        dimensions: ["Time", "Ep"],
        source: historyTrend.Data?historyTrend.Data:[],
    };
    const grid = {
        // 图表 grid
        left: "0px",
        right: "0",
        top: "30px",
        bottom: "0px",
        containLabel: true,
    }
    const charts = () => {
        drawEcharts(vlref.current, {
            dataset: datasetMonthV,
            series: [{ type: "line", name: 'A相电压(V)' },{ type: "line", name: 'B相电压(V)' },{ type: "line", name: 'C相电压(V)' }],
            grid,
            legend: {
                icon: 'rect',
                itemHeight: 8,
                itemWidth: 8,
                itemGap: 20
            },

        })
        drawEcharts(alref.current, {
            dataset: datasetMonthA,
            series: [{ type: "line", name: 'A相电流(A)' },{ type: "line", name: 'B相电流(A)' },{ type: "line", name: 'C相电流(A)' }],
            grid,
            legend: {
                icon: 'rect',
                itemHeight: 8,
                itemWidth: 8,
                itemGap: 20
            },

        })
        drawEcharts(elref.current, {
            dataset: datasetMonthE,
            series: [{ type: "line", name: '有功总电能(kWh)' }],
            grid,
            legend: {
                icon: 'rect',
                itemHeight: 8,
                itemWidth: 8,
                itemGap: 20
            },

        })

    }
    const option = (name, name1, name2, name3, name4, type = "line") => ({
        xAxis: {
            data: xline ? xline : []
        },
        series: [
            {
                data: yline ? yline : [],
                type,
                name: name
            }, {
                data: yline1 ? yline1 : [],
                type,
                name: name1
            }, {
                data: yline2 ? yline2 : [],
                type,
                name: name2
            }, {
                data: yline3 ? yline3 : [],
                type,
                name: name3
            }, {
                data: yline4 ? yline4 : [],
                type,
                name: name4
            }
        ],
        grid: {
            // 图表 grid
            left: "0px",
            right: "0",
            top: "30px",
            bottom: "0px",
            containLabel: true,
        },
        legend: {
            top: 0,
            // bottom: 0,
            icon: 'rect',
            itemHeight: 2,
            itemWidth: 12,
            itemGap: 20,
        },
    });

    const tdrawEcharts = (c, option) => {
        return drawEcharts(c, { ...option, type: 2 })
    }
    const onTimeOk = (date,dataString) => {
        setstartTime(dataString[0])
        setendTime(dataString[1])
    }//监控趋势选择时间
    const onTimeOkAlarm = (date,dataString) => {
            setstartTimeAlarm(dataString[0])
            setendTimeAlarm(dataString[1])
    }//告警记录选择时间
    const onSearch = () => {
        getHistoryTrend()
        getHistoryTable()
    }//监控趋势更改时间
    const onSearchAlarm = () => {
        getAlarmPage()
    }
    const changeTime = (e) => {
        console.log(e.target.value)
        setreportTypeTime(parseInt(e.target.value))
        //reportType=parseInt(e.target.value)
    }//切换日月年
    const today = moment();
    const onChangeDate = (date, dateString) => {
        console.log(dateString);
        if (reportTypeTime == 1) {
            setdateValue(dateString)
            console.log(dateString);
        } else if (reportTypeTime == 2) {
            setdateValue(dateString + '-01')
            console.log(dateString + '-01');
        } else {
            setdateValue(dateString + '-01-01')
            console.log(dateString + '-01-01');
        }
    };//能耗趋势图表接口传参日期

    const changeTable = (e) => {
        console.log(e.target.value)
        if (e.target.value == 'trend') {
            settrend(1)
        } else if (e.target.value == 'list') {
            settrend(2)
        }

    }//切换趋势列表
    const exportExecel = () => {
        tableLoadRef.current.download()
    }//数据导出
    const columnsLog = [
        {
            title: '告警时间',
            dataIndex: 'sn',
            key: 'sn',
            id: 'id'
        },
        {
            title: '告警事件',
            dataIndex: 'category',
            key: 'category',
            id: 'id'
        },
        {
            title: '告警内容',
            dataIndex: 'category',
            key: 'category',
            id: 'id'
        },
    ];
    const columnsTrend = [
        {
            title: '日期时间',
            dataIndex: 'Time',
            key: 'Time',
            id: 'Time'
        },
        {
            title: '用电量(kWh)',
            dataIndex: 'E',
            key: 'E',
            id: 'E'
        }
    ];

    useEffect(() => {
        getData()
        getDetailData()
        getEnergyTrend()
    }, [search, projectId])
    useEffect(() => {
        getHistoryTrend()
        getHistoryTable()
        getAlarmPage()
    }, [paramsTrend.sn])
    useEffect(() => {
        getEnergyReport()
        getEnergyTrend()
        if (xline && yline) {
            tdrawEcharts(energyref.current, option("用电量-总(kWh)", "用电量-尖(kWh)", "用电量-峰(kWh)", "用电量-平(kWh)", "用电量-谷(kWh)"))
        }
    }, [paramsReport.date, projectId, search, paramsReport.type, trend])
    useEffect(() => {
        if (xline && yline) {
            tdrawEcharts(energyref.current, option("用电量-总(kWh)", "用电量-尖(kWh)", "用电量-峰(kWh)", "用电量-平(kWh)", "用电量-谷(kWh)"))
        }
    }, [energyReport.Header, energyReport.Data, xline, yline, trend])
    return (
        <div className={style.main}>
            <div className={style.head}>
                <img src={imgurl.logo} className={style.headImg} ></img>
                <p>智慧能源服务管理平台</p>
            </div>
            <div className={style.body}>
                <div className={style.left}>
                    <div className={style.leftHead}><div className={style.leftHeadLine} ></div>
                        <p>设备详情</p></div>
                    <div className={style.leftImgBox}>
                        <img src={detail.imageBase64 ? 'data:image/png;base64,' + detail.imageBase64 : imgurl.category} className={style.leftImg} ></img>
                        <div className={style.leftImgState}>{detail.state == 1 ? '设备离线' : detail.state == 2 ? '设备在线' : '设备告警'}</div>
                    </div>
                    <div className={style.leftBottom}>
                        <p><span className={style.leftBottomSpan}>设备类型：</span><span>{detail.deviceStyle == 1 ? '电表' : detail.deviceStyle == 2 ? '水表' : '燃气表'}</span></p>
                        <p><span className={style.leftBottomSpan}>设备编号：</span><span>{detail.sn}</span></p>
                        <p><span className={style.leftBottomSpan}>设备型号：</span><span>{detail.category}</span></p>
                        <p><span className={style.leftBottomSpan}>设备名称：</span><span>{detail.name}</span></p>
                        <p><span className={style.leftBottomSpan}>能耗类型：</span><span>{detail.customerType == 1 ? '客户能耗' : detail.customerType == 2 ? '公共能耗' : '/'}</span></p>
                        <p><span className={style.leftBottomSpan}>所属网关：</span><span>{detail.gateway ? detail.gateway : '/'}</span></p>
                        <div className={style.line}></div>
                        <p><span className={style.leftBottomSpan}>安装地址：</span></p>
                        <p><span>{detail.address}</span></p>
                    </div>
                </div>
                <div className={style.right}>
                    <div className={style.rightHead}>
                        <div className={state == 1 ? style.tabBoxW : style.tabBoxB} onClick={() => { onchangeTab(1) }}>实时数据</div>
                        <div className={state == 2 ? style.tabBoxW : style.tabBoxB} onClick={() => { onchangeTab(2) }}>监控趋势</div>
                        <div className={state == 3 ? style.tabBoxW : style.tabBoxB} onClick={() => { onchangeTab(3) }}>能耗趋势</div>
                        <div className={state == 4 ? style.tabBoxW : style.tabBoxB} onClick={() => { onchangeTab(4) }}>告警记录</div>
                    </div>
                    {state == 1 ? <div><div className={style.newTime}>
                        <img src={imgurl.time} className={style.time} ></img>
                        <p>数据最新更新时间：{current.lastSampleTime}</p>
                    </div>
                        <img src={imgurl.line} className={style.timeline} ></img></div> : state == 2 ? <div className={style.newTime}>
                            <span style={{ marginRight: 16 }}>请选择日期范围</span>
                            <RangePicker format='YYYY-MM-DD' disabledDate={disabledDate} onChange={onTimeOk} defaultValue={[moment(today), moment(today)]} />
                            <Button style={{ marginLeft: 16, width: 96, height: 32 }} type="primary" onClick={onSearch} icon={<SearchOutlined />} >查询</Button>
                        </div> : state == 3 ? <div><div className={style.newTime}>
                            <img src={imgurl.time} className={style.time} ></img>
                            <p>数据最新更新时间：{current.lastSampleTime}</p>
                        </div> </div> : <div className={style.newTime}>
                        <RangePicker format='YYYY-MM-DD' disabledDate={disabledDate} onChange={onTimeOkAlarm} defaultValue={[moment(today), moment(today)]}/>
                        <Button style={{ marginLeft: 16, width: 96, height: 32 }} type="primary" onClick={onSearchAlarm} icon={<SearchOutlined />} >查询</Button>

                    </div>}

                    <div className={style.tableBox}>
                        {state == 1 ?
                            <div>
                                <div className={style.dataHeader}>
                                    设备参量
                                </div>
                                <div className={style.dataBottom}>
                                    {dataList ? dataList.map((item, index) => {
                                        return <div key={index} className={style.itemBox}>
                                            <div className={style.itemHead}>{item.name}</div>
                                            <div className={style.itemTail}>{item.value}</div>
                                        </div>
                                    }) : ''}
                                </div>
                            </div>
                            : state == 2 ? <div className={style.chartsBox}>
                                <div className={style.title}><div className={style.blueLine}></div><p>电压 (V)</p></div>
                                <div><div ref={vlref} style={{ width: '100%', height: 320, padding: 16 }}></div></div>
                                <div className={style.title}><div className={style.blueLine}></div><p>电流 (A)</p></div>
                                <div><div ref={alref} style={{ width: '100%', height: 320, padding: 16 }}></div></div>
                                <div className={style.title}><div className={style.blueLine}></div><p>电度 (kWh)</p></div>
                               <div> <div ref={elref} style={{ width: '100%', height: 320, padding: 16 }}></div></div>
                            </div> : state == 3 ? <div>
                                <div className={style.energyHead}>
                                    <div className={style.dateData}>
                                        <p><span>今日用电量 (kWh)</span><span>日环比{actuary.e_DayRatio > 0 ? <CaretUpOutlined
                                            style={{ color: 'rgb(255,0,0)', marginLeft: 3, marginRight: 3 }} /> : actuary.e_DayRatio < 0 ? <CaretDownOutlined
                                                style={{ color: 'rgb(0,153,0)', marginLeft: 3, marginRight: 3 }} /> : ''}{actuary.e_DayRatio}</span></p>
                                        <div>{actuary.e_DayUsage}</div>
                                        <p>日均用电量 : {actuary.e_DayAvg}</p>
                                    </div>
                                    <div className={style.dateData}>
                                        <p><span>本月用电量 (kWh)</span><span>月环比{actuary.e_MonthRatio > 0 ? <CaretUpOutlined
                                            style={{ color: 'rgb(255,0,0)', marginLeft: 3, marginRight: 3 }} /> : actuary.e_MonthRatio < 0 ? <CaretDownOutlined
                                                style={{ color: 'rgb(0,153,0)', marginLeft: 3, marginRight: 3 }} /> : ''}{actuary.e_MonthRatio}</span></p>
                                        <div>{actuary.e_MonthUsage}</div>
                                        <p>月均用电量 : {actuary.e_MonthAvg}</p>
                                    </div>
                                    <div className={style.dateData}>
                                        <p><span>本年用电量 (kWh)</span><span>年环比{actuary.e_YearRatio > 0 ? <CaretUpOutlined
                                            style={{ color: 'rgb(255,0,0)', marginLeft: 3, marginRight: 3 }} /> : actuary.e_YearRatio < 0 ? <CaretDownOutlined
                                                style={{ color: 'rgb(0,153,0)', marginLeft: 3, marginRight: 3 }} /> : ''}{actuary.e_YearRatio}</span></p>
                                        <div>{actuary.e_YearUsage}</div>
                                        <p>年均用电量 : {actuary.e_YearAvg}</p>
                                    </div>
                                    <div className={style.dateDataLast}>
                                        <div>
                                            <div className={style.rightImg} ><img src={imgurl.deviceDetail2}></img></div>
                                            <p><span style={{ fontSize: 18, color: '#333' }}>{actuary.e_All}</span> kWh</p>
                                            <p>累计用电量</p>
                                        </div>
                                        <div>
                                            <div className={style.rightImg} ><img src={imgurl.deviceDetail2}></img></div>
                                            <p><span style={{ fontSize: 18, color: '#333' }}>{actuary.coal}</span> kg</p>
                                            <p>累计转标煤</p>
                                        </div>
                                        <div>
                                            <div className={style.rightImg} ><img src={imgurl.deviceDetail1}></img></div>
                                            <p><span style={{ fontSize: 18, color: '#333' }}>{actuary.co2}</span> kg</p>
                                            <p>累计转二氧化碳</p>
                                        </div>
                                    </div>
                                </div>
                                <img src={imgurl.line} className={style.timeline} ></img>
                                <div className={style.chartHead}>
                                    <div>
                                        <Radio.Group defaultValue="1" buttonStyle="solid" onChange={changeTime}>
                                            <Radio.Button style={{ width: 96, height: 32, textAlign: 'center' }} value="1">今日</Radio.Button>
                                            <Radio.Button style={{ width: 96, height: 32, textAlign: 'center' }} value="2">本月</Radio.Button>
                                            <Radio.Button style={{ width: 96, height: 32, textAlign: 'center' }} value="3">本年</Radio.Button>
                                        </Radio.Group>
                                        {reportTypeTime == 1 ? <DatePicker onChange={onChangeDate} defaultValue={moment(today)}
                                            style={{ marginLeft: 32 }} /> : reportTypeTime == 2 ? <DatePicker onChange={onChangeDate}
                                                style={{ marginLeft: 32 }} picker='month' /> : <DatePicker onChange={onChangeDate}
                                                    style={{ marginLeft: 32 }} picker='year' />
                                        }
                                    </div>
                                    <div className={style.chartHeadRight}>
                                        <Button style={{ width: 96, backgroundColor: '#FFF', color: '#515151', marginLeft: 16 }} size="middle" onClick={() => { exportExecel() }}>导出</Button>
                                        <img src={imgurl.columnLine} style={{ width: 2, height: 33, marginRight: 32, marginLeft: 32 }} ></img>
                                        <Radio.Group defaultValue="trend" buttonStyle="solid" onChange={changeTable}>
                                            <Radio.Button style={{ width: 96, height: 32, textAlign: 'center' }} value="trend">趋势</Radio.Button>
                                            <Radio.Button style={{ width: 96, height: 32, textAlign: 'center' }} value="list">列表</Radio.Button>
                                        </Radio.Group>
                                    </div>

                                </div>
                                {trend === 1 ? <div><div ref={energyref} style={{ width: 1536, height: 513, marginTop: 16 }}></div></div> : trend === 2 ? <div>
                                    <Table columns={columnsTrend} dataSource={energyReport.Data} rowKey={columnsTrend => columnsTrend.id} style={{ marginTop: 16 }} className={style.alarmTable}></Table>
                                </div> : ''}
                            </div> : <div>
                                <img src={imgurl.line} style={{ width: 1537, height: 2, marginTop: -16, marginBottom: 16 }} ></img>
                                <div>
                                    <Table columns={columnsLog} dataSource={dataSourceLog} rowKey={columnsLog => columnsLog.id} className={style.alarmTable}></Table>
                                    <Pagination className={style.pageNumD} size="small" current={pageNum} total={totalalarm}  defaultPageSize={12} onChange={onChangePageLog} />
                                </div>
                            </div>}

                    </div>
                </div>
            </div>
        </div>
    )
}
