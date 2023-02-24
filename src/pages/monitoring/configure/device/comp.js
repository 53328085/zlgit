import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import { useSelector } from 'react-redux'
import { Input, Select, Button, Divider, Row, Col } from 'antd'
import style from './style.module.less'
import { Monitoring } from '@api/api.js'
export default forwardRef(function Comp(props, ref) {
    const {
        placeholder = '输入网关编号/安装地址',
        inplabel = '设备查询',
        addopen = () => { },
        isenergy = false,
        multExport,
        selectopts=[]
    } = props
    const [selvalue, setSelvalue] = useState(0)
    const [inpvalue, setInpvalue] = useState('')
    const changeSelect = (value) => {
        setSelvalue(value)
    }
   
    useImperativeHandle(ref, () => ({
        selvalue,
        inpvalue,
      
    }))
    useEffect(() => {
    }, [])
    return (
        <div>
            <Row justify='space-between'  >
                <Row align='middle'>
                    <Col>
                        <Select
                            defaultValue="全部园区"
                            style={{
                                width: 264,
                            }}
                            fieldNames={{
                                label: 'name',
                                value: 'id'
                            }}
                            value={selvalue}
                            onChange={changeSelect}
                            options={selectopts}
                        />
                    </Col>
                    <Col style={{ margin: '0 20px' }}>
                        <Divider type="vertical" dashed style={{ borderColor: ' #d7d7d7', height: 30 }} />
                    </Col>
                    <Col>
                        <span style={{ paddingRight: 16 }}>{inplabel}</span>
                    </Col>
                    <Col>
                        <Input style={{ width: 321 }} placeholder={placeholder} onChange={(v) => { setInpvalue(v) }} />
                    </Col>
                    <Col>
                        <Button style={{ marginLeft: '-1px', width: 80, background: '#f5f7fa' }}>查询</Button>
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
                    <div className={style.divmgr16} onClick={multExport}>批量导入</div>
                    <div className={style.divmgr16}>导出</div>
                </Row>
            </Row>
            <Divider dashed style={{ margin: '16px 0', borderColor: ' #d7d7d7' }} />
            {props.children}
        </div>
    )
})
