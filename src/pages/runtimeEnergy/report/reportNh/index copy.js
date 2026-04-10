import React, { useState, useCallback, useRef, useEffect, useMemo   } from 'react'
import { Checkbox, DatePicker, message, Tooltip, Descriptions, Radio, Space} from 'antd'
import moment from 'moment'

import { useOutletContext } from 'react-router-dom'
import { useAntdTable } from 'ahooks'
 
import Pagecount from '@com/pagecontent'
import UserTable from "@com/useTable";
import UserTree from "@com/useTree"
 
import { getTime, isObject } from '@com/usehandler'
 
import CModal from '@com/useModal'
import { ExportExcel, CustButton,SetButton } from '@com/useButton'
 
import {   conscols,setcols, labelStyle, contentStyle } from '../data'
import Ichart from '@com/useEcharts/Ichart';
import {Contentbox,Chartwrap} from "../style"
import {useQueryConsumeReport} from "../api"
import {useBaript} from "../usehook"
import Draggable from '../DraggableTransfer'
 

export default function Index() {

  let { exparams  } = useOutletContext()
 

 const draggleRef = useRef()

 
  const [line, setLine] = useState(0)
  const [treeId, setTreeId] = useState()
  let { areaId, projectId, publictype:type, publicdate:date, energytype, alike,publicrangedate } = exparams  

  const [concolumns, setConcolumns] = useState(conscols)
  let [dataSource, setDataSource]= useState([...conscols,...setcols])
  let [targetKeys, setTargetKeys] = useState(["name","sn","total","sr","er","power"])
 
  const [detailHeaders, setDetailHeaders] = useState([])
  

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const transferProps = useMemo(()=>({
    dataSource,
    targetKeys,
    setTargetKeys,
    
  }),[dataSource, selectedRowKeys])

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
 
  const getTableData =async ({ current, pageSize, areaId, projectId, type, date, energytype, treeId,   line,   alike ,publicrangedate }) => {
     try { 
    let f = [areaId, projectId, type, energytype,   line].every(v => Number.isInteger(v)) && Array.isArray(treeId) &&((type!==4 && date ) || (type==4 && publicrangedate?.[0]&& publicrangedate?.[1] )) 


    
    if (!f) return;
 
 
    let dateType = { 1: "day", 2: "month", 3: "year" }[type]

    let params = {
      projectId,
      meterType: energytype,
      startDate: type!=4 ?  date?.startOf(dateType).format("YYYY-MM-DD HH:mm") :publicrangedate?.[0]?.format("YYYY-MM-DD HH:mm"),
      endDate:   type!=4 ? date?.endOf(dateType).format("YYYY-MM-DD HH:mm") :publicrangedate?.[1]?.format("YYYY-MM-DD HH:mm"),
      pageNum: current,
      pageSize,
      queryType: line,
      ids: treeId,
      type: type, // 
      reportType:1,
      filterInfo: alike,
      customTime: type== 4,
    }
 
 

    conscols?.forEach(e => {
        if (e?.dataIndex == 'total') {
          e.title = energytype == 1 ? '能耗(kWh)' : '能耗（m³）'
        }
      })
 
      let { success, data, total = 0 }= await useQueryConsumeReport({},params) 
    
      setTotal(total)
      
      let  counsume = []
      
      if (success && isObject(data) ) {
        
          let { detailHeaders, detailDatas } = data
          setDetailHeaders(detailHeaders)
          if (!Array.isArray(detailHeaders)) return {
            list: [],
            total: 0
          } 
          let last = detailHeaders.length - 1
          let column = detailHeaders.map((col, index) => ({
            title: col, children: [
              {
                title: "起始读数",
                dataIndex: col + 'r',
                key: col + 'r',
                width: 70,
                fixed: index == last ? "right" : false
              },
               {
                title: "结束读数",
                dataIndex: col + 'er',
                key: col + 'er',
                width: 70,
                fixed: index == last ? "right" : false
              },
              {
                title: "用能",
                dataIndex: col + 'v',
                key: col + 'v',
                width: 70,
                fixed: index == last ? "right" : false
              }

            ]
          }))
          setConcolumns([...conscols, ...column])
          counsume = detailDatas.map(item => {
            let { detailValues, eDetailReadings,sDetailReadings } = item;
            for (const [index, val] of detailHeaders?.entries()) {
              item[val + 'v'] = detailValues[index]
              item[val + 'r'] = sDetailReadings[index]
              item[val + 'er'] = eDetailReadings[index]
            }
            return item
          })
        return {
          list:  counsume  ,
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
  const { tableProps } = useAntdTable((params) => getTableData({ ...params, areaId, projectId, type, date, energytype, treeId,   line,    alike,publicrangedate  }), {
    defaultParams: [{ current: 1, pageSize: 18 }],
    refreshDeps: [areaId, projectId, type, date, energytype, treeId,  line,   alike,publicrangedate ],
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
 
  const baroption= useBaript({selectedRowKeys, tableProps, checkvalue, detailHeaders, type})
  const oncompare = () => {
    if (selectedRowKeys?.length == 0) return message.info("请选择最多3条数据")
    modref.current.onOpen()
  }
 
  const onExport = useCallback(() => {
    return getTableData({
      current: 1, pageSize: total, areaId, projectId, type, date, energytype, treeId,   alike, line,publicrangedate    })
  }, [total, concolumns, type, date, energytype, areaId, treeId,   line, alike,publicrangedate])

  const onSet=()=>{
    draggleRef.current.onDisplay()
  }
  return (
   
      <Pagecount showSearch={false} custserach={true} >
        <Contentbox>
          <UserTree areaId={areaId} energytype={energytype} setTreeId={setTreeId} setLine={setLine} showline={true} datatype={NaN} />
          <div style={{ position: "relative", flex: 1 }} >
            <div style={{ position: "absolute", width: "100%", }} >
             <div className="opt">
                  <Space>
                    <Tooltip title="最多选择三条信息进行对比"><CustButton onClick={oncompare}>勾选对比</CustButton></Tooltip>
                    <ExportExcel tb={tbref}   />
                    <SetButton onClick={onSet} />
                  </Space>
             </div>
            
              <div><UserTable ref={tbref} rowSelection={rowSelection} columns={concolumns} {...tableProps} rowKey={row => Object.values(row).join()}   scroll={{
                  scrollToFirstRowOnChange: true,
                  x: 1400,
                  y: 685
                }
                }
                  sheetName="能耗报表" onExport={onExport}
                ></UserTable>
                </div>
                </div>
          </div>
        </Contentbox>
        <CModal title="对比分析" ref={modref} footer={null} width={1082} mold="cust" closable={true}>
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
         <Draggable ref={draggleRef} {...transferProps} />
      </Pagecount>
    
  )
}


