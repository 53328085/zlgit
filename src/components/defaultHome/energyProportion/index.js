import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import { selectProjectId } from '@redux/systemconfig.js'
import Titlelayout from '@com/titlelayout';
 
import moment from 'moment';
 
import { HomeRuntime } from '@api/api.js'
import { message } from 'antd';
import Ichart  from '@com/useEcharts/Ichart';
const fs = {
  hv: '24px',
  fc: '#333',
  shadow: "y"
}

 


export default function DefaultHome(props){
  const projectId = useSelector(selectProjectId)

  useEffect(() => {

   
    
  }, [])
  
  return (
         <Titlelayout title={'分类能耗占比'} {...fs}>
         <div  style={{width: '424px', height: '341px', display: 'flex'}}>
              {/* <Ichart {...options} /> */}
         </div>
         </Titlelayout>
  )
}
