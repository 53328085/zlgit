import React, { useEffect, useState, useRef, useMemo, Suspense } from 'react'
import Pagecount from '@com/pagecontent'
import CustContext from '@com/content.js'
import { Form, Image, message, Progress, Select, Button,Checkbox, Space  } from 'antd'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import BlueColumn from '@com/bluecolumn'
import UserTable from '@com/useTable'
import { useReactive } from 'ahooks';
import { ExportExcel } from '@com/useButton'
import { operationDesigin } from '@api/api'
import exportpng from './img/export.png'
import Loading from '../../Loading'

const MainBox = styled.div`
  background-color: #fff;
  padding:16px;
  border: 1px solid #d7d7d7;
  border-radius: 4px; 
  flex: 1;
  --ant-primary-color:#237ae4;
  --ant-primary-color-hover:#237ae4;
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
const Custbtn = styled(Button)`
  && {
    width: ${props => props.wh || '96px'};
    height: 32px;
    background: #237ae4;
    border-color: #237ae4;
    border-radius: 2px;
    color: #fff;
    padding: 8px;
    text-align: left;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &&:hover {
    background-color: #4f95ea;
    border-color: #4f95ea;
    color: #fff;
  }
  &&:active,
  &&:focus {
    background-color: #1c62b7;
    border-color: #1c62b7;
    color: #fff;
  }
  &&[disabled] {
    background-color: #C8C9CC;
    border-color: #C8C9CC;
  }
  img {
    height: ${props => props.imgh || '16px'}; 
    margin-right: 8px;
  }
`;
 export default function Index() {
  const [form] = Form.useForm()
  const tableRef =useRef()
  const [isLoading,setIsLoading] = useState(true)
  const [key, setKey] = useState()
  const [tabledata, setTableData] = useState([])
  const [areaId,setAreaId]=useState(null)
  const oneLevel = useSelector(state => state.system.onelevel)
  const projectId = useSelector(state => state.system.menus.projectId)
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
    }
  ]
  const changeArea = (id) => {
    setAreaId(id)
    setTableData([])
   
    reactive.plancount = 0
    tabledataRef.current=[]
  }
  
  const [columns,setColumns]=useState(initdata)
  const reactive  = useReactive({
    plans:{},
    plancount:0,
  })
 const exporttabledata=useRef([])
  //获取排班表
  const tabledataRef =useRef()
  const GetDutyUsers = async () => {
    const res = await operationDesigin.GetDutyUsers(projectId,areaId)
    if (res.success ) {
      if(res.data){
        setTableData([...res.data])
        tabledataRef.current = [...res.data]
      }
    } else {
      message.error(res.errMsg)
    }
  }
   //获取班次计划
   const getDuty =async ()=>{
    const res = await operationDesigin.GetDuty(projectId,areaId)
    if(res.success){
      if(res.data){
        reactive.plans = res.data
       
      }
      updateTable()
    }else{
      message.error(res.errMsg)
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
  useEffect(()=>{
    if(oneLevel.length > 0){
      setAreaId(oneLevel[0]['id'])
    }else{
      setIsLoading(false)
    }
  
  },[])
  useEffect(() => {
    async function func(){
      await GetDutyUsers()
      await getDuty()
      setIsLoading(false)
    }
    areaId&&func()
  }, [areaId])
  return (
    <>
   {
  
    isLoading?<Loading/>:(<CustContext.Provider >
      <Pagecount bgcolor="#eeeff3" pd={0}>
        <div style={{ backgroundColor: "#fff", display: 'flex', alignItems: 'center', padding: '8px 16px', marginBottom: 16, border: '1px solid #d7d7d7', borderRadius: 4 }}>
          <Form
            form={form}
            colon={false}
          >
            <Form.Item label={oneLevel[0]?.levelName} name="area" style={{ marginBottom: 0 }}>
              <Select style={{ width: 200 }} options={oneLevel} fieldNames={{ label: 'name', value: 'id' }} onChange={changeArea} defaultValue={oneLevel.length > 0 ? oneLevel[0]['id'] : null}></Select>
            </Form.Item>
          </Form>
        </div>
        <MainBox>
          <div className='title'>
            <BlueColumn name="排班信息"></BlueColumn>
            {/* <div onClick={()=>{ tableRef.current.downloadByData({data:[
  ['姓名', '年龄', '性别'],
  ['王二', 35, '男'],
  ['张三', 25, '男'],
  ['李四', 30, '女'],
  ['赵五', 40, '女'],
]})}}>1111</div> */}
            <Custbtn onClick={exportEvent}>
              <img src={exportpng} />
              导出
            </Custbtn>
          </div>
         
          <div className='mgt16'>
            <UserTable columns={columns} dataSource={tabledata} ref={tableRef}></UserTable>
          </div>
        
          <div className='mgt16'>
            {reactive.plans?.name1?(<span className='pdr'>{reactive.plans.name1} : {reactive.plans.startTime1}~{reactive.plans.endTime1}</span>):null}
            {reactive.plans?.name2?(<span className='pdr'>{reactive.plans.name2} : {reactive.plans.startTime2}~{reactive.plans.endTime2}</span>):null}
            {reactive.plans?.name3?(<span className='pdr'>{reactive.plans.name3} : {reactive.plans.startTime3}~{reactive.plans.endTime3}</span>):null}
            {reactive.plans?.name4?(<span>{reactive.plans.name4} : {reactive.plans.startTime4}~{reactive.plans.endTime4}</span>):null}
          </div>
        </MainBox>
      </Pagecount>
    </CustContext.Provider>)
   }
    
    </>
  )
}


