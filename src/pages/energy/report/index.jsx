import React, { useState,useCallback,useRef, useEffect, useMemo } from 'react'
import {Checkbox, DatePicker, message, Tooltip, Descriptions, Radio} from 'antd'
import moment from 'moment'
 
import {useOutletContext} from 'react-router-dom'
import {useAntdTable} from 'ahooks'
import CustContext from '@com/content.js'
import Pagecount from '@com/pagecontent'
import UserTable from "@com/useTable";
import UserTree from "@com/useTree"
import { Space} from 'antd'
import {getTime, isObject} from '@com/usehandler'
import styled from 'styled-components'
import {energyReport} from '@api/api'
import CModal from '@com/useModal' 
import {  ExportExcel, CustButton} from '@com/useButton'
 import {Serach} from "@com/comstyled"
 import {cols,conscols, timecols, typecols, fromlot, shitcols, etabs, wtabs,labelStyle,contentStyle} from './data'
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
 
export default function Index() {

  let {exparams, setCustview} = useOutletContext() 
  const [dates, setDates] = useState([moment().startOf("day"), moment().endOf("hour")]);

  
  const [isrange, setIsrange] = useState({range:false})
  
  const [value, setvalue] = useState('0')
  const [line, setLine] = useState(0)
  const [treeId, setTreeId] = useState()
  let {areaId, projectId, type, date, energytype} = exparams
  
  const [concolumns, setConcolumns] = useState(conscols) 
  const [alike, setAlike] = useState("")
  const onSearch = (e)=> {
     setAlike(e)
  }
  // 对比分析 start
  const Ctitle= useMemo(()=> {
   if(!(date && type)) return ""
    let format ={
      1:"YYYY-MM-DD",
      2: "YYYY-MM",
      3: "YYYY"
    }[type]
    return   `对比分析（${date.format(format)})`  
  }, [date, type]) 
  
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
 
  const onSelectChange = (newkey,rows) => {
     console.log(newkey, rows)
     if(newkey?.length > 3){
      return message.warning("最多选择3条信息进行对比")
     }else {
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
/*   const etabs = [
    { key: '0', label: '实时抄表' },
    { key: '1', label: '能耗报表' },
    { key: '2', label: '分时能耗' },
    { key: '3', label: '分类能耗' },
    { key: '4', label: '电能报表' },
    { key: '5', label: '班次能耗' },
  ]
  const wtabs = [
    { key: '0', label: '实时抄表' },
    { key: '1', label: '能耗报表' },
    { key: '3', label: '分类能耗' },
    { key: '5', label: '班次能耗' },
  ] */
  const [tabs, setTabs] = useState(etabs)
  const index = Number(value)
 


 const sheetName = useMemo(()=> {
     let filename="sheet"
     let  f = ["0","1","4"].includes(value)
   //  console.log(dates)
     if(Array.isArray(dates)&&dates?.[0] && dates?.[1]){
       filename = getTime(dates?.[0],1).toString()+"-"+getTime(dates?.[1], 1).toString() + tabs[index]?.label
     }
    return (f&&isrange.range&&dates?.length) ?filename :  (tabs[index]?.label ?? 'sheet')

 }, [value, dates, tabs,isrange])
 
 
  
 let columns = [cols, [], timecols, typecols, fromlot,shitcols][index] // 

 
  
  const getTableData = ({ current, pageSize, areaId, projectId, type, date, energytype, treeId, index, line,isrange, dates, alike }) => {
  //  console.log(date)


    
    let f = [areaId, projectId, type, energytype,index, line].every(v => Number.isInteger(v)) && Array.isArray(treeId) && date

   
    let range =[0,1,4].includes(index) && isrange.range && Array.isArray(dates) && dates?.length>1
    if(!f) return;
    if(index === 0 && isrange.range && !Array.isArray(dates) ){
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
     let dateType = {1: "day",2:"month",3: "year"}[type]
   
     let params ={
      projectId, 
      meterType: energytype,
      startDate: range ? dates?.[0].format("YYYY-MM-DD HH:mm") : date?.startOf(dateType).format("YYYY-MM-DD HH:mm"),
      endDate:  range ? dates?.[1].format("YYYY-MM-DD HH:mm"): date?.endOf(dateType).format("YYYY-MM-DD HH:mm"),   
      pageNum: current,
      pageSize,
      queryType:line,
      ids:treeId,
      type
     }  
     if(index==0) {
       params.filterInfo=alike
     }
     
     // //  cols 实时抄表，  conscols 能耗报表 , typecols 分类能耗
     if(energytype == 1) {
      setTabs([...etabs])
     }else if(energytype == 2) {
      setTabs([...wtabs])
     }
   
     columns.forEach(c => {
             if(c.dataIndex == 'consume' && index == 0) { // 实时抄表
                c.title = energytype == 1 ? '用能(kWh)' : '差值（m³）'
             }
             if (c.dataIndex == 'consume' && index == 3) {  // 分类报表
              c.title = energytype == 1 ? '用能(kWh)' : '用水量（m³）'
             }
           })
       
      
    if(index == 1) {
      conscols.forEach(e => {
        if(e.dataIndex == 'total') {
           e.title = energytype == 1 ? '能耗(kWh)' : '能耗（m³）'
        }
      })
    }
 
    if(!hander) return message.warning("请求方法不存在")

     return hander(params).then(res => {
         let {success, data, total=0} = res
         setTotal(total)
         let fag = index == 5 && isObject(data)
         let arrData =[]
         if(success && ((Array.isArray(data) && data.length > 0) || fag) ) {           
           if(index == 1) {
             let {detailHeaders} = data[0]
             let last = detailHeaders.length - 1
            let column = detailHeaders.map(col => ({title: col, dataIndex: col, key: col,width: "96px"}))
           // let column = detailHeaders.map(col => ({title: col, dataIndex: col, key: col,width: "96px", render: (text)=> Math.round(parseFloat(text))}))  
             column[last].fixed = "right"
             setConcolumns([...conscols, ...column])
             data.forEach(item => {
              let {detailHeaders, detailValues} = item;
              for(const [index, val] of detailHeaders?.entries()) {
                  item[val] = detailValues[index]
              }
            })
           }else if(index==5) {
              let {heads, datas} = data
              let ishead = Array.isArray(heads) && heads?.length
              if(ishead) {
                  let shiftcolumn = heads.map(h=> ({
                    title: `${h.name}`,
                    dataIndex:  `shiftname${h.name}`,
                  //  render: (text)=> Math.round(parseFloat(text)),
                  } ))
                  setConcolumns([...shitcols, ...shiftcolumn])

              }
              if(Array.isArray(datas) && ishead) {
                 arrData=datas.map(d => {
                   let {e} = d, Earr=[]
                   if(Array.isArray(e) && e.length) {
                      e.forEach((v,index) =>{
                      let key ='shiftname'+heads[index]?.name
                       d[key] =v
                     })

                   }
                   return d
                 })
              }

           }
           
         
            return {
              list: index==5 ? arrData : data,
              total: total
            }
         }else {
          return {
            list: [],
            total: 0
          }
         }
     }).catch(e => {
      console.log(e)
     })


  }
  const {tableProps} = useAntdTable((params) => getTableData({...params,areaId, projectId, type, date, energytype, treeId, index, line,isrange, dates,alike }), {
    defaultParams: [{current: 1, pageSize: 14}],
    refreshDeps: [areaId, projectId, type, date, energytype, treeId, index, line,isrange, dates,alike]
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
  const comparehandler=()=> { // 留着待用
    setChecks(checkedRef.current)
  }
  const [source, dimensions, chartlen, unit] = useMemo(() => {
      let {dataSource=[]} = tableProps || {}
      let datas = dataSource.filter(d => selectedRowKeys.includes(d.sn))
      let {detailHeaders=[], unit} = datas?.[0]|| {}
      let dimensions = datas?.map?.(d => d.name) || []
      let source = checkvalue?.length > 0 ? (datas?.map?.(d =>d.detailValues) || []) : []
      return [[detailHeaders, ...source], ["time",...dimensions], dimensions.length, unit]
  }, [selectedRowKeys, tableProps, checkvalue])
 
   const  baroption= {
      series: new Array(chartlen).fill({ type: "bar",seriesLayoutBy: 'row' }), // [{ type: "bar",seriesLayoutBy: 'row' }], 
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
  
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (value) => value+unit
        }
      },
      dataset: {
        dimensions,
        source,
        sourceHeadr:true
      },
      toolbox: {
        show:true,
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
  const  oncompare =() => {
    if(selectedRowKeys?.length == 0) return message.info("请选择最多3条数据")
      modref.current.onOpen()
  }
  const CustView =useMemo(()=> {
    const showdefined =  ["0","1","4"].includes(value)
    return (
      <Space size={16}>
        <ExportExcel tb={tbref} defined={showdefined}  setIsrange={setIsrange} getDates={setDates} value={dates}  />
       </Space>
      )
  }, [value]) 
  const onExport =useCallback(() => {  
    return  getTableData({current: 1, pageSize: total,areaId, projectId, type, date, energytype, treeId, index, line,isrange, dates})
 }, [total, concolumns, type, date,energytype,areaId, treeId, index, line, isrange, dates,sheetName])

  const boxchange = (e)=> {
  const f = e.target.checked
  setIsrange({range:f})
  if(!f) {
    setDates([moment().startOf("day"), moment()])
    setValuet([moment().startOf("day"), moment()])
  }
}

 const disabledDate = (current) => { // 限制选择范围
  if (!dates) {
    return false;
  }
  const tooLate = dates[0] && current.diff(dates[0], 'days') > 31;
  const tooEarly = dates[1] && dates[1].diff(current, 'days') > 31;
  const date = current && current > moment().endOf("day");
  return !!tooEarly || !!tooLate || !!date
};
  const [valuet, setValuet] = useState(null);

  const onTimeOk = (date = [], dataString) => {
    let f = dataString.some((d) => d);
    if (!f) return;
   // console.log(dataString)
     setDates(date)
     setValuet(date)
  };  
 
  let dataProps = {
    value,
    setvalue,
    tabs,
  //  tabsprops,
  //  form,
  //  custview: <CustView />,
  }
 
 useEffect(() => {
  setCustview(CustView);
  return () => {
    setCustview(undefined)
  }
 }, [value])


  return (
      <CustContext.Provider value={dataProps} >
          <Pagecount showSearch={false} custserach={true} >
             <Contentbox>
                <UserTree areaId={areaId} energytype={energytype}  setTreeId={setTreeId} setLine={setLine}   showline={value!='3'} datatype={value=='3' ? 0 : NaN}   /> 
              <div style={{position: "relative", flex: 1}}> 
                <div style={{position: "absolute", width: "100%"}}>
           {  value=="4" &&  <div style={{marginBottom: "16px", display: "flex"}}>
              <div style={{marginLeft: "auto"}}>
            <Checkbox onChange={boxchange} checked={isrange.range}>使用日期范围（优先）</Checkbox>  <RangePicker
                  value={dates || valuet }
                    disabledDate={disabledDate}
                   onCalendarChange={(val) => setDates(val)}
                    onChange={onTimeOk} 
                    disabled={!isrange.range}
                    defaultValue={[moment().startOf("day"), moment().endOf("hour")]}
                    format="YYYY-MM-DD HH:mm"
                    showTime={{
                      format: 'HH:mm',
                      minuteStep:15
                    }}
                  />
                  </div>
                  </div>
                } 
                {
                  value=="0" && <div className='search'>
<Serach placeholder="请输入设备名称/设备编号/安装地址查询" style={{width: "362px"}}  onSearch={onSearch} />
                  </div>
                }
                 {
                  value=="1" && <div className='search'>
              <Tooltip title="最多选择三条信息进行对比"><CustButton onClick={oncompare}>勾选对比</CustButton></Tooltip> 
                  </div>
                }
                 {
                   ["1","5"].includes(value) ? <UserTable ref={tbref} rowSelection={value==1 ? rowSelection : null}   columns={concolumns} {...tableProps} rowKey={row => row.sn} key={value}  scroll={{
                    scrollToFirstRowOnChange: true,
                     x: 1400, 
                     y: 685
                   }
                  }
                  sheetName={sheetName} onExport={onExport}
                  ></UserTable>
                  :<UserTable ref={tbref} columns={columns} {...tableProps} key={value} sheetName={sheetName}  onExport={onExport}></UserTable>
                } 
                </div>
                </div> 
             </Contentbox>
              <CModal title={Ctitle} ref={modref}  footer={null}  width={1082} mold="cust"   closable={true}>
                 <Chartwrap>
                  <div className='chart'>
                  <Ichart {...baroption} />
                  </div>
                   <div className="foot">
                     <Descriptions column={1} bordered style={{flex: 1}} labelStyle={labelStyle} contentStyle={contentStyle}>
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


