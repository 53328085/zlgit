import React,{useState, useEffect} from 'react'
import moment from 'moment';
import {Space,DatePicker} from 'antd'
import {SerachButton} from '@com/useButton'
import Ichart from "@com/useEcharts/Ichart"
import Titlelayout from '@com/titlelayout' 
import styled from "styled-components"
const Wrap=styled.div`
    display:flex;
    align-items:center;
    justify-content:center;
    column-gap:16px;
`
export default function Chart(props) {
const {title=""} =props
const onChange=()=>{

}
const customHead = (
    <Wrap>
     <div>日期</div>   
    <DatePicker onChange={onChange} />
    <SerachButton/>
    </Wrap>
)
  return (
 
        <Titlelayout title={title} extra={customHead}>Chart</Titlelayout>

    
  )
}
