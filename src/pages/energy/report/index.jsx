import React, { useEffect, useMemo, useState,useContext,useRef } from 'react'
import { useSelector } from 'react-redux'
import CustContext from '@com/content.js'
import Pagecount from '@com/pagecontent'
import Energyconsum from './energyconsum'
import Energymeter from './energymeter'
import Energytimeshare from './energytimeshare'
import { Form, message, Select } from 'antd'
import {energyReport} from '@api/api'

// const CountContext = createContext();
export default function Index() {
  const [value, setvalue] = useState('0')
  const [tabs, setTabs] = useState([
    { key: '0', label: '能耗抄表' },
    { key: '1', label: '能耗用量' },
    { key: '2', label: '分时能耗' },
  ])
  const [areas,setAreas] = useState([])
  const  arealistRef = useRef()
  arealistRef.current=areas
  const [areavalue,setAreavalue]=useState(0)

  const [form]=Form.useForm()
  const projectId = useSelector(state=>state.system.menus.projectId)
  let Coms = [
    <Energymeter areavalue={areavalue} arealistRef={arealistRef}/>,
    <Energyconsum areavalue={areavalue} arealistRef={arealistRef}/>,
    <Energytimeshare areavalue={areavalue} arealistRef={arealistRef}/>
  ]
  //获取区域
  const getAeraQueryAll=async ()=>{
    const res =await energyReport.AeraQueryAll(projectId)
    if(res.success){
      setAreas([{name:'全部园区',id:0},...res.data])
      form.setFieldValue('area',0) 
    }else{
      message.error(res.errMsg)
    }
  }
  //改变区域
  const changeArea =(v)=>{
    console.log(v)
    setAreavalue(v)
  }
  let dataProps = {
    value,
    setvalue,
    tabs,
    form
  }
  useEffect(()=>{
    getAeraQueryAll()
  },[])
  return (
    <>

      <CustContext.Provider value={dataProps} >
       
          <div style={{backgroundColor:"#fff",display:'flex',alignItems:'center',padding:'8px 16px',marginBottom:16,border:'1px solid #d7d7d7',borderRadius:4 }}>
            <Form 
            form={form}
            >
              <Form.Item label="园区选择" name="area" style={{marginBottom:0}}>
                <Select style={{width:200 }} options={areas} fieldNames={{label:'name',value:'id'}} onChange={ changeArea}></Select>
              </Form.Item>
            </Form>
            
          </div>
    
          <Pagecount showSearch={false}>
            {Coms[Number(value)]}
          </Pagecount>
          {/* <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        </div> */}

      </CustContext.Provider>

    </>

  )
}

