import React, { useState, useRef, useEffect, useCallback, memo } from 'react'
import { useAntdTable } from 'ahooks';
import styled from 'styled-components';
import { Space, Button, message } from 'antd';

import { useOutletContext } from 'react-router-dom'
import columns, { onDesc } from './columns';
import UserTable from "@com/useTable";
import { EnergyLossRuntime } from '@api/api.js'
import {useQueryByLine} from "./api"
import Titlelayout from '@com/titlelayout'
import Pagecount from "@com/pagecontent";
import UserTree from "@com/useTree"
import { ExportExcel } from '@com/useButton'
import { getTime } from '@com/usehandler'
const Mainbox = styled.div`
   display: grid;
   flex: 1;
   grid-template-columns: 300px 1fr;
   column-gap: 16px;
   .tablebox {
    flex: 1;
   // padding-top: 16px;
    display: flex;
   }
`

export default function Index() {
  const tbref = useRef()

  let { exparams, setCustview } = useOutletContext()
  let { areaId, projectId, type, date, energytype, shiftNo } = exparams
  const pageTotal = useRef()


  const [treeId, setTreeId] = useState(null)
  const [line, setLine] = useState(0)
 
  const CustView = (
    <Space size={16}>
      <ExportExcel tb={tbref} />
    </Space>
  )
  useEffect(() => {
    setCustview(CustView);
    return () => {
      setCustview(undefined)
    }
  }, [])
  const getTableData =async ({ current, pageSize }) => {
    // 0 建筑 1线路

    //if (Object.values(exparams)?.length < 6) return;
    try {
      
 
    let flag = [areaId, projectId, type,  energytype, shiftNo].some(i => Number.isInteger(parseInt(i))) && date
    if(!flag) return
    if (!Array.isArray(treeId) || !isFinite(line)) return
    let time = getTime(date, type)
    let params = {
      projectId,
      areaId,
      shiftId: shiftNo,
      energyType: energytype,
      type,
      date: time,
      selectIds: treeId
    }

     let {data, success, total,errMsg} =  await useQueryByLine({pageSize, pageNum: current},params)
      pageTotal.current = total
      if(success && Array.isArray(data)){
        return {
          list: data,
          total,
        }
      }else{
        if(!success) message.warning(errMsg || "数据出错")
        return {
          list:[],
          total:0
        }
      }



  





  /*   return handler(current, pageSize, params).then(res => {
      let { success, data, total = 0 } = res
      pageTotal.current = total
      if (success) {
        return {
          list: Array.isArray(data) ? data : [],
          total: Array.isArray(data) ? total : 0,
        }
      } else {
        return {
          list: [],
          total: 0
        }

      }
    }).catch((e)=> {
       console.log(e)
    }) */

  } catch (error) {
      
  }
  }
  const { tableProps } = useAntdTable(getTableData, {
    defaultParams: [{ current: 1, pageSize: 20 }],
    refreshDeps: [ areaId, projectId, type, date, energytype, shiftNo , treeId, line]
  })

  const onExport = useCallback(() => {

    return getTableData({ current: 1, pageSize: pageTotal.current })
  }, [ areaId, projectId, type, date, energytype, shiftNo , treeId, line])

  const modeHandler=(node) => {
    
     return   node.nodes?.length>0
  }
  return (
    <Pagecount pd="0" bgcolor="transparent" >
      <Mainbox>
        <UserTree
          areaId={areaId}
          setTreeId={setTreeId}
          setLine={setLine}
          mode={modeHandler}
          showline={false}
          datatype={1}
          allselect={false}
          checkStrictly={true}
          energytype={energytype} />
        <Titlelayout title={<div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>损耗分析</span>
          <ExportExcel tb={tbref} /></div>} layout="flex" exa>
          <div className='tablebox'>
            <UserTable ref={tbref} size='small'  {...tableProps} sheetName="损耗分析表" onExport={onExport} columns={columns} rowKey='Id' />
          </div>
        </Titlelayout>
      </Mainbox>
    </Pagecount>
  )
}
