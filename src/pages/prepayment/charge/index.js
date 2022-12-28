import React, { useState } from 'react'
import style from './style.module.less'
import { Select, Tabs } from 'antd'
import EnergyRecord from './energyRecord'
import Refund from './refund'
import Pagecount from '@com/pagecontent'
import CustContext from '@com/content.js'
const { Option } = Select

export default function Index() {
  const [value, setvalue] = useState('device')
  const tabs = [{ label: "能源账户充值", key: 'customer' }, { label: '退费', key: 'device' }]
  const propsData = {
    tabs,
    value,
    setvalue
  }
  return (
    <CustContext.Provider value={propsData}>
      <Pagecount showserach>
        <div className={style.container}>
          <div className={style.content}>
            <div className={style.contentTable}>
              {
                value === 'customer' ? <EnergyRecord /> : <Refund />
              }
            </div>
          </div>

        </div>
      </Pagecount>
    </CustContext.Provider>



  )
}

