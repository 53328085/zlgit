import React, { useState, useRef, useEffect, useCallback, memo } from 'react'
import { useAntdTable } from 'ahooks';
import styled from 'styled-components';
import { Space, Button } from 'antd';

import { useOutletContext } from 'react-router-dom'
import columns, { onDesc } from './columns';
import UserTable from "@com/useTable";
import { EnergyLossRuntime } from '@api/api.js'
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
  const [line, setLine] = useState(null)
  const { tree, setTree } = useState(null)
  const { queryByLine, queryByBuilding } = EnergyLossRuntime
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
  const getTableData = ({ current, pageSize }) => {
    // 0 建筑 1线路

    //if (Object.values(exparams)?.length < 6) return;

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
    const index = Number(line)
    const handler = [queryByBuilding, queryByLine][index]
    return handler(current, pageSize, params).then(res => {
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
    })
  }
  const { tableProps } = useAntdTable(getTableData, {
    defaultParams: [{ current: 1, pageSize: 20 }],
    refreshDeps: [exparams, treeId, line]
  })

  const onExport = useCallback(() => {

    return getTableData({ current: 1, pageSize: pageTotal.current })
  }, [exparams, treeId, line])


  return (
    <Pagecount pd="0" bgcolor="transparent" >
      <Mainbox>
        <UserTree areaId={areaId} setTreeId={setTreeId} setLine={setLine} energytype={energytype} />
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
