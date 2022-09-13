import React, {useState, useRef, useEffect} from 'react'
import {Form } from 'antd'
import styled from 'styled-components'
import UserSearch from '@com/useSerach'
import CustContext from '@com/content.js'
import Pagecontent from '@com/pagecontent/maincontent'
import {drawEcharts} from '@com/useEcharts'
const Laybox = styled.div`
  display: grid;
  grid-template-rows: minmax(576px, 1fr) 432px;
  row-gap: 16px;
  flex:1;
  .top {
     display: grid;
     grid-template-columns: 1fr 400px;
     column-gap: 16px;
      .topleft {
        display: grid;
        grid-template-rows: 48px minmax(512px, auto);
        row-gap: 16px;
      }
  }
  .down {
    display: grid;
    grid-template-columns: 432px repeat(6,192px);
    row-gap: 16px;
  }
`
export default function Index() {
  const ref = useRef()
  const [form] = Form.useForm()
  const [value, setvalue] = useState('1')
  const tabs = [
    {label: '综合能耗', key: '1' },
    {label: '电', key: '2' },
    {label: '水', key: '3' },
    {label: '燃气', key: '4' },
    {label: '煤炭', key: '5' }
  ]
  const dataset = {
    dimensions: ['product', '2015', '2016', '2017'],
    source: [
      { product: 'Matcha Latte', '2015': 12343.3, '2016': 55585.8, '2017': 55553.7 },
      { product: 'Milk Tea', '2015': 34483.1, '2016': 555573.4, '2017': 55555.1 },
      { product: 'Cheese Cocoa', '2015': 455586.4, '2016': 55565.2, '2017': 555582.5 },
      { product: 'Walnut Brownie', '2015': 55552.4, '2016': 555553.9, '2017': 555539.1 }
    ]
  }
  useEffect(() => {
    console.log(ref)
    drawEcharts(ref.current, {dataset, series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }]})
  })
  return (
    <CustContext.Provider value={{form, names: ['RegioId', 'BuildingId', 'FloorId'], tabs, value, setvalue}}>
    <Laybox>
     <div className='top'>
         <div className='topleft'>
           <UserSearch></UserSearch>
           <Pagecontent>
              <div ref={ref} style={{flex: 1}}></div>
           </Pagecontent>
         </div>
          <div>
           
          </div>
     </div>
     <div className='down'>

     </div>

    </Laybox>
    </CustContext.Provider>
  )
}
