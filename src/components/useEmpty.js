import React from 'react'
import {Empty} from 'antd'
import img from './empty.jpg'
import {i18t} from "@com/useButton"
import {ReactComponent as Nodata} from './nodata.svg'
export default function Index(props) {
  let tip = props.tip 
  return (
    <div style={{flex: 1,display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: props.bgcolor}}>
        <Empty 
          image={props?.image || <Nodata />}
          styles={{
            image:{width: '200px', height: '180px'}
          }} 
          description={tip ?? i18t("comm","NoDataAvailable")}
        />
       
    </div>
  )
}
