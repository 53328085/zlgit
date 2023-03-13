import React, { useEffect, useRef, useState, useContext, createContext } from 'react'
import Modal from '@com/useModal'
import BlueColumn from '@com/bluecolumn'
import { Form, Row, Col, Select, Input, Divider, Upload,Button } from 'antd'
import style from './style.module.less'
export const MyContext = createContext({ addopts: [], gatewaylist: [], devicelist: [], alarmopts: [] })

//新增com
let Com = ({ form, coms }) => {
    let options = []
    const rules = [{
        required: true,
    }]
    for (let i = 1; i <= coms; i++) {
        options.push({
            label: `COM ${i}`,
            value: i
        })
    }
    return (
        <>
            {form.getFieldValue('gatewayId') ?
                <>
                    <Form.Item label="通讯端口" name="commPort" rules={rules}>
                        <Select
                            options={options}
                            placeholder
                        ></Select>
                    </Form.Item>
                    <Form.Item label="通讯协议" name="commProtocol" rules={rules}>
                        <Select options={[{ label: "CJT188-2004", value: 0 }]} disabled></Select>
                    </Form.Item>
                </> : null}
        </>
    )
}
//新增form表单组件
export const FormComp = (props) => {
    const { TextArea } = Input
    const { addopts, gatewaylist, devicelist, alarmopts, form, deviceStyle } = useContext(MyContext)
    const [area, setArea] = useState([])
    const [coms, setComs] = useState(0)
    const rules = [{
        required: true
    }]
    const changeGateway = (v, option) => {
        console.log(v, option)
        if (v) {
            const arr = addopts?.filter(it => (it.id === option.areaId))
            setArea([...arr])
            setComs(option.com)
            form.setFieldsValue({ areaId: arr[0].id, commPort: '', commProtocol: 0 })
        } else {
            setArea([])
        }
    }
    return (
        <Form
            labelAlign="left"
            form={form}
            colon={false}
            labelCol={{
                span: 6
            }}
        >
            <Row className={style.customItem}>
                <Col flex={1}>
                    <Form.Item label="所属园区" name="areaId" rules={rules}>
                        {
                            area.length > 0 ? <Select
                                fieldNames={{
                                    label: 'name',
                                    value: 'id',
                                }}
                                options={area}
                                disabled
                            ></Select> : <Select
                                fieldNames={{
                                    label: 'name',
                                    value: 'id',
                                }}
                                options={addopts}
                            ></Select>
                        }
                    </Form.Item>
                    <Form.Item label="安装地址" name="address" rules={rules}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="告警方案" name="alarmPlanId" rules={rules}>
                        <Select
                            options={alarmopts}
                        ></Select>
                    </Form.Item>
                    <Form.Item label="备注" name="remark" >
                        <TextArea />
                    </Form.Item>
                </Col>
                <Col>
                    <Divider type='vertical' style={{ height: '100%', margin: '0 32px', borderColor: '#bcbcbc' }} dashed />
                </Col>
                <Col flex={1}>
                    <Form.Item label="所属网关" name="gatewayId" rules={rules}>
                        <Select
                            fieldNames={{
                                label: 'sn',
                                value: 'id',
                            }}
                            onChange={changeGateway}
                            options={gatewaylist}
                        ></Select>
                    </Form.Item>
                    <Form.Item label="设备型号" name="category" rules={rules}>
                        <Select
                            options={devicelist}
                        ></Select>
                    </Form.Item>
                    <Form.Item label="设备编号" name="sn" rules={rules}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="设备名称" name="name" rules={rules}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="用能类型" name="customerType" rules={rules}>
                        <Select
                            options={[{
                                label: '客户用能',
                                value: 1
                            }, {
                                label: '公共用能',
                                value: 2
                            }]}></Select>
                    </Form.Item>
                    <Com form={form} coms={coms}></Com>
                </Col>
            </Row>
        </Form>
    )
}
//新增设备
export let AddModalForm = ({ modalFormRef, ...other }) => {
    return (
        <Modal mold='cust' ref={modalFormRef} {...other} footer={[
            <Button onClick={other.onCancel}>取消</Button>,
            <Button style={{backgroundColor:'#237ae4',color:'#fff',borderColor:"#237ae4"}} onClick={other.onOk}>保存</Button>,
            <Button style={{backgroundColor:'#237ae4',color:'#fff',borderColor:"#237ae4"}} onClick={other.onSure}>应用</Button>,
        ]}>
            <BlueColumn name={other.name} styled={{ padding: '24px 0px' }}></BlueColumn>
            <FormComp >
            </FormComp>
        </Modal>
    )

}




//编辑设备
export const EditModalForm = ({ EditModalFormRef, ...other }) => {
    return (
        <Modal mold='cust' ref={EditModalFormRef} {...other} footer={[
            <Button onClick={other.onCancel}>取消</Button>,
            <Button style={{backgroundColor:'#237ae4',color:'#fff',borderColor:"#237ae4"}} onClick={other.onOk}>保存</Button>,
            <Button style={{backgroundColor:'#237ae4',color:'#fff',borderColor:"#237ae4"}} onClick={other.onSure}>应用</Button>,
        ]}>
            <BlueColumn name={other.name} styled={{ padding: '24px 0px' }}></BlueColumn>
            <EditFormComp >
            </EditFormComp>
        </Modal>
    )

}
//编辑com组件
let EditCom = ({ form, coms }) => {

    let options = []
    const rules = [{
        required: true,

    }]
    for (let i = 1; i <= coms; i++) {
        options.push({
            label: `COM ${i}`,
            value: i
        })
    }
    return (
        <>
            {form.getFieldValue('gatewayId') ?
                <>
                    <Form.Item label="通讯端口" name="commPort" rules={rules}>
                        <Select
                            options={options}
                            placeholder
                        ></Select>
                    </Form.Item>
                    <Form.Item label="通讯协议" name="commProtocol" rules={rules}>
                        <Select
                            options={[{ label: "CJT188-2004", value: 0 }]} disabled
                        ></Select>
                    </Form.Item>
                </> : null}
        </>
    )
}
//编辑form表单组件
export const EditFormComp = (props) => {
    const { TextArea } = Input
    const { addopts, gatewaylist, devicelist, alarmopts, form, deviceStyle } = useContext(MyContext)
    const [area, setArea] = useState([])
    const [coms, setComs] = useState(0)
    const [isdisable, setIsdisable] = useState(false)
    const rules = [{
        required: true
    }]
    const changeGateway = (v, option) => {
        console.log(v, option)
        setIsdisable(false)
        if (v) {
            const arr = addopts?.filter(it => (it.id === option.areaId))
            setArea([...arr])
            setComs(option.com)
            form.setFieldsValue({ areaId: arr[0].id, commPort: '', commAddress: 0, commProtocol: '' })
        } else {
            setArea([])
            form.setFieldsValue({ commAddress: 0, commPort: 0, commProtocol: 0 })
        }
    }
    useEffect(() => {
        if (form?.getFieldsValue().gatewayId !== 0) {
            setIsdisable(true)
        }
        const comsnum = gatewaylist.filter(it => it.id === form?.getFieldsValue().gatewayId)
        comsnum[0] && setComs(comsnum[0].com)
        console.log(form?.getFieldsValue())
    }, [])
    return (
        <Form
            labelAlign="left"
            form={form}
            colon={false}
            labelCol={{
                span: 6
            }}
        >
            <Row className={style.customItem}>
                <Col flex={1}>
                    <Form.Item label="所属园区" name="areaId" rules={rules}>
                        {
                            (area.length || isdisable) > 0 ? <Select
                                fieldNames={{
                                    label: 'name',
                                    value: 'id',
                                }}
                                options={area}
                                disabled
                            ></Select> : <Select
                                fieldNames={{
                                    label: 'name',
                                    value: 'id',
                                }}
                                options={addopts}
                            ></Select>
                        }
                    </Form.Item>
                    <Form.Item label="安装地址" name="address" rules={rules}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="告警方案" name="alarmPlanId" rules={rules}>
                        <Select
                            options={alarmopts}
                        ></Select>
                    </Form.Item>
                    <Form.Item label="备注" name="remark" >
                        <TextArea />
                    </Form.Item>
                </Col>
                <Col>
                    <Divider type='vertical' style={{ height: '100%', margin: '0 32px', borderColor: '#bcbcbc' }} dashed />
                </Col>
                <Col flex={1}>
                    <Form.Item label="所属网关" name="gatewayId" rules={rules}>
                        <Select
                            fieldNames={{
                                label: 'sn',
                                value: 'id',
                            }}
                            onChange={changeGateway}
                            options={gatewaylist}
                        ></Select>
                    </Form.Item>
                    <Form.Item label="设备型号" name="category" rules={rules}>
                        <Select
                            options={devicelist}
                        ></Select>
                    </Form.Item>
                    <Form.Item label="设备编号" name="sn" rules={rules}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="设备名称" name="name" rules={rules}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="用能类型" name="customerType" rules={rules}>
                        <Select
                            options={[{
                                label: '客户用能',
                                value: 1
                            }, {
                                label: '公共用能',
                                value: 2
                            }]}></Select>
                    </Form.Item>
                    <EditCom form={form} coms={coms}></EditCom>
                </Col>
            </Row>
        </Form>
    )
}
