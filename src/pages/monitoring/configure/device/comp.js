import React, { useEffect, useState, forwardRef, useImperativeHandle, useMemo, useContext, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Input, Select, Space, Divider, Row, Col } from 'antd'
import styled from 'styled-components'
import { Monitoring } from '@api/api.js'
import { publishState,adaptation } from '@redux/systemconfig'
import {  ExportExcel, NewButton, AllExportButton} from '@com/useButton'
import {Serach, Cdivider} from '@com/comstyled'
const { DeviceManager: { OneLevel } } = Monitoring
const Mainbox = styled.div`
  flex:1;
  display: flex;
  flex-direction: column;
  row-gap: 16px;
`
export default forwardRef(function Comp(props, ref) {
    const {
        placeholder = '输入设备编号/安装地址',
        inplabel = '设备查询',
        addopen = () => { },
        isenergy = false,
        multExport,
        getList = "",
        setPage,
        exportExecel,
        levelname,
        page,
        tb,
        btnlist=true
    } = props
    const publish = useSelector(publishState)
    const projectId = useSelector(state => state.system.menus.projectId)
    const oneLevel = useSelector(state => state.system.onelevel)
    const {laptop} = useSelector(adaptation)
    const areaOptions = oneLevel.length > 0 ? useMemo(() =>{
         let all = oneLevel.find(i => i.id ==0)
        if(!all)   {
           return  ([{ name: oneLevel[0].levelName+'(全部)', id: 0 }, ...oneLevel])
         }else {
            return oneLevel
         }
    }, [oneLevel]) : []
    const [selvalue, setSelvalue] = useState()
    const [inpvalue, setInpvalue] = useState('')
    const [energyVal, setEnergyVal] = useState()
    const selOptions = [{
        label: '全部用能类型',
        value: 0
    }, {
        label: '客户用能',
        value: 1
    }, {
        label: '公共用能',
        value: 2
    }]


    const changeSelect = (value) => {
        setPage(() => ({
            ...page,
            current: 1,
        }))
        setSelvalue(value)
        console.log(page)
        getList && getList(1, page.pageSize, value, inpvalue, energyVal)
        // getList && getList(value, inpvalue,energyVal)
    }
    const getDeviceSearch = (v) => {
        setPage(() => ({
            ...page,
            current: 1,
        }))
        getList && getList(1, page.pageSize, selvalue, v, energyVal)
    }
    const changeEnergy = (v) => {
        console.log(v)
        setEnergyVal(v)
        setPage(() => ({
            ...page,
            current: 1,
        }))
        getList && getList(1, page.pageSize, selvalue, inpvalue, v)
    }
 
    useImperativeHandle(ref, () => ({
        selvalue,
        inpvalue,
        energyVal,

    }))
    useEffect(() => {

    }, [])
    return (
        <Mainbox>
            <Row justify='space-between'   >
                <Space size={16}>
                        <Select
                            showSearch
                            filterOption={(val,opts)=>{
                                if(opts.name.includes(val)){
                                    return true
                                }else{
                                    return false
                                }        
                            }}
                            style={{
                                width: laptop ? 160 : 264,
                            }}
                            fieldNames={{
                                label: 'name',
                                value: 'id'
                            }}
                            defaultValue={oneLevel.length > 0 ? 0 : null}
                            value={selvalue}
                            onChange={changeSelect}
                            options={areaOptions}
                        />
                    <div style={{display:"flex", alignItems:"center", columnGap: "8px"}}>
                    <span>{inplabel}</span>
                    <Serach
                           style={{ width: laptop ? 260 : 321 }}
                            placeholder={placeholder}
                            allowClear
                            onChange={(e) => { 
                                setInpvalue(e.target.value)
                             }}
                            onSearch = {getDeviceSearch}
                            /> 
                       </div>
                   
                    {
                        isenergy &&   
                                <Select style={{ width: 128 }} options={selOptions} defaultValue={0} onChange={changeEnergy}></Select>
                            
                    }
                </Space>
                {
                    btnlist?( <Row>
                        {publish ? null : <Space size={16} style={{marginRight: '16px'}}>
                            <NewButton onClick={addopen}></NewButton>
                            <AllExportButton onClick={multExport} />
                        </Space>}
                        
                      
                        <ExportExcel tb={tb}/>
                    </Row>):<NewButton onClick={addopen} />
                }
               
            </Row>         
            <div style={{display:'flex',flex:1}}>
            {props.children}
            </div>
            
        </Mainbox>
    )
})
