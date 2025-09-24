import React, { useEffect, useRef, useState, useContext, createContext } from 'react'
import Modal from '@com/useModal'
import { snValidator, snValidatorE } from "@pages/rule"
import { Form, Row, Col, Select, Input, Divider, Upload, Button, InputNumber } from 'antd'
import style from './style.module.less'
export const MyContext = createContext({ addopts: [], gatewaylist: [], devicelist: [], alarmopts: [], levelname: { current: '' } })

//新增com
let coms = 0
let Com = ({ form }) => {
    const category = Form.useWatch('category', form);
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
                        type === 1 ? <>{category === 'ZTWL376-W' ? null : <Form.Item label="通讯协议" name="commProtocol" rules={rules}>
                            <Select options={[{ label: "CJT188-2004", value: 0 }]} disabled></Select>
                        </Form.Item>}</> : <Form.Item label="通讯地址" name="commAddress" rules={[{ required: true }, {
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
    console.log('deviceStyle:' + deviceStyle)
    const category = Form.useWatch('category', form);
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
                span: 9
            }}
        >
            <Row className={style.customItem}>
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
                    <Divider type='vertical' style={{ height: '100%', borderColor: '#bcbcbc' }} dashed />
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
                        validator: [2, 7].includes(deviceStyle) ? snValidatorE : snValidator
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
                    {/* {form?.getFieldValue('gatewayId') && category === 'ZTWL376-W' ?
                        <> */}
                    <Form.Item label="写参密级" name="writePwdLevel">
                        <Select
                            options={[{
                                label: '01',
                                value: 1
                            }, {
                                label: '02',
                                value: 2
                            }]}
                            placeholder
                        ></Select>
                    </Form.Item>
                    <Form.Item label="写参密码" name="writePwd" rules={[
                        // 非必填，但如果输入则必须为6位数字
                        () => ({
                            validator(_, value) {
                                if (!value || /^\d{6}$/.test(value)) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('请输入6位数字或留空'));
                            },
                        }),
                    ]}>
                        <Input // 以下限制输入只能为数字（可选）
                            onKeyDown={(e) => {
                                if (
                                    !/[0-9]/.test(e.key) &&
                                    !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(e.key)
                                ) {
                                    e.preventDefault();
                                }
                            }}
                            onChange={(e) => {
                                const value = e.target.value.replace(/[^\d]/g, '');
                                form.setFieldsValue({ writePwd: value });
                            }}
                            maxLength={6}
                            placeholder="请输入6位纯数字写参密码" />
                    </Form.Item>

                    <Form.Item label="控制密级" name="controlPwdLevel">
                        <Select
                            options={[{
                                label: '01',
                                value: 1
                            }, {
                                label: '02',
                                value: 2
                            }, {
                                label: '98',
                                value: 98
                            }
                            ]}
                        ></Select>
                    </Form.Item>
                    <Form.Item label="控制密码" name="controlPwd" rules={[
                        // 非必填，但如果输入则必须为6位数字
                        () => ({
                            validator(_, value) {
                                if (!value || /^\d{6}$/.test(value)) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('请输入6位数字或留空'));
                            },
                        }),
                    ]}>
                        <Input  // 以下限制输入只能为数字（可选）
                            onKeyDown={(e) => {
                                if (
                                    !/[0-9]/.test(e.key) &&
                                    !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(e.key)
                                ) {
                                    e.preventDefault();
                                }
                            }}
                            onChange={(e) => {
                                const value = e.target.value.replace(/[^\d]/g, '');
                                form.setFieldsValue({ controlPwd: value });
                            }}
                            maxLength={6}
                            placeholder="请输入6位纯数字控制密码" />
                    </Form.Item>
                    {/* </> : null} */}
                </Col>
            </Row>
        </Form>
    )
}
//新增设备
export let AddModalForm = ({ addform, modalFormRef, ...other }) => {
    const category = Form.useWatch('category', addform);
    const gatewayId = Form.useWatch('gatewayId', addform);
    const handleCancel = () => {
        modalFormRef?.current?.onCancel()
    };
    return (
        <Modal mold='cust' ref={modalFormRef} {...other} title={other.name} custft={true} onOk={other.onOk}
            footer={
                [<Button key="back" onClick={handleCancel}>
                    取消
                </Button>,
                gatewayId && category === 'ZTWL376-W' ? <Button key="next" type="primary" onClick={() => other.onOk('next')}>
                    下一步
                </Button> : [<Button key="apply" type="primary" onClick={() => other.onOk('apply')}>
                    应用
                </Button>, <Button key="submit" type="primary" onClick={() => other.onOk('submit')}>
                    确定
                </Button>]
                ]}
        /* footer={[
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
export const EditModalForm = ({ editform, EditModalFormRef, ...other }) => {
    const category = Form.useWatch('category', editform);
    const gatewayId = Form.useWatch('gatewayId', editform);
    const handleCancel = () => {
        EditModalFormRef?.current?.onCancel()
    };
    return (
        <Modal mold='cust' ref={EditModalFormRef} {...other} title={other.name} onOk={other.onOk}
            footer={
                [<Button key="back" onClick={handleCancel}>
                    取消
                </Button>,
                <Button key="submit" type="primary" onClick={() => other.onOk('submit')}>
                    确定
                </Button>,
                gatewayId && category === 'ZTWL376-W' ?
                    <Button key="next" type="primary" onClick={() => other.onOk('next')}>
                        下一步
                    </Button> : null
                ]}
        >
            <EditFormComp >
            </EditFormComp>
        </Modal>
    )

}
//编辑com组件
let EditCom = ({ form, coms }) => {
    const { type = 1 } = useContext(MyContext)
    const category = Form.useWatch('category', form);
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
                    {type === 1 ? <>{category === 'ZTWL376-W' ? null : <Form.Item label="通讯协议" name="commProtocol" rules={rules}>
                        <Select
                            options={[{ label: "CJT188-2004", value: 0 }]} disabled
                        ></Select>
                    </Form.Item>}</> :
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
    const category = Form.useWatch('category', form);
    const gatewayId = Form.useWatch('gatewayId', form);
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
                span: 9
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
                        <Input disabled />
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
                    {/* {gatewayId && category === 'ZTWL376-W' ?
                        <> */}
                    <Form.Item label="写参密级" name="writePwdLevel">
                        <Select
                            options={[{
                                label: '01',
                                value: 1
                            }, {
                                label: '02',
                                value: 2
                            }]}
                            placeholder
                        ></Select>
                    </Form.Item>
                    <Form.Item label="写参密码" name="writePwd" rules={[
                        // 非必填，但如果输入则必须为6位数字
                        () => ({
                            validator(_, value) {
                                if (!value || /^\d{6}$/.test(value)) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('请输入6位数字或留空'));
                            },
                        }),
                    ]}>
                        <Input
                            // 以下限制输入只能为数字（可选）
                            onKeyDown={(e) => {
                                if (
                                    !/[0-9]/.test(e.key) &&
                                    !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(e.key)
                                ) {
                                    e.preventDefault();
                                }
                            }}
                            onChange={(e) => {
                                const value = e.target.value.replace(/[^\d]/g, '');
                                form.setFieldsValue({ writePwd: value });
                            }}
                            maxLength={6}
                            placeholder="请输入6位纯数字写参密码" />
                    </Form.Item>
                    <Form.Item label="控制密级" name="controlPwdLevel">
                        <Select
                            options={[{
                                label: '01',
                                value: 1
                            }, {
                                label: '02',
                                value: 2
                            }, {
                                label: '98',
                                value: 98
                            }
                            ]}
                        ></Select>
                    </Form.Item>
                    <Form.Item label="控制密码" name="controlPwd" rules={[
                        // 非必填，但如果输入则必须为6位数字
                        () => ({
                            validator(_, value) {
                                if (!value || /^\d{6}$/.test(value)) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('请输入6位数字或留空'));
                            },
                        }),
                    ]}>
                        <Input
                            // 以下限制输入只能为数字（可选）
                            onKeyDown={(e) => {
                                if (
                                    !/[0-9]/.test(e.key) &&
                                    !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(e.key)
                                ) {
                                    e.preventDefault();
                                }
                            }}
                            onChange={(e) => {
                                const value = e.target.value.replace(/[^\d]/g, '');
                                form.setFieldsValue({ controlPwd: value });
                            }}
                            maxLength={6}
                            placeholder="请输入6位纯数字控制密码" />
                    </Form.Item>
                    {/* </> : null} */}
                </Col>
            </Row>
        </Form>
    )
}

//设置设备参数form表单组件
export const SetFormComp = (props) => {
    const {
        form,
    } = useContext(MyContext)
    const IntegerDigitsData = [{
        label: '4',
        value: 0
    }, {
        label: '5',
        value: 1
    }, {
        label: '6',
        value: 2
    }, {
        label: '7',
        value: 3
    }]
    const BautRateData = [{
        label: '无需设置或默认',
        value: 0
    }, {
        label: '600',
        value: 1
    }, {
        label: '1200',
        value: 2
    }, {
        label: '2400',
        value: 3
    }, {
        label: '4800',
        value: 4
    }, {
        label: '7200',
        value: 5
    }, {
        label: '9600',
        value: 6
    }, {
        label: '19200',
        value: 7
    }]
    const LargeCategoryData = [{
        label: '0{电力大型专变用户}',
        value: 0
    }, {
        label: '1{电力小型专变用户/水表}',
        value: 1
    }, {
        label: '2{电力低压三相用户/热量表}',
        value: 2
    }, {
        label: '3{电力低压单相用户/燃气表}',
        value: 3
    }, {
        label: '4{电力居民用户/其他仪表}',
        value: 4
    }, {
        label: '5{电力公变考核计量}',
        value: 5
    }, {
        label: '8{路灯}',
        value: 8
    }]
    const ProtocolTypeData = [{
        label: '无需对本序号的电能表/交流采样装置进行抄表',
        value: 0
    }, {
        label: 'DL/T645-1997',
        value: 1
    }, {
        label: '交流采样装置通信协议',
        value: 2
    }, {
        label: '正泰智能微断(电气)',
        value: 10
    }, {
        label: 'DL/T645-2007',
        value: 30
    }, {
        label: '串行接口连接窄带低压载波通信模块接口协议',
        value: 31
    }, {
        label: 'CJ/T 188-2004',
        value: 32
    }, {
        label: 'DL/T698.45-201X',
        value: 36
    }, {
        label: 'MODBUS-逆变器 正泰电源',
        value: 48
    }, {
        label: 'MODBUS-监控器',
        value: 49
    }, {
        label: 'MODBUS-环境检测仪',
        value: 50
    }, {
        label: 'MODBUS-逆变器 古瑞瓦特',
        value: 51
    }, {
        label: 'MODBUS-逆变器 锦浪',
        value: 53
    }, {
        label: 'MODBUS-逆变器 阳光-水晶石',
        value: 54
    }, {
        label: 'MODBUS-逆变器 阳光-中功率',
        value: 55
    }, {
        label: '正泰塑壳断路器',
        value: 60
    }, {
        label: '正泰安全用电',
        value: 70
    }, {
        label: '正泰智能微断(仪表)',
        value: 80
    }, {
        label: 'SA-201G电子秤',
        value: 90
    }, {
        label: '正泰灯控',
        value: 100
    }, {
        label: '正泰定制MQTT协议',
        value: 255
    }]
    const StopBitesData = [{
        label: '1停止位',
        value: 0
    }, {
        label: '2停止位',
        value: 1
    }]
    const DataBitesData = [{
        label: '5位',
        value: 0
    }, {
        label: '6位',
        value: 1
    }, {
        label: '7位',
        value: 2
    }, {
        label: '8位',
        value: 3
    }]
    const DecimalDigitsData = [{
        label: '1',
        value: 0
    }, {
        label: '2',
        value: 1
    }, {
        label: '3',
        value: 2
    }, {
        label: '4',
        value: 3
    }]
    const SmallCategoryData = [{
        label: '0{通配电能表/冷水表/热量表(计热量)/燃气表/其他仪表(如 电度表)}',
        value: 0
    }, {
        label: '1{单相电能表/中水表/热量表(计冷量)/全夜灯}',
        value: 1
    }, {
        label: '2{三相电能表/纯净水表/半夜灯}',
        value: 2
    }, {
        label: '3{热水表}',
        value: 3
    }, {
        label: '4{景观灯}',
        value: 4
    }, {
        label: '8{泛光灯}',
        value: 8
    }, {
        label: '9{电子水表}',
        value: 9
    }]
    const RateCountData = [{
        label: '1',
        value: 1
    }, {
        label: '2',
        value: 2
    }, {
        label: '3',
        value: 3
    }, {
        label: '4',
        value: 4
    }, {
        label: '5',
        value: 5
    }, {
        label: '6',
        value: 6
    }, {
        label: '7',
        value: 7
    }, {
        label: '8',
        value: 8
    }, {
        label: '9',
        value: 9
    }, {
        label: '10',
        value: 10
    }, {
        label: '11',
        value: 11
    }, {
        label: '12',
        value: 12
    }]
    const ParityBitesData = [{
        label: '无校验',
        value: ''
    }, {
        label: '偶校验',
        value: '0'
    }, {
        label: '奇校验',
        value: '1'
    }]
    const rules = [{
        required: true
    }]

    useEffect(() => {

    }, [])
    return (
        <Form
            labelAlign="left"
            form={form}
            colon={false}
            labelCol={{
                span: 9
            }}
            preserve={false}
        >
            <Row className={style.customItem}>
                <Col span={10}>
                    <Form.Item label="示值整数个数" name="integerDigits" rules={rules}>
                        <Select
                            options={IntegerDigitsData}
                        ></Select>
                    </Form.Item>

                    <Form.Item label="示值小数个数" name="decimalDigits" rules={rules}>
                        <Select
                            showSearch
                            options={DecimalDigitsData}
                        ></Select>
                    </Form.Item>
                    <Form.Item label="所属测量点号" name="pn">
                        <InputNumber placeholder='范围0-2040' style={{ width: '190px' }}
                            min={0} max={2024} />
                    </Form.Item>
                    <Form.Item label="数据位" name="dataBites" rules={rules}>
                        <Select
                            options={DataBitesData}
                        ></Select>
                    </Form.Item>
                    <Form.Item label="停止位" name="stopBites" rules={rules}>
                        <Select
                            options={StopBitesData}
                        ></Select>
                    </Form.Item>
                    <Form.Item label="校验方式" name="parityBites" rules={rules}>
                        <Select
                            showSearch
                            options={ParityBitesData}
                        ></Select>
                    </Form.Item>

                    <Form.Item label="费率数" name="rateCount" rules={rules}>
                        <Select
                            showSearch
                            options={RateCountData}
                        ></Select>
                    </Form.Item>

                </Col>
                <Col>
                    <Divider type='vertical' style={{ height: '100%', margin: '0 32px', borderColor: '#bcbcbc' }} dashed />
                </Col>
                <Col span={10}>

                    <Form.Item label="大类号" name="largeCategory" rules={rules}>
                        <Select
                            showSearch
                            options={LargeCategoryData}
                        ></Select>
                    </Form.Item>
                    <Form.Item label="小类号" name="smallCategory" rules={rules}>
                        <Select
                            showSearch
                            options={SmallCategoryData}
                        ></Select>
                    </Form.Item>
                    <Form.Item label="通信协议类型" name="protocolType" rules={rules}>
                        <Select
                            showSearch
                            options={ProtocolTypeData}
                        ></Select>
                    </Form.Item>
                    <Form.Item label="通信波特率" name="bautRate" rules={rules}>
                        <Select
                            options={BautRateData}
                        ></Select>
                    </Form.Item>
                    <Form.Item label="通信密码" name="password" rules={rules}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="采集器通信地址" name="collectSn" rules={rules}>
                        <Input />
                    </Form.Item>
                </Col>

            </Row>
        </Form>
    )
}
//设备参数设置
export let SetModalForm = ({ setform, SetmodalFormRef, cancelStatus, isfiber = false, openarea, onOk, okText, ...other }) => {
    return (
        <>
            {
                <Modal mold='cust' ref={SetmodalFormRef} title={other.name} {...other}
                    onOk={onOk} cancelButtonProps={{
                        disabled: cancelStatus,
                    }}
                >
                    <SetFormComp isfiber={isfiber} openarea={openarea}> </SetFormComp>
                </Modal>
            }</>

    )

}
