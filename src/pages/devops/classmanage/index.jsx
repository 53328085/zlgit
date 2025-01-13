import React, { useEffect, useState, useRef, useMemo, Suspense, useCallback } from 'react'
import Pagecount from '@com/pagecontent'
import CustContext from '@com/content.js'
import { Form, Image, message, Progress, Select, Button,Checkbox, Space  } from 'antd'
import {useOutletContext} from 'react-router-dom'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import BlueColumn from '@com/bluecolumn'
import UserTable from '@com/useTable'
import { useReactive } from 'ahooks';
import { ExportExcel, CustButton, ExportButton } from '@com/useButton'
import { operationDesigin } from '@api/api'
import exportpng from './img/export.png'
import Loading from '../../Loading'
 
import Titlelayout from '@com/titlelayout'

const MainBox = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  row-gap: 16px;  
  padding-top: 16px;
  .title{
    display: flex;
    justify-content: space-between;
  }
  .pdr{
    padding-right: 16px;
  }
  .wd96{
      width: 96px;
    }
  .mgt16{
      margin-top: 16px;
    }
  .pd0{
    padding: 0px !important;
    width: 63px;
    height:92px;
    .ant-checkbox-group{
      padding: 2px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .ant-checkbox-group-item
      {
        width: 16px;
        height:28px ;
        padding: 0;
        margin: 0;
        text-align: center;
        line-height: 28px;
      }
      
    }    
    .gridrow3{
      display: grid;
      padding: 2px;
      grid-template-columns:59px;
      grid-gap: 2px;
      justify-content: center;
      align-items: center;
      .planclass{
      height: 28px;
      color: #fff;
      line-height:28px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      &:nth-of-type(1){
        background-color: #6666ff;
      }
      &:nth-of-type(2){
        background-color: #339966;
      }
      &:nth-of-type(3){
        background-color: #cc3333;
      }
      &:nth-of-type(4){
        background-color: #f18509;
      }
    }
    }
    
  }
  
`
const Checkboxs =  styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  && {
    .ant-checkbox-wrapper + .ant-checkbox-wrapper {
      margin-left: 0;
    }
  }
`
const columns =[
  {
    title: "值班人员",
    dataIndex: `userName`,
    align: 'center',
    width: 120,
  }, {
    title: "班次",
    dataIndex: `plan`,
    align: 'center',
    onCell(record, rowIndex) {
      return {
        className: "pd0"
      }
    },
    render(text, record, index) {
      return (
        <div className='gridrow3'>
          <div className='planclass'>早班</div>
          <div className='planclass'>中班</div>
          <div className='planclass'>晚班</div>
        </div>
      )
    }
  },
  ...Array.from({length: 31}, (_, i) => {
     return {
        title: i+1,
        dataIndex: i,
        render: (text) =>{
         let options = []
        for( let [label, value] of Object.entries(text)) {
             options.push({label, value})
          }
         return (  
          <Checkboxs>
            { options.map(o =>  <Checkbox checked={o.value==1}></Checkbox>)} 
          </Checkboxs>
         )
        }
     }
     

  })
]
let dates = Array.from({length: 31}, (_,i) => (i+1).toString())
const excolums = [
  '值班人员',
  '班次',
 ...dates,
]
 export default function Index() {
  let {exparams} = useOutletContext()
 
  let {areaId, projectId} = exparams
  const condition = Number.isInteger(areaId) && Number.isInteger(projectId)
  const tableRef =useRef()
  const [isLoading,setIsLoading] = useState(true)
  const [key, setKey] = useState()
  const [tabledata, setTableData] = useState([])
 
  // const areaOptions = oneLevel.length > 0 ? useMemo(() => ([{ name: oneLevel[0].levelName + '(全部)', id: 0 }, ...oneLevel]), [oneLevel]) : []

  
 
  const reactive  = useReactive({
    plans:{},
    plancount:0,
  })
 const exporttabledata=useRef([])
  //获取排班表
  const tabledataRef =useRef()
  const GetDutyUsers = async (key) => {
    try {
      const {success, data, errMsg} = await operationDesigin.GetDutyUsers(projectId,areaId)
      if (success) {
        
        if(Array.isArray(data) && data?.length > 0){
          let datas = data.map(d => {
           
            let nos = d.nos.map(d =>  {
              delete d[key]
              return d;
            })
             
             return  {userId: d.userId, plan: '', userName: d.userName, ...nos}
          })
        
          setTableData(datas)
          //tabledataRef.current = [...res.data]
        }else {
          setTableData([])
        }
      } else {
        message.error(errMsg)
      }
    } catch (error) {
       console.log(error)
    }
   
  }
   //获取班次计划
   const getDuty =async ()=>{
    try {
      const res = await operationDesigin.GetDuty(projectId,areaId)
      if(res.success){
        if(res.data){
          reactive.plans = res.data
         let key =  ['no1','no2','no3', 'no4'].find(n => res.data[n]==0)
        
          GetDutyUsers(key)
        }else {
          setTableData([])
        }
     //   updateTable()
      }else{
        setTableData([])
        message.error(res.errMsg)
      }
    } catch (error) {
      console.log(error)
    }
   
  }
   
  //导出
  const onexprot =useCallback( () => {

  let tbdata =  tabledata.map(t => {
     let row = {
      '值班人员': t.userName,
      '班次': "早班 中班 晚班"
     }
     Array.from({length: 31}, (_, i) => {
          let text1 = t[i].no1==1 ? reactive.plans.name1 : ''
          let text2 = t[i].no2==1 ? reactive.plans.name2 : ''
          let text3 = t[i].no3==1 ? reactive.plans.name3 : ''
          let text4 = t[i]?.no4==1 ? reactive.plans.name4 : ''
          row[i+1] = text1+text2 + text3 + text4;
     }) 
     return row
   })
  
   tableRef.current.downloadByData({header: excolums, data: tbdata, skipHeader: false})
  }, [tabledata])


 
  useEffect(() => {
    async function func(){
    //  await GetDutyUsers()
      await getDuty()
      setIsLoading(false)
    }
    if(condition) {
      func()
    }
   
  }, [areaId, projectId])
  return (
   
      <Pagecount pd="0">
       
          <Titlelayout title={<div style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}><span>排班信息</span> <ExportButton onClick={onexprot}  /></div>} layout="flex" >
            <MainBox>
            <UserTable columns={columns} dataSource={tabledata} ref={tableRef} ></UserTable>
            <div>
            {reactive.plans?.name1?(<span className='pdr'>{reactive.plans.name1} : {reactive.plans.startTime1}~{reactive.plans.endTime1}</span>):null}
            {reactive.plans?.name2?(<span className='pdr'>{reactive.plans.name2} : {reactive.plans.startTime2}~{reactive.plans.endTime2}</span>):null}
            {reactive.plans?.name3?(<span className='pdr'>{reactive.plans.name3} : {reactive.plans.startTime3}~{reactive.plans.endTime3}</span>):null}
            {reactive.plans?.name4?(<span>{reactive.plans.name4} : {reactive.plans.startTime4}~{reactive.plans.endTime4}</span>):null}
           </div>  
          </MainBox>        
          </Titlelayout>
      </Pagecount>
   
  )
}


