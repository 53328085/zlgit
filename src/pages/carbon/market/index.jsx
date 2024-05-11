import React, {useEffect, useState} from 'react'
import Pagecount from '@com/pagecontent'
import styled from 'styled-components'
import Titlelayout from '@com/titlelayout';
const Mainbox = styled.div`
  flex: 1;
  display: grid;
  grid-template-rows: 48px 1fr ;
  row-gap: 16px;
  
 
`
export default function Index() { 

  return (
    <Pagecount bgcolor="transparent" pd="0">
      <Mainbox>
          <Titlelayout title="全国碳市场行情"  key="title" pv="0 16px">
          </Titlelayout>
          <Titlelayout   layout="flex" key="chart">
          <iframe frameborder="0" width="1080" height="810" scrolling="no" src="http://k.tanjiaoyi.com/wz_chart.html"></iframe>
          </Titlelayout>
       </Mainbox>
    </Pagecount>
  )
}
