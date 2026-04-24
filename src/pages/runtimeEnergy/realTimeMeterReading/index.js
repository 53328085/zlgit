import React, { useState, useCallback, useRef, useEffect, useMemo   } from 'react'
import { Checkbox, DatePicker, message, Tooltip, Descriptions, Radio, Space} from 'antd'
 
import { useOutletContext } from 'react-router-dom'
 
 
import Pagecount from '@com/pagecontent'
import UseProTable from "@com/useTable/proTable";
import UserTree from "@com/useTree/nodeTree"
 
import { getTime, isObject } from '@com/usehandler'
 
import CModal from '@com/useModal'
import { ProExportExcel, CustButton,SetButton } from '@com/useButton'
 
//import {   conscols,Nhconfig, labelStyle, contentStyle } from '../reportdata'
import Ichart from '@com/useEcharts/Ichart';
import {Contentbox,Chartwrap} from "../publicStyle/style"
import {useQueryRealtimeReadingList} from "./api"
 
 

export default function Index() {

  let { exparams  } = useOutletContext()
 
  const [tableData, setTableData] = useState([])
 
   const [columnsStateMap, setColumnsStateMap] = useState([])
 
  const [line, setLine] = useState(0)
  const [treeId, setTreeId] = useState()
  let { areaId, projectId,  energytype, alike  } = exparams  

 
  
  const [detailHeaders, setDetailHeaders] = useState([])
  

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const colsettingChange =(v) =>{
    console.log(v)
    setColumnsStateMap(v)
  }
 
  const concolumns = useMemo(()=>{
    let column = []
      if (detailHeaders.length) {
          let last = detailHeaders.length - 1
          column = detailHeaders.map((col, index) => ({
            title: col,
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
        return  [ ]

  },[ ])
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
  return  {
      projectId,
      meterType: energytype,
      queryType: line,
       ids: treeId,
      filterInfo: alike,
      areaId
    }
  }, [projectId, areaId, energytype, treeId,  line,   alike])

  const [total, setTotal] = useState(0)
  const tbref = useRef()
 
  const getTableData =async (params) => {
    params.pageNum = params.current
    let  {  projectId,   meterType, ids, areaId,  queryType}= params
     try { 
    let f = [ projectId,  meterType,areaId,   queryType].every(v => Number.isInteger(v)) && Array.isArray(ids)  
    
    if (!f) return;
 
 
 
 

    
 
      let { success, data, total = 0 }= await useQueryRealtimeReadingList({},params) 
    
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
         
        
     
        return {
          data:  []  ,
          total: total,
          success,
        }
      } else {
         setTableData([])
        return {
          data: [],
          total: 0,
          success,
        }
      }
    

     } catch (error) {
      console.log(error)
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

 
  const oncompare = () => {
    if (selectedRowKeys?.length == 0) return message.info("请选择最多3条数据")
    modref.current.onOpen()
  }
 
  const onExport = useCallback(() => {
    params.pageSize=total
    params.current=1
    return getTableData(params)
  }, [total, concolumns, params])

   const  parameter={
    params:{
      showDevice:false
    },
    limit:Number.isNaN
  }
  const toolbar = [  <Tooltip title="最多选择三条信息进行对比"><CustButton onClick={oncompare}>勾选对比</CustButton></Tooltip>,
                    <ProExportExcel tb={tbref} className="reportNh"   />]
  return (
   
      <Pagecount showSearch={false} custserach={true} pd="0" bgcolor="none" >
        <Contentbox>
          <UserTree parameter={parameter} correlation={1} isshow={true} areaId={areaId} showSearch={true} allselect={false} energytype={energytype} setTreeId={setTreeId} setLine={setLine} showline={true}   />
        
           <div className="rightwrap">
                                  <div className="tbwrap"> 
             <UseProTable 
                headerTitle="实时抄表详情"
                tableClassName="realTimeMeterReading"
              //  ref={tbref}
                columns={[]} 
                request={getTableData} 
                params={params} 
                search={false}
                toolBarRender={() => toolbar}
                rowSelection={rowSelection}
                columnsState={{
                  defaultValue:[],
                  value:columnsStateMap,
                  onChange:colsettingChange,
                }}
           
               sheetName="实时抄表"
               onExport={onExport} 
                ></UseProTable>
                </div>
          </div>
        </Contentbox>
        <CModal title="对比分析" ref={modref} footer={null} width={1082} mold="cust" closable={true}>
          <Chartwrap>
            <div className='chart'>
               
            </div>
            <div className="foot">
               
            
            </div>
          </Chartwrap>
        </CModal>
        {/*  <Draggable ref={draggleRef} {...transferProps} /> */}
      </Pagecount>
    
  )
}


