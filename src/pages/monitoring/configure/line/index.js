import React ,{useState}from 'react'
import CustContext from '@com/content.js'
import Pagecount from '@com/pagecontent'
import Electric from './electric'
import Water from './water'
import Fire from './fire'
export default function Index() {
  const [value, setvalue] = useState('0')
  const [tabs,setTabs] =useState([
    {key: '0',label: '电'},
    {key: '1',label: '水'},
    {key: '2',label: '燃气'}
  ])
  let dataProps={
    value,
    setvalue,
    tabs
  }
  let Coms = [
    <Electric />,
    <Water />,
    <Fire/>
  ]
  return (
    <CustContext.Provider value={dataProps}>
      <Pagecount>
       { Coms[Number(value)] }
      </Pagecount>
    </CustContext.Provider>
  )
}
