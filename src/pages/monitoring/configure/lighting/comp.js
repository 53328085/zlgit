import React, { useEffect,useContext } from 'react'
import { useSelector } from 'react-redux'
import { Input, Select, Button, Divider, Row, Col } from 'antd'
import style from './style.module.less'
import { Monitoring } from '@api/api.js'
import CustContext from '@com/content'
export default function Comp(props) {
    const context = useContext(CustContext)
    const {
        placeholder = '输入网关编号/安装地址',
        inplabel = '设备查询',
        addopen = () => { },
        isenergy = false,
        areaList=[],
        multExport
    } = props
   
    
   
    useEffect(() => {
       
    }, [])
    return (
        <div>
            <Row justify='space-between'  >
                <Row align='middle'>
                    <Col>
                        <Select
                           defaultValue={0}
                           fieldNames={{
                            label:'name',
                            value:'id'
                           }}
                            style={{
                                width: 264,
                            }}
                            options={areaList}
                        />
                    </Col>
                    <Col style={{ margin: '0 20px' }}>
                        <Divider type="vertical" dashed style={{ borderColor: ' #d7d7d7', height: 30 }} />
                    </Col>
                    <Col>
                        <span style={{ paddingRight: 16 }}>{inplabel}</span>
                    </Col>
                    <Col>
                        <Input style={{ width: 321 }} placeholder={placeholder} />
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
}
