import React, { useState, useCallback, useRef, useEffect, useMemo   } from 'react'
import { Checkbox, DatePicker, message, Tooltip, Descriptions, Radio, Space} from 'antd'
import dayjs from 'dayjs'
import { ProTable  } from '@ant-design/pro-components';
import { useOutletContext } from 'react-router-dom'
import { useAntdTable } from 'ahooks'
 
import Pagecount from '@com/pagecontent'
import UseProTable from "@com/useTable/proTable";
import UserTree from "@com/useTree"
 
import { getTime, isObject } from '@com/usehandler'
 
import CModal from '@com/useModal'
import { ProExportExcel, CustButton,SetButton } from '@com/useButton'
 
import {   conscols,Nhconfig, labelStyle, contentStyle } from '../reportdata'
import Ichart from '@com/useEcharts/Ichart';
import {Contentbox,Chartwrap} from "../style"
import {useQueryConsumeReport} from "../api"
import {useBaript} from "../usehook"
 

export default function Index() {

  let { exparams  } = useOutletContext()
 
  const [tableData, setTableData] = useState([])
 
   const [columnsStateMap, setColumnsStateMap] = useState(Nhconfig)
 const [unit, setUnit]=useState("")
  const [line, setLine] = useState(0)
  const [treeId, setTreeId] = useState()
  let { areaId, projectId, publictype:type, publicdate:date, energytype, alike,publicrangedate } = exparams  

 
  
  const [detailHeaders, setDetailHeaders] = useState([])
  

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const colsettingChange =(v) =>{
    console.log(v)
    setColumnsStateMap(v)
  }
 
  const concolumns = useMemo(()=>{
    let column = []
    let fomrat = {
      1: "HH:mm",
      2: "MM-DD",
      3:"YYYY-MM",
      4:"YYYY-MM-DD"
    }[type] ?? "HH:mm"
    let arg ={
      1: "YYYY-MM-DD HH:mm",
      2: "YYYY-MM-DD",
      3:"YYYY-MM",
      4:"YYYY-MM-DD"
    }[type] ?? "HH:mm"
      let newcols = [...conscols]
      let row = newcols[4]
      row.title=`总用能${unit}`
      if (detailHeaders.length) {
          let last = detailHeaders.length - 1
          column = detailHeaders.map((col, index) => ({
            title: dayjs(col,arg).format(fomrat),
            hideInSetting:true,
            key: col,
             children: [
              {
                title: "起始读数",
                dataIndex: col + 'r',
                key: col + 'r',
                width: 70,
                hidden:!columnsStateMap?.sr?.show,
                fixed: index == last ? "right" : false
              },
               {
                title: "结束读数",
                dataIndex: col + 'er',
                key: col + 'er',
                width: 70,
                hidden:!columnsStateMap?.er?.show,
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
        }
        return  [...newcols,...column]

  },[detailHeaders,columnsStateMap?.er?.show,columnsStateMap?.sr?.show,conscols, type,unit])
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

  // 使用ProTable
  const params=useMemo(()=>{
  let dateType = { 1: "day", 2: "month", 3: "year" }[type]
  return  {
      projectId,
      meterType: energytype,
      startDate: type!=4 ?  date?.startOf(dateType).format("YYYY-MM-DD HH:mm") :publicrangedate?.[0]?.format("YYYY-MM-DD HH:mm"),
      endDate:   type!=4 ? date?.endOf(dateType).format("YYYY-MM-DD HH:mm") :publicrangedate?.[1]?.format("YYYY-MM-DD HH:mm"),
   //   pageNum: current,
     // pageSize,
      queryType: line,
      ids: treeId,
      type: type, // 
      reportType:1,
      filterInfo: alike,
      customTime: type== 4,
      areaId
    }
  }, [projectId, areaId, type, date, energytype, treeId,  line,   alike,publicrangedate])

  const [total, setTotal] = useState(0)
  const tbref = useRef()
 
  const getTableData =async (params) => {
    params.pageNum = params.current
    let  {  projectId, type,  meterType, ids, areaId,  queryType,   startDate,endDate}= params
     try { 
    let f = [ projectId, type, meterType,areaId,   queryType].every(v => Number.isInteger(v)) && Array.isArray(ids) && startDate && endDate


    
    if (!f) return;
 
 
 
 

    
 
      let { success, data, total = 0 }= await useQueryConsumeReport({},params) 
    
      setTotal(total)
      
      let  counsume = []
      
      if (success && isObject(data) ) {
        
          let { detailHeaders, detailDatas } = data
          setDetailHeaders(detailHeaders)
          if (!Array.isArray(detailHeaders)) return {
            data: [],
            total: 0,
            success,
          } 
         
         setUnit(detailDatas?.[0]?.unit)
         // setConcolumns([...conscols, ...column])
          counsume = detailDatas.map((item,idx) => {
            let { detailValues, eDetailReadings,sDetailReadings } = item;
            for (const [index, val] of detailHeaders?.entries()) {
              item[val + 'v'] = detailValues[index]
              item[val + 'r'] = sDetailReadings[index]
              item[val + 'er'] = eDetailReadings[index]

            //  item["er"]=idx.toString()
            //  item["sr"]=idx.toString()
            //  item["power"]=idx.toString()
            }
            return item
          })
          setTableData(counsume)
     //   console.log("counsume",counsume)
        return {
          data:  counsume  ,
          total: total,
          success,
        }
      } else {
         setTableData([])
         setUnit("")
        return {
          data: [],
          total: 0,
          success,
        }
      }
     } catch (error) {
      
      console.log(error)
      return Promise.reject(error)
     }
  }


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

  const baroption= useBaript({selectedRowKeys, tableData, checkvalue, detailHeaders, type})
  const oncompare = () => {
    if (selectedRowKeys?.length == 0) return message.info("请选择最多3条数据")
    modref.current.onOpen()
  }
 
  const onExport = useCallback(() => {
    params.pageSize=total
    params.current=1
    return getTableData(params)
  }, [total, concolumns, params])

 
  const toolbar = [  <Tooltip title="最多选择三条信息进行对比"><CustButton onClick={oncompare}>勾选对比</CustButton></Tooltip>,
                    <ProExportExcel tb={tbref} className="reportNh"   />]
  return (
   
      <Pagecount showSearch={false} custserach={true} pd="0" bgcolor="none" >
        <Contentbox>
          <UserTree areaId={areaId} energytype={energytype} setTreeId={setTreeId} setLine={setLine} showline={true} showSearch={true} datatype={NaN} />
          <div className="rightwrap">
            <div className="tbwrap">
                <UseProTable 
                headerTitle="能耗报表"
                tableClassName="reportNh"
                ref={tbref}
                columns={concolumns} 
                request={getTableData} 
                params={params} 
                search={false}
                toolBarRender={() => toolbar}
                rowSelection={rowSelection}
                columnsState={{
                  defaultValue:Nhconfig,
                  value:columnsStateMap,
                  onChange:colsettingChange,
                }}
           
               sheetName="能耗报表"
               onExport={onExport} 
                ></UseProTable>
              
                 
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
        {/*  <Draggable ref={draggleRef} {...transferProps} /> */}
      </Pagecount>
    
  )
}


