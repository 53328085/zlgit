import { React, useState, useEffect, useRef } from "react";
import mqtt from 'mqtt'
import styled from "styled-components";
import style from './style.module.less'
import { useSelector } from 'react-redux'
import { useAntdTable } from 'ahooks'
import imgurl from './images/index.js'
import { Pagination, message, DatePicker, Button, Radio, Empty, Form, Input, Divider, Typography, Select } from 'antd'
import { SearchOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Monitoring, RuntimeHMI, DeviceDtl } from '@api/api.js'
import Custmodal from '@com/useModal'
import { drawEcharts } from '@com/useEcharts'
import Titlelayout from '@com/titlelayout'
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
import { selectProjectId, mixtitle, systemConfigInfo, currProject, selectOneLevelDefaultId } from '@redux/systemconfig.js'
import { isObject, disabledDate } from "@com/usehandler"
import { selectUser } from '@redux/user.js'
import Ichart from '@com/useEcharts/Ichart';
import Table from '@com/useTable'
import Devicelog from './deviceLogs.js'
import moment from "moment";

import deviceDetail3 from './images/deviceDetail3.jpg'
import Control from './Control'
import { min } from "lodash";

const { Text } = Typography
const Mainbox = styled.div`
&&{
  background-color: ${props => props.theme.devicebgcolor || "#135abd"};
  .leftImgBox,.rightHead {
    background-color: ${props => props.theme.devicebgcolor || "#135abd"};
  }
  .head{
    background-color: ${props => props.theme.deviceheardcolor || "#003366"};
  }
  
}
`
const Textbox = styled(Text)`
   && {
    color: #666;
    width: 162px;
   }

`
const Ctitlec = styled.div`  // detail?.state == 2 ? style.leftImgState : detail.state == 3 ? style.leftImgStateAlarm : style.leftImgStateOff
&&{
    width: 96px;
    height: 32px;
    background-color: ${props => props.state == 2 ? props.theme.successColor : props.state == 3 ? props.theme.errorColor : "#666"};
    border: none;
   // border: 1px solid rgb(0, 204, 0);
    color: #fff;
    position: absolute;
    top: 16px;
    right: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
}
`
const deviceList = ['', '电表', '冷水表', '燃气表', '传感器', '变压器', '热水表', '蒸汽表', '煤炭表', '燃油表', '储能设备', '', '断路器', '触点测温', '光纤测温', '', '', '', '流量计']

const Chartbox = styled.div`
  display: grid;
  grid-template-rows:   ${props => {
        return props.n > 3 ? `repeat(${props.n}, 320)` : `repeat(${props.n}, 1fr)`
    }};
  flex: 1;
`
// 2,7
const Chartin = (props) => {
    let { group, data, deviceStyle } = props
    if (!group || !Array.isArray(data) || data.length == 0) return <Empty description={group ? `${group}暂无数据` : null} />

    let title = {
        EC: '电流(A)',
        WF: [2, 7].includes(deviceStyle) ? '用水量(m³)' : '电度(kWh)',
        EC: '电流(A)',
        EP: '电压(V)',
        TP: '温度(℃)'
    }[group] || '未知'




    let ref = useRef()
    useEffect(() => {
        let dimensions = ["time"]
        let source = []
        let series = Array(data.length).fill({
            type: "line",
            seriesLayoutBy: 'row',
            areaStyle: null,
            stack: null
        })

        data.forEach((d, index) => {
            let { point, data } = d;
            dimensions.push(point)
            if (index == 0) {
                source.push(data.map(t => t.time));
                source.push(data.map(t => t.value))
            } else {
                source.push(data.map(t => t.value))
            }
        })


        drawEcharts(ref.current, {
            dataset: {
                dimensions,
                source,
                sourceHeader: false,
            },
            series,
            dataZoom: {
                type: 'inside'
            },
            xAxis: {
                axisLabel: {
                    formatter: (value, index) => {
                        return moment(value, "YYYY-MM-DD HH:mm:ss").format("HH:mm")
                    },
                    interval: "auto"
                },

            },
            yAxis: { // 万工、老梁的方案
                min: function (value) {
                    return value.min - 10;
                },
                max: function (value) {
                    return value.max + 10;
                }
            }

        })
    }, [data])
    return (
        <Titlelayout title={title} layout="flex" pd={0} bordered="n">
            <div style={{ flex: 1 }} ref={ref}>
            </div>
        </Titlelayout>
    )


}
export default function GatewayDetail(props) {
    let devess = useSelector(state => state.system.deviceStyle);

    let location = useLocation()
    // let [searchParams, setSearchParams] = useSearchParams()
    const sn = new URLSearchParams(location.search).get('sn')

    // const sn = searchParams.get('sn')  
    const projectId = useSelector(selectProjectId)
    const enchtitle = useSelector(mixtitle)
    const { projectName, logoImage } = useSelector(currProject)
    const areaId = useSelector(selectOneLevelDefaultId)


    const { hostServer } = useSelector(selectUser)
    const channel = "HMI_" + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)

    var options = {

        clientId: channel,
    }
    //const mqtClient =mqtt.connect(hostServer, options)
    const { chineseTitle } = useSelector(systemConfigInfo)
    const { RangePicker } = DatePicker;
    const { RuntimeDevice: { Detail, Current, HistoryTrend, HistoryTable, EnergyActuary, EnergyReport, AlarmPage }, RuntimeLog, GetPointList, HistoryCurve } = Monitoring
    let [state, setstate] = useState(1)
    let [detail, setDetail] = useState({})
    const deviceStyle = detail?.deviceStyle;
    const OtherdeviceStyle = detail?.deviceStyle == 4 && detail?.category == 'ZTWLSENSOR-SL';
    const category = detail?.category
    const displaypoint = [4, 18].includes(detail?.deviceStyle)
    console.log(OtherdeviceStyle, detail)
    // 能耗趋势 文本 1： 电， 2. 7 冷水，热水，3. 燃气 4. 传感器 不显示 5.变压器,6. 视频 7.热水表 后面的不知道用什么单位？？
    // let todayT = ['用电量 (kWh)', '用电量 (kWh)', '用水量 (m³)', '用气量 (m³)', '', '用电量 (kWh)', '', '用水量 (m³)'][deviceStyle] || '用电量 (kWh)'   //今日, 本月, 本年 文本， 数据表格中

    // let todayA = ['用电量', '用电量', '用水量', '用气量', '', '用电量', '', '用水量'][deviceStyle] || '用电量'  // 日均， 月均， 年均， 累计

    // let unit = ['(kWh)', '(kWh)', '(m³)', '(m³)', '', '(kWh)', '', '(m³)'][deviceStyle] || '(kWh)'

    let todayT = {
        0: '用电量 (kWh)',
        1: '用电量 (kWh)',
        2: '用水量 (m³)',
        3: '用气量 (m³)',
        5: '用电量 (kWh)',
        7: '用水量 (m³)',
        18: '流量 (m³)'
    }[deviceStyle] || '';
    let todayA = { 0: '用电量', 1: '用电量', 2: '用水量', 3: '用气量', 5: '用电量', 7: '用水量', 18: "流量" }[deviceStyle] || '';
    let unit = { 0: '(kWh)', 1: '(kWh)', 2: '(m³)', 3: '(m³)', 5: '(kWh)', 7: '(m³)', 18: '(m³)' }[deviceStyle] || ''
    const [boptions, setOptions] = useState({   //能耗趋势图表
        series: [],
        grid: {
            left: "0px",
            right: "0",
            top: "30px",
            bottom: "0px",
            containLabel: true,
        },
        legend: {
            top: 0,
            icon: 'rect',
            itemHeight: 2,
            itemWidth: 12,
            itemGap: 20,
        },
        dataset: {
            dimensions: [],
            source: []
        },
        xAxis: {
            axisLabel: {
                interval: "auto"
            }
        }
    })


    // 水，电 ， 气；
    const isclude = [2, 7].includes(deviceStyle); // 是否是水表
    let showtab = ![4].includes(deviceStyle)// 王建需求： 传感器 不显示 监控趋势， 能耗趋势。

    //let dtlkeys = Number.isFinite(detail.state) ? ![2, 3].includes(detail.state) : true; // 0 离线
    let dtlkeys = false // 禅道任务 设备离线时能够查询历史数据 
    let [historyTable, setHistoryTable] = useState()
    let [current, setCurrent] = useState({})
    const elref = useRef(null)
    const vlref = useRef(null)
    const alref = useRef(null)
    const energyref = useRef(null)
    let [reportTypeTime, setreportTypeTime] = useState(1)
    let year = new Date().getFullYear()
    let month = new Date().getMonth() + 1
    let day = new Date().getDate()
    let date = year + '-' + (month > 9 ? month : '0' + month) + '-' + (day > 9 ? day : '0' + day)
    const today = moment().startOf('day');
    const tmonth = moment().startOf('month')
    //  console.log(today)
    // const yesterday = date + ' ' + "00:00:00"
    const yesterday = moment()
    let [dataList, setdataList] = useState([])
    let [dateValue, setdateValue] = useState(date)
    let [dataSourceLog, setdataSourceLog] = useState([])
    let [trend, settrend] = useState(1)
    let [energyReport, setEnergyReport] = useState({})
    let [actuary, setactuary] = useState({})
    // let dataToday = new Date()

    let dataToday = moment().format('YYYY-MM-DD HH:mm:ss')
    let [startTime, setstartTime] = useState(moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'))
    let [endTime, setendTime] = useState(dataToday)
    let [startTimeAlarm, setstartTimeAlarm] = useState(moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'))
    let [endTimeAlarm, setendTimeAlarm] = useState(dataToday)

    const [points, setPoints] = useState([])
    const [pointval, setPointval] = useState(null)
    const [ptrend, setPtrend] = useState({})
    const onchangeTab = val => {
        setstate(val)
        console.log(val, deviceStyle)
        setreportTypeTime(1)
        if (dtlkeys) return

        if (val == 3) {
            if (isclude) setreportTypeTime(2)
            getEnergyReport()
        } else if (val == 2) {
            if ([4, 18].includes(deviceStyle)) {
                historycurve(pointval)
            } else {
                getHistoryTrend()
                getHistoryTable()
            }
        }

    }//切换tab
    // const disabledDate = (current) => {
    //     return current && current > dayjs().endOf('day');
    // };
    let pday = moment().subtract(7, 'day'), cday = moment();
    const [logparm, setLogparm] = useState({ alike: '', deviceStyle: 12, start: pday.format("yyyy-MM-DD"), end: cday.format("yyyy-MM-DD") })
    let [logdata, setLogData] = useState([])
    const changelog = (v) => {
        let [start, end] = v;
        setLogparm({ ...logparm, start: start.format('yyyy-MM-DD'), end: end.format('yyyy-MM-DD') })
    }
    /*    const getLog= async () => {
         try {
            let {start, end, alike, deviceStyle} = logparm
            let {success, data}=  await RuntimeLog.QueryDeviceLogs(areaId, alike, deviceStyle,{projectId, pageNum: 1, pageSize: 1200,start, end})
            if(success && Array.isArray(data)) {
                setLogData(data)
            }
         } catch (error) {
            console.log(error)
         }
         
       } */

    const getLog = async ({ current, pageSize }) => {
        try {
            let { start, end, alike, deviceStyle } = logparm
            if (!alike) return
            let { success, data, total } = await RuntimeLog.QueryDeviceLogs(areaId, alike, deviceStyle, { projectId, pageNum: 1, pageSize: 1200, start, end })
            if (success && Array.isArray(data)) {
                return {
                    list: data,
                    total: total
                }
            } else {
                return {
                    list: [],
                    total: 0
                }
            }
        } catch (error) {
            console.log(error)
        }

    }
    const { tableProps: logProps } = useAntdTable(getLog, {
        defaultPageSize: 18,
        refreshDeps: [logparm]
    })

    // 传感器、流量计
    const ponchange = (v) => {
        setPointval(v)
        historycurve(v)
    }
    let { data: pdata, sn: psn } = isObject(ptrend) ? ptrend : {}
    let haspdata = Array.isArray(pdata) && pdata.length > 0;
    let pointoption = {
        series: [{
            type: "line",
            seriesLayoutBy: 'row',
        }],
        grid: {
            left: "0px",
            right: "0",
            top: "30px",
            bottom: "0px",
            containLabel: true,
        },
        legend: {
            top: 0,
            icon: 'rect',
            itemHeight: 2,
            itemWidth: 12,
            itemGap: 20,
        },
        dataZoom: {
            type: 'inside'
        },
        dataset: {
            dimensions: haspdata ? ["time", psn] : [],
            source: haspdata ? [pdata.map(p => p.x), pdata.map(p => p.y)] : []
        },
        xAxis: {
            axisLabel: {
                formatter: (value, index) => {
                    return moment(value, "YYYY-MM-DD HH:mm:ss").format("HH:mm:ss")
                },
                interval: "auto"
            },


        }
    }
    let paramspointTrend = { // 传感器、流量计 监控趋势
        sn,
        start: startTime,
        end: endTime,
        projectId,
        pointName: ''
    }
    const historycurve = async (pointName) => {
        try {
            paramspointTrend.pointName = pointName
            let { data, success } = await HistoryCurve(paramspointTrend)

            if (success && isObject(data)) {
                setPtrend(data)


            } else {
                setPtrend({})
            }
        } catch (error) {
            setPtrend({})
        }
    }
    const getPoints = async (params) => {
        try {
            let data = await GetPointList(params)
            if (Array.isArray(data) && data.length > 0) {
                setPoints(data)
                setPointval(data[0].name)
                historycurve(data[0].name)
            } else {
                setPoints([])
                setPointval(null)
                setPtrend({})
            }
        } catch (error) {

        }
    }
    const getData = () => {//设备详情
        return Current(projectId, encodeURIComponent(sn)).then(res => {
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
        return Detail(projectId, encodeURIComponent(sn)).then(res => {
            let { success, data } = res
            if (success) {

                if (data?.deviceStyle == 2 || data?.deviceStyle == 7) {
                    setreportTypeTime(2)
                };
                if (data?.deviceStyle == 12) {
                    setLogparm({ ...logparm, alike: data.sn, deviceStyle: data.deviceStyle })
                    //  logparm.alike = data.sn
                    //  logparm.deviceStyle = data.deviceStyle
                    //  getLog()
                }
                setDetail(data || {})

            } else {

                message.error(res.errMsg)
            }
        }).catch(e => {

            setDetail({})
            console.log(e)
        })
    }

    // 消除告警
    const onCancle = async (sn) => {
        try {
            let { success, errMsg } = await DeviceDtl.IgnoreAlarm({ projectId, sn })
            if (!success) return message.warning(errMsg)
            message.success('消除告警成功')
            getDetailData()
        } catch (error) {

        }

    }

    let paramsTrend = {
        sn,
        start: startTime,
        end: endTime,
        projectId
    }
    const [historyTrend, sethistoryTrend] = useState()

    const getHistoryTrend = () => {//
        return HistoryTrend(paramsTrend).then(res => {
            let { success, data } = res
            if (success) {
                sethistoryTrend(data)
                dealData()
            } else {
                message.error(res.errMsg)
            }
        }).catch(e => {
            //  console.log(e)
        })
    }
    const getHistoryTable = () => {//
        return HistoryTable(paramsTrend).then(res => {
            let { success, data } = res
            if (success) {
                setHistoryTable(data)
            } else {
                message.error(res.errMsg)
            }
        }).catch(e => {
            // console.log(e)
        })
    }
    const getEnergyTrend = () => {//
        return EnergyActuary(projectId, encodeURIComponent(sn)).then(res => {    // getEnergyTrend getData projectId, sn   detail
            let { success, data } = res
            if (success) {
                setactuary(data || {})
            } else {
                message.error(res.errMsg)
            }
        })
    }
    let [pageNum, setPageNum] = useState(1)
    let [totalalarm, settotalalarm] = useState(1)
    let paramsAlarm = {
        projectId: projectId,
        sn: sn,
        start: startTimeAlarm,
        end: endTimeAlarm,
        pageSize: 12,
        pageNum: pageNum
    }

    const getAlarmPage = () => {//
        return AlarmPage(paramsAlarm).then(res => {
            let { success, data } = res
            if (success) {
                setdataSourceLog(data)
                settotalalarm(res.total)
            } else {
                message.error(res.errMsg)
            }
        })
    }
    const onChangePageLog = (page, pageSize) => {
        setPageNum(page)
    }
    let paramsReport = {
        projectId: projectId,
        sn,
        type: reportTypeTime,
        date: dateValue
    }

    const getEnergyReport = () => {// 水表不展示日趋势线
        if (!deviceStyle) return
        if ([2, 7].includes(deviceStyle) && paramsReport.type == 1) return

        return EnergyReport(paramsReport).then(res => {
            let { success, data, errMsg } = res
            setEnergyReport(data)
            if (success && isObject(data)) {
                let { Data = [], Header = [] } = data
                let dimensions = Header.map(h => ({ name: h.Name, displayName: h.Display }))
                setOptions({
                    ...boptions,
                    series: Array.from({ length: Header.length - 1 }, () => ({ type: "line", seriesLayoutBy: 'row' })),
                    dataset: {
                        dimensions,
                        source: Data,
                        sourceHeader: false,
                    }
                })
            } else {
                setOptions({
                    ...boptions,
                    series: [],
                    dataset: {
                        dimensions: [],
                        source: [],
                        sourceHeader: false,
                    }
                })
                if (!success) message.warning(errMsg || "数据出错")
            }


            /* if (success) {
                setEnergyReport(data)
                let x = []
                let y = []
                let y1 = []
                let y2 = []
                let y3 = []
                let y4 = []
                const chartsData = data.Data.map((item, index) => {
                    x.push(item.Time)
                    y.push(item.E)
                    y1.push(item.E1)
                    y2.push(item.E2)
                    y3.push(item.E3)
                    y4.push(item.E4)
                })
                console.log(x)
                let objList = [{ data: y, type: 'line', name: '用电量-总(kWh)' },
                { data: y1, type: 'line', name: '用电量-尖(kWh)' },
                { data: y2, type: 'line', name: '用电量-峰(kWh)' },
                { data: y3, type: 'line', name: '用电量-平(kWh)' },
                { data: y4, type: 'line', name: '用电量-谷(kWh)' }
            ]
                tdrawEcharts(energyref.current, option(objList, x, 0))
                
            } else {
                message.error(res.errMsg)
            } */
        })
    }
    const drawTrendCharts = () => {
        tdrawEcharts(vlref.current, option(objList2, xAxisTrendList[1], 90))
        tdrawEcharts(alref.current, option(objList1, xAxisTrendList[0], 90))
        tdrawEcharts(elref.current, option(objList3, xAxisTrendList[2], 90))
    }
    let objList1 = []
    let objList2 = []
    let objList3 = []
    let xAxisTrendList = []
    const dealData = () => {
        if (historyTrend) {
            historyTrend.map((item, index) => {
                if (item.data && item.data.length != 0) {
                    for (let i = 0; i < item.data.length; i++) {
                        let xAxisTrend = []
                        let yAxis = []
                        let obj = {}
                        for (let j = 0; j < item.data[i].data.length; j++) {
                            xAxisTrend.push(item.data[i].data[j].time)
                            yAxis.push(item.data[i].data[j].value)
                            obj.name = item.data[i].point
                        }
                        obj.data = yAxis
                        obj.type = 'line'
                        xAxisTrendList.push(xAxisTrend)
                        if (index == 0) {
                            objList1.push(obj)
                        } else if (index == 1) {
                            objList2.push(obj)
                        } else if (index == 2) {
                            objList3.push(obj)
                        }
                    }
                }
            })
        }
        drawTrendCharts()
    }

    const option = (objList, xAxisTrend, start) => ({
        xAxis: {
            data: xAxisTrend ? xAxisTrend : [],
            type: "category",
            boundaryGap: true,
            axisTick: {
                alignWithLabel: true,
            },
            axisLabel: {
                //     formatter: (value) => {       
                //        return moment(value, "YYYY-MM-DD HH:mm:ss").format("HH:mm")        
                //       //return  type.value == 1 ? Utlis.chintDate(value, 3) : value;
                //     },
            },
        },
        series: objList ? objList : [],
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
        dataZoom: {
            type: 'inside',
            //  start: start,
            // end: 100,

        }
    });
    const format = 'YYYY-MM-DD HH:mm:ss'
    const [value, setValue] = useState(null);
    const tdrawEcharts = (c, option) => {
        return drawEcharts(c, { ...option, type: 2 })
    }
    const onTimeOk = (date = [], dataString) => {
        let f = dataString.some(d => d);
        if (!f) return
        setstartTime(dataString[0])
        setendTime(dataString[1])
        setValue(date)
    }//监控趋势选择时间
    const [dates, setDates] = useState([moment().startOf('day'), moment()]);

    const disabledDate = (current) => {
        if (!dates) {
            return false;
        }
        const tooLate = dates[0] && current.diff(dates[0], 'months') >= 3;
        const tooEarly = dates[1] && dates[1].diff(current, 'months') >= 3;
        const date = current && current > dayjs().endOf('day')
        return !!tooEarly || !!tooLate || !!date;
    };
    const onOpenChange = (open) => {
        if (open) {
            setDates([null, null]);
        } else {
            setDates(null);
        }
    };

    const onTimeOkAlarm = (date = [], dataString) => {
        let f = dataString.some(d => d);
        if (!f) return
        setstartTimeAlarm(dataString[0])
        setendTimeAlarm(dataString[1])
    }//告警记录选择时间
    const onSearch = () => {
        if ([4, 18].includes(deviceStyle)) {
            historycurve(pointval)
        } else {
            getHistoryTrend()
            getHistoryTable()
        }

    }//监控趋势更改时间
    const onSearchAlarm = () => {
        // if(dtlkeys) return
        getAlarmPage()
    }
    const changeTime = (e) => {
        console.log(e.target.value)
        setreportTypeTime(parseInt(e.target.value))
        //reportType=parseInt(e.target.value)
    }//切换日月年

    const onChangeDate = (date, dateString) => {
        if (!dateString) return;
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
    const tableLoadRef = useRef()
    const exportExecel = () => {
        tableLoadRef.current.download()
    }//数据导出
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
    const columnsTrend = [
        {
            title: '日期时间',
            dataIndex: 'Time',
            key: 'Time',
            id: 'Time'
        },
        {
            title: todayT,
            dataIndex: 'E',
            key: 'E',
            id: 'E'
        }
    ];

    const onHerart = () => {
        let params = {
            projectId,
            channel,
            points: [],
            sn,
        }
        RuntimeHMI.onHerart(params).then(res => {

        }).catch(e => {
            console.log(e)
        })
    }
    /*   useEffect(() => {
          let timer ;
          timer = window.setInterval(() => {
              onHerart();
             }, 10*1000*60) 
           onHerart();
           mqtClient.on("connect", (e) => {
             console.log("连接成功:");
             mqtClient.subscribe(
              "HMI/202305220008",
              (error) => {
                if (!error) {
                 console.log("订阅成功");
                } else {
                  console.log("订阅失败");
                }
              }
            );
           })
           mqtClient.on("message", (topic, message, packet) => {
              console.log('message')
              let mqttData = JSON.parse(message.toString()).Points;
              console.log(mqttData)
             // setdataList(mqttData)
             
           })
  
           // 断开发起重连
           mqtClient.on("reconnect", (error) => {
             console.log("正在重连:", error);
           });
        // 链接异常处理
           mqtClient.on("error", (error) => {
          console.log("连接失败:", error);
           });
          return () => {
              timer = null
              mqtClient.end()
              RuntimeHMI.onStop(channel)
          }
  
      }, [location]) */
    useEffect(() => {
        document.title = enchtitle + ' ' + (location.state?.title || '')
        return () => document.title = enchtitle
    }, [location])
    /*     useEffect(() => {
            dealData()
        }, [historyTable, historyTrend]) */

    useEffect(() => {  // 设备详情如果没有数据返回就不调下面的接口
        getDetailData()
    }, [projectId, sn])
    useEffect(() => {
        if (dtlkeys) return
        getData()
        getEnergyTrend()
    }, [sn, projectId, dtlkeys])



    useEffect(() => {
        if (dtlkeys) return
        console.log(dtlkeys)
        if ([4, 18].includes(deviceStyle)) {
            historycurve(pointval)
        } else {
            getHistoryTrend()
            getHistoryTable()
        }
    }, [sn, projectId, startTime, endTime, dtlkeys])


    useEffect(() => {
        if (dtlkeys) return
        getAlarmPage()
    }, [sn, projectId, startTimeAlarm, endTimeAlarm, pageNum, dtlkeys])


    useEffect(() => {
        if (dtlkeys) return
        getEnergyReport()

    }, [dateValue, projectId, sn, reportTypeTime, trend, dtlkeys])


    useEffect(() => {
        if (Number.isInteger(projectId) && category && [4, 18].includes(deviceStyle)) {
            getPoints({ projectId, category })
        }

    }, [projectId, category, deviceStyle])
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
    return (
        <Mainbox className={style.main}>
            <div className={style.head + " head"}>
                <img src={logoImage || imgurl.logo} className={style.headImg} ></img>
                <p>{projectName}综合能源服务平台</p>
            </div>
            <div className={style.body}>
                <div className={style.left}>
                    <div className={style.leftHead}><div className={style.leftHeadLine} ></div>
                        <p>设备详情</p></div>
                    <div className={style.leftImgBox + " leftImgBox"}>
                        <img src={detail?.imageBase64 ? detail?.imageBase64 : imgurl.category} className={style.leftImg} ></img>
                        <Ctitlec state={detail?.state}>{detail.state == 2 ? '设备在线' : detail.state == 3 ? '设备告警' : '设备离线'}</Ctitlec>
                    </div>
                    <div className={style.leftBottom}>
                        <p><span className={style.leftBottomSpan}>设备类型：</span><Textbox ellipsis={{ tooltip: deviceList[detail.deviceStyle] }}>{deviceList[detail.deviceStyle] || ''}</Textbox></p>
                        <p><span className={style.leftBottomSpan}>设备编号：</span><Textbox ellipsis={{ tooltip: detail.sn }}>{detail.sn}</Textbox></p>
                        <p><span className={style.leftBottomSpan}>设备型号：</span><Textbox ellipsis={{ tooltip: detail.category }}>{detail.category}</Textbox></p>
                        <p><span className={style.leftBottomSpan}>设备名称：</span><Textbox ellipsis={{ tooltip: detail.name }}>{detail.name}</Textbox></p>
                        <p><span className={style.leftBottomSpan}>能耗类型：</span><Textbox>{detail.customerType == 1 ? '客户能耗' : detail.customerType == 2 ? '公共能耗' : '/'}</Textbox></p>
                        <p><span className={style.leftBottomSpan}>所属网关：</span><Textbox ellipsis={{ tooltip: detail.gateway || '' }}>{detail.gateway ? detail.gateway : '/'}</Textbox></p>
                        <div className={style.line}></div>
                        <p><span className={style.leftBottomSpan}>安装地址：</span></p>
                        <p><span>{detail.address}</span></p>

                    </div>
                    {detail?.state === 3 && <Button type="primary" block danger onClick={() => onCancle(detail.sn)} style={{ height: '48px' }}>忽略告警</Button>}
                </div>
                <div className={style.right}>
                    <div className={style.rightHead + " rightHead"}>
                        <div className={state == 1 ? style.tabBoxW : style.tabBoxB} onClick={() => { onchangeTab(1) }}>实时数据</div>
                        {showtab &&
                            <>
                                <div className={state == 2 ? style.tabBoxW : style.tabBoxB} onClick={() => { onchangeTab(2) }}>监控趋势</div>
                                {detail?.calculate && <div className={state == 3 ? style.tabBoxW : style.tabBoxB} onClick={() => { onchangeTab(3) }}>能耗趋势</div>}

                            </>
                        }
                        {deviceStyle != 12 && <div className={state == 4 ? style.tabBoxW : style.tabBoxB} onClick={() => { onchangeTab(4) }}>告警记录</div>}
                        {deviceStyle == 12 && <div className={state == 6 ? style.tabBoxW : style.tabBoxB} onClick={() => { onchangeTab(6) }}>设备日志</div>}

                        {detail.status && detail.status['1'] && <div className={state == 5 ? style.tabBoxW : style.tabBoxB} onClick={() => { onchangeTab(5) }}>远程控制</div>}
                    </div>
                    {state == 1 ? <div><div className={style.newTime}>
                        <img src={imgurl.time} className={style.time} ></img>
                        <p>数据最新更新时间：{current.lastSampleTime}</p>
                    </div>
                        <img src={imgurl.line} className={style.timeline} ></img></div> : state == 2 ? <div className={style.newTime}>
                            <span style={{ marginRight: 16 }}>请选择日期范围</span>
                            <RangePicker
                                value={dates || value}
                                disabledDate={disabledDate}
                                onCalendarChange={(val) => setDates(val)}
                                onChange={onTimeOk}
                                //    onOpenChange={onOpenChange}
                                defaultValue={[moment().startOf('day'), moment()]}
                                format='YYYY-MM-DD HH:mm:ss'
                                showTime
                            />
                            {/* <RangePicker
                                format='YYYY-MM-DD HH:mm:ss' disabledDate={disabledDate} showTime onChange={onTimeOk} defaultValue={[moment(yesterday), moment(today)]} /> */}
                            {displaypoint && <Select options={points} value={pointval} onChange={ponchange} fieldNames={{ label: "description", value: "name" }} style={{ width: 200, marginLeft: "16px" }}></Select>}
                            <Button style={{ marginLeft: 16, width: 96, height: 32 }} type="primary" onClick={onSearch} icon={<SearchOutlined />} >查询</Button>
                        </div> : (state == 3) ? <div><div className={style.newTime}>
                            <img src={imgurl.time} className={style.time} ></img>
                            <p>数据最新更新时间：{current.lastSampleTime}</p>
                        </div> </div> : (state == 6) ? <div><div className={style.newTime}>
                            <img src={imgurl.time} className={style.time} ></img>
                            <p style={{ paddingRight: '1em' }}>数据最新更新时间：{current.lastSampleTime}</p>
                            <RangePicker format="YYYY-MM-DD" defaultValue={[pday, cday]} onChange={changelog} disabledDate={disabledDate} />
                        </div> </div> : state == 4 ? <div className={style.newTime}>
                            <RangePicker format='YYYY-MM-DD HH:mm:ss' showTime disabledDate={(cur) => cur && cur >= moment().endOf('day')} onChange={onTimeOkAlarm} defaultValue={[today, yesterday]} />
                            <Button style={{ marginLeft: 16, width: 96, height: 32 }} type="primary" onClick={onSearchAlarm} icon={<SearchOutlined />} >查询</Button>

                        </div> : null
                    }

                    <div className={state !== 5 ? style.tableBox : ''} style={{ display: 'flex', flexDirection: "column", flex: 1 }}>
                        {state == 1 ?
                            <div>
                                <div className={style.dataHeader}>
                                    设备参量
                                </div>
                                <div className={style.dataBottom}>
                                    {dataList ? dataList.map((item, index) => {
                                        return <div key={index} className={style.itemBox}>
                                            <div className={style.itemHead}>{item.name}</div>
                                            {!OtherdeviceStyle ? <div className={style.itemTail}> {circuitState[item.value] || item.value} </div>
                                                : <div className={style.itemTail}> {circuitStateOther[item.value] || item.value} </div>}
                                        </div>
                                    }) : ''}
                                </div>
                            </div>
                            : state == 2 ?
                                <> {displaypoint ? <Chartbox>
                                    <Ichart {...pointoption} />
                                </Chartbox> :
                                    <Chartbox n={historyTrend?.length}>
                                        {
                                            historyTrend?.map(data => <Chartin {...data} deviceStyle={deviceStyle} key={data.group} />)

                                        }

                                    </Chartbox>}
                                </>
                        /*   <div className={style.chartsBox}>
                                <div className={style.title}><div className={style.blueLine}></div><p>电压 (V)</p></div>
                                <div><div ref={vlref} style={{ width: '100%', height: 320, padding: 16 }}></div></div>
                                <div className={style.title}><div className={style.blueLine}></div><p>电流 (A)</p></div>
                                <div><div ref={alref} style={{ width: '100%', height: 320, padding: 16 }}></div></div>
                                <div className={style.title}><div className={style.blueLine}></div><p>电度 (kWh)</p></div>
                                <div> <div ref={elref} style={{ width: '100%', height: 320, padding: 16 }}></div></div>
                            </div>  */ : state == 3 ? <div>
                                    <div className={style.energyHead}>
                                        <div className={style.dateData}>
                                            <p><span>今日{todayT} </span><span>日环比{actuary?.e_DayRatio?.slice(0, 1) != '-' ? <CaretUpOutlined
                                                style={{ color: 'rgb(255,0,0)', marginLeft: 3, marginRight: 3 }} /> : actuary?.e_DayRatio?.slice(0, 1) == '-' ? <CaretDownOutlined
                                                    style={{ color: 'rgb(0,153,0)', marginLeft: 3, marginRight: 3 }} /> : ''}{actuary.e_DayRatio}</span></p>
                                            <div>{actuary.e_DayUsage}</div>
                                            <p>日均{todayA}  : {actuary.e_DayAvg}</p>
                                        </div>
                                        <div className={style.dateData}>
                                            <p><span>本月{todayT}</span><span>月环比{actuary.e_MonthRatio?.slice(0, 1) != '-' ? <CaretUpOutlined
                                                style={{ color: 'rgb(255,0,0)', marginLeft: 3, marginRight: 3 }} /> : actuary?.e_MonthRatio?.slice(0, 1) == '-' ? <CaretDownOutlined
                                                    style={{ color: 'rgb(0,153,0)', marginLeft: 3, marginRight: 3 }} /> : ''}{actuary.e_MonthRatio}</span></p>
                                            <div>{actuary.e_MonthUsage}</div>
                                            <p>月均{todayA} : {actuary.e_MonthAvg}</p>
                                        </div>
                                        <div className={style.dateData}>
                                            <p><span>本年{todayT}</span><span>年环比{actuary?.e_YearRatio?.slice(0, 1) != '-' ? <CaretUpOutlined
                                                style={{ color: 'rgb(255,0,0)', marginLeft: 3, marginRight: 3 }} /> : actuary?.e_YearRatio?.slice(0, 1) == '-' ? <CaretDownOutlined
                                                    style={{ color: 'rgb(0,153,0)', marginLeft: 3, marginRight: 3 }} /> : ''}{actuary.e_YearRatio}</span></p>
                                            <div>{actuary.e_YearUsage}</div>
                                            <p>年均{todayA} : {actuary.e_YearAvg}</p>
                                        </div>
                                        <div className={style.dateDataLast}>
                                            <div>
                                                <div className={style.rightImg} ><img width={68} height={68} src={deviceDetail3}></img></div>
                                                <p><span style={{ fontSize: 18, color: '#333' }}>{actuary.e_All}</span>{unit}</p>
                                                <p>累计{todayA}</p>
                                            </div>
                                            <div>
                                                <div className={style.rightImg} ><img src={imgurl.deviceDetail2}></img></div>
                                                <p><span style={{ fontSize: 18, color: '#333' }}>{actuary.coal}</span> t</p>
                                                <p>累计转标煤</p>
                                            </div>
                                            <div>
                                                <div className={style.rightImg} ><img src={imgurl.deviceDetail1}></img></div>
                                                <p><span style={{ fontSize: 18, color: '#333' }}>{actuary.co2}</span> t</p>
                                                <p>累计转二氧化碳</p>
                                            </div>
                                        </div>
                                    </div>
                                    <img src={imgurl.line} className={style.timeline} ></img>
                                    <div className={style.chartHead}>
                                        <div>
                                            <Radio.Group defaultValue={isclude ? '2' : '1'} buttonStyle="solid" onChange={changeTime}>
                                                {!isclude && <Radio.Button style={{ width: 96, height: 32, textAlign: 'center' }} value="1">今日</Radio.Button>}
                                                <Radio.Button style={{ width: 96, height: 32, textAlign: 'center' }} value="2">本月</Radio.Button>
                                                <Radio.Button style={{ width: 96, height: 32, textAlign: 'center' }} value="3">本年</Radio.Button>
                                            </Radio.Group>
                                            {reportTypeTime == 1 ? <DatePicker onChange={onChangeDate} defaultValue={moment(today)}
                                                style={{ marginLeft: 32 }} /> : reportTypeTime == 2 ? <DatePicker onChange={onChangeDate}
                                                    style={{ marginLeft: 32 }} defaultValue={moment(tmonth)} picker='month' /> : <DatePicker onChange={onChangeDate}
                                                        style={{ marginLeft: 32 }} picker='year' />
                                            }
                                        </div>
                                        <div className={style.chartHeadRight}>
                                            {trend === 2 ? <div><Button style={{ width: 96, backgroundColor: '#FFF', color: '#515151', marginLeft: 16 }} size="middle" onClick={() => { exportExecel() }}>导出</Button>
                                                <img src={imgurl.columnLine} style={{ width: 2, height: 33, marginRight: 32, marginLeft: 32 }} ></img></div> : ''}
                                            <Radio.Group defaultValue="trend" buttonStyle="solid" onChange={changeTable}>
                                                <Radio.Button style={{ width: 96, height: 32, textAlign: 'center' }} value="trend">趋势</Radio.Button>
                                                <Radio.Button style={{ width: 96, height: 32, textAlign: 'center' }} value="list">列表</Radio.Button>
                                            </Radio.Group>
                                        </div>

                                    </div>
                                    {trend === 1 ? <div><div style={{ width: 1536, height: 480, paddingTop: 16 }}> {/* ref={energyref}  */}
                                        <Ichart {...boptions} />
                                    </div></div> : trend === 2 ? <div>
                                        <Table ref={tableLoadRef} columns={columnsTrend} dataSource={energyReport.Data} scroll={{ y: 475, }}
                                            rowKey={columnsTrend => columnsTrend.id} style={{ marginTop: 16 }} hbc="#515151"></Table>
                                    </div> : ''}
                                </div> : state == 4 ? <div>
                                    <img src={imgurl.line} style={{ width: 1537, height: 2, marginTop: -16, marginBottom: 16 }} ></img>
                                    <div>
                                        {/* istheme="theme" */}
                                        <Table columns={columnsLog} dataSource={dataSourceLog} rowKey={columnsLog => columnsLog.id} hbc="#515151"></Table>
                                        <Pagination className={style.pageNumD} size="small" current={pageNum} total={totalalarm} pageSize={12} onChange={onChangePageLog} showSizeChanger={false} />
                                    </div>
                                </div> : state == 6
                                    ? <Devicelog logdata={logProps} /> :
                                    (state == 5 || state == 6) && <Control Custmodal={Custmodal} sn={sn} state={state} detail={detail} getDetailData={getDetailData} />



                        }

                    </div>
                </div>
            </div>
        </Mainbox>
    )
}
