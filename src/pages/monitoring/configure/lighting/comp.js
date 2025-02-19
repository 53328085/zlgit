import React, { useEffect, useContext, forwardRef, useImperativeHandle, useState, useRef, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Input, Select, Space, Divider, Row, Col,message } from 'antd'
import styled from 'styled-components'
import { Monitoring } from '@api/api.js'
import CustContext from '@com/content'
import { publishState,adaptation } from '@redux/systemconfig'
import {  ExportExcel, NewButton, AllExportButton} from '@com/useButton'
import {Serach, Cdivider} from '@com/comstyled'
const Mainbox = styled.div`
  flex:1;
  display: flex;
  flex-direction: column;
  row-gap: 16px;
`
function Comp(props, ref) {
    const publish = useSelector(publishState)
    const {laptop} =useSelector(adaptation)
    const context = useContext(CustContext)
    const [selvalue, setSelValue] = useState()
    const [inpvalue, setInpValue] = useState()
    const selRef = useRef(selvalue)
    selRef.current = selvalue
    const inpRef = useRef(inpvalue)
    inpRef.current = inpvalue
    const oneLevel = useSelector(state => state.system.onelevel)

    const areaOptions = useMemo(() => {
         
         let isall = oneLevel.find(o => o.id ==0)
       
        if (!isall && oneLevel.length > 0) {
         return  [{ name: oneLevel[0].levelName+'(全部)', id: 0 }, ...oneLevel]
        }else {
            return oneLevel
        }
    }, [oneLevel])
  
    const {
        placeholder = '输入控制器编号/安装地址',
        inplabel = '设备查询',
        addopen = () => { },
        isenergy = false,
        tableParams,
        setTableParams,
        modalImport,
        exportTable,
        tableParamsRef,
        levelname,
        tb,
        getList = () => { }
    } = props

    const changeSelect = (v) => {
        setSelValue(v)
        selRef.current = v
        setTableParams({
            ...tableParams,
            current: 1
        })
        getList({ pageSize: tableParams.pageSize, pageNum: 1, areaId: v, alike: inpRef.current ? inpRef.current : "" })
    }
    const changeInp = (e) => {
        setInpValue(e.target.value)

    }
    const searchBtn = (value) => {
        setTableParams({
            ...tableParams,
            current: 1
        })
        console.log(selRef)
        getList({ pageSize: tableParams.pageSize, pageNum: 1, alike: value, areaId: selRef.current ? selRef.current : 0 })

    }
    useImperativeHandle(ref, () => ({
        selvalue,
        inpvalue,
        selRef,
        inpRef
    }))

    return (
        <Mainbox>
            <Row justify='space-between'  >
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
                            fieldNames={{
                                label: 'name',
                                value: 'id'
                            }}
                            style={{
                                width: laptop ? 160 : 264,
                            }}
                            defaultValue={oneLevel.length > 0 ? 0 : null}
                            value={selvalue}
                            options={areaOptions}
                            onChange={changeSelect}
                        />
                         <div style={{display:"flex", alignItems:"center", columnGap: "8px"}}> 
                        <span>{inplabel}</span>
                     
                                <Serach
                                style={{ width: laptop ? 260 : 321 }}
                                placeholder={placeholder}
                                allowClear
                                onChange={changeInp}
                                onSearch = {searchBtn}
                                /> 
                                </div>
                    
                    {
                        isenergy &&  
                                <Select style={{ width: 128 }}></Select>  
                    }
                </Space>
                <Space size={16}>
                    {publish ? null : <>
                        <NewButton onClick={()=>{
                            if(oneLevel.length == 0){
                                message.warning('请新增园区!')
                                return 
                              }
                              addopen()
                        }} /> 
                        <AllExportButton onClick={modalImport} /> 
                    </>}

                  
                    <ExportExcel tb={tb}/>
                </Space>
            </Row> 
            <div style={{display:'flex',flex:1}}>
            {props.children}
            </div>
            
        </Mainbox>
    )
}
export default forwardRef(Comp)