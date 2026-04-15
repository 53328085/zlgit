import React, { useRef, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import Titlelayout from '@com/titlelayout'
import { useRequest } from 'ahooks'
import { Space, Typography } from 'antd'
import styled from 'styled-components'
import UseTable from '@com/useTable'
import { ExportExcel, CustButtonT, ExportButton } from "@com/useButton"
import { DistributionRoomRuntime } from '@api/api.js'
import dayjs from 'dayjs'


const Ctitle = styled.div`
  && {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .time{
        padding-right: 64px;
        color: #515151;
        font-size: 16px;
    }
  }
`
const Type = {
  2: '分表',
  1: '总表'
}

export default function Run({ projectId, lineIds }) {
  const { pathname, state } = useLocation()
  console.log(state)
  const navigate = useNavigate()
  const tbref = useRef()
  const jump = ({ sn, lineName }) => {
    let serach = encodeURIComponent(lineName)

    navigate(`${pathname}?lineName=${serach}&sn=${encodeURIComponent(sn)}`, { state: { ...state } })


  }
  const getData = async () => {
    try {
      if (!Number.isInteger(parseInt(projectId)) && !Array.isArray(lineIds)) return
      let { success, data } = await DistributionRoomRuntime.RLineRuntimePoints({ projectId, lineIds })
      if (success && Array.isArray(data)) {
        return data
      } else {
        return []
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }
  const { data, run, loading } = useRequest(getData, {
    refreshDeps: [projectId, lineIds]
  })
  const tableData = data?.map(({ data, ...rest }) => {
    let obj = {}
    data?.forEach(d => {
      let { alias, value } = d
      obj[alias] = value
    })
    return { ...obj, ...rest }
  })

  const CusTitle = (
    <Ctitle> <span>详细参数</span>
      <Space><span className='time'> 参量采集时间：{dayjs().format('YYYY-MM-DD HH:mm:ss')}</span><CustButtonT text="refresh" />   <ExportExcel single={true} tb={tbref} /></Space>
    </Ctitle>
  )
  const columns = [
    {
      title: '回路名称',
      dataIndex: 'lineName',
      key: 'lineName',
      render(text, record) {
        return <Typography.Link onClick={() => jump(record)}>
          {text}
        </Typography.Link>
      }
    },
    {
      title: '总分表',
      dataIndex: 'type',
      key: 'type',
      width: 60,
      render(text) {
        return <span>{Type[text]}</span>
      }
    },
    {
      title: '设备编号',
      dataIndex: 'sn',
      key: 'sn',
      render(sn) {

        return <Link to={{
          pathname: "/deviceDetail",
          search: `?sn=${encodeURIComponent(sn)}`,
        }}
          target="_blank">
          {sn}
        </Link>
      }
    },
    {
      title: '电压',
      children: [
        {
          title: 'Ua(V)',
          dataIndex: 'Ua',
          key: 'Ua',
        },
        {
          title: 'Ub(V)',
          dataIndex: 'Ub',
          key: 'Ub',
        },
        {
          title: 'Uc(V)',
          dataIndex: 'Uc',
          key: 'Uc',
        },
      ]
    },
    {
      title: '电流',
      children: [
        {
          title: 'Ia(A)',
          dataIndex: 'Ia',
          key: 'Ia',
        },
        {
          title: 'Ib(A)',
          dataIndex: 'Ib',
          key: 'Ib',
        },
        {
          title: 'Ic(A)',
          dataIndex: 'Ic',
          key: 'Ic',
        },
      ]
    },
    {
      title: '功率因数',
      dataIndex: 'phsA',
      key: 'phsA',
      width: 80,
    },
    {
      title: '总有功功率',
      children: [
        {
          title: '(kW)',
          dataIndex: 'Pa',
          key: 'Pa',
        },
      ]
    },
    {
      title: '总无功功率',
      children: [
        {
          title: '(kVar)',
          dataIndex: 'Q',
          key: 'Q',
        },
      ]
    },
    {
      title: '总能耗',
      children: [
        {
          title: '(kWh)',
          dataIndex: 'EP',
          key: 'EP',
        },
      ]
    },
  ]
  return (
    <Titlelayout title={CusTitle} layout="flex" bordered="none" pv="0" bodypad="16px 0 0 0" >
      <UseTable columns={columns} dataSource={tableData} loading={loading}
        hbg="#ecf5ff"
        hbc="#515151"
        ref={tbref}
        sheetName="运行报表"
        scroll={{
          scrollToFirstRowOnChange: true,
          y: 550
        }
        }></UseTable>
    </Titlelayout>
  )
}
