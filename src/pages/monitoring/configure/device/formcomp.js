import React, { useEffect, useRef, useState, useContext, createContext } from 'react'
import Modal from '@com/useModal'
import {snValidator, snValidatorE} from "@pages/rule"
import { Form, Row, Col, Select, Input, Divider, Upload, Button } from 'antd'
import style from './style.module.less'
export const MyContext = createContext({ addopts: [], gatewaylist: [], devicelist: [], alarmopts: [], levelname: { current: '' } })

//新增com
let coms = 0
let Com = ({ form}) => {
    const { type = 1, deviceStyle } = useContext(MyContext)
    console.log(type)
   
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
    return (
        <>
            {form?.getFieldValue('gatewayId') ?
                <>
                    <Form.Item label="通讯端口" name="commPort" rules={rules}>
                        <Select
                            options={options}
                            placeholder
                        ></Select>
                    </Form.Item>
                    {
                        type === 1 ? <Form.Item label="通讯协议" name="commProtocol" rules={rules}>
                            <Select options={[{ label: "CJT188-2004", value: 0 }]} disabled></Select>
                        </Form.Item> : <Form.Item label="通讯地址" name="commAddress" rules={[{ required: true }, {
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
                        </Form.Item>
                    }
                </> : null}
        </>
    )
}
//新增form表单组件
export const FormComp = (props) => {
    const { TextArea } = Input
    const { addopts, gatewaylist, devicelist, alarmopts, form, deviceStyle, levelname } = useContext(MyContext)
    const [area, setArea] = useState([])
  //  const [coms, setComs] = useState(0)
  console.log('deviceStyle:'+deviceStyle)
    const rules = [{
        required: true
    }]
    const changeGateway = (v, option) => {
        if (v) {
            const arr = addopts?.filter(it => (it.id === option.areaId))
            setArea([...arr])
           // setComs(option.com)
           coms = option.com
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
            <Row gutter={16}>
                <Col span={10}>
                    <Form.Item label={levelname.current} name="areaId" rules={rules}>
                        {
                            area.length > 0 ? <Select
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
                                options={area}
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
                    <Divider type='vertical' style={{ height: '100%',  borderColor: '#bcbcbc' }} dashed />
                </Col>
                <Col span={10}>
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
                    <Form.Item label="设备编号" name="sn" rules={[{ required: true }, {
                            validator:  [2,7].includes(deviceStyle) ? snValidatorE : snValidator
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
                    <Com form={form} ></Com>
                </Col>
            </Row>
        </Form>
    )
}
//新增设备
export let AddModalForm = ({ modalFormRef, ...other }) => {
    return (
        <Modal mold='cust' ref={modalFormRef} {...other} title={other.name} custft={true} onOk={other.onOk} /* footer={[
            <Button onClick={other.onCancel}>取消</Button>,
            <Button style={{ backgroundColor: '#237ae4', color: '#fff', borderColor: "#237ae4" }} onClick={other.onOk}>保存</Button>,
            <Button style={{ backgroundColor: '#237ae4', color: '#fff', borderColor: "#237ae4" }} onClick={other.onSure}>应用</Button>,
        ]} */>
           
            <FormComp >
            </FormComp>
        </Modal>
    )

}




//编辑设备
export const EditModalForm = ({ EditModalFormRef, ...other }) => {
    return (
        <Modal mold='cust' ref={EditModalFormRef} {...other} title={other.name} onOk={other.onOk} >
            <EditFormComp >
            </EditFormComp>
        </Modal>
    )

}
//编辑com组件
let EditCom = ({ form, coms }) => {
    const { type = 1 } = useContext(MyContext)

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
    return (
        <>
            {form?.getFieldValue('gatewayId') ?
                <>
                    <Form.Item label="通讯端口" name="commPort" rules={rules}>
                        <Select
                            options={options}
                            placeholder
                        ></Select>
                    </Form.Item>
                    {type === 1 ? <Form.Item label="通讯协议" name="commProtocol" rules={rules}>
                        <Select
                            options={[{ label: "CJT188-2004", value: 0 }]} disabled
                        ></Select>
                    </Form.Item> :
                        <Form.Item label="通讯地址" name="commAddress" rules={[{ required: true }, {
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
                        </Form.Item>
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
    const { type = 1 } = useContext(MyContext)
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
            form.setFieldsValue({ areaId: arr[0].id, commPort: '', commAddress: type === 1 ? 0 : '', commProtocol: 0 })
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
                    <Form.Item label={levelname.current} name="areaId" rules={rules}>
                        {
                            (area.length || isdisable) > 0 ? <Select
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
                                options={area}
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
                                disabled
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
                            disabled
                            showSearch
                            options={devicelist}
                        ></Select>
                    </Form.Item>
                    <Form.Item label="设备编号" name="sn" rules={rules}>
                        <Input disabled/>
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
