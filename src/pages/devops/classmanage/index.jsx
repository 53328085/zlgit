import React, { useEffect, useState, useRef, useMemo, Suspense } from 'react'
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
  && {
    .ant-checkbox-wrapper + .ant-checkbox-wrapper {
      margin-left: 0;
    }
  }
`
 
 export default function Index() {
  let {exparams} = useOutletContext()
 
  let {areaId, projectId} = exparams
  const condition = Number.isInteger(areaId) && Number.isInteger(projectId)
  const tableRef =useRef()
  const [isLoading,setIsLoading] = useState(true)
  const [key, setKey] = useState()
  const [tabledata, setTableData] = useState([])
 
  // const areaOptions = oneLevel.length > 0 ? useMemo(() => ([{ name: oneLevel[0].levelName + '(全部)', id: 0 }, ...oneLevel]), [oneLevel]) : []
  const initdata =[
    {
      title: "值班人员",
      dataIndex: `userName`,
      align: 'center',
      width: 200,
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
          render: (text, recoder, index) =>{
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
 
  
  const [columns,setColumns]=useState(initdata)
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
        console.log(key)
        if(Array.isArray(data) && data?.length > 0){
          let datas = data.map(d => {
           
            let nos = d.nos.map(d =>  {
              delete d[key]
              return d;
            })
             console.log(nos)
             return  {userId: d.userId, plan: '', userName: d.userName, ...nos}
          })
          console.log(datas)
          setTableData(datas)
          //tabledataRef.current = [...res.data]
        }else {

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
         console.log(key)
          GetDutyUsers(key)
        }
     //   updateTable()
      }else{
        message.error(res.errMsg)
      }
    } catch (error) {
      console.log(error)
    }
   
  }
  //更新表格视图
  const updateTable=()=>{
    const planvalue=[];
    const columnmore=[]
    for (const key in  reactive.plans ) {
      if (key.indexOf('no')!==-1&&reactive.plans[key]) {
        reactive.plancount++
      }
    } 
    console.log(reactive,)
    initdata[1].render = () => {
      return (
        <div className='gridrow3'>
          {reactive.plans.name1 ? <div className='planclass'>{reactive.plans.name1}</div> : null}
          {reactive.plans.name2 ? <div className='planclass'>{reactive.plans.name2}</div> : null}
          {reactive.plans.name3 ? <div className='planclass'>{reactive.plans.name3}</div> : null}
          {reactive.plans.name4 ? <div className='planclass'>{reactive.plans.name4}</div> : null}
        </div>
      )
    }
    for(let i=0;i<reactive.plancount;i++){
      planvalue.push({label:null,value:`no${i+1}`})
    }
    for (let i = 1; i <= 31; i++) {
      columnmore.push({
        title: i,
        dataIndex: `date${i}`,
        align: 'center',
        onCell(record, rowIndex) {
        
          return {
            className: "pd0"
          }
        },
        render(text,record,index){
     
          let cheeckvalue =[] 
          for (const key in record.nos[i-1]) {
            if (record.nos[i-1][key] ) {
              cheeckvalue.push(key)
            }
          } 
            return (
              <>
                <Checkbox.Group 
                options={planvalue} 
                className='checkGroup'
                key={`${index}-${i}`}
                value={cheeckvalue}></Checkbox.Group>
              </>
                   
            )
        }
      })
    } 
    setColumns([...initdata,...columnmore]) 
  }
  //导出
  const exportEvent = () => {
    for(let i=0;i<tabledataRef.current.length;i++){
      for(let j=0;j<reactive.plancount;j++){
        let arr=[]
        tabledataRef.current[i]['nos'].forEach(item=>{  
          arr.push(item[`no${j+1}`]) 
        })
        exporttabledata.current.push([tabledataRef.current[i]['userName'],reactive.plans[`name${j+1}`],...arr],)
      }
    }
    let head = ['值班人员','班次']
    for(let i=1;i<=31;i++){
      head.push(i)
    }
    
    exporttabledata.current = exporttabledata.current.map(item=>{
     return item.map(it=>{
     
        if(it==1){
          return '是'
        }else if(it==0){
          return '否'
        }else{
          return it
        }
      })
    })
    exporttabledata.current =[head,...exporttabledata.current ]  
    console.log(exporttabledata.current)
    tableRef.current.downloadByData({data:exporttabledata.current})
  }
/*   useEffect(()=>{
    if(oneLevel.length > 0){
      setAreaId(oneLevel[0]['id'])
    }else{
      setIsLoading(false)
    }
  
  },[oneLevel]) */
 
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
       {/*  <div style={{ backgroundColor: "#fff", display: 'flex', alignItems: 'center', padding: '8px 16px', marginBottom: 16, border: '1px solid #d7d7d7', borderRadius: 4 }}>
          <Form
            form={form}
            colon={false}
          >
            <Form.Item label={oneLevel[0]?.levelName} name="area" style={{ marginBottom: 0 }}>
              <Select style={{ width: 200 }} options={oneLevel} fieldNames={{ label: 'name', value: 'id' }} onChange={changeArea} defaultValue={oneLevel.length > 0 ? oneLevel[0]['id'] : null}></Select>
            </Form.Item>
          </Form>
        </div> */}
       
          <Titlelayout title={<div style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}><span>排班信息</span> <ExportButton onClick={exporttabledata}  /></div>} layout="flex" >
            <MainBox>
            <UserTable columns={columns} dataSource={tabledata} ref={tableRef} ></UserTable>
           
            <div className='mgt16'>
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


