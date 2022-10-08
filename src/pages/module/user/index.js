import React, {useState } from 'react'

import Pagecount from '@com/pagecontent'


import CustContext from '@com/content.js'
import styled from 'styled-components'
import Account from './account'
import Power from './power'
export default function Index() {

  const [value, setvalue] = useState('1')


  const tabs = [
    {label: '账号管理', key: '1'},
    {label: '权限管理', key: '2'},
   
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
              value == '1' ? <Account /> : <Power />
             }
       
      
    </Pagecount>
    </CustContext.Provider>
  )
}
