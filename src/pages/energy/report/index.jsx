import React, { useState, useCallback, useRef, useEffect, useMemo, Children } from 'react'
import { Checkbox, DatePicker, message, Tooltip, Descriptions, Radio, Select, Input } from 'antd'
import moment from 'moment'

import { useOutletContext } from 'react-router-dom'
import { useAntdTable } from 'ahooks'
import CustContext from '@com/content.js'
import Pagecount from '@com/pagecontent'
import UserTable from "@com/useTable";
import UserTree from "@com/useTree"
import { Space } from 'antd'
import { getTime, isObject } from '@com/usehandler'
import styled from 'styled-components'
import { energyReport } from '@api/api'
import CModal from '@com/useModal'
import { ExportExcel, CustButton } from '@com/useButton'
import { Serach } from "@com/comstyled"
import { cols, conscols, timecols, typecols, fromlot, shitcols, aqtabs, etabs, wtabs, labelStyle, contentStyle, reportTypeopt } from './data'
import Ichart from '@com/useEcharts/Ichart';


const { RangePicker } = DatePicker;
const {

  QueryConsumeRegion, //实时抄表
  QueryConsumeHourTime, // 能耗报表
  QueryConsumeByTime, // 分时能耗
  QueryConsumeClassify, // 分类能耗
  QueryConsumeFromIot, //电能报表
  QueryConsumeDeviceShit, // 班次能耗
} = energyReport

const Contentbox = styled.div`
  display: grid;
  grid-template-columns: 296px 1fr;
  column-gap: 16px;
  flex: 1;
  .opt {
    display: flex;
    justify-content: flex-end;
    column-gap: 16px;
  }
  .search {
   display: flex;
   justify-content: flex-end;
   padding-bottom: 8px;
  }
`
const Chartwrap = styled.div`
  .chart {
    height: 430px;
    display: flex;
  }
  .foot{
    display: flex;
    justify-content: center;
    align-items: center;
    column-gap: 8px;
  }

`
/* 
[
    {
        "name": "电",
        "type": 1
    },
    {
        "name": "冷水",
        "type": 2
    },
    {
        "name": "热水",
        "type": 7
    },
    {
        "name": "燃气",
        "type": 3
    }
]
 */
export default function Index() {

  let { exparams, setCustview, setConfig } = useOutletContext()


  const [dates, setDates] = useState([moment().startOf("day"), moment().endOf("hour")]);

  const [startDateTime, setStartDateTime] = useState('')
  const [endDateTime, setEndDateTime] = useState('')

  const [isrange, setIsrange] = useState({ range: false })

  const [value, setvalue] = useState('0')
  const [line, setLine] = useState(0)
  const [treeId, setTreeId] = useState()
  let { areaId, projectId, type, date, energytype } = exparams // projectId = 30 安庆旺旺 项目定制 水电 只显示电能报表

  const [concolumns, setConcolumns] = useState([])
  const [alike, setAlike] = useState("")
  const [alikev, setAlikev] = useState("")
  const [reportType, setReportType] = useState(1)
  const [detailHeaders, setDetailHeaders] = useState([])
  const [valuet, setValuet] = useState(null);
  const alikeRef = useRef({})
  const onSearch = (e) => {
    setAlike(e)
    alikeRef.current[value] = e
  }
  const alikeChange = (e) => {
    setAlikev(e.target.value)

  }



  const toformat = {
    1: "HH:mm",
    2: "DD",
    3: "MM",
  }[type]
  const timeformt = {
    1: "YYYY-MM-DD HH:mm",
    2: "YYYY-MM-DD",
    3: "YYYY-MM",
  }[type]
  // 对比分析 start
  const Ctitle = useMemo(() => {

    if (!(date && type)) return ""
    let format = {
      1: "YYYY-MM-DD",
      2: "YYYY-MM",
      3: "YYYY",

    }[type]
    return `对比分析` //${date.format(format)}
  }, [date, type])

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onSelectChange = (newkey, rows) => {

    if (newkey?.length > 3) {
      return message.warning("最多选择3条信息进行对比")
    } else {
      setSelectedRowKeys(newkey)
    }
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    hideSelectAll: true,
    preserveSelectedRowKeys: false,

  };


  //  对比分析 end

  const [total, setTotal] = useState(0)
  const tbref = useRef()

  // const [tabs, setTabs] = useState(etabs)
  const index = Number(value)  // 30 电能报表



  const tabs = useMemo(() => {

    if (projectId == 30) {
      setvalue("1")
      return aqtabs
    } else if (energytype == 1) {
      // setvalue("0")
      return etabs
    } else {
      // setvalue("0")
      return wtabs
    }

  }, [projectId, energytype])



  useEffect(() => {
    if (["0", "1", "4"].includes(value) && isrange.range) {
      setConfig((o) => ({ ...o, disabledDate: value != "1" }))
    } else {
      setConfig((o) => ({ ...o, disabledDate: false }))
    }
    setConfig((o) => ({ ...o, reportType: value == "1" && isrange.range }))
    setConfig((o) => ({ ...o, onlye: ["2", "4"].includes(value) })) // 分时能耗，账单表单只有电
    let str = typeof alikeRef.current?.[value] === "string" ? alikeRef.current?.[value] : ""
    setAlike(str)
    setAlikev(str)
  }, [value, isrange])
  useEffect(() => {
    return () => {
      setConfig((o) => ({ ...o, disabledDate: false, reportType: false, onlye: false }))
    }
  }, [])

  /* 
   if (energytype == 1) {
        setTabs([...etabs])
      } else if (energytype == 2) {
        setTabs([...wtabs])
      } else if (energytype == 7) {
        setTabs([...wtabs])
      }
   */

  const sheetName = useMemo(() => {
    let filename = "sheet"
    let f = ["0", "1", "4"].includes(value)
    //  console.log(dates)
    if (Array.isArray(valuet) && valuet?.[0] && valuet?.[1]) {
      filename = getTime(valuet?.[0], 1).toString() + "-" + getTime(valuet?.[1], 1).toString() + tabs?.[index]?.label
    }
    return (f && isrange.range && valuet?.length) ? filename : (tabs?.[index]?.label ?? 'sheet')

  }, [value, valuet, tabs, isrange])

  let columns = useMemo(() => {

    let column = [cols(startDateTime, endDateTime), [], timecols, typecols, fromlot, shitcols][index]
    if ([0, 3].includes(index)) {
      return column.map(c => {
        if (c.dataIndex == 'consume' && index == 0) { // 实时抄表

          c.title = (energytype == 1 ? '用能(kWh)' : '用量(m³)')
        }
        if (c.dataIndex == 'consume' && index == 3) {  // 分类报表
          c.title = (energytype == 1 ? '用能(kWh)' : '用水量（m³）')
        }

        return c
      })
    } else {
      return column
    }

  }, [index, energytype, startDateTime, endDateTime])





  const getTableData = ({ current, pageSize, areaId, projectId, type, date, energytype, treeId, index, line, isrange, valuet, alike, reportType }) => {
    //  console.log(date)



    let f = [areaId, projectId, type, energytype, index, line].every(v => Number.isInteger(v)) && Array.isArray(treeId) && date


    let range = [0, 1, 4].includes(index) && isrange.range && Array.isArray(valuet) && valuet?.length > 1
    if (!f) return;
    if (index === 0 && isrange.range && !Array.isArray(valuet)) {
      return
    }

    let hander = [
      QueryConsumeRegion,
      QueryConsumeHourTime,
      QueryConsumeByTime,
      QueryConsumeClassify,
      QueryConsumeFromIot,
      QueryConsumeDeviceShit,
    ][index]
    let dateType = { 1: "day", 2: "month", 3: "year" }[type]

    let params = {
      projectId,
      meterType: energytype,
      startDate: range ? valuet?.[0]?.format("YYYY-MM-DD HH:mm") : date?.startOf(dateType).format("YYYY-MM-DD HH:mm"),
      endDate: range ? valuet?.[1]?.format("YYYY-MM-DD HH:mm") : date?.endOf(dateType).format("YYYY-MM-DD HH:mm"),
      pageNum: current,
      pageSize,
      queryType: line,
      ids: treeId,
      type: type, // 
      reportType,
      filterInfo: alike,
      customTime: range // 日期范围优化
    }
    //新需求 除分类能耗外 都添加搜索
    // let params = range ? {...query, customTime:true} : query
    setStartDateTime(range ? valuet?.[0].format("YYYY-MM-DD HH:mm") : date?.startOf(dateType).format("YYYY-MM-DD HH:mm"))
    setEndDateTime(range ? valuet?.[1].format("YYYY-MM-DD HH:mm") : date?.endOf(dateType).format("YYYY-MM-DD HH:mm"))
    /*  if (index == 0) {
       params.filterInfo = alike
     } */

    // //  cols 实时抄表，  conscols 能耗报表 , typecols 分类能耗
    /*    if(parseInt(projectId)!==30) {
       
       if (energytype == 1) {
         setTabs([...etabs])
       } else if (energytype == 2) {
         setTabs([...wtabs])
       } else if (energytype == 7) {
         setTabs([...wtabs])
       }
     } 
    */



    if (index == 1) {
      conscols?.forEach(e => {
        if (e?.dataIndex == 'total') {
          e.title = energytype == 1 ? '能耗(kWh)' : '能耗（m³）'
        }
      })
    }

    if (!hander) return message.warning("请求方法不存在")

    return hander(params).then(res => {
      let { success, data, total = 0 } = res
      setTotal(total)
      let fag = [1, 5].includes(index) && isObject(data)
      let arrData = [], counsume = []

      if (success && ((Array.isArray(data) && data.length > 0) || fag)) {
        if (index == 1) {
          let { detailHeaders, detailDatas } = data
          setDetailHeaders(detailHeaders)
          if (!Array.isArray(detailHeaders)) return
          let last = detailHeaders.length - 1
          let column = detailHeaders.map((col, index) => ({
            title: col, children: [
              {
                title: "读数",
                dataIndex: col + 'r',
                key: col + 'r',
                width: 70,
                fixed: index == last ? "right" : false
              },
              {
                title: "用量",
                dataIndex: col + 'v',
                key: col + 'v',
                width: 70,
                fixed: index == last ? "right" : false
              }

            ]
          }))
          // let column = detailHeaders.map(col => ({title: col, dataIndex: col, key: col,width: "96px", render: (text)=> Math.round(parseFloat(text))}))  

          setConcolumns([...conscols, ...column])
          counsume = detailDatas.map(item => {
            let { detailValues, detailReadings } = item;
            for (const [index, val] of detailHeaders?.entries()) {
              item[val + 'v'] = detailValues[index]
              item[val + 'r'] = detailReadings[index]
            }
            return item
          })

        } else if (index == 5) {
          let { heads, datas } = data
          let ishead = Array.isArray(heads) && heads?.length
          if (ishead) {
            let shiftcolumn = heads.map(h => ({
              title: `${h.name}`,
              dataIndex: `${h.name}`,
              //  render: (text)=> Math.round(parseFloat(text)),
            }))
            setConcolumns([...shitcols, ...shiftcolumn])

          }

          if (Array.isArray(datas) && ishead) {

            arrData = datas.map(d => {
              let { e, ...rest } = d
              if (Array.isArray(e) && e.length) {
                e.forEach((v, index) => {
                  let key = heads[index]?.name
                  rest[key] = v
                })

              }

              return rest
            })
          }

        }


        return {
          list: index == 5 ? arrData : index == 1 ? counsume : data,
          total: total
        }
      } else {
        return {
          list: [],
          total: 0
        }
      }
    }).catch(e => {
      console.log(e)
    })


  }
  const { tableProps } = useAntdTable((params) => getTableData({ ...params, areaId, projectId, type, date, energytype, treeId, index, line, isrange, valuet, alike, reportType }), {
    defaultParams: [{ current: 1, pageSize: 18 }],
    refreshDeps: [areaId, projectId, type, date, energytype, treeId, index, line, isrange, valuet, alike, reportType]
  })


  // 对比分析 图表
  const modref = useRef()
  const [checkvalue, setCheckvalue] = useState(["1"])
  const [checks, setChecks] = useState(["1"]) // 留着待用
  const checkedRef = useRef([])
  const checkChange = (e) => {
    checkedRef.current = e
    setCheckvalue(e)
  }
  const comparehandler = () => { // 留着待用
    setChecks(checkedRef.current)
  }
  const [source, dimensions, chartlen, unit] = useMemo(() => {
    let { dataSource = [] } = tableProps || {}
    let datas = dataSource.filter(d => selectedRowKeys.some(s => s.includes(d.sn) && s.includes(d.nodeName)))

    let { unit } = datas?.[0] || {}
    let dimensions = datas?.map?.(d => d.name) || []
    let source = checkvalue?.length > 0 ? (datas?.map?.(d => d.detailValues) || []) : []
    return [[detailHeaders, ...source], ["time", ...dimensions], dimensions.length, unit]
  }, [selectedRowKeys, tableProps, checkvalue, detailHeaders])

  const baroption = {
    series: new Array(chartlen).fill({ type: "bar", seriesLayoutBy: 'row' }), // [{ type: "bar",seriesLayoutBy: 'row' }], 
    grid: {
      left: "0px",
      right: "0",
      top: "40px",
      bottom: "35px",
      containLabel: true,
    },
    legend: {
      top: "5px",
    },
    xAxis: {
      type: 'category',
      axisLabel: {
        formatter: (value) => moment(value, timeformt).format(toformat)
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (value) => value + unit
      }
    },
    dataset: {
      dimensions,
      source,
      sourceHeadr: true
    },
    toolbox: {
      show: true,
      feature: {
        magicType: {
          type: ['line', 'bar',]
        },
        saveAsImage: {},

      },
      top: "5px",
      right: "10px"
    }
  }
  const oncompare = () => {
    if (selectedRowKeys?.length == 0) return message.info("请选择最多3条数据")
    modref.current.onOpen()
  }
  const CustView = useMemo(() => {
    //  const showdefined = ["1", "4"].includes(value)
    return (
      <Space size={16}>
        <ExportExcel tb={tbref} defined={false} setIsrange={setIsrange} getDates={setDates} value={valuet} />
      </Space>
    )
  }, [value])
  const onExport = useCallback(() => {
    return getTableData({
      current: 1, pageSize: total, areaId, projectId, type, date, energytype, treeId, index, alike, line, isrange, valuet, reportType
    })
  }, [total, concolumns, type, date, energytype, areaId, treeId, index, line, isrange, valuet, sheetName, reportType, alike])

  const boxchange = (e) => {
    const f = e.target.checked
    setIsrange({ range: f })
    if (!f) {
      setDates([moment().startOf("day"), moment()])
      setValuet([moment().startOf("day"), moment()])
    }
  }

  const disabledDate1 = (current) => { // 限制选择范围
    if (!dates) {
      return false;
    }
    const tooLate = dates[0] && current.diff(dates[0], 'days') > 45;
    const tooEarly = dates[1] && dates[1].diff(current, 'days') > 45;
    const date = current && current > moment().endOf("day");
    return !!tooEarly || !!tooLate || !!date
  };

  const disabledDate2 = useCallback((current) => {

    if (!dates) return false
    let difftime = { 1: 6, 2: 44, 3: 2 }[type]  // 7天，45天，3年
    const date = current && (current > moment().endOf("day"));
    const dateuint = { 1: "days", 2: "days", 3: "years" }[type]
    //  console.log("dates", dates?.[0]?.format("YYYY-MM-DD"), dates?.[1]?.format("YYYY-MM-DD"))
    const tooLate = dates[0] && current.diff(dates[0], dateuint) > difftime;
    const tooEarly = dates[1] && dates[1].diff(current, dateuint) > difftime;
    //  console.log("tooEarly", tooEarly, tooLate, date)
    return !!tooEarly || !!tooLate || !!date
  }, [dates, type])

  const disabledDate = useMemo(() => {

    if (value == "1") {
      return disabledDate2
    }
    return disabledDate1
  }, [value, disabledDate2, disabledDate1])


  /* 
  format="YYYY-MM-DD HH:mm"
                      showTime={{
                        format: 'HH:mm',
                        minuteStep: 15
                      }}
   */

  const dateprops = useMemo(() => {
    if (value == "1") {
      return {
        format: ["YYYY-MM-DD HH:mm", "YYYY-MM-DD HH:mm", "YYYY-MM-DD", "YYYY-MM"][type],
        showTime: type == 1 ? {
          format: 'HH:mm',
          minuteStep: 15
        } : false,
        picker: type !== 3 ? "date" : "month"
      }
    }
    return {
      format: "YYYY-MM-DD HH:mm",
      showTime: {
        format: 'HH:mm',
        minuteStep: 15
      },
      picker: "date"
    }
  }, [value, type])



  const onTimeOk = (date = [], dataString) => {
    console.log("change", date, dataString)
    let f = dataString.every((d) => d);
    if (!f) return;
    let difftime = { 1: 6, 2: 44, 3: 2 }[type]  // 7天，45天，3年
    const dateuint = { 1: "days", 2: "days", 3: "years" }[type]
    if (value != "1" && date[1].diff(date[0], "days") > 45) {
      return message.info("时间范围不能超过45天", 3)
    } else if (value == "1" && date[1].diff(date[0], dateuint) > difftime) {
      return message.info(`时间范围不能超过${difftime}天`, 3)
    }
    // console.log(dataString)
    setDates(date)
    setValuet(date)
  };
  const onOpenChange = (open) => {
    if (open) {
      setDates([null, null])
    } else {
      setDates(null)
    }
  }
  let dataProps = useMemo(() => (
    {
      value,
      setvalue,
      tabs,
      //  tabsprops,
      //  form,
      //  custview: <CustView />,
    }
  ), [value, tabs, setvalue])

  useEffect(() => {
    setCustview(CustView);
    return () => {
      setCustview(undefined)
    }
  }, [value])

  /* 线上实时抄表， 能耗报表 显示时间范围。 电能报表不显示 */

  return (
    <CustContext.Provider value={dataProps} >
      <Pagecount showSearch={false} custserach={true} >
        <Contentbox>
          <UserTree areaId={areaId} energytype={energytype} setTreeId={setTreeId} setLine={setLine} showline={value != '3'} datatype={value == '3' ? 0 : NaN} />
          <div style={{ position: "relative", flex: 1 }} >
            <div style={{ position: "absolute", width: "100%", }} >
              <div className='opt' >
                {
                  value != "3" && <div className='search'    >
                    <Serach placeholder="请输入设备名称/设备编号/安装位置" value={alikev} onChange={alikeChange} style={{ width: "362px" }} onSearch={onSearch} />
                  </div>
                }
                {(["0", "1", "4"].includes(value) || projectId == 30) && <div style={{ marginBottom: "16px", display: "flex" }} key="custdate">

                  <div style={{ marginLeft: "auto" }}>
                    <Checkbox onChange={boxchange} checked={isrange.range}>使用日期范围（优先）</Checkbox>  <RangePicker
                      value={dates || valuet}
                      disabledDate={disabledDate}
                      onCalendarChange={(val) => {
                        setDates(val)
                      }}
                      onChange={onTimeOk}
                      disabled={!isrange.range}
                      onOpenChange={onOpenChange}
                      defaultValue={[moment().startOf("day"), moment().endOf("hour")]}
                      {...dateprops}
                    />
                  </div>
                </div>
                }
                {
                  value == "4" && <Select value={reportType} options={reportTypeopt} onChange={(e) => setReportType(e)} style={{ width: "200px", marginBottom: "16px" }}></Select>
                }
                {
                  value == "1" && <div className='search'>
                    <Tooltip title="最多选择三条信息进行对比"><CustButton onClick={oncompare}>勾选对比</CustButton></Tooltip>
                  </div>
                }

              </div>
              {
                ["1", "5"].includes(value) ? <div key={value}><UserTable ref={tbref} rowSelection={value == 1 ? rowSelection : null} columns={concolumns} {...tableProps} rowKey={row => Object.values(row).join()} key={value} scroll={{
                  scrollToFirstRowOnChange: true,
                  x: 1400,
                  y: 685
                }
                }
                  sheetName={sheetName} onExport={onExport}
                ></UserTable></div>
                  : <div key={value}><UserTable ref={tbref} columns={columns} {...tableProps} rowKey={(row) => Object.values(row).join()} sheetName={sheetName} onExport={onExport}  ></UserTable></div>
              }
            </div>
          </div>
        </Contentbox>
        <CModal title={Ctitle} ref={modref} footer={null} width={1082} mold="cust" closable={true}>
          <Chartwrap>
            <div className='chart'>
              <Ichart {...baroption} />
            </div>
            <div className="foot">
              <Descriptions column={1} bordered style={{ flex: 1 }} labelStyle={labelStyle} contentStyle={contentStyle}>
                <Descriptions.Item label="横轴">
                  <Radio defaultChecked>日期</Radio>
                </Descriptions.Item>
                <Descriptions.Item label="纵轴">
                  <Checkbox.Group value={checkvalue} onChange={checkChange}  >
                    <Checkbox value="1">用能</Checkbox>
                  </Checkbox.Group>
                </Descriptions.Item>
              </Descriptions>
              {/*  <CustButton wh="auto" onClick={comparehandler}>对比</CustButton> */}
            </div>
          </Chartwrap>
        </CModal>

      </Pagecount>
    </CustContext.Provider>
  )
}


