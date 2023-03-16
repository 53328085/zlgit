import React,{useMemo, useState} from 'react'
import Energy from './energy'
import Cost from './cost'
import style from './style.module.less'
import {Form,Input ,Select,Divider,DatePicker} from 'antd'
import { useSelector } from 'react-redux'
import moment from 'moment'
import {energyClassified} from '@api/api'
export default function Index() {
  const projectId =useSelector(state=>state.system.menus.projectId)
  const oneLevel = useSelector(state=>state.system.onelevel)
  const areaOptions =useMemo(()=>([{name:oneLevel[0].levelName,id:0},...oneLevel]),[oneLevel]) 
  const dateOptions = [{label:'日',value:1},{label:'月',value:2},{label:'年',value:3}]
  const [dateType,setDateType] = useState(1)
  const [showType,setShowType] = useState(1)
  //日期类型改变
  const changDateType=(v)=>{
    setDateType(v)
  }
  return (
    <>
    <div className={style.headform}>
      <Form 
      className={style.formstyle}
      initialValues={{
        area:0,
        datetype:1,
        datevalue:moment()
      }}
      >
        <div className={style.divflex}>
        <Form.Item label="园区选择" name="area" className={style.mgbt0}>
            <Select 
            options={areaOptions}  
            fieldNames={{label:'name',value:'id'}}
            style={{width:200}}
            ></Select>
        </Form.Item>
        <Divider style={{background:'#d7d7d7',height:32,margin:'0 32px'}} type="vertical" dashed></Divider>
        <div className={style.checkBox}>
            <div className={ showType===1?`${style.box} ${style.boxactive}`:style.box} onClick={()=>{setShowType(1)}}>能耗</div>
            <div className={ showType===2?`${style.box} ${style.boxactive}`:style.box} onClick={()=>{setShowType(2)}}>费用</div>
        </div>
        </div>
        <div className={style.divflex}>
          <Form.Item name="datetype" className={style.mgbt0} >
            <Select  options={dateOptions} style={{width:80}}  onChange={changDateType}></Select>
          </Form.Item>
          <Form.Item name="datevalue" className={style.mgbt0} style={{marginLeft: 16}}>
             <DatePicker picker={dateType===1?'date':dateType===2?'month':'year'} />
          </Form.Item>
          <Form.Item name="plan" className={style.mgbt0} style={{marginLeft: 16}}>
            <Select style={{width:100}}></Select>
          </Form.Item>
        </div>
      </Form>
    </div>
    <div className={style.content}></div>
      {showType===1?<Energy/>:<Cost/>}
    </>
    
  )
}
