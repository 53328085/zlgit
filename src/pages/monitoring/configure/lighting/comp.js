import React, { useEffect, useContext, forwardRef, useImperativeHandle, useState, useRef, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Input, Select, Space, Divider, Row, Col,message } from 'antd'
import style from './style.module.less'
import { Monitoring } from '@api/api.js'
import CustContext from '@com/content'
import { publishState } from '@redux/systemconfig'
import {  ExportExcel, NewButton, AllExportButton} from '@com/useButton'
import {Serach, Cdivider} from '@com/comstyled'
function Comp(props, ref) {
    const publish = useSelector(publishState)
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
        if (!isall) {
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
        <div>
            <Row justify='space-between'  >
                <Row align='middle' gutter={16}>
                    <Col>
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
                                width: 264,
                            }}
                            defaultValue={oneLevel.length > 0 ? 0 : null}
                            value={selvalue}
                            options={areaOptions}
                            onChange={changeSelect}
                        />
                    </Col>
                    <Col>
                        <Cdivider    style={{height: 30 }} />
                    </Col>
                    <Col>
                        <span style={{ paddingRight: 16 }}>{inplabel}</span>
                    </Col>
                    <Col>
                                <Serach
                                style={{ width: 321 }}
                                placeholder={placeholder}
                                allowClear
                                onChange={changeInp}
                                onSearch = {searchBtn}
                                />
                      {/*   <Input style={{ width: 321 }} placeholder={placeholder} value={inpvalue} onChange={changeInp} /> */}
                    </Col>
                    {/* <Col>
                        <Button style={{ marginLeft: '-1px', width: 80, background: '#f5f7fa' }} onClick={searchBtn}>查询</Button>
                    </Col> */}
                    {
                        isenergy && (<>
                            <Cdivider     style={{ margin: '0 16px',   height: 30 }} />
                            <Col>
                                <Select style={{ width: 128 }}></Select>
                            </Col>
                        </>)
                    }
                </Row>
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
            <Divider dashed style={{ margin: '16px 0', borderColor: ' #d7d7d7' }} />
            <div style={{display:'flex',height:700}}>
            {props.children}
            </div>
            
        </div>
    )
}
export default forwardRef(Comp)