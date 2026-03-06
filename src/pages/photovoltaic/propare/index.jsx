import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react'

import { Typography, message, Space, Checkbox } from 'antd'
import UseTree from "@com/useTree";
import { useSelector } from 'react-redux'
import { useAntdTable } from "ahooks";
import { useOutletContext } from 'react-router-dom'
import moment from 'moment';

import { adaptation } from "@redux/systemconfig";
//import {Link} from 'react-router-dom'
import { ExportExcel, CustButtonT } from '@com/useButton'

import Titlelayout from '@com/titlelayout'
import Pagecount from '@com/pagecontent'
import UseTable from '@com/useTable'
import { cloneDeep } from 'lodash';
import { Serach } from "@com/comstyled";
import { useQueryStatisticTable } from "./api"
import { baseColumns } from './data'
import { getTime } from '@com/usehandler';
const { Link } = Typography
import { Ctitle, Mainbox } from './style'
export default function Index() {


  const [treeId, setTreeId] = useState([]);
  const [showAll, setShowAll] = useState(false)
  const [dtlcol, setDtlcol] = useState([])
  const [total, setTotal] = useState(0)
  let { exparams } = useOutletContext()
  console.log(exparams)
  const { projectId, publictype: type, publicdate: date, publicrangedate, areaId } = exparams

  const { laptop } = useSelector(adaptation)

  const getTableData = async ({ current, pageSize, areaId, treeId, type, date, projectId }) => {
    try {
      if (!Array.isArray(treeId)) return;
      if (![projectId, type, areaId].every(i => Number.isInteger(parseInt(i)))) return;
      if (!date) return;
      let flag = type == 4 && publicrangedate[0] && publicrangedate[1]
      if (!flag) return;
      let body = {
        pageNum: current,
        pageSize,
        projectId,
        areaId,
        type,
        date: getTime(date, type),
        snGroup: treeId,
      }
      let { success, data, total, errMsg } = await useQueryStatisticTable({}, body)
      if (success && Array.isArray(data) && data.length > 0) {
        setTotal(total)
        let { x } = data[0].detail;
        let cols = x.map((item, index, array) => {
          let unit = ['', '', '日', '月',][type]
          let fag = index == array.length - 1
          let col = {
            title: item + unit,
            key: item,
            children: [
              { title: '发电量', dataIndex: `y_${item}`, width: 100, fixed: fag ? "right" : false },
              { title: '用电量', dataIndex: `y1_${item}`, width: 100, fixed: fag ? "right" : false }
            ]
          }


          return col

        })

        setDtlcol(cols) // 列
        const fData = data?.map(d => {
          let { detail: { x, y, y1 } } = d;
          x?.forEach((item, index) => {
            d[`y_${item}`] = y[index]
            d[`y1_${item}`] = y1[index]

          })
          return d
        })
        return {
          list: fData,
          total,
        }
      } else {
        setTotal(0)
        if (!success) message.warning(errMsg || '数据出错')
        return {
          list: [],
          total: 0
        }
      }
    } catch (error) {
      console.log(error)
    }

  }
  const { tableProps, search } = useAntdTable((params) => getTableData({ ...params, areaId, treeId, type, date, projectId, publicrangedate }), {
    defaultPageSize: 14,
    refreshDeps: [areaId, treeId, type, date, projectId, publicrangedate],

  })


  const tableRef = useRef()








  const showAllChagne = (e) => {
    setShowAll(e.target.checked)
  }

  const columns = useMemo(() => {
    if (showAll) {
      return [
        ...baseColumns,
        ...dtlcol
      ];
    }
    return baseColumns;
  }, [showAll, baseColumns, dtlcol]);
  console.log(columns)


  const onExport = useCallback(() => {
    return getTableData({ current: 1, pageSize: total, areaId, treeId, type, date, projectId })
  }, [total, columns, type, date, areaId, treeId])

  const CustTitle = (
    <Ctitle>
      <span className='title'>光伏电站发电量统计</span>
      <Space size={16}>
        <Space><Checkbox checked={showAll} onChange={showAllChagne}>显示明细</Checkbox></Space>
        {/* <Serach
          placeholder="请输入设备名称/设备编号/安装地址查询"
          style={{ width: "380px" }}
          onSearch={onChangeValue}
        /> */}
        <ExportExcel tb={tableRef} />
      </Space>
    </Ctitle>
  )
  return (
    <Pagecount bgcolor="transparent" pd="0">
      <Mainbox laptop={laptop}>
        <UseTree
          areaId={0}
          setTreeId={setTreeId}
          setLine={() => { }}
          showline={false}
          datatype={7}
          energytype={1}
          allselect={true}
          showSearch={true}
        />
        <Titlelayout layout="flex" title={CustTitle} >
          <div className='outwrap'>
            <div className="inwrap">
              <UseTable columns={columns}  {...tableProps} ref={tableRef}
                scroll={{
                  x: "max-content"
                }}
                tableLayout="fixed"
                sticky
                sheetName="光伏发电站发电量统计"
                onExport={onExport}
              >

              </UseTable>
            </div>
          </div>

        </Titlelayout>
      </Mainbox>
    </Pagecount >
  )
}
