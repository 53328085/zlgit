import React, { useState, useMemo, useEffect, useRef } from 'react'

import { Typography, message, Space } from 'antd'
import UseTree from "@com/useTree";
import { useSelector } from 'react-redux'
import { useAntdTable } from "ahooks";
import dayjs from 'dayjs';
import { DistributionRoomRuntime } from '@api/api.js'
import { selectcurlRommidl, roomId, adaptation } from "@redux/systemconfig";
//import {Link} from 'react-router-dom'
import { ExportExcel, CustButtonT } from '@com/useButton'
import styled, { css } from 'styled-components';
import Titlelayout from '@com/titlelayout'
import Pagecount from '@com/pagecontent'
import UseTable from '@com/useTable'
import { cloneDeep } from 'lodash';
import { Serach } from "@com/comstyled";

const { Link } = Typography
const sty = css`
    grid-template-columns: 265px 1fr;
`
const Ctitle = styled.div`
     display: flex;
     justify-content: space-between;
     height: 40px;
     align-items: center;
   //  margin-bottom: 16px;
    /*  .title {
        display: inline-flex;
        height: 32px;
        padding-left: 16px;
        border-left: 4px solid ${props => props.theme.primaryColor};
        align-items: center;
        color: #515151;
     } */
`
const Mainbox = styled.div`
flex: 1;
display: grid;
grid-template-columns: 265px minmax(1397px,1fr);
column-gap: 16px;
 align-items: stretch;
.tbwrap {
     flex:1;
     display: flex;
   
}
${props => props.laptop ? sty : null}
`
export default function Index() {


  const [treeId, setTreeId] = useState([]);
  const projectId = useSelector(state => state.system.menus.projectId)
  const curid = useSelector(selectcurlRommidl)
  const roomIds = useSelector(roomId)
  const { laptop } = useSelector(adaptation)
  //  const roomId = [curid]
  const RoomId = useMemo(() => {
    return curid == 0 ? roomIds?.filter(r => r.id != 0).map(m => m.id) : [curid]
  }, [curid])
  const [tableData, setTableData] = useState([])
  const tableRef = useRef()
  const columns = [
    {
      title: '逆变器名称',
      dataIndex: 'lineName',
      width: 160,
      key: 'lineName',
    },
    {
      title: "逆变器编号",
      dataIndex: 'sn',
      width: 140,
      key: 'sn',
      // render: (text, record) => <Link underline target="blank" href={`/deviceDetail?sn=${record.sn}`}>{text}</Link>
    },
    {
      title: "所属网关",
      dataIndex: 'sn',
      width: 140,
      key: 'sn',
    },
    {
      title: "安装地址",
      dataIndex: 'sn',
      width: 140,
      key: 'sn',
    },
    {
      title: "总发电量 (kWh)",
      dataIndex: 'sn',
      width: 140,
      key: 'sn',
    },
  ]


  const getLinePoint = async (RoomId, lineId) => {
    if (!Number.isInteger(lineId)) return
    const res = await DistributionRoomRuntime.LineRuntimePoints(projectId, RoomId, lineId)
    if (res.success) {
      if (res.data) {
        const dataes = cloneDeep(res.data)
        dataes.forEach((it, i) => {
          if (Array.isArray(it.data)) {
            it.data.forEach((item, index) => {
              it[item.alias] = item.value
            })
          }

        })

        setTableData(dataes)
      } else {
        setTableData([])
      }
    } else {
      message.error(res.errMsg)
    }
  }
  const onExport = () => {
    return {
      list: tableData,
      total: tableData.length
    }
  }

  const onChangeValue = (e) => {
    // setParams({
    //   ...params,
    //   alike: e,
    // });
  }; //输入框改变值
  useEffect(() => {
    console.log('RoomId', RoomId)
    if (Array.isArray(RoomId)) getLinePoint(RoomId, 0);
  }, [RoomId])
  const CustTitle = (
    <Ctitle>
      <span className='title'>光伏逆变器发电量统计</span>
      <Space size={16}>
        <Serach
          placeholder="请输入设备名称/设备编号/安装地址查询"
          style={{ width: "380px" }}
          onSearch={onChangeValue}
        />
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
          datatype={5}
          energytype={1}
          allselect={true}
          showSearch={true}
        />
        <Titlelayout layout="flex" title={CustTitle}>
          <UseTable columns={columns} dataSource={tableData} ref={tableRef}>

          </UseTable>
        </Titlelayout>
      </Mainbox>
    </Pagecount >
  )
}
