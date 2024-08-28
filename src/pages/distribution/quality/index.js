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
  .item {
    display: grid;
    grid-template-columns: 1fr 334px;
    grid-template-rows: 30px auto;
    gap: 16px;
    .title {
      display: flex;
      align-items: center;
      column-gap: 16px;
      font-size: 16px;
    }
  }
`
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
          <div className='title' key="ec1">
                <img src={svgurl.ec} />
                电压
          </div>
          <div className='title' key="ec2">
                <img src={svgurl.ec} />
                电压
          </div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </Mainbox>
    </Pagecount>
    </CustContext.Provider>
  )
}
