import React from 'react'
import style from './style.module.less'
import { Select, Tabs } from 'antd'
import styled from 'styled-components'
import Account from './account'
import Refund from './refund'

const Tabsbox = styled(Tabs)`
  .ant-tabs-nav {
    margin-bottom: 0px;
   .ant-tabs-nav-list {
    .ant-tabs-tab {
        border-radius: 4px 4px 0 0;
        height: 40px;
        width: 144px;
        justify-content: center;
        font-size: 14px;
        background-color: #fff;      
        &:hover {
            background-color: var(--ant-primary-color);
            color: #fff;
        }
    }
    .ant-tabs-tab-active {
        background-color: var(--ant-primary-color);
       
        .ant-tabs-tab-btn {
            color:#fff;
            transition: color 100ms;
        }
    }
   }  
 
}
`

export default function Index() {
  const { Option } = Select;

  const account = ()=>{
    return <Account></Account>
  }
  const refund = ()=>{
    return <Refund></Refund>
  }

  const items = [
    { label: '账户交易', key: 'account', children: account() },
    { label: '退费处理', key: 'refund', children: refund() },
  ]

  const onChange = (checkedValues) => {
    console.log('checked = ', checkedValues);
  };

  return (
    <div>
      <div className={style.header}>
        <span style={{marginLeft: '12px'}}>项目选择</span>
        <Select
          placeholder="请选择项目"
          size="middle"
          style={{width: '320px', marginLeft: '12px'}}
        >
          <Option value="1">正泰物联项目</Option>
        </Select>
      </div>
      <div className={style.content}>
      <Tabsbox onChange={onChange} animated tabBarGutter={16} type="card" items={items}></Tabsbox>
      </div>
    </div>
  )
}
