import { React, useState, useEffect,useRef } from "react";
import style from './style.module.less'
import { useSelector } from 'react-redux'
import imgurl from './images/index.js'
import { Pagination, message, DatePicker, Button } from 'antd'
import { SearchOutlined } from '@ant-design/icons';
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

export default function GatewayDetail(props) {
    let location = useLocation()
    let search = location.search.substr(1, location.search.length)
    console.log(search)
    const projectId = useSelector(selectProjectId)
    const { RangePicker } = DatePicker;
    const [messageApi, contextHolder] = message.useMessage();
    const { RuntimeDevice: { Statistics, Overview, CategoryImages, Detail, Current, HistoryTrend, HistoryTable, EnergyActuary, EnergyReport, AlarmPage } } = Monitoring
    let [state, setstate] = useState(1)
    let [detail, setDetail] = useState({})
    let [current, setCurrent] = useState({})
    const elref=useRef(null)
    const vlref=useRef(null)
    const alref=useRef(null)
    let [dataList, setdataList] = useState([
        {
            name: 'A相电流（A）',
            value: '10.25'
        },
        {
            name: 'B相电流（A）',
            value: '1.58'
        },
        {
            name: 'C相电流（A）',
            value: '5.26'
        },
        {
            name: 'Uab线电压（V）',
            value: '220.12'
        },
    ])
    const onchangeTab = val => {
        setstate(val)
    }//切换tab
    const disabledDate = (current) => {
        // Can not select days before today and today
        return current && current < dayjs().endOf('day');
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
            if (success && data) {
                setCurrent(data)
            } else {
                messageApi.open({
                    type: 'error',
                    content: res.errMsg
                })
            }
        })
    }
    const getDetailData = () => {//设备详情
        return Detail(projectId, search).then(res => {
            let { success, data } = res
            if (success && data) {
                setDetail(data)
            } else {
                messageApi.open({
                    type: 'error',
                    content: res.errMsg
                })
            }
        })
    }
    let dataToday=new Date()
    let paramsTrend={
      sn:search,
      start:dataToday,
      end:dataToday
    }
    const getHistoryTrend = () => {//
        return HistoryTrend(paramsTrend).then(res => {
            let { success, data } = res
            if (success && data) {
                //setDetail(data)
                
                console.log(JSON.parse(data))
                charts()
            } else {
                messageApi.open({
                    type: 'error',
                    content: res.errMsg
                })
            }
        })
    }
    const getHistoryTable = () => {//
        return HistoryTable(paramsTrend).then(res => {
            let { success, data } = res
            if (success && data) {
                //setDetail(data)
                
                console.log(JSON.parse(data))
               // charts()
            } else {
                messageApi.open({
                    type: 'error',
                    content: res.errMsg
                })
            }
        })
    }
    const datasetMonthV = {
        dimensions: ["name", "value"],
        source:[] ,
      };
      const datasetMonthA = {
        dimensions: ["name", "value"],
        source:[] ,
      };
      const datasetMonthE = {
        dimensions: ["name", "value"],
        source:[] ,
      };
      const grid = {
        // 图表 grid
        left: "0px",
        right: "0",
        top: "30px",
        bottom: "0px",
        containLabel: true,
      }
    const charts=()=>{
        drawEcharts(vlref.current, {
          dataset: datasetMonthV,
          series: [{ type: "line" ,name:'电压 (V)'}],
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
          series: [{ type: "line" ,name:'电流 (A)'}],
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
          series: [{ type: "line" ,name:'电度 (kWh)'}],
          grid,
          legend: {
            icon: 'rect',
            itemHeight: 8,
            itemWidth: 8,
            itemGap: 20
          },
          
        })
      }
    useEffect(() => {
        getData()
        getDetailData()
        getHistoryTrend()
        getHistoryTable()
    }, [search, projectId])
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
                            <RangePicker format='YYYY-MM-DD HH:mm:ss' disabledDate={disabledDate} 
                                showTime={{
                                    hideDisabledOptions: true,
                                    defaultValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('11:59:59', 'HH:mm:ss')],
                                }} />
                            <Button style={{ marginLeft: 16,width:96,height:32 }} type="primary" icon={<SearchOutlined />} >查询</Button>
                        </div> : state == 3 ? <div><div className={style.newTime}>
                            <img src={imgurl.time} className={style.time} ></img>
                            <p>数据最新更新时间：{current.lastSampleTime}</p>
                        </div>
                            <img src={imgurl.line} className={style.timeline} ></img></div> : <div></div>}

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
                                <div ref={vlref} style={{ width: '100%', height: 320, padding: 16 }}></div>
                                <div className={style.title}><div className={style.blueLine}></div><p>电流 (A)</p></div>
                                <div ref={alref} style={{ width: '100%', height: 320, padding: 16 }}></div> 
                                <div className={style.title}><div className={style.blueLine}></div><p>电度 (kWh)</p></div>
                                <div ref={elref} style={{ width: '100%', height: 320, padding: 16 }}></div>
                            </div> : state == 3 ? <div>3</div> : <div>4</div>}

                    </div>
                </div>
            </div>
        </div>
    )
}
