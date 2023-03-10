import React, { useEffect,useContext, forwardRef, useImperativeHandle, useState,useRef } from 'react'
import { useSelector } from 'react-redux'
import { Input, Select, Button, Divider, Row, Col } from 'antd'
import style from './style.module.less'
import { Monitoring } from '@api/api.js'
import CustContext from '@com/content'
 function Comp(props,ref) {
    const context = useContext(CustContext)
    const [selvalue,setSelValue]=useState()
    const [inpvalue,setInpValue]=useState()
    const selRef = useRef(selvalue)
    selRef.current =selvalue
    const inpRef = useRef(inpvalue)
    inpRef.current =inpvalue
    const {
        placeholder = '输入控制器编号/安装地址',
        inplabel = '设备查询',
        addopen = () => { },
        isenergy = false,
        areaList=[],
        tableParams,
        setTableParams,
        modalImport,
        exportTable,
        getList=()=>{}
    } = props
   
   const changeSelect=(v)=>{
    setSelValue(v)
    setTableParams({
        ...tableParams,
        current:1
    })
    getList({pageSize:tableParams.pageSize,pageNum:1,areaId:v,alike:inpRef.current})
   }
   const changeInp=(e)=>{
    setInpValue(e.target.value)
   }
   const searchBtn=()=>{
    setTableParams({
        ...tableParams,
        current:1
    })
    getList({pageSize:tableParams.pageSize,pageNum:1,alike:inpvalue,areaId:selRef.current})
   }
   useImperativeHandle(ref,()=>({
    selvalue,
    inpvalue,
    selRef,
    inpRef
   }))
    useEffect(() => {
        
    }, [])
    return (
        <div>
            <Row justify='space-between'  >
                <Row align='middle'>
                    <Col>
                        <Select
                           defaultValue='全部园区'
                           value={selvalue}
                           fieldNames={{
                            label:'name',
                            value:'id'
                           }}
                            style={{
                                width: 264,
                            }}
                            options={areaList}
                            onChange={changeSelect}
                        />
                    </Col>
                    <Col style={{ margin: '0 20px' }}>
                        <Divider type="vertical" dashed style={{ borderColor: ' #d7d7d7', height: 30 }} />
                    </Col>
                    <Col>
                        <span style={{ paddingRight: 16 }}>{inplabel}</span>
                    </Col>
                    <Col>
                        <Input style={{ width: 321 }} placeholder={placeholder} value={inpvalue} onChange={changeInp}/>
                    </Col>
                    <Col>
                        <Button style={{ marginLeft: '-1px', width: 80, background: '#f5f7fa' }} onClick={searchBtn}>查询</Button>
                    </Col>
                    {
                        isenergy && (<>
                            <Divider type="vertical" dashed style={{ margin: '0 16px', borderColor: ' #d7d7d7', height: 30 }} />
                            <Col>
                                <Select style={{ width: 128 }}></Select>
                            </Col>
                        </>)
                    }
                </Row>
                <Row>
                    <div className={style.divmgr16} onClick={addopen}>+新增</div>
                    <div className={style.divmgr16} onClick={modalImport}>批量导入</div>
                    <div className={style.divmgr16} onClick={exportTable}>导出</div>
                </Row>
            </Row>
            <Divider dashed style={{ margin: '16px 0', borderColor: ' #d7d7d7' }} />
            {props.children}
        </div>
    )
}
export default forwardRef(Comp)