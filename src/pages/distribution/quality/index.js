import React , {useState} from 'react'
import {nanoid} from '@reduxjs/toolkit'
import styled from 'styled-components'
import Pagecount from '@com/pagecontent' 
import CustContext from '@com/content.js'
import {Cdivider} from '@com/comstyled'
import svgurl from '@svgs'
import UserTable from "@com/useTable";
const Mainbox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  padding: 16px;
  .item {
    display: grid;
    grid-template-columns: 1fr 334px;
    grid-template-rows: 30px auto;
    gap: 16px 32px;
    padding-bottom: 32px;
    border-bottom: 1px dotted #d7d7d7;
    .title {
      display: flex;
      align-items: center;
      column-gap: 16px;
      font-size: 16px;
    }
  }
`
const  columns = [
   {
      title: '',
      dataIndex: 'type',
      key: 'type',
      width: 80,
    },
    {
      title: '有效值（V）',
      dataIndex: 'a',
      key: 'a',
    },
    {
      title: '波动（v）',
      dataIndex: 'b',
      key: 'b',
    },
    {
      title: '波动频次(次/min)',
      dataIndex: 'c',
      key: 'c',
    },
    {
      title: '偏差(%)',
      dataIndex: 'd',
      key: 'd',
    },
    {
      title: '短闪变',
      dataIndex: 'e',
      key: 'e',
    },
    {
      title: '长闪变',
      dataIndex: 'f',
      key: 'f',
    },
    {
      title: '总谐波畸变率 (%)',
      dataIndex: 'g',
      key: 'g',
    },
    {
      title: '奇次谐波总畸变率 (%)',
      dataIndex: 'h',
      key: 'h',
    },
    {
      title: '偶次谐波总畸变率 (%)',
      dataIndex: 'i',
      key: 'i',
    },
  ]

  const  columns2 = [
    {
       title: '',
       dataIndex: 'type',
       key: 'type',
       width: 80,
     },
     {
       title: '有效值（V）',
       dataIndex: 'a',
       key: 'a',
     },
     {
       title: '不平衡度 (%)',
       dataIndex: 'b',
       key: 'b',
     },
    ]
export default function Index() {
  const [value, setvalue] = useState('0')
  const tabs = [
    { key: '0', label: '稳态检测' },
    { key: '1', label: '谐波频谱' },
    { key: '2', label: '稳态曲线' },
    { key: '3', label: '谐波曲线' },
    { key: '4', label: '负荷曲线' },
    { key: '5', label: '暂态分析' },
    { key: '6', label: 'SOE事件' },
    { key: '7', label: '电能质量分析' },
    { key: '8', label: '电能质量治理' },
  ]
  const dataProps = {
    value,
    setvalue,
    tabs,
  }
  return (
    <CustContext.Provider value={dataProps} >
    <Pagecount>
      <Mainbox>
        <div className='item' key="ec">
          <div className='title' key={nanoid()}>
                <img src={svgurl.ec} />
                电压
          </div>
          <div className='title' key={nanoid()}>
                <img src={svgurl.ec} />
                电压
          </div>
          <div key={nanoid()}>
               <UserTable columns={columns} dataSource={[]} istheme="theme" ></UserTable>
          </div>
          
          <div key={nanoid()}>
               <UserTable columns={columns2} dataSource={[]} istheme="theme" ></UserTable>
          </div>
          </div>
          
      </Mainbox>
    </Pagecount>
    </CustContext.Provider>
  )
}
