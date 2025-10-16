import React, { useState, useMemo, useEffect, useRef } from 'react'

import { Typography, message, Space, Checkbox } from 'antd'
import UseTree from "@com/useTree";
import { useSelector } from 'react-redux'
import { useAntdTable } from "ahooks";
import {useOutletContext} from 'react-router-dom'
import moment from 'moment';
 
import {   adaptation } from "@redux/systemconfig";
//import {Link} from 'react-router-dom'
import { ExportExcel, CustButtonT } from '@com/useButton'
import styled, { css } from 'styled-components';
import Titlelayout from '@com/titlelayout'
import Pagecount from '@com/pagecontent'
import UseTable from '@com/useTable'
import { cloneDeep } from 'lodash';
import { Serach } from "@com/comstyled";
import {useQueryStatisticTable} from "./api"
import { getTime } from '@com/usehandler';
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
  const [showAll, setShowAll] = useState(false)
  let { exparams } = useOutletContext()
  const {projectId, type, date,areaId } = exparams
 
  const { laptop } = useSelector(adaptation)

  const getTableData = async({current, pageSize})=>{
   try {
     if(!Array.isArray(treeId) )return;
     if(![projectId, type,  areaId].every(i => Number.isInteger(parseInt(i)))) return;
     if(!date) return;
     let body ={
        pageNum:current,
        pageSize,
        projectId,
        areaId,
        type,
        date:getTime(date, type),
        snGroup:treeId,
     }
     let {success, data, total, errMsg}= await useQueryStatisticTable({}, body)
     if(success && Array.isArray(data)){
       return {
         list:data,
         total,
       }
     }else {
       if(!success) message.warning(errMsg || '数据出错')
       return {
         list:[],
         total:0
       }
     }
   } catch (error) {
     console.log(error)
   }

  }
 const{tableProps, search} = useAntdTable(getTableData, {
      defaultPageSize:14,
      refreshDeps:[areaId, treeId, type, date,projectId],
      
  })
  //  const roomId = [curid]
 
  // const [tableData, setTableData] = useState([])
  const tableRef = useRef()
  // 模拟表格数据
  const tableData = [
    {
      key: '1',
      lineName: '安庆直奔旺旺',
      sn: 'HZZ001',
      type: '站点',
      address: '安庆直奔旺旺',
      totalGeneration: '11520.21',
      totalConsumption: '124.24'
    },
    {
      key: '2',
      lineName: '并网柜 D01(一期)',
      sn: 'Q2132225',
      type: '并网柜',
      address: '安庆直奔旺旺',
      totalGeneration: '11520.21',
      totalConsumption: '/'
    },
    // ... 其他数据
  ];
  // 时间数据（假设每个设备有对应的时间段数据）
  const timeData = {
    '1': [
      ['12.32', '12.36'], // 00:00 的两个数据
      ['11.25', '19.25'], // 01:00 的两个数据
      ['12.32', '11.25'], // 02:00 的两个数据
      ['20.14', '24.99'], // 03:00 的两个数据
      ['25.36', '20.00'], // 04:00 的两个数据
      ['18.50', '16.75'], // 05:00 的两个数据
      ['15.20', '14.80'], // 06:00 的两个数据
      ['13.45', '12.90'], // 07:00 的两个数据
      ['11.20', '10.80'], // 08:00 的两个数据
      ['9.85', '8.90'],   // 09:00 的两个数据
      ['7.60', '6.80'],   // 10:00 的两个数据
      ['5.40', '4.90']    // 11:00 的两个数据
    ],
    '2': [
      ['12.32', '/'],
      ['11.25', '/'],
      ['20.14', '/'],
      ['12.32', '/'],
      ['15.60', '/'],
      ['14.20', '/'],
      ['13.80', '/'],
      ['12.40', '/'],
      ['11.20', '/'],
      ['10.80', '/'],
      ['9.60', '/'],
      ['8.40', '/']
    ],
    '3': [
      ['15.80', '16.20'],
      ['14.90', '18.75'],
      ['17.40', '16.80'],
      ['19.20', '20.10'],
      ['18.90', '17.60'],
      ['16.30', '15.80'],
      ['14.20', '13.80'],
      ['12.90', '12.40'],
      ['11.80', '11.20'],
      ['10.60', '10.20'],
      ['9.40', '9.00'],
      ['8.20', '7.80']
    ],
    // ... 其他设备的时间数据
  };
  // 时间段列 - 每个时间点有两个子列
  const generateTimeColumns = () => {
    const timeColumns = [];

    for (let i = 0; i < 12; i++) {
      const hour = i.toString().padStart(2, '0');
      timeColumns.push({
        title: `${hour}:00`,
        key: `time_${i}`,
        children: [
          {
            title: '发电量',
            dataIndex: `time_${i}_1`,
            width: 100,
            key: `time_${i}_1`,
            render: (text) => text || '/'
          },
          {
            title: '用电量',
            dataIndex: `time_${i}_2`,
            width: 100,
            key: `time_${i}_2`,
            render: (text) => text || '/'
          }
        ]
      });
    }

    return timeColumns;
  };
  // 时间段列（00:00, 01:00, 02:00, ...）
  const timeColumns = Array.from({ length: 24 }, (_, i) => ({
    title: `${i.toString().padStart(2, '0')}:00`,
    dataIndex: `time_${i}`,
    width: 100,
    key: `time_${i}`,
    render: (text) => text || '/'
  }));
  const baseColumns = [
    {
      title: '名称',
      dataIndex: 'lineName',
      width: 160,
      key: 'lineName',
    },
    {
      title: "编号",
      dataIndex: 'sn',
      width: 100,
      key: 'sn',
    },
    {
      title: "类型",
      dataIndex: 'type',
      width: 100,
      key: 'type',
    },
    {
      title: "安装地址",
      dataIndex: 'address',
      width: 100,
      key: 'address',
    },
    {
      title: "总发电量 (kWh)",
      dataIndex: 'totalGeneration',
      width: 100,
      key: 'totalGeneration',
    },
    {
      title: "总用电量 (kWh)",
      dataIndex: 'totalConsumption',
      width: 100,
      key: 'totalConsumption',
    },
  ]


  const getLinePoint = async (RoomId, lineId) => {
    // if (!Number.isInteger(lineId)) return
    // const res = await DistributionRoomRuntime.LineRuntimePoints(projectId, RoomId, lineId)
    // if (res.success) {
    //   if (res.data) {
    //     const dataes = cloneDeep(res.data)
    //     dataes.forEach((it, i) => {
    //       if (Array.isArray(it.data)) {
    //         it.data.forEach((item, index) => {
    //           it[item.alias] = item.value
    //         })
    //       }

    //     })

    //     setTableData(dataes)
    //   } else {
    //     setTableData([])
    //   }
    // } else {
    //   message.error(res.errMsg)
    // }
  }
  const onExport = () => {
   
  }

  const onChangeValue = (e) => {
    // setParams({
    //   ...params,
    //   alike: e,
    // });
  }; //输入框改变值
  
  const showAllChagne = (e) => {
    setShowAll(e.target.checked)
  }
  // 根据showAll状态动态生成列
  const columns = useMemo(() => {
    if (showAll) {
      const timeColumns = generateTimeColumns();
      return [
        // 前6列固定
        ...baseColumns.map((col, index) => ({
          ...col,
          fixed: 'left',
          onCell: () => ({
            style: {
              zIndex: 2
            }
          })
        })),
        // 时间列不固定，使用分组列
        ...timeColumns.map(col => ({
          ...col,
          fixed: false
        }))
      ];
    }
    return baseColumns;
  }, [showAll, baseColumns]);
  console.log(columns)
  // 根据showAll状态处理数据
  const processedData = useMemo(() => {
    if (!showAll) {
      return tableData;
    }

    return tableData.map(item => {
      const timeValues = timeData[item.key] || [];
      const timeDataObj = {};

      // 处理每个时间段的两个数据
      timeValues.forEach((hourData, hourIndex) => {
        if (Array.isArray(hourData)) {
          timeDataObj[`time_${hourIndex}_1`] = hourData[0] || '/'; // 发电量
          timeDataObj[`time_${hourIndex}_2`] = hourData[1] || '/'; // 用电量
        }
      });

      return {
        ...item,
        ...timeDataObj
      };
    });
  }, [showAll, tableData]);
  // 计算滚动宽度
  const scrollX = useMemo(() => {
    if (showAll) {
      const baseWidth = baseColumns.reduce((sum, col) => sum + (col.width || 100), 0);
      const timeWidth = timeColumns.reduce((sum, col) => sum + (col.width || 100), 0);
      // 添加一些额外宽度确保滚动正常
      return baseWidth + timeWidth + 50;
    }
    return '100%';
  }, [showAll, baseColumns, timeColumns]);
  // 表格滚动配置
  const scrollConfig = useMemo(() => {
    if (showAll) {
      return {
        x: scrollX,
      };
    }
    return { x: 'max-content' };
  }, [showAll, scrollX]);

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
        <Titlelayout layout="flex" title={CustTitle}>
          <UseTable columns={columns}  {...tableProps} ref={tableRef}
            scroll={scrollConfig} style={{
              width: '100%'
            }}  // 确保表格布局固定
            tableLayout="fixed"
            sticky
          >

          </UseTable>
        </Titlelayout>
      </Mainbox>
    </Pagecount >
  )
}
