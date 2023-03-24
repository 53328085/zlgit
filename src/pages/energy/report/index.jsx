import React, { useEffect, useMemo, useState,useContext,useRef } from 'react'
import { useSelector } from 'react-redux'
import CustContext from '@com/content.js'
import Pagecount from '@com/pagecontent'
import Energyconsum from './energyconsum'
import Energymeter from './energymeter'
import Energytimeshare from './energytimeshare'
import { Form, message, Select } from 'antd'
import {energyReport} from '@api/api'

export default function Index() {
  const [value, setvalue] = useState('0')
  const [tabs, setTabs] = useState([
    { key: '0', label: '能耗抄表' },
    { key: '1', label: '能耗用量' },
    { key: '2', label: '分时能耗' },
  ])
  const [areavalue,setAreavalue]=useState()
  const [form]=Form.useForm()
  const projectId = useSelector(state=>state.system.menus.projectId)
  const oneLevel = useSelector(state=>state.system.onelevel)
  const areaOptions =oneLevel.length>0?useMemo(()=>([{name:oneLevel[0].levelName,id:0},...oneLevel]),[oneLevel]) :[]

  let Coms = [
    <Energymeter />,
    <Energyconsum />,
    <Energytimeshare />
  ]

  //改变区域
  const changeArea =(v)=>{
    console.log(v)
    setAreavalue(v)
  }
  let dataProps = {
    value,
    setvalue,
    tabs,
    form,
    areavalue,
    arealistRef:areaOptions
  }
  useEffect(()=>{
 
  },[])
  return (
    <>

      <CustContext.Provider value={dataProps} >
          <div style={{backgroundColor:"#fff",display:'flex',alignItems:'center',padding:'8px 16px',marginBottom:16,border:'1px solid #d7d7d7',borderRadius:4 }}>
            <Form 
            form={form}
            colon={false}
            >
              <Form.Item label={oneLevel[0]?.levelName} name="area" style={{marginBottom:0}}>
                <Select style={{width:200 }} options={areaOptions} fieldNames={{label:'name',value:'id'}} onChange={ changeArea} defaultValue={oneLevel.length>0?0:null}></Select>
              </Form.Item>
            </Form>

          </div>

          <Pagecount showSearch={false}>
            {Coms[Number(value)]}
          </Pagecount>
      </CustContext.Provider>

    </>

  )
}


