import React, { useState } from 'react'
import style from './style.module.less'
import { Select } from 'antd'
import Account from './account'
import Refund from './refund'

import CustContext from '@com/content.js'
import Pagecount from '@com/pagecontent'


export default function Index() {
  const { Option } = Select;

  const [value, setvalue] = useState('account')

  const tabs = [
    { label: '账户交易', key: 'account' },
    { label: '退费处理', key: 'refund' },
  ]
  const propsData ={
    tabs,
    value,
    setvalue
  }

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
      <CustContext.Provider value={propsData}>
      <Pagecount showserach={false}>   
        {
          value == 'account' ? <Account /> : <Refund />
        }
      </Pagecount>
    </CustContext.Provider>
    </div>
  )
}
