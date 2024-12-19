import React, {useEffect, useState} from 'react'
import Pagecount from '@com/pagecontent'
import styled from 'styled-components'
import Titlelayout from '@com/titlelayout';
const Mainbox = styled.div`
  flex: 1;
  display: grid;
  grid-template-rows: 48px 1fr ;
  row-gap: 16px;
  
 .title {
  display: flex;
  padding-left: 16px;
  align-items: center;
  background-color: #fff;
  border: 1px solid #d7d7d7;
  border-radius: 4px;
  .ct {
    padding-left: 16px;
    border-left: 4px solid ${props => props.theme.primaryColor};
    display: inline-flex;
    height: 32px;
    line-height: 32px;
    color: #515151;
  }
 

  
 }
`
export default function Index() { 

  return (
    <Pagecount bgcolor="transparent" pd="0">
      <Mainbox>
          <div  className='title' >
            <span className='ct'>全国碳市场行情</span>
          </div>
          <Titlelayout   layout="flex" key="chart">
          <iframe frameborder="0" width="1080" height="810" scrolling="no" src="http://k.tanjiaoyi.com/wz_chart.html"></iframe>
          </Titlelayout>
       </Mainbox>
    </Pagecount>
  )
}
