import React, { useEffect, useRef, useState, useContext, createContext } from 'react'
import Modal from '@com/useModal'
import BlueColumn from '@com/bluecolumn'
import style from './style.module.less'
import { Form, Row, Col, Select, Input, Divider, Upload, Button } from 'antd'
export const MyContext = createContext({ addopts: [], gatewaylist: [], devicelist: [], alarmopts: [] })

//新增com
let Com = ({ form, coms }) => {
    const [isaddress, setIsaddress] = useState(true)
    let options = []
    const rules = [{
        required: true,

    }]
    for (let i = 1; i <= coms; i++) {
        options.push({
            label: `COM${i}`,
            value: i
        })
    }
    const changeProtocol = (v, option) => {
        if (v === 1) {
            setIsaddress(true)
        } else {
            setIsaddress(false)
        }
    }
    useEffect(() => {
        if (form.getFieldsValue().commAddress) {
            setIsaddress(true)
        } else {
            setIsaddress(false)
        }
    }, [form.getFieldsValue().commAddress])
    return (
        <>
            <Form.Item label="倍率" name="factor" rules={[...rules,
            {
                validator: (_, value) => {
                    if (!value) {
                        return Promise.resolve()
                    } else if (parseInt(value) < 0) {
                        return Promise.reject(new Error("请输入正整数"))
                    } else {
                        return Promise.resolve()
                    }
                }
            },]}>
                <Input />
                {/* 默认1 */}
            </Form.Item>
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
                            onChange={changeProtocol}
                            options={[{
                                label: 'Modbus',
                                value: 1
                            }, {
                                label: 'DL645',
                                value: 2
                            }]}
                        ></Select>
                    </Form.Item>
                    {
                        isaddress ? <Form.Item label="通讯地址" name="commAddress"
                            rules={[{ required: true }, {
                                validator: (_, value) => {
                                    if (!value) {
                                        return Promise.resolve()
                                    } else {
                                        if (Number(value) < 255 && Number(value) > 0) {
                                            return Promise.resolve()
                                        } else {
                                            return Promise.reject(new Error("通讯地址范围(0-255)"))
                                        }
                                    }
                                }
                            }]}>
                            <Input placeholder='通讯地址范围(0-255)' />
                            {/* 默认1-255 */}
                        </Form.Item> : null
                    }

                </> : null}
        </>
    )
}
//新增form表单组件
export const FormComp = (props) => {
    const { TextArea } = Input
    const { addopts, gatewaylist, devicelist, alarmopts, form, deviceStyle, levelname } = useContext(MyContext)
    console.log( addopts, gatewaylist, devicelist, alarmopts, form, deviceStyle, levelname)
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
            form.setFieldsValue({ areaId: arr[0].id, commPort: '' })
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
                    <Form.Item label={levelname?.current} name="areaId" rules={rules}>
                        {
                            area.length > 0 ? <Select
                                fieldNames={{
                                    label: 'name',
                                    value: 'id',
                                }}
                                options={area}
                                showSearch
                                filterOption={(val, opts) => {
                                    if (opts.name.includes(val)) {
                                        return true
                                    } else {
                                        return false
                                    }
                                }}
                                disabled
                            ></Select> : <Select
                                showSearch
                                filterOption={(val, opts) => {
                                    if (opts.name.includes(val)) {
                                        return true
                                    } else {
                                        return false
                                    }
                                }}
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
                            fieldNames={{
                                label: 'name',
                                value: 'id',
                            }}
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
                            showSearch
                            filterOption={(val, opts) => {
                                if (opts.sn.includes(val)) {
                                    return true
                                } else {
                                    return false
                                }
                            }}
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
                            showSearch
                            options={devicelist}
                        ></Select>
                    </Form.Item>
                    <Form.Item label="设备编号" name="sn" rules={[...rules, {
                        validator: (_, value) => {
                            if (!value) {
                                return Promise.resolve()
                            } /* else {
                                let val = value.trim()

                                if (val.split(" ").join("").length !== 12) {
                                    return Promise.reject(new Error("设备编号长度12位"))
                                } else {
                                    return Promise.resolve()
                                }
                            } */
                        }
                    }]}>
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
                    {deviceStyle === 1 ? <Com form={form} coms={coms}></Com> : null}
                </Col>
            </Row>
        </Form>
    )
}


//新增设备
export let AddModalForm = ({ modalFormRef,transitionName,maskTransitionName, ...other }) => {
    return (
       <>
        {
       <Modal mold='cust' ref={modalFormRef} transitionName={transitionName} maskTransitionName={maskTransitionName} {...other} footer={[
                <Button onClick={other.onAddCancel}>取消</Button>,
                <Button style={{ backgroundColor: '#237ae4', color: '#fff', borderColor: "#237ae4" }} onClick={other.onOk}>保存</Button>,
                <Button style={{ backgroundColor: '#237ae4', color: '#fff', borderColor: "#237ae4" }} onClick={()=>{other.onSure();}}>应用</Button>,
            ]}>
                <BlueColumn name={other.name} styled={{ padding: '24px 0px' }}></BlueColumn>
                <FormComp >
                </FormComp>
            </Modal>
        }</>
       
    )

}
//编辑设备
export const EditModalForm = ({ EditModalFormRef, ...other }) => {
    return (
        <Modal mold='cust' ref={EditModalFormRef} {...other} footer={[
            <Button onClick={other.onEditCancel}>取消</Button>,
            <Button style={{ backgroundColor: '#237ae4', color: '#fff', borderColor: "#237ae4" }} onClick={other.onOk}>保存</Button>,
            <Button style={{ backgroundColor: '#237ae4', color: '#fff', borderColor: "#237ae4" }} onClick={other.onSure}>应用</Button>,
        ]}>
            <BlueColumn name={other.name} styled={{ padding: '24px 0px' }}></BlueColumn>
            <EditFormComp >
            </EditFormComp>
        </Modal>
    )

}
//编辑com组件
let EditCom = ({ form, coms }) => {
    const [isaddress, setIsaddress] = useState(true)
    let options = []
    const rules = [{
        required: true,

    }]
    for (let i = 1; i <= coms; i++) {
        options.push({
            label: `COM${i}`,
            value: i
        })
    }
    const changeProtocol = (v, option) => {
        if (v === 1) {
            setIsaddress(true)
        } else {
            setIsaddress(false)
        }
    }
    useEffect(() => {
        if (form.getFieldsValue().commAddress) {
            setIsaddress(true)
        } else {
            setIsaddress(false)
        }
    }, [form.getFieldsValue().commAddress])
    return (
        <>
            <Form.Item label="倍率" name="factor" rules={rules}>
                <Input disabled />
                {/* 默认1 */}
            </Form.Item>
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
                            onChange={changeProtocol}
                            options={[{
                                label: 'Modbus',
                                value: 1
                            }, {
                                label: 'DL645',
                                value: 2
                            }]}
                        ></Select>
                    </Form.Item>
                    {
                        isaddress ? <Form.Item label="通讯地址" name="commAddress" rules={[{ required: true }, {
                            validator: (_, value) => {
                                if (!value) {
                                    return Promise.resolve()
                                } else {
                                    if (Number(value) < 255 && Number(value) > 0) {
                                        return Promise.resolve()
                                    } else {
                                        return Promise.reject(new Error("通讯地址范围(0-255)"))
                                    }
                                }
                            }
                        }]}>
                            <Input placeholder='通讯地址范围(0-255)' />
                            {/* 默认1-255 */}
                        </Form.Item> : null
                    }

                </> : null}
        </>
    )
}
//编辑form表单组件
export const EditFormComp = (props) => {
    const { TextArea } = Input
    const { addopts, gatewaylist, devicelist, alarmopts, form, deviceStyle, levelname } = useContext(MyContext)
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
                    <Form.Item label={levelname?.current} name="areaId" rules={rules}>
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
                            fieldNames={{
                                label: 'name',
                                value: 'id',
                            }}
                        ></Select>
                    </Form.Item>
                    <Form.Item label="备注" name="remark">
                        <TextArea />
                    </Form.Item>
                </Col>
                <Col>
                    <Divider type='vertical' style={{ height: '100%', margin: '0 32px', borderColor: '#bcbcbc' }} dashed />
                </Col>
                <Col flex={1}>
                    <Form.Item label="所属网关" name="gatewayId" rules={rules}>
                        <Select
                            showSearch
                            filterOption={(val, opts) => {
                                if (opts.sn.includes(val)) {
                                    return true
                                } else {
                                    return false
                                }
                            }}
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
                            disabled
                            showSearch
                            options={devicelist}
                        ></Select>
                    </Form.Item>
                    <Form.Item label="设备编号" name="sn" rules={[...rules, {
                        validator: (_, value) => {
                            if (!value) {
                                return Promise.resolve()
                            } else {
                                let val = value.trim()

                                if (val.split(" ").join("").length !== 12) {
                                    return Promise.reject(new Error("设备编号长度12位"))
                                } else {
                                    return Promise.resolve()
                                }
                            }
                        }
                    }]}>
                        <Input placeholder='设备编号长度12为' disabled/>
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
                    {deviceStyle === 1 ? <EditCom form={form} coms={coms}></EditCom> : null}
                </Col>
            </Row>
        </Form>
    )
}
