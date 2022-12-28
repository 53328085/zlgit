import React, { useState } from 'react'
import Elec from './elec'
import Water from './water'
import Gas from './gas'

import CustContext from '@com/content.js'
import Pagecount from '@com/pagecontent'

export default function Index() {
  const [value, setvalue] = useState('elec')

  const tabs = [
    { label: '电', key: 'elec' },
    { label: '水', key: 'water' },
    { label: '燃气', key: 'gas' },
  ]
  const propsData ={
    tabs,
    value,
    setvalue
  }

  return (
    <CustContext.Provider value={propsData}>
      <Pagecount showserach={false}>   
        {
          value == 'elec' ? <Elec /> : value == 'water' ? <Water /> : <Gas />
        }
      </Pagecount>
    </CustContext.Provider>
  )
}
