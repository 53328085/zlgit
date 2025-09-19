import React, {
    useEffect,
    useRef,
    useState,
    useContext,
    createContext,
    useMemo,
    forwardRef,
    useImperativeHandle,
} from "react";
import Modal from "@com/useModal";
import BlueColumn from "@com/bluecolumn";
import style from "./style.module.less";
import {
    Form,
    Row,
    Col,
    Select,
    Input,
    Divider,
    Upload,
    Button,
    Checkbox,
    Space,
    InputNumber,
    message,
    Alert,
} from "antd";
import { snValidator, snValidatorE } from "@pages/rule";
export const MyContext = createContext({
    addopts: [],
    gatewaylist: [],
    devicelist: [],
    alarmopts: [],
});

//新增com
let coms = 0;
// 1 电表, 11 断路器
let Com = ({ form, deviceStyle }) => {
    const tip = (
        <div style={{ marginBottom: "24px" }}>
            <p>倍率=PT*CT！</p>
            <p>修改倍率会影响结算金额，请设置准确！</p>
            <p>添加完毕不允许修改</p>
        </div>
    );
    const [isaddress, setIsaddress] = useState(true);
    let options = [];
    const rules = [
        {
            required: true,
        },
    ];
    for (let i = 1; i <= coms; i++) {
        options.push({
            label: `COM${i}`,
            value: i,
        });
    }
    const changeProtocol = (v, option) => {
        if (v === 1) {
            setIsaddress(true);
        } else {
            setIsaddress(false);
        }
    };
    useEffect(() => {
        if (form.getFieldsValue().commAddress) {
            setIsaddress(true);
        } else {
            setIsaddress(false);
        }
    }, [form.getFieldsValue().commAddress]);
    return (
        <>
            {/*  {deviceStyle == 12 ? (
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
                </Form.Item>
            ) :  null} */}
            {(deviceStyle == 1 || deviceStyle == 12) && (
                <>
                    <Form.Item label="CT" name="ct" initialValue={1}>
                        <InputNumber
                            min={1}
                            parser={(value) => parseInt(value)}
                            style={{ width: "100%" }}
                        />
                    </Form.Item>
                    <Form.Item label="PT" name="pt" initialValue={1}>
                        <InputNumber
                            min={1}
                            parser={(value) => parseInt(value)}
                            style={{ width: "100%" }}
                        />
                    </Form.Item>
                </>
            )}
            {
                <Form.Item shouldUpdate={(pre, cur) => pre.gatewayId !== cur.gatewayId} noStyle>
                    {({ getFieldValue }) => {
                        return getFieldValue("gatewayId") ? (
                            <>
                                <Form.Item label="通讯端口" name="commPort" rules={rules}>
                                    <Select options={options} placeholder></Select>
                                </Form.Item>
                                <Form.Item label="通讯协议" name="commProtocol" rules={rules}>
                                    <Select
                                        onChange={changeProtocol}
                                        options={[
                                            {
                                                label: "Modbus",
                                                value: 1,
                                            },
                                            {
                                                label: "DL645",
                                                value: 2,
                                            },
                                        ]}
                                    ></Select>
                                </Form.Item>
                                {isaddress ? (
                                    <Form.Item
                                        label="通讯地址"
                                        name="commAddress"
                                        rules={[
                                            { required: true },
                                            {
                                                validator: (_, value) => {
                                                    if (!value) {
                                                        return Promise.resolve();
                                                    } else {
                                                        if (Number(value) < 255 && Number(value) > 0) {
                                                            return Promise.resolve();
                                                        } else {
                                                            return Promise.reject(
                                                                new Error("通讯地址范围(0-255)")
                                                            );
                                                        }
                                                    }
                                                },
                                            },
                                        ]}
                                    >
                                        <Input placeholder="通讯地址范围(0-255)" />
                                        {/* 默认1-255 */}
                                    </Form.Item>
                                ) : null}
                            </>
                        ) : null;
                    }}
                </Form.Item>
            }
            {deviceStyle == 1 && (
                <Form.Item noStyle>
                    <Alert message={tip} type="error" />
                </Form.Item>
            )}
        </>
    );
};
//新增form表单组件
export const FormComp = (props) => {
    const { TextArea } = Input;
    const {
        addopts,
        gatewaylist,
        devicelist,
        alarmopts,
        form,
        deviceStyle,
        levelname,
        setChannelName1,
        setChannelName2,
        setChannelName3,
        setChannelName4,
        setIndex,
        checklistRef,
        path1Gruop,
        path2Gruop,
        path3Gruop,
        path4Gruop,
        setTransition,
        setMaskTransitionName,
    } = useContext(MyContext);
    const [name1, setName1] = useState("通道1");
    const [name2, setName2] = useState("通道2");
    const [name3, setName3] = useState("通道3");
    const [name4, setName4] = useState("通道4");
    const [area, setArea] = useState([]);
    //const [coms, setComs] = useState(0)
    const rules = [
        {
            required: true,
        },
    ];
    const changeGateway = (v, option) => {
        console.log(v, option);
        if (v) {
            const arr = addopts?.filter((it) => it.id === option.areaId);
            setArea([...arr]);
            coms = option.com;
            form.setFieldsValue({ areaId: arr[0].id, commPort: "" });
        } else {
            setArea([]);
        }
    };
    const validator = () => ({
        validator(_, value) {
            console.log(_, value, checklistRef.current);
            let count = 0;
            for (const key in checklistRef.current) {
                if (Object.hasOwnProperty.call(checklistRef.current, key)) {
                    if (checklistRef.current[key]) {
                        count++;
                    }
                }
            }
            if (
                path1Gruop.current.length == 0 &&
                path2Gruop.current.length == 0 &&
                path3Gruop.current.length == 0 &&
                path4Gruop.current.length == 0
            ) {
                count = 0;
            }
            console.log(count);
            if (count) {
                return Promise.resolve();
            } else {
                return Promise.reject(new Error("通道配置未勾选或未配置"));
            }
        },
    });
    return (
        <Form
            labelAlign="left"
            form={form}
            colon={false}
            labelCol={{
                span: 9
            }}
        /*  initialValues={{
               channel1:'通道1',
               channel2:'通道2',
               channel3:'通道3',
               channel4:'通道4'
           }} */
        >
            <Row className={style.customItem}>
                <Col span={10}>
                    <Form.Item label={levelname?.current} name="areaId" rules={rules}>
                        {area.length > 0 ? (
                            <Select
                                fieldNames={{
                                    label: "name",
                                    value: "id",
                                }}
                                options={area}
                                showSearch
                                filterOption={(val, opts) => {
                                    if (opts.name.includes(val)) {
                                        return true;
                                    } else {
                                        return false;
                                    }
                                }}
                                disabled
                            ></Select>
                        ) : (
                            <Select
                                showSearch
                                filterOption={(val, opts) => {
                                    if (opts.name.includes(val)) {
                                        return true;
                                    } else {
                                        return false;
                                    }
                                }}
                                fieldNames={{
                                    label: "name",
                                    value: "id",
                                }}
                                options={addopts}
                            ></Select>
                        )}
                    </Form.Item>
                    <Form.Item label="安装地址" name="address" rules={rules}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="告警方案" name="alarmPlanId" rules={rules}>
                        <Select
                            options={alarmopts}
                            fieldNames={{
                                label: "name",
                                value: "id",
                            }}
                        ></Select>
                    </Form.Item>
                    <Form.Item label="备注" name="remark">
                        <TextArea />
                    </Form.Item>
                </Col>
                <Col>
                    <Divider
                        type="vertical"
                        style={{ height: "100%", margin: "0 32px", borderColor: "#bcbcbc" }}
                        dashed
                    />
                </Col>
                <Col span={10}>
                    <Form.Item label="所属网关" name="gatewayId" rules={rules}>
                        <Select
                            showSearch
                            filterOption={(val, opts) => {
                                if (opts.sn.includes(val)) {
                                    return true;
                                } else {
                                    return false;
                                }
                            }}
                            fieldNames={{
                                label: "sn",
                                value: "id",
                            }}
                            onChange={changeGateway}
                            options={gatewaylist}
                        ></Select>
                    </Form.Item>
                    <Form.Item label="设备型号" name="category" rules={rules}>
                        <Select showSearch options={devicelist}></Select>
                    </Form.Item>

                    <Form.Item
                        label="设备编号"
                        name="sn"
                        rules={[
                            {
                                required: true,
                            },
                            {
                                validator: deviceStyle != 7 ? snValidator : snValidatorE,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    {/* <Form.Item label="设备编号" name="sn" rules={[...rules, {
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
                        <Input />
                    </Form.Item> */}
                    <Form.Item label="设备名称" name="name" rules={rules}>
                        <Input />
                    </Form.Item>
                    {deviceStyle !== 13 &&
                        deviceStyle !== 14 &&
                        deviceStyle !== 18 &&
                        deviceStyle !== 20 &&
                        deviceStyle !== 21 &&
                        deviceStyle !== 22 &&
                        deviceStyle !== 23 ? (
                        <Form.Item label="用能类型" name="customerType" rules={rules}>
                            <Select
                                options={[
                                    {
                                        label: "客户用能",
                                        value: 1,
                                    },
                                    {
                                        label: "公共用能",
                                        value: 2,
                                    },
                                ]}
                            ></Select>
                        </Form.Item>
                    ) : null}

                    {/* {
                        deviceStyle === 21 ? (
                            <Form.Item label="计量电表" name="customerType" rules={rules}>
                                <Select
                                    options={[{
                                        label: '客户用能',
                                        value: 1
                                    }, {
                                        label: '公共用能',
                                        value: 2
                                    }]}></Select>
                            </Form.Item>
                        ) : null
                    } */}
                    {deviceStyle === 1 ||
                        deviceStyle == 12 ||
                        deviceStyle == 13 ||
                        deviceStyle == 14 ||
                        deviceStyle == 20 ||
                        deviceStyle == 21 ||
                        deviceStyle == 22 ||
                        deviceStyle == 23 ? (
                        <Com form={form} deviceStyle={deviceStyle}></Com>
                    ) : null}
                </Col>
                {/*   {
                    props.isfiber ? (
                        <>
                            <Col >
                                <Divider type='vertical' style={{ height: '100%', margin: '0 32px', borderColor: '#bcbcbc' }} dashed />
                            </Col>
                            <Col span={7}>
                                <div style={{paddingBottom: 12}}>通道配置</div>
                                    
                                    <Form.Item
                                        label={ <Checkbox onChange={(e)=>{checklistRef.current.check1=e.target.checked}}></Checkbox>}
                                        name="channel1" rules={[...rules,validator]}
                                        labelCol={2}
                                    >   
                                        <Space size='large'>
                                            <Input value={name1} onChange={(e) => {
                                                setChannelName1(e.target.value)
                                                setName1(e.target.value)
                                            }}></Input>
                                            <Button type='primary' onClick={() => {
                                                props.openarea(1);
                                                setIndex(1);
                                            }}>分区配置</Button>
                                        </Space>
                                    </Form.Item>
 
                                
                                <Form.Item 
                                label={<Checkbox onChange={(e)=>{checklistRef.current.check2=e.target.checked}}></Checkbox>} 
                                name="channel2"  rules={[...rules,validator]}
                                labelCol={2}
                                
                                >
                                    <Space size='large'>
                                    <Input value={name2} onChange={(e)=>{
                                         setChannelName2(e.target.value)
                                         setName2(e.target.value)
                                    }}></Input>
                                    <Button type='primary'onClick={()=>{
                                        props.openarea(2);
                                        setIndex(2);
                                    }}>分区配置</Button>
                                    </Space>
                                </Form.Item>
                                <Form.Item 
                                label={<Checkbox onChange={(e)=>{checklistRef.current.check3=e.target.checked}}></Checkbox>} 
                                name="channel3"  rules={[...rules,validator]}
                                labelCol={2}
                                
                                >
                                    <Space size='large'>
                                    <Input value={name3} onChange={(e)=>{
                                         setChannelName3(e.target.value)
                                         setName3(e.target.value)
                                    }}></Input>
                                    <Button type='primary ' onClick={()=>{
                                        props.openarea(3);
                                        setIndex(3);
                                    }}>分区配置</Button>
                                    </Space>
                                </Form.Item>
                                <Form.Item 
                                label={<Checkbox onChange={(e)=>{checklistRef.current.check4=e.target.checked}}></Checkbox>} 
                                name="channel4" rules={[...rules,validator]}
                                labelCol={2}
                                
                                >
                                    <Space size='large'>
                                    <Input value={name4} onChange={(e)=>{
                                        setChannelName4(e.target.value)
                                        setName4(e.target.value)
                                    }}></Input>
                                    <Button type='primary' onClick={()=>{
                                        props.openarea(4);
                                        setIndex(4);
                                    }}>分区配置</Button>
                                    </Space>
                                </Form.Item>
                            </Col>
                        </>
                        
                    ) : null
                } */}
            </Row>
        </Form>
    );
};

//新增设备
export let AddModalForm = ({
    addform,
    modalFormRef,
    isfiber = false,
    openarea,
    onOk,
    ...other
}) => {
    const category = Form.useWatch('category', addform);
    const gatewayId = Form.useWatch('gatewayId', addform);
    const handleCancel = () => {
        modalFormRef?.current?.onCancel()
    };
    return (
        <>
            {
                <Modal
                    mold="cust"
                    ref={modalFormRef}
                    title={other.name}
                    {...other}
                    custft={true}
                    footer={
                        [<Button key="back" onClick={handleCancel}>
                            取消
                        </Button>,
                        gatewayId && (category === 'ZTWL376-L') ? <Button key="next" type="primary" onClick={() => onOk('next')}>
                            下一步
                        </Button> : [<Button key="apply" type="primary" onClick={() => onOk('apply')}>
                            应用
                        </Button>, <Button key="submit" type="primary" onClick={() => onOk('submit')}>
                            确定
                        </Button>]
                        ]}
                >
                    <FormComp isfiber={isfiber} openarea={openarea}>
                    </FormComp>
                </Modal>
            }
        </>
    );
};
//编辑设备
export const EditModalForm = ({
    editform,
    EditModalFormRef,
    isfiber = false,
    openarea,
    onOk,
    ...other
}) => {
    const category = Form.useWatch('category', editform);
    const gatewayId = Form.useWatch('gatewayId', editform);
    const handleCancel = () => {
        EditModalFormRef?.current?.onCancel()
    };
    return (
        <Modal
            mold="cust"
            ref={EditModalFormRef}
            title={other.name}
            {...other}
            custft={true}
            footer={
                [<Button key="back" onClick={handleCancel}>
                    取消
                </Button>, <Button key="submit" type="primary" onClick={() => onOk('submit')}>
                    确定
                </Button>,
                gatewayId && (category === 'ZTWL376-L') ? <Button key="next" type="primary" onClick={() => onOk('next')}>
                    下一步
                </Button> : [<Button key="apply" type="primary" onClick={() => onOk('apply')}>
                    应用
                </Button>]
                ]}
        >

            <EditFormComp isfiber={isfiber} openarea={openarea}></EditFormComp>
        </Modal>
    );
};
//编辑com组件
let EditCom = ({ form, coms, deviceStyle }) => {
    const [isaddress, setIsaddress] = useState(
        form.getFieldValue("commProtocol") == 1
    );
    let options = [];
    const rules = [
        {
            required: true,
        },
    ];
    for (let i = 1; i <= coms; i++) {
        options.push({
            label: `COM${i}`,
            value: i,
        });
    }
    const changeProtocol = (v, option) => {
        if (v === 1) {
            setIsaddress(true);
        } else {
            setIsaddress(false);
        }
    };
    useEffect(() => {
        if (form.getFieldsValue().commAddress) {
            setIsaddress(true);
        } else {
            setIsaddress(false);
        }
    }, [form.getFieldsValue().commAddress]);
    return (
        <>
            {![1, 13, 14, 12, 20, 21, 22, 23].includes(deviceStyle) ? (
                <Form.Item label="倍率" name="factor" rules={rules}>
                    <Input disabled />
                </Form.Item>
            ) : [1, 12].includes(deviceStyle) ? (
                <>
                    {" "}
                    <Form.Item label="CT" name="ct" initialValue={1}>
                        <InputNumber
                            min={1}
                            parser={(value) => parseInt(value)}
                            style={{ width: "100%" }}
                            disabled
                        />
                    </Form.Item>
                    <Form.Item label="PT" name="pt" initialValue={1}>
                        <InputNumber
                            min={1}
                            parser={(value) => parseInt(value)}
                            style={{ width: "100%" }}
                            disabled
                        />
                    </Form.Item>
                </>
            ) : null}

            {form.getFieldValue("gatewayId") ? (
                <>
                    <Form.Item label="通讯端口" name="commPort" rules={rules}>
                        <Select options={options} placeholder></Select>
                    </Form.Item>
                    <Form.Item label="通讯协议" name="commProtocol" rules={rules}>
                        <Select
                            onChange={changeProtocol}
                            options={[
                                {
                                    label: "Modbus",
                                    value: 1,
                                },
                                {
                                    label: "DL645",
                                    value: 2,
                                },
                            ]}
                        ></Select>
                    </Form.Item>
                    {isaddress ? (
                        <Form.Item
                            label="通讯地址"
                            name="commAddress"
                            rules={[
                                { required: true },
                                {
                                    validator: (_, value) => {
                                        if (!value) {
                                            return Promise.resolve();
                                        } else {
                                            if (Number(value) < 255 && Number(value) > 0) {
                                                return Promise.resolve();
                                            } else {
                                                return Promise.reject(new Error("通讯地址范围(0-255)"));
                                            }
                                        }
                                    },
                                },
                            ]}
                        >
                            <Input placeholder="通讯地址范围(0-255)" />
                            {/* 默认1-255 */}
                        </Form.Item>
                    ) : null}
                </>
            ) : null}
        </>
    );
};
//编辑form表单组件
export const EditFormComp = (props) => {
    const { TextArea } = Input;
    const {
        addopts,
        gatewaylist,
        devicelist,
        alarmopts,
        form,
        deviceStyle,
        levelname,
        setIndex,
    } = useContext(MyContext);
    const [area, setArea] = useState([]);
    const [coms, setComs] = useState(0);
    const [isdisable, setIsdisable] = useState(false);
    const [formdata, setFormData] = useState({});

    const rules = [
        {
            required: true,
        },
    ];

    const changeGateway = (v, option) => {
        console.log(v, option);
        setIsdisable(false);
        if (v) {
            const arr = addopts?.filter((it) => it.id === option.areaId);
            setArea([...arr]);
            setComs(option.com);
            form.setFieldsValue({
                areaId: arr[0].id,
                commPort: "",
                commAddress: 0,
                commProtocol: "",
            });
        } else {
            setArea([]);
            form.setFieldsValue({ commAddress: 0, commPort: 0, commProtocol: 0 });
        }
    };
    useEffect(() => {
        console.log(form.getFieldsValue());
    }, []);
    useEffect(() => {
        if (form?.getFieldsValue().gatewayId !== 0) {
            setIsdisable(true);
        }
        if (gatewaylist.filter) {
            const comsnum = gatewaylist.filter(
                (it) => it.id === form?.getFieldsValue().gatewayId
            );
            comsnum[0] && setComs(comsnum[0].com);
        }
        const obj = form?.getFieldsValue();
        const len = Object.keys(obj);
        if (len.length > 0) {
            setFormData({ ...obj });
        }
    }, []);
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
                    <Form.Item label={levelname?.current} name="areaId" rules={rules}>
                        {(area.length || isdisable) > 0 ? (
                            <Select
                                fieldNames={{
                                    label: "name",
                                    value: "id",
                                }}
                                options={area}
                                disabled
                            ></Select>
                        ) : (
                            <Select
                                fieldNames={{
                                    label: "name",
                                    value: "id",
                                }}
                                options={addopts}
                            ></Select>
                        )}
                    </Form.Item>
                    <Form.Item label="安装地址" name="address" rules={rules}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="告警方案" name="alarmPlanId" rules={rules}>
                        <Select
                            options={alarmopts}
                            fieldNames={{
                                label: "name",
                                value: "id",
                            }}
                        ></Select>
                    </Form.Item>
                    <Form.Item label="备注" name="remark">
                        <TextArea />
                    </Form.Item>
                </Col>
                <Col>
                    <Divider
                        type="vertical"
                        style={{ height: "100%", margin: "0 32px", borderColor: "#bcbcbc" }}
                        dashed
                    />
                </Col>
                <Col span={10}>
                    <Form.Item label="所属网关" name="gatewayId" rules={rules}>
                        <Select
                            showSearch
                            filterOption={(val, opts) => {
                                if (opts.sn.includes(val)) {
                                    return true;
                                } else {
                                    return false;
                                }
                            }}
                            fieldNames={{
                                label: "sn",
                                value: "id",
                            }}
                            onChange={changeGateway}
                            options={gatewaylist}
                        ></Select>
                    </Form.Item>
                    <Form.Item label="设备型号" name="category" rules={rules}>
                        <Select disabled showSearch options={devicelist}></Select>
                    </Form.Item>
                    <Form.Item label="设备编号" name="sn" rules={rules}>
                        <Input disabled />
                    </Form.Item>

                    <Form.Item label="设备名称" name="name" rules={rules}>
                        <Input />
                    </Form.Item>
                    {deviceStyle !== 13 &&
                        deviceStyle !== 14 &&
                        deviceStyle !== 18 &&
                        deviceStyle !== 20 &&
                        deviceStyle !== 21 &&
                        deviceStyle !== 22 &&
                        deviceStyle !== 23 ? (
                        <Form.Item label="用能类型" name="customerType" rules={rules}>
                            <Select
                                options={[
                                    {
                                        label: "客户用能",
                                        value: 1,
                                    },
                                    {
                                        label: "公共用能",
                                        value: 2,
                                    },
                                ]}
                            ></Select>
                        </Form.Item>
                    ) : null}

                    {/* {
                        deviceStyle === 21 ? (
                            <Form.Item label="计量电表" name="customerType" rules={rules}>
                                <Select
                                    options={[{
                                        label: '客户用能',
                                        value: 1
                                    }, {
                                        label: '公共用能',
                                        value: 2
                                    }]}></Select>
                            </Form.Item>
                        ) : null
                    } */}
                    {/* {deviceStyle === 1? <EditCom form={form} coms={coms}></EditCom> : null} */}
                    {deviceStyle === 1 ||
                        deviceStyle == 12 ||
                        deviceStyle == 13 ||
                        deviceStyle == 14 ||
                        deviceStyle == 20 ||
                        deviceStyle == 21 ||
                        deviceStyle == 22 ||
                        deviceStyle == 23 ? (
                        <EditCom
                            form={form}
                            coms={coms}
                            deviceStyle={deviceStyle}
                        ></EditCom>
                    ) : null}
                </Col>
            </Row>
        </Form>
    );
};

//设备参数设置
export let SetModalForm = ({ setform, SetmodalFormRef, cancelStatus, isfiber = false, openarea, onOk, ...other }) => {
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
        label: '1{全夜灯/单相电能表/中水表/热量表(计冷量)}',
        value: 1
    }, {
        label: '2{半夜灯/三相电能表/纯净水表}',
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
//分区配置
export const AreaOption = ({
    areaModaref,
    channelName1,
    channelName2,
    channelName3,
    channelName4,
    index,
    ...other
}) => {
    const channelname = (text = "分区配置") => {
        return index == 1
            ? `${channelName1}${text}`
            : index == 2
                ? `${channelName2}${text}`
                : index == 3
                    ? `${channelName3}${text}`
                    : index == 4
                        ? `${channelName4}${text}`
                        : "";
    };

    useEffect(() => { }, [channelName1]);
    return (
        <Modal
            mold="cust"
            title={channelname()}
            ref={areaModaref}
            {...other}
            footer={[
                <Button onClick={other.areacancel}>返回</Button>,
                <Button
                    style={{
                        backgroundColor: "#237ae4",
                        color: "#fff",
                        borderColor: "#237ae4",
                    }}
                    onClick={other.areaok}
                >
                    确认
                </Button>,
                // <Button style={{ backgroundColor: '#237ae4', color: '#fff', borderColor: "#237ae4" }} onClick={other.onSure}>应用</Button>,
            ]}
        >
            {/* <BlueColumn name={channelname()} styled={{ padding: '24px 0px' }}></BlueColumn> */}
            <WrapDiv channelname={channelname}></WrapDiv>
        </Modal>
    );
};
const WrapDiv = ({ channelname }) => {
    const { path1Gruop, path2Gruop, path3Gruop, path4Gruop, rankindex } =
        useContext(MyContext);
    const pathGruop =
        rankindex == 1
            ? path1Gruop
            : rankindex == 2
                ? path2Gruop
                : rankindex == 3
                    ? path3Gruop
                    : rankindex == 4
                        ? path4Gruop
                        : [{ current: { name: "", remakr: "" } }];
    const cardRef = useRef();
    const [numchannel, setNumChannel] = useState();
    const [list, setList] = useState([]);
    const setChannel = () => {
        if (!numchannel) {
            message.warning("请设置通道数");
            return;
        }
        pathGruop.current = [];
        setList(
            Array(numchannel)
                ?.fill(0)
                .map((it, i) => {
                    // pathGruop.current=[]
                    const order = i + 1 < 10 ? "0" + (i + 1) : i + 1;
                    pathGruop.current[i] = {
                        name: `${channelname("")}-分区${order}`,
                        remark: "",
                    };
                    // if( cardRef.current){
                    //     cardRef.current.setCardValue(`${channelname('')}-分区${order}`)
                    // }
                    console.log(i);
                    return (
                        <Card
                            Index={i}
                            key={pathGruop.current[i]["name"]}
                            channelname={channelname("")}
                            pathGruop={pathGruop}
                            ref={cardRef}
                        />
                    );
                })
        );
        console.log(pathGruop);
    };
    useEffect(() => {
        if (Array.isArray(pathGruop.current) && pathGruop.current.length > 0) {
            const len = pathGruop.current.length;
            setNumChannel(len);
            setList(
                pathGruop.current.map((it, i) => {
                    return (
                        <Card
                            Index={i}
                            key={pathGruop.current[i]["name"]}
                            channelname={channelname("")}
                            pathGruop={pathGruop}
                            ref={cardRef}
                        />
                    );
                })
            );
        }
    }, []);
    return (
        <div>
            <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ paddingRight: 16 }}>{channelname("分区个数")}</span>
                <InputNumber
                    style={{ width: 64, marginRight: 16 }}
                    value={numchannel}
                    min={1}
                    max={40}
                    onChange={(value) => {
                        setNumChannel(value);
                    }}
                ></InputNumber>
                <span style={{ paddingRight: 16 }}>(1~40)</span>
                <Button type="primary" ghost onClick={setChannel}>
                    配置
                </Button>
            </div>
            <Divider
                type="horizontal"
                style={{ height: "100%", borderColor: "#bcbcbc" }}
                dashed
            />
            <div className={style.gridcss}>{list}</div>
        </div>
    );
};

const Card = forwardRef(({ Index = 1, channelname, pathGruop }, ref) => {
    const [cardvalue, setCardValue] = useState();
    const [reamrk, setRemark] = useState();
    const order = Index + 1 < 10 ? "0" + (Index + 1) : Index + 1;

    useImperativeHandle(ref, () => {
        return {
            setCardValue,
        };
    });
    useEffect(() => {
        if (pathGruop.current[Index]["name"]) {
            setCardValue(pathGruop.current[Index]["name"]);
        }
    }, [pathGruop.current[Index]["name"]]);
    return (
        <div
            style={{
                width: 248,
                height: 90,
                display: "flex",
                border: "1px solid rgba(215, 215, 215, 1)",
            }}
        >
            <div
                style={{
                    width: 32,
                    height: 90,
                    textAlign: "center",
                    lineHeight: "82px",
                    backgroundColor: "#3399ff",
                    color: "#fff",
                }}
            >
                {Index + 1 < 10 ? `0${Index + 1}` : Index + 1}
            </div>
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    justifyContent: "space-around",
                }}
            >
                <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ flexShrink: 0, padding: "0 6px" }}>名称</span>
                    <Input
                        size="middle"
                        style={{ width: 165 }}
                        defaultValue={
                            pathGruop.current[Index]
                                ? pathGruop.current[Index]["name"]
                                : `${channelname}-分区${order}`
                        }
                        value={cardvalue}
                        onChange={(e) => {
                            pathGruop.current[Index]["name"] = e.target.value;
                            setCardValue(e.target.value);
                        }}
                    ></Input>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ flexShrink: 0, padding: "0 6px" }}>备注</span>
                    <Input
                        size="middle"
                        style={{ width: 165 }}
                        defaultValue={
                            pathGruop.current[Index]
                                ? pathGruop.current[Index]["remark"]
                                : null
                        }
                        value={reamrk}
                        onChange={(e) => {
                            pathGruop.current[Index]["remark"] = e.target.value;
                            setRemark(e.target.value);
                        }}
                    ></Input>
                </div>
            </div>
        </div>
    );
});

