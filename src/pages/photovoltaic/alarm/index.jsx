import React, { useState, useRef, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { Typography, Image, Form, Space, Input, Select, DatePicker, Divider } from 'antd'
import { useAntdTable } from 'ahooks'
import { nanoid } from "@reduxjs/toolkit"
import moment from 'moment'
import Titlelayout from '@com/titlelayout'
import Usetable from '@com/useTable'
import { StorageAlarmRuntime } from '@api/api'
import { useQueryWarningStatistics, useQueryAlarmDetails } from './api';
import imgurl from './icon'
import { ExportExcel } from '@com/useButton'
import Pagecount from "@com/pagecontent";
import { useOutletContext } from 'react-router-dom'
const { Text, Link, Title, Paragraph } = Typography
const Mainbox = styled.div`
    && {
      display: grid;
      grid-template-rows: 64px 1fr;
      row-gap: 16px;
      flex: 1;
      .items {
         display: grid;
         grid-template-columns: repeat(4, 320px);
         grid-template-rows: 64px;
         column-gap: 16px;
        .item {
          width: 320px;
          height: 64px;
          background-color: rgba(255, 255, 255, 1); 
          border: 1px solid rgba(215, 215, 215, 1); 
          border-radius: 4px; 
          box-shadow: none;
          padding:  8px 12px;
          display: grid;
          grid-template-columns: 48px 1fr;
          align-items: center;
          justify-items: center;
          column-gap: 22px;
          .info { 
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 16px;;
          } 
        }
        
      }
      .content {
        display: grid;
        grid-template-rows: 32px 4px 1fr;
        row-gap: 16px; 
        flex: 1;
        color:#515151;
        padding-top: 16px;
        .top {
            display: flex;
            justify-content: space-between;
            align-items: center;

        }
      }
       
       }

`
const P = styled(Paragraph)`
&& {
  margin-bottom: 0px;
  line-height: 1;
  font-size: 18px;
  color:#666;
}
 
`
const columns = [
  {
    title: '最新告警时间',
    dataIndex: 'alarmTime',
    key: 'alarmTime',
    align: 'center'
  },
  {
    title: '告警等级',
    dataIndex: 'level',
    key: 'level',
    align: 'center'
  },
  {
    title: '最新告警事件',
    dataIndex: 'alarmEvent',
    key: 'alarmEvent',
    align: 'center'
  },
  {
    title: ' 设备编号',
    dataIndex: 'sn',
    key: 'sn',
    align: 'center',
    render: (sn) => (
      <Link
        to={{
          pathname: "/deviceDetail",
          search: `?sn=${encodeURIComponent('12abd1234412')}&deviceStyle=${encodeURIComponent(19)}`,
        }}
        target="_blank"
      >
        {sn}
      </Link>
    ),
  },
  {
    title: '设备型号',
    dataIndex: 'category',
    key: 'category',
    align: 'center'
  },
  {
    title: '设备名称',
    dataIndex: 'name',
    key: 'name',
    align: 'center'
  },
  {
    title: '安装地址',
    dataIndex: 'address',
    key: 'address',
    align: 'center'
  },
  // {
  //   title: '操作',
  //   key: 'action',
  //   align: 'center',
  //   render: (_, record) => (
  //     <Link
  //       className='historicalData'
  //       to={`/deviceDetail?sn=${encodeURIComponent("202304220001")}&deviceStyle=${encodeURIComponent(19)}`}
  //       target="_blank"
  //     >
  //       设备信息
  //     </Link>
  //   )
  // }

]
export default function Index() {
  let { exparams } = useOutletContext()
  let { projectId, photovoltaicPowerStation, rangePicker } = exparams || { photovoltaicPowerStation: { key: '' } }
  const { value: stationId } = photovoltaicPowerStation || { value: NaN }
  const condition = Number.isInteger(projectId) && Number.isInteger(stationId) && rangePicker
  const [form] = Form.useForm()
  const [statistics, setStatistics] = useState({})
  const [total, setTotal] = useState(0)
  const getData = async () => {

    try {
      let { success, data } = await useQueryWarningStatistics({ projectId, stationId })
      success && setStatistics({ ...data })
      !success && setStatistics({})
    } catch (error) {
      console.log(error)
    }

  }


  const QueryReports = ({ current, pageSize }) => {
    if (!condition) return
    let start = rangePicker[0].format('YYYY-MM-DD')
    let end = rangePicker[1].format('YYYY-MM-DD')
    let params = {
      pageNum: current,
      pageSize,
      start,
      end,
      projectId,
      stationId
    }
    return useQueryAlarmDetails({}, params).then(res => {
      let { success, data, total } = res
      setTotal(total)
      if (success && Array.isArray(data) && data.length > 0) {
        return {
          list: data,
          total
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
  const { tableProps, search, params } = useAntdTable(QueryReports, {
    defaultParams: [{ pageSize: 14, pageNum: 1 }, {
      start: moment().subtract(7, 'day').format('YYYY-MM-DD'),
      end: moment().format('YYYY-MM-DD'),
      projectId,
    }],
    refreshDeps: [projectId, stationId, rangePicker],
    manual: false,
  })

  const { submit } = search
  const tbref = useRef()

  const onExport = useCallback(() => {
    let formData = form.getFieldsValue()
    return QueryReports({ current: 1, pageSize: total })
  }, [total])

  useEffect(() => {

    if (condition) {
      getData()
    }

  }, [exparams])


  return (
    <Pagecount pd="0px" bgcolor="transparent">
      <Mainbox>
        <div className='items'>
          <div className='item'>
            <Image src={imgurl.allCn} preview={false} height={48} width={48}></Image>
            <div className='info'>
              <P style={{ fontSize: '18px' }}>告警总数</P>
              <P ellipsis={{ tooltip: statistics.allCn }} style={{ fontSize: '18px' }} >{statistics.allCnt}</P>
            </div>
          </div>
          <div className='item'>
            <Image src={imgurl.levelOneCnt} preview={false} height={48} width={48}></Image>
            <div className='info'>
              <P style={{ fontSize: '16px' }}>一级告警</P>
              <P ellipsis={{ tooltip: statistics.levelOneCnt }}    >{statistics.levelOneCnt}</P>
              <P ellipsis={{ tooltip: statistics.levelOneRate }} style={{ fontSize: '14px' }} >{statistics.levelOneRate}%</P>
            </div>
          </div>
          <div className='item'>
            <Image src={imgurl.levelTwoCnt} preview={false} height={48} width={48}></Image>
            <div className='info'>
              <P style={{ fontSize: '16px' }}>二级告警</P>
              <P ellipsis={{ tooltip: statistics.levelTwoCnt }}  >{statistics.levelTwoCnt}</P>
              <P ellipsis={{ tooltip: statistics.levelTwoRate }} style={{ fontSize: '14px' }} >{statistics.levelTwoRate}%</P>
            </div>
          </div>
          <div className='item'>
            <Image src={imgurl.levelThreeCnt} preview={false} height={48} width={48}></Image>
            <div className='info'>
              <P style={{ fontSize: '16px' }}>三级告警</P>
              <P ellipsis={{ tooltip: statistics.levelThreeCnt }}  >{statistics.levelThreeCnt}</P>
              <P ellipsis={{ tooltip: statistics.levelThreeRate }} style={{ fontSize: '14px' }} >{statistics.levelThreeRate}%</P>
            </div>
          </div>

        </div>
        <Titlelayout title={<div style={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}><span>告警记录</span><ExportExcel tb={tbref} /></div>} layout="flex" >
          <Usetable columns={columns} ref={tbref} {...tableProps} rowKey={nanoid()} hbg="#f0f9ff" hbc="#515151" sheetName="告警信息" onExport={onExport} />
        </Titlelayout>
      </Mainbox>
    </Pagecount>
  )
}
