import React, {useState} from 'react'
import Pagecount from '@com/pagecontent' 
import styled from 'styled-components'
import Titlelayout from '@com/titlelayout'
import CustContext from '@com/content.js'
import Run from './run' // 运行报表
import Electric from './electric'
import Power from './power'
const Mainbox = styled.div`
 && {
   flex:1;
   display: grid;
   grid-template-columns: 257px 1409px;
   column-gap: 16px;
   
 }

`
export default function Index() {
  const [value, setvalue] = useState('0')
  const tabs = [
    { key: '0', label: '运行报表' },
    { key: '1', label: '电力极值报表' },
    { key: '2', label: '平均功率报表' },
  ]
  let dataProps = {
    value,
    setvalue,
    tabs,
  }
  const Com={
    "0": <Run />,
    "1": <Electric />,
    "2": <Power />
  }[value]
  return (
    <Pagecount bgcolor="transparent" pd="0">
      <Mainbox>
   <Titlelayout title="回路选择">

   </Titlelayout>
   <CustContext.Provider value={dataProps} >
     <Pagecount>
       {Com}
     </Pagecount>
    </CustContext.Provider>
   </Mainbox>
    </Pagecount>
   
  )
}


