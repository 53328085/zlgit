import React from 'react'
import style from './style.module.less'
import BlueColumn from '@com/bluecolumn'
import {Select,Divider} from 'antd'
import { useSelector } from 'react-redux'
export default function Index() {
  const arealist = useSelector(state => state.system.onelevel)
  return (
    <div className={style.container}>
        <div className={style.leftcss}>
        <BlueColumn name="园区选择"/>
        <Select 
        options={arealist} 
        style={{width:'100%',marginTop:32}}
        fieldNames={{label:'name',value:'id'}}
        ></Select>
        <Divider dashed style={{borderColor: '#d7d7d7'}}/>
        <BlueColumn name="运行报告"/>
        
        </div>
        <div className={style.rightcss}>

        </div>
    </div>
  )
}
