import React, {useRef, forwardRef,useImperativeHandle,useState,memo, useMemo,useEffect} from 'react'
import {Space, message, Button, Form, Select, DatePicker, Radio} from "antd"
 
import CModal from '@com/useModal'
import {useAntdTable, useRequest} from "ahooks"
import UserTable from "@com/useTable";
import {Mcontent} from "../style"
import {timeoption,viewoption, useColumns,usedOption,useBaroption,useBaroptionEC,useBaroptionIncome,useBaroptionEfc} from "../data"
import {useEuDetail,useEcDetail,useEiDetail,useEeDetail} from "../api"
import { getTime,isObject } from '@com/usehandler'
import {ExportExcel} from "@com/useButton"
import moment from 'moment'
import Ichart from "@com/useEcharts/Ichart";
import { user } from '@pages/Home/header/icon';
 
export default forwardRef(function Index({cRef}){
 
  const mRef = useRef()
  const [form] = Form.useForm()
  const [dtype, setDtype] = useState("date")
  const [params, setParams] = useState({})
  const [title, setTitle] =  useState('')
  const [tabledata, setTableData] = useState([])
  const [used, setUsed] = useState({})
  const [ecs, setEcs] = useState({euc:0, eus:0})
  const [view, setView] = useState(2)
  const usedopti = usedOption(ecs)
  const baropti = useBaroption(used)
  const columns = useColumns(params?.index)
  const baroptiec = useBaroptionEC(used)
  const baroptIncome= useBaroptionIncome(used)
  const baropteffect = useBaroptionEfc(used)
  const fRef = useRef()
  const tbRef=useRef()
  const getTableData = async ({index, projectId})=> { 
    try {
    //  console.log(params)
     // const {index, projectId}= params
      if(!(Number.isInteger(index) && Number.isInteger(projectId))) return
    //  console.log(form.getFieldsValue())
      const {type="date", date=moment()} =  form.getFieldsValue(true)
      if (!(type && date)) return
      const value ={
        date:1,
        month:2,
        year:3
      }[type]
      let query = {
         type:value,
         date: getTime(date, value),
         projectId
        
      }
     let handler = [useEuDetail,useEcDetail,useEiDetail,useEeDetail][index]
     let {success, data, errMsg}  = await  handler(query)
     if(success && isObject(data)) {

       let {euc, eus, useds,creates,incomes,effects} = data
       setEcs({euc, eus})
       let datas =[]
       if(isObject(useds) && index==0) {
          setUsed(useds)
          let {x, y, y1} = useds
           datas = x.map((t, i)=> {
            let total = parseFloat(y[i])+parseFloat(y1[i])
            let curate = isNaN(y[i]/total) ? 0 : (y[i]/total*100)?.toFixed(2)
            let surate=isNaN(y1[i]/total) ? 0 : (y1[i]/total*100)?.toFixed(2)
           return {time: t, cu: parseFloat(y[i]),su:parseFloat(y1[i]), total, curate,surate}
          }
          ) 
       }else if (isObject(creates) && index==1) {
           setUsed(creates)
          let {x, y} = creates
          datas = x.map((t,i) => {
            return {time: t,ec: y[i] }
          })
         
       }else if(isObject(incomes) && index==2) {
           setUsed(incomes)
           let {x, y} = incomes
           datas = x.map((t,i) => {
            return {time: t,income: y[i] }
          })
       } else if(isObject(effects) && index==3) {
         setUsed(effects)
        let {x, y, y1} = effects
          datas = x.map((t,i) => {
          return {time: t,coal: y?.[i], co2:y1?.[i] }
       })
    }
       setTableData(datas)
        
    //   mRef.current.onOpen()
     }else {
      setTableData([])
      setEcs({euc:0, eus:0})
       message.warning(errMsg || "数据出错")
     }
    } catch (error) {
      console.log(error)
    }

  }

/*   useRequest(getTableData, {
    refreshDeps: [params]
  }) */
   
 

 
  const onOpen =async({index, projectId})=> {
    try { 
      setTitle(["用电量明细", "发电量明细","发电折算收益明细","当年社会效益"][index])
     setParams({index, projectId})
     await  mRef.current.onOpen()
      getTableData({index, projectId})
     // mRef.current.onOpen()
    } catch (error) {
      console.log(error)
    }

  }

 
 const onCancel=()=> {
  mRef.current.onCancel()
  form.resetFields()
  setUsed([])
  setView(2)
 }
 
 const onValuesChange=(_, allvalue)=> { 
    setView(allvalue.view)
    getTableData(params)
 }
 
 
  useImperativeHandle(cRef, ()=> ({
    onOpen,
  }))

  const Chart =function({index}){
     if(index===0) {
       return (<div className='chartwrap' key="iu">
        <div className="pie">
          <Ichart {...usedopti} />
        </div>
        <div className='bar'>
          <Ichart {...baropti} />
        </div>
      </div>)
     }else if(index==1) {
       return (
         <div className='allofArea' key="ec">
          <Ichart {...baroptiec} ></Ichart>
         </div>
       )
     }else if(index==2) {
       return (
        <div className="allofArea" key="income">
           <Ichart {...baroptIncome} ></Ichart>
        </div>
       )
     }else if(index==3) {
      return <div className='allofArea'>
         <Ichart {...baropteffect} />
      </div>
     }
  }
  //console.log(chart)
  return (
  <CModal title={title}  closable onCancel={onCancel}      width={1150} mold="cust" footer={null}   ref={mRef}  >
            <Mcontent>
              <Form layout="inline" form={form} onValuesChange={onValuesChange} ref={fRef} preserve={false} >
                <Space size={16} style={{marginLeft: "auto"}}>
                <Form.Item name="type" initialValue="date" >
                <Select options={timeoption} style={{width: "100px"}}></Select>
                </Form.Item>
                <Form.Item noStyle shouldUpdate={(cur, pre)=>cur.type!=pre.type}>
                  {
                    ({getFieldValue, setFieldValue})=>{
                       let dtype = getFieldValue("type")
                       setDtype(dtype)
                       setFieldValue("date", moment())
                       return  null
                    }
                  }
                </Form.Item>
                <Form.Item name="date" initialValue={moment()}>
                  <DatePicker picker={dtype} style={{width: "200px"}}></DatePicker>
                </Form.Item>
                <Form.Item name="view" initialValue={2} >
                  <Radio.Group options={viewoption}   buttonStyle="solid" optionType="button" />
                </Form.Item>
                <Form.Item>
                  <ExportExcel disabled={view==1} tb={tbRef} single={true} />
                </Form.Item>
                </Space>
              </Form>
             {view==2? <div className='outwrap'>
                <div className='inwrap'>
                  <UserTable columns={columns} dataSource={tabledata} scroll={{
                    x:"max-content",
                    y:288,
                  }} ref={tbRef}></UserTable>
                </div>
              </div>
              :  <Chart index={params?.index} />
              }
            </Mcontent>
                
           </CModal>
  )
})
