import React, {useState} from 'react'
import {useSelector} from 'react-redux'
import Pagecount from '@com/pagecontent' 
import styled from 'styled-components'
import { useSearchParams, useLocation} from 'react-router-dom'
import CustContext from '@com/content.js'
import Run from './run' // 运行报表
import Electric from './electric'
import Lookselect from './loopSelect'
import Loopname from './loopname'
// import Power from './power'
const Mainbox = styled.div`
 && {
   flex:1;
   display: flex;
   column-gap: 16px;
  .treewrap {
    background-color: #fff;
  }
 }

`

export default function Index() {
  const projectId = useSelector(state => state.system.menus.projectId)
  const [value, setvalue] = useState('0')
  const [lineIds, setLineIds] = useState([])
  const {search} = useLocation()
  
  const lineName = new URLSearchParams(search)?.get('lineName')
 
  
 
  const tabs = [
    { key: '0', label: '运行报表' },
    { key: '1', label: '电力极值报表' },
  ]
  let dataProps = {
    value,
    setvalue,
    tabs,
  }
  const getLinePoint =(keys) => {
     
      setLineIds([...keys])
  }
  const Com={
    "0": <Run lineIds={lineIds} projectId={projectId}   />,
    "1": <Electric lineIds={lineIds} projectId={projectId} />,
    // "2": <Power />
  }[value]
  return (
    <Pagecount bgcolor="transparent" pd="0 0 0 0">
      <Mainbox style={{display: !!lineName ? 'none' : 'flex'}}>
   <div className='treewrap'>
      <Lookselect getLinePoint={getLinePoint} projectId={projectId} />
   </div>
   <CustContext.Provider value={dataProps} >
    
     <Pagecount>
       {Com}
     </Pagecount>
    
    </CustContext.Provider>
    
   </Mainbox>
   {
     lineName && <Loopname  projectId={projectId} />
   }
    </Pagecount>
   
  )
}


