import React, {useRef, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {selectCurProject} from '@redux/user.js'
import {ExclamationCircleFilled} from '@ant-design/icons'
import Titlelayout from '@com/titlelayout';
import {drawEcharts} from '@com/useEcharts'
import {CustTransO} from "@com/useButton"
const fs = {
 // hv: '24px',
  fc: '#333',
  shadow: "y",
}

const pietmData = [
  { value: 30.4, name: "尖占比" },
  { value: 25.7, name: "峰占比" },
  { value: 25.6, name: "平占比" },
  { value: 20.7, name: "谷占比" },
];
export default function DefaultHome(){
  const curProject = useSelector(selectCurProject)
  const tmref = useRef(null)
  useEffect(() => {

    drawEcharts(tmref.current,  {pieData: {data: pietmData, total: 102.4}, type: 3})
  }, [])
  
  return (
         <Titlelayout title={'分时电量分析'} {...fs}>
         <div ref={tmref} style={{width: '422px', height: '300px'}}>

         </div>
         <div className='tips'>
           
         <ExclamationCircleFilled style={{color: '#467cfd', fontSize: '32px'}} />  <p style={{paddingLeft: '32px'}}> 当前时段内,峰电量占总电量37%,占比较大。<br/>

            请合理利用峰谷用电。</p>
         </div>
         </Titlelayout>      
    
  )
}
