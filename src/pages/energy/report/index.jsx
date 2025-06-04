import React, { useState,useCallback,useRef, useEffect, useMemo } from 'react'
import {Checkbox, DatePicker, message, TimePicker} from 'antd'
import moment from 'moment'
import { useSelector } from 'react-redux'
import {useOutletContext} from 'react-router-dom'
import {useAntdTable} from 'ahooks'
import CustContext from '@com/content.js'
import Pagecount from '@com/pagecontent'
import UserTable from "@com/useTable";
import UserTree from "@com/useTree"
import { Space} from 'antd'
import {getTime} from '@com/usehandler'
import styled from 'styled-components'
import {energyReport} from '@api/api'
import {levelDefaultLabel} from '@redux/systemconfig.js'
import {  ExportExcel} from '@com/useButton'
import { isObject } from 'lodash'
const { RangePicker } = DatePicker;
const {
  QueryByArea, 
  QueryByLine, 
  QueryConsumeByArea,
  QueryConsumeByLine,
  QueryTimeConsumeByArea, 
  QueryTimeConsumeByLine,
  QueryClassifyConsume,
  QueryReadingByAreaCustomize,
  QueryReadingByLineCustomize,
  QueryConsumeByAreaCustomize,
  QueryConsumeByLineCustomize,
  QueryByAreaFromIot,
  QueryByLineFromIot,


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
`
 
const cols =[ // 实时抄表  
{
  title: '区域名称',
  dataIndex: 'nodeName', 
  key:'nodeName',
},
  {
    title: '设备名称',
    dataIndex: 'name', 
    key: "name"
  }, {
    title: '起始读数',
    dataIndex: 'start',
    key: "start"
    
  }, {
    title: '结束读数',
    dataIndex: 'end',
    key:"end"
  },
  {
    title: '用能(kWh)',
    dataIndex: 'consume',
    key: "consume"
  }, 
  {
    title: '设备编号',
    dataIndex: 'sn',
    key:"sn"
  },
  {
    title: '安装位置',
    dataIndex: 'address',
    key: "address"
  },
]
 

let conscols =[ //  cols 实时抄表，  conscols 能耗报表 , typecols 分类能耗
{
  title: '区域名称',
  dataIndex: 'nodeName', 
  key: "nodeName",
  fixed: 'left',
  width: 100
},
{
    title: '设备名称',
    dataIndex: 'name', 
    width: 84,
    key: "name",
    fixed: 'left',
  },  
  {
    title: '设备编号',
    dataIndex: 'sn',
    width:134,
    key: "sn",
    fixed: 'left',
  },
  {
    title: '安装位置',
    dataIndex: 'address',
    key: 'address',
    width: 84,
  },
  {
    title: '能耗(kWh)',
    dataIndex: 'total',
    key: 'total',
    width: 92,
  },   
]
const cellstyle = {
  textAlign: "center",
  color: "#fff"
}
const timecols =[  // 分时能耗 
{
  title: '区域名称',
  dataIndex: 'nodeName', 
  key: "nodeName"
},
{
    title: '设备名称',
    dataIndex: 'name', 
    key: "name"
  },  
  {
    title: '总计(kWh)',
    dataIndex: 'e',
    key: "e",
    onHeaderCell: () => ({
      style: {
        background: "#000",
        ...cellstyle
      }
    })
  },
  {
    title: '峰(kWh)',
    dataIndex: 'e2',
    key:"e2",
    onHeaderCell: () => ({
      style: {
        background: "#f33",
        ...cellstyle
      }
    })
  },
  {
    title: '平(kWh)',
    dataIndex: 'e3',
    key: "e3",
    onHeaderCell: () => ({
      style: {
        background: "#f90",
        ...cellstyle
      }
    })
  },  
  {
    title: '谷(kWh)',
    dataIndex: 'e4',
    key: "e4",
    onHeaderCell: () => ({
      style: {
        background: "#093",
        ...cellstyle
      }
    })

  },  
  {
    title: '费用',
    dataIndex: 'cost',
    key: "cost"
  },
  {
    title: '设备编号',
    dataIndex: 'sn',
    key: "sn"
  }, 
  {
    title: '安装位置',
    dataIndex: 'address',
    key: "address"
  }, 
]

const typecols =[  // 分类能耗 
  {
    title: '能耗类型',
    dataIndex: 'type', 
    key: "type"
  },  
  {
    title: '子类型',
    dataIndex: 'subType',
    key:"subType"
  },  
  {
    title: '能耗(kWh)',
    dataIndex: 'consume',
    key: "consume"
  },  
  {
    title: '同比',
    dataIndex: 'yoy',
    key: "yoy"
  }, 
  {
    title: '环比',
    dataIndex: 'mom',
    key: "mom"
  }, 
]
const fromlot =[ // 电能报表 
  {
    title: '区域名称',
    dataIndex: 'nodeName', 
    key: "nodeName"
  },
    {
      title: '设备名称',
      dataIndex: 'name', 
      key: "name"
    }, {
      title: '起始读数',
      dataIndex: 'start',
      key: "start"
      
    }, {
      title: '结束读数',
      dataIndex: 'end',
      key: "end"
    },
    {
      title: '用能(kWh)',
      dataIndex: 'consume',
      key: "consume"
    }, 
    {
      title: '设备编号',
      dataIndex: 'sn',
      key: "sn"
    },
    {
      title: '安装位置',
      dataIndex: 'address',
      key: "address"
    },
  ]
const shitcols =[  // 班次能耗 
  {
    title: '区域名称',
    dataIndex: 'nodeName', 
    key: "nodeName"
  },  
  {
    title: '设备名称',
    dataIndex: 'name',
    key: "name"
  },  
  {
    title: '编号',
    dataIndex: 'sn',
    key:"sn"
  },  
  {
    title: '地址',
    dataIndex: 'address',
    key: "address"
  },  
]


export default function Index() {

  let {exparams, setCustview} = useOutletContext() 
  const [dates, setDates] = useState([moment().startOf("day"), moment().endOf("hour")]);

  
  const [isrange, setIsrange] = useState({range:false})
  const levelname = useSelector(levelDefaultLabel)
  const [value, setvalue] = useState('0')
  const [line, setLine] = useState(0)
  const [treeId, setTreeId] = useState()
  let {areaId, projectId, type, date, energytype} = exparams
  // conscols[0].title = levelname
  // cols[0].title = levelname
  // timecols[0].title = levelname
  const [concolumns, setConcolumns] = useState(conscols) 
 
  const [total, setTotal] = useState(0)
  const tbref = useRef()
  const etabs = [
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
  ]
  const [tabs, setTabs] = useState(etabs)
  const index = Number(value)
 


 const sheetName = useMemo(()=> {
     let filename="sheet"
     let  f = ["0","1","4"].includes(value)
     console.log(dates)
     if(Array.isArray(dates)&&dates?.[0] && dates?.[1]){
       filename = getTime(dates?.[0],1).toString()+"-"+getTime(dates?.[1], 1).toString() + tabs[index]?.label
     }
    return (f&&isrange.range&&dates?.length) ?filename :  (tabs[index]?.label ?? 'sheet')

 }, [value, dates, tabs,isrange])
 
 
  
 let columns = [cols, [], timecols, typecols, fromlot,shitcols][index] // 

 
  
  const getTableData = ({ current, pageSize, areaId, projectId, type, date, energytype, treeId, index, line,isrange, dates }) => {
  //  console.log(date)


    
    let f = [areaId, projectId, type, energytype,index, line].every(v => Number.isInteger(v)) && Array.isArray(treeId) && date

   
    let range =[0,1,4].includes(index) && isrange.range && Array.isArray(dates) && dates?.length>1
    if(!f) return;
    if(index === 0 && isrange.range && !Array.isArray(dates) ){
          return
    }
  /*    let hander =range ? [[QueryReadingByAreaCustomize,
      QueryReadingByLineCustomize], [QueryConsumeByAreaCustomize, QueryConsumeByLineCustomize],[],[], [QueryByAreaFromIot,QueryByLineFromIot]][index][line] :  index == 3 ? QueryClassifyConsume : [
      [QueryByArea, QueryByLine], 
      [QueryConsumeByArea, QueryConsumeByLine],
      [QueryTimeConsumeByArea,QueryTimeConsumeByLine],
      [],
      [QueryByAreaFromIot,QueryByLineFromIot],
       [QueryConsumeDeviceShit, QueryConsumeDeviceShit]
      ][index][line]   */
  /*     QueryConsumeRegion, //实时抄表
      QueryConsumeHourTime, // 能耗报表
      QueryConsumeByTime, // 分时能耗
      QueryConsumeClassify, // 分类能耗
      QueryConsumeFromIot, //电能报表
      QueryConsumeDeviceShit, // 班次能耗 */
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
             let column = detailHeaders.map(col => ({title: col, dataIndex: col, key: col,width: "96px" }))
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
  const {tableProps} = useAntdTable((params) => getTableData({...params,areaId, projectId, type, date, energytype, treeId, index, line,isrange, dates }), {
    defaultParams: [{current: 1, pageSize: 14}],
    refreshDeps: [areaId, projectId, type, date, energytype, treeId, index, line,isrange, dates]
  })
  console.log(tableProps)
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
    console.log(dataString)
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
                   ["1","5"].includes(value) ? <UserTable ref={tbref}  columns={concolumns} {...tableProps} key={value}  scroll={{
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
          </Pagecount>
      </CustContext.Provider>
  )
}


