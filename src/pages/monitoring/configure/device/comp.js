import React, { useEffect, useState, forwardRef, useImperativeHandle, useMemo, useContext, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Input, Select, Button, Divider, Row, Col } from 'antd'
import style from './style.module.less'
import { Monitoring } from '@api/api.js'
import { publishState } from '@redux/systemconfig'
import {  ExportExcel} from '@com/useButton'
const { DeviceManager: { OneLevel } } = Monitoring

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
        tb
    } = props
    const publish = useSelector(publishState)
    const projectId = useSelector(state => state.system.menus.projectId)
    const oneLevel = useSelector(state => state.system.onelevel)
    const areaOptions = oneLevel.length > 0 ? useMemo(() => ([{ name: oneLevel[0].levelName+'(全部)', id: 0 }, ...oneLevel]), [oneLevel]) : []
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
    const getDeviceSearch = () => {
        setPage(() => ({
            ...page,
            current: 1,
        }))
        getList && getList(1, page.pageSize, selvalue, inpvalue, energyVal)
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
        <div>
            <Row justify='space-between'  >
                <Row align='middle'>
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
                            style={{
                                width: 264,
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
                    </Col>
                    <Col style={{ margin: '0 20px' }}>
                        <Divider type="vertical" dashed style={{ borderColor: ' #d7d7d7', height: 30 }} />
                    </Col>
                    <Col>
                        <span style={{ paddingRight: 16 }}>{inplabel}</span>
                    </Col>
                    <Col>
                        <Input style={{ width: 321 }} placeholder={placeholder} onChange={(e) => { setInpvalue(e.target.value) }} />
                    </Col>
                    <Col>
                        <Button style={{ marginLeft: '-1px', width: 80, background: '#f5f7fa' }} onClick={getDeviceSearch}>查询</Button>
                    </Col>
                    {
                        isenergy && (<>
                            <Divider type="vertical" dashed style={{ margin: '0 16px', borderColor: ' #d7d7d7', height: 30 }} />
                            <Col>
                                <Select style={{ width: 128 }} options={selOptions} defaultValue={0} onChange={changeEnergy}></Select>
                            </Col>
                        </>)
                    }
                </Row>
                <Row>
                    {publish ? null : <>
                        <div className={style.divmgr16} onClick={addopen}>+新增</div>
                        <div className={style.divmgr16} onClick={multExport}>批量导入</div>
                    </>}

                    {/* <div className={style.divmgr16} onClick={exportExecel}>导出</div> */}
                    <ExportExcel tb={tb}/>
                </Row>
            </Row>
            <Divider dashed style={{ margin: '16px 0', borderColor: ' #d7d7d7' }} />
            <div style={{display:'flex',height:700}}>
            {props.children}
            </div>
            
        </div>
    )
})
