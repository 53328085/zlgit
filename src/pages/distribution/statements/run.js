import React, {useRef, useEffect} from 'react'
import Titlelayout from '@com/titlelayout'
import {useRequest} from 'ahooks'
import {Space} from 'antd'
import styled from 'styled-components'
import UseTable from '@com/useTable'
import {ExportExcel, CustButtonT, ExportButton} from "@com/useButton"
import {DistributionRoomRuntime} from '@api/api.js'
const Ctitle = styled.div`
  && {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .time{
        padding-right: 64px;
        color: #515151;
    }
  }
`
const Type ={
  1: '分表',
  2: '总表'
}
const columns =[
    {
     title: '回路名称',
     dataIndex: 'lineName',
     key: 'lineName',
    },
    {
        title: '总分表',
        dataIndex: 'type',
        key: 'type',
        render(text) {
          return <span>{Type[text]}</span>
        }
       },
       {
        title: '设备编号',
        dataIndex: 'sn',
        key: 'sn',
       },
       {
        title: '电压',
        children: [
            {
                title: 'Ua(v)',
                dataIndex: 'Ua',
                key: 'Ua',
               },
               {
                title: 'Ub(v)',
                dataIndex: 'Ub',
                key: 'Ub',
               },
               {
                title: 'Uc(v)',
                dataIndex: 'Uc',
                key: 'Uc',
               },
        ]
       },
       {
        title: '电流',
        children: [
            {
                title: 'Ia(v)',
                dataIndex: 'Ia',
                key: 'Ia',
               },
               {
                title: 'Ib(v)',
                dataIndex: 'Ib',
                key: 'Ib',
               },
               {
                title: 'Ic(v)',
                dataIndex: 'Ic',
                key: 'Ic',
               },
        ]
       },
       {
        title: '功率因数',
        dataIndex: 'phsA',
        key: 'phsA',
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
export default function Run({projectId, lineIds}) {
  const tbref=useRef()
  const getData =async() => {
      try {
        if(!Number.isInteger(parseInt(projectId)) && !Array.isArray(lineIds)) return
        let {success, data} =await DistributionRoomRuntime.RLineRuntimePoints({projectId, lineIds})
        if(success && Array.isArray(data)) {
          return data
        }else {
          return []
        }
      } catch (error) {
        return Promise.reject(error)
      }
  } 
  const {data, run, loading} = useRequest(getData, {
    refreshDeps: [projectId, lineIds]
  })
  const  tableData = data?.map(({data,...rest}) =>  {
    let obj = {}
    data?.forEach(d => {
      let {alias, value} = d
       obj[alias] = value
    })
    return {...obj, ...rest}
  })
 
  const CusTitle =(
   <Ctitle> <span>详细参数</span>
        <Space><span className='time'>参量采集时间：2020-09-03 09:35:21</span><CustButtonT text="refresh"   />   <ExportExcel single={true} tb={tbref}  /></Space> 
    </Ctitle>
  )
  return (
     <Titlelayout title={CusTitle} layout="flex" bordered="none" pv="0" bodypad="16px 0 0 0" >
       <UseTable columns={columns} dataSource={tableData} 
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
