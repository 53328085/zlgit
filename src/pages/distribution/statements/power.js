import React, {useRef} from 'react'
import styled from 'styled-components'
import Titlelayout from '@com/titlelayout'
import {Space, Select, DatePicker, Form} from 'antd'
import UseTable from '@com/useTable'
import {ExportExcel, CustButtonT } from "@com/useButton"
import Ichart from '@com/useEcharts/Ichart'
const Mainbox = styled.div`
 flex:1;
 display: grid;
 grid-template-rows: 32px 305px 1fr;
 row-gap: 16px;
 .tool {
   display: flex;
   justify-content: flex-end;
 }
 .chartwrap {
   display: flex;
   flex: 1;
   height: 305px;
 }
`
const columns =[
    {
     title: '回路名称',
     dataIndex: 'name',
     key: 'name',
     width: 100,
     fixed: 'left'
    },
    {
        title: '日期',
        dataIndex: 'date',
        key: 'date',
        width: 80,
     },
     {
      title: '正向有功电度',
      dataIndex: 'power',
      key: 'power',
   },
   {
    title: '反向有功电度',
    dataIndex: 'fpower',
    key: 'fpower',
  },
  {
    title: '正向无功电度',
    dataIndex: 'b',
    key: 'b',
  },
  {
    title: '反向无功电度',
    dataIndex: 'c',
    key: 'c',
  },
  {
    title: '平均功率因数',
    dataIndex: 'a',
    key: 'a',
  },
]
export default function Power() {
  const tbref=useRef()
 
 
  return (
     <Mainbox>
      <div className='tool'>
        <Space><DatePicker /><CustButtonT text="search" src="search" /> <ExportExcel single={true} tb={tbref}  /> </Space>
      </div>
      <Titlelayout layout="flex" style={{height: '305px'}}>
               <Ichart />
      </Titlelayout>
       <UseTable columns={columns} dataSource={[]} 
       hbg="#ecf5ff"
       hbc="#515151"
       ref={tbref}
       sheetName="平均功率报表"
       scroll={{ y: 320}}></UseTable>
     </Mainbox>
  )
}
