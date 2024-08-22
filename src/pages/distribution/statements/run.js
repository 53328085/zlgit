import React, {useRef} from 'react'
import Titlelayout from '@com/titlelayout'
import {Space} from 'antd'
import UseTable from '@com/useTable'
import {ExportExcel, CustButtonT, ExportButton} from "@com/useButton"
import styled from 'styled-components'
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
const columns =[
    {
     title: '回路名称',
     dataIndex: 'name',
     key: 'name',
    },
    {
        title: '总分表',
        dataIndex: 'total',
        key: 'total',
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
                dataIndex: 'ua',
                key: 'ua',
               },
               {
                title: 'Ub(v)',
                dataIndex: 'ub',
                key: 'ub',
               },
               {
                title: 'Uc(v)',
                dataIndex: 'uc',
                key: 'uc',
               },
        ]
       },
       {
        title: '电流',
        children: [
            {
                title: 'Ia(v)',
                dataIndex: 'ia',
                key: 'ia',
               },
               {
                title: 'Ib(v)',
                dataIndex: 'ib',
                key: 'ib',
               },
               {
                title: 'Ic(v)',
                dataIndex: 'ic',
                key: 'ic',
               },
        ]
       },
       {
        title: '功率因数',
        dataIndex: 'power',
        key: 'power',
       },
       {
        title: '总有功功率',
        children: [
            {
                title: '(kW)',
                dataIndex: 'kw',
                key: 'kw',
               },
         ]
       },
       {
        title: '总无功功率',
        children: [
            {
                title: '(kVar)',
                dataIndex: 'kVar',
                key: 'kVar',
               },
         ]
       },
       {
        title: '总能耗',
        children: [
            {
                title: '(kWh)',
                dataIndex: 'kWh',
                key: 'kWh',
               },
         ]
       },
]
export default function Run() {
  const tbref=useRef()
  const CusTitle =(
   <Ctitle> <span>详细参数</span>
        <Space><span className='time'>参量采集时间：2020-09-03 09:35:21</span><CustButtonT text="refresh"   />   <ExportExcel single={true} tb={tbref}  /></Space> 
    </Ctitle>
  )
  return (
     <Titlelayout title={CusTitle} layout="flex" bordered="none" pv="0" bodypad="16px 0 0 0" >
       <UseTable columns={columns} dataSource={[]} 
       hbg="#ecf5ff"
       hbc="#515151"
       ref={tbref}
       sheetName="运行参数"
       scroll={{
                    scrollToFirstRowOnChange: true, 
                     y: 470
                   }
                  }></UseTable>
     </Titlelayout>
  )
}
