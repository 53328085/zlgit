import React, { useEffect, useMemo, useState, useRef } from 'react'
import styled, { css } from 'styled-components'

import { Select, Divider, Input, Button, message, Form, Space, Typography } from 'antd'
import { useSelector } from 'react-redux'
import Table from '@com/useTable'
import { operationDesigin, Monitoring } from '@api/api'
import Modal from '@com/useModal'
import { Cspin } from "@com/comstyled"
import { publishState } from '@redux/systemconfig'
import CustContext from '@com/content.js'
import { useLatest, useAntdTable } from 'ahooks';
import Pagecont from "@com/pagecontent"
import Titlelayout from '@com/titlelayout'
import { Serach } from '@com/comstyled'
import { CustButtonT, CustLink } from '@com/useButton'
import restart from './imgs/restart.png'
// import { display } from 'html2canvas/dist/types/css/property-descriptors/display'
const { Item } = Form
const { Link } = Typography
const {
    DeviceManager: {
        QueryListGateWay
    },
    FileDistribution: {
        QueryDeviceIncreaseParams,
        DataInitialization,
        ClearPoint,
        Query376CommandSettingResult
    }
} = Monitoring
const csssty = css`
row-gap: 16px;
`
const ContainerDiv = styled.div`
 display: grid;
 grid-template-rows: 32px  1fr;
 row-gap: 32px;
 //padding-top: 16px;
 flex: 1;
 .loading{
    width: 100%;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
 }
 ${props => props.theme.laptop ? csssty : null}
`
export default function Index() {
    const [form] = Form.useForm()
    const [gatewayName, setGatewayName] = useState([])
    const gatewayid = Form.useWatch('gatewayId', form);
    const portName = Form.useWatch('port', form)
    const modalRef = useRef() //清除测量点、数据区初始化Ref
    const [modalTitle, setModalTitle] = useState('')
    const [modalType, setModalType] = useState('')
    const [showLoading, setShowLoading] = useState(false)
    // 用 useRef 替代全局变量，避免污染作用域
    const retryCountRef = useRef(0);//下发次数
    const [isInit, setIsInit] = useState(false)
    const currentBatchIndexRef = useRef(0);
    const publish = useSelector(publishState)
    const [gatewaylist, setGatewaylist] = useState([])
    const [gatewayIdInint, setGatewayId] = useState()
    const onelevel = useSelector(state => state.system.onelevel);
    const projectId = useSelector(state => state.system.menus.projectId)
    let columns = [
        {
            title: '序号',
            dataIndex: 'index',
            align: 'center',
            width: 40,
            render: (text, recoder, index) => <span>{index + 1}</span>
        },
        { title: '网关编号', dataIndex: 'gatewaySn' },
        { title: '设备编号', dataIndex: 'deviceSn' },
        { title: '设备型号', dataIndex: 'deviceModel' },
        {
            title: '示值整数个数', dataIndex: 'integerDigits',
            render: (text) => (<span>{text === 0 ? '4' : text === 1 ? '5' : text === 2 ? '6' : text === 3 ? '7' : '/'}</span>)
        },
        {
            title: '示值小数个数', dataIndex: 'decimalDigits',
            render: (text) => (<span>{text === 0 ? '1' : text === 1 ? '2' : text === 2 ? '3' : text === 3 ? '4' : '/'}</span>)
        },
        { title: '所属测量点号', dataIndex: 'pn' },
        {
            title: '数据位', dataIndex: 'dataBites',
            render: (text) => (<span>{text === 0 ? '5位' : text === 1 ? '6位' : text === 2 ? '7位' : text === 3 ? '8位' : '/'}</span>)
        },
        {
            title: '停止位', dataIndex: 'stopBites',
            render: (text) => (<span>{text === 0 ? '1停止位' : text === 1 ? '2停止位' : '/'}</span>)
        },
        {
            title: '校验方式', dataIndex: 'parityBites',
            render: (text) => (<span>{text === '' ? '无校验' : text === '0' ? '偶校验' : text === '1' ? '奇校验' : '/'}</span>)
        },
        { title: '费率数', dataIndex: 'rateCount' },
        {
            title: '大类号', dataIndex: 'largeCategory',
            render: (text) => (<span>{text === 0 ? '电力大型专变用户'
                : text === 1 ? '电力小型专变用户/水表'
                    : text === 2 ? '电力低压三相用户/热量表'
                        : text === 3 ? '电力低压单相用户/燃气表'
                            : text === 4 ? '电力居民用户/其他仪表'
                                : text === 5 ? '电力公变考核计量'
                                    : '/'}</span>)
        },
        {
            title: '小类号', dataIndex: 'smallCategory',
            width: 200,
            render: (text) => (<span>{text === 0 ? '通配电能表/冷水表/热量表(计热量)/燃气表/其他仪表(如 电度表)'
                : text === 1 ? '单相电能表/中水表/热量表(计冷量)'
                    : text === 2 ? '三相电能表/纯净水表'
                        : text === 3 ? '热水表'
                            : text === 9 ? '电子水表'
                                : '/'}</span>)
        },
        {
            title: '通信协议类型', dataIndex: 'protocolType',
            width: 200,
            render: (text) => (<span>{text === 0 ? '无需对本序号的电能表/交流采样装置进行抄表'
                : text === 1 ? 'DL/T645-1997'
                    : text === 2 ? '交流采样装置通信协议'
                        : text === 10 ? '正泰智能微断(电气)'
                            : text === 30 ? 'DL/T645-2007'
                                : text === 31 ? '串行接口连接窄带低压载波通信模块接口协议'
                                    : text === 32 ? 'CJ/T 188-2004'
                                        : text === 36 ? 'DL/T698.45-201X'
                                            : text === 48 ? 'MODBUS-逆变器 正泰电源'
                                                : text === 49 ? 'MODBUS-监控器'
                                                    : text === 50 ? 'MODBUS-环境检测仪'
                                                        : text === 51 ? 'MODBUS-逆变器 古瑞瓦特'
                                                            : text === 53 ? 'MODBUS-逆变器 锦浪'
                                                                : text === 54 ? 'MODBUS-逆变器 阳光-水晶石'
                                                                    : text === 55 ? 'MODBUS-逆变器 阳光-中功率'
                                                                        : text === 60 ? '正泰塑壳断路器'
                                                                            : text === 70 ? '正泰安全用电'
                                                                                : text === 80 ? '正泰智能微断(仪表)'
                                                                                    : text === 90 ? 'SA-201G电子秤'
                                                                                        : text === 100 ? '正泰灯控'
                                                                                            : text === 255 ? '正泰定制MQTT协议'
                                                                                                : '/'}</span>)
        },
        {
            title: '通信波特率', dataIndex: 'bautRate',
            render: (text) => (<span>{text === 0 ? '无需设置或默认'
                : text === 1 ? '600'
                    : text === 2 ? '1200'
                        : text === 3 ? '2400'
                            : text === 4 ? '4800'
                                : text === 5 ? '7200'
                                    : text === 6 ? '9600'
                                        : text === 7 ? '19200'
                                            : '/'}</span>)
        },
        { title: '通信密码', dataIndex: 'password' },
        { title: '采集器通信地址', dataIndex: 'collectSn' },
    ]
    if (publish) {
        columns.pop()
    }
    const [tableData, setTtableData] = useState(false)
    const [dataSource, setDataSource] = useState(false)
    //获取设备
    const getQueryPageDevice = (formData) => {
        if (gatewayIdInint == undefined) return
        let { alike, port, gatewayId } = form.getFieldValue()

        console.log(form.getFieldValue(), gatewayId, '网关ID')
        let params = {
            projectId,
            port,
            gatewayId: gatewayId == undefined ? gatewayIdInint : gatewayId,
            alike,
        }
        return QueryDeviceIncreaseParams(params).then(res => {
            let { success, total, data } = res
            if (success) {
                setTtableData(Array.isArray(data) ? data : [])
                setDataSource(Array.isArray(data) ? data : [])
            } else {
                message.error(res.errMsg)
                setTtableData([])
                setDataSource([])
                return {
                    list: [],
                    total: 0
                }
            }
        })
    }
    //打开新增
    // 生成 1~31 的 {label, value} 数组
    const portList = Array.from({ length: 31 }, (_, index) => ({
        label: `${index + 1}`,
        value: `${index + 1}`
    }));
    const getQueryListGateWay = async () => {
        try {
            const resp = await QueryListGateWay(projectId)
            if (resp.success && Array.isArray(resp.data)) {
                const arr = resp.data.map(it => ({ label: it.sn, value: it.id }))
                if (arr.length > 0) {
                    setGatewayId(arr[0].value)
                    form.setFieldValue("gatewayId", arr[0].value)
                } setGatewaylist(() => ([...arr]));
                console.log(arr, form)
            } else {
                setDevicelist([])//{ sn: '(无)直连设备', id: 0 }
            }
        } catch (e) { console.log(e) }

    }
    const onClear = async () => {
        if (tableData.length == 0) return message.warning('当前条件下不存在设备')
        setModalTitle('清除测量点')
        setModalType('clear')
        setGatewayName(gatewaylist.find(item => item.value === gatewayid)?.label)
        modalRef?.current?.onOpen()
    }
    const onInitialize = async () => {
        if (tableData.length == 0) return message.warning('当前条件下不存在设备')
        if (!isInit) return message.warning('请先清除测量点')
        setModalTitle('数据区初始化')
        setModalType('init')
        modalRef?.current?.onOpen()
        setGatewayName(gatewaylist.find(item => item.value === gatewayid)?.label)
    }
    const onsubmit = async () => {
        modalRef?.current?.onCancel()
        let params = {
            projectId,
            gatewaySn: gatewayName,
            port: portName
        }
        setShowLoading(true)
        modalRef?.current?.onCancel()
        if (modalType === 'clear') {
            try {
                const res = await ClearPoint(params)
                if (res.success) {
                    clearResult(JSON.parse(res.data).seq)

                } else {
                    setShowLoading(false)
                    message.error(res.errMsg)
                }
            } catch (e) {
                setShowLoading(false)
                console.log(e)
            }
        } else if (modalType === 'init') {
            // 重置批次索引和重试次数
            currentBatchIndexRef.current = 0;
            await processBatchInitialization();

        }
    }
    // 处理分批初始化
    const processBatchInitialization = async () => {
        const { current: currentIndex } = currentBatchIndexRef;
        const batch = tableData.slice(currentIndex, currentIndex + 10);

        if (batch.length === 0) {
            // 所有批次完成
            setShowLoading(false);
            setIsInit(false)
            retryCountRef.current = 0
            message.success('数据区初始化成功');
            return;
        }

        const deviceSns = batch.map(item => item.deviceSn);
        try {
            const res = await DataInitialization(projectId, gatewayName, portName, deviceSns);
            if (res.success) {
                await initResult(JSON.parse(res.data).seq);
            } else {
                setShowLoading(false);
                message.error(res.errMsg);
            }
        } catch (e) {
            setShowLoading(false);
            console.error('初始化失败:', e);
        }
    };

    const clearResult = async (seq) => {
        try {
            const res = await Query376CommandSettingResult(seq)
            if (res.success) {
                if (res.data === 0 || res.data === 1) {
                    //持续调用
                    if (retryCountRef.current >= 4) {
                        message.warning('清除测量点异常,请重新操作')
                        retryCountRef.current = 0
                        setShowLoading(false)
                    } else {
                        retryCountRef.current++
                        setTimeout(() => {
                            clearResult(seq)
                        }, 1000)

                    }

                } else if (res.data === 2) {
                    //成功 
                    message.success('清除测量点成功')
                    setShowLoading(false)
                    setIsInit(true)
                    retryCountRef.current = 0
                }
            } else {
                setShowLoading(false)
                message.error(res.errMsg)
            }
        } catch (e) {
            console.log(e)
        }
    }
    const initResult = async (seq) => {
        try {
            const res = await Query376CommandSettingResult(seq)
            if (res.success) {
                if (res.data === 0 || res.data === 1) {
                    //持续调用
                    if (retryCountRef.current >= 4) {
                        message.warning('数据区初始化异常,请重新操作')
                        retryCountRef.current = 0
                        setShowLoading(false)
                    } else {
                        retryCountRef.current++
                        setTimeout(() => {
                            initResult(seq)
                        }, 1000)
                    }

                } else if (res.data === 2) {
                    // 当前批次成功，处理下一批次
                    retryCountRef.current = 0;
                    currentBatchIndexRef.current += 10;
                    await processBatchInitialization(); // 继续下一批
                }
            } else {
                message.error(res.errMsg)
                setShowLoading(false);
            }
        } catch (e) {
            console.log(e)
            setShowLoading(false);
        }
    }
    useEffect(() => {
        getQueryListGateWay()
    }, [])
    const { search } = useAntdTable(getQueryPageDevice, {
        refreshDeps: [gatewayIdInint], // 当 gatewayId 变化时自动刷新
    })
    const { submit } = search
    return (
        <Pagecont showserach={false} pd="0px" >
            <Titlelayout title="档案下发" layout="flex" dr="column">
                <ContainerDiv>
                    <Form form={form} layout='line'
                        initialValues={{
                            alike: '',
                            port: '1',
                            gatewayId: gatewayIdInint
                        }}
                        style={{ display: 'flex', justifyContent: "space-between" }}
                    >
                        <Space size={16}>

                            <Item label="设备查询" name="alike" style={{ marginBottom: 0 }}>

                                <Serach
                                    placeholder="输入设备编号/安装地址"
                                    onSearch={submit}
                                />
                            </Item>
                            <Item label="网关查询" name="gatewayId" style={{ marginBottom: 0 }} >
                                <Select
                                    showSearch
                                    style={{ width: 164 }}
                                    filterOption={(val, opts) => {
                                        if (opts.sn.includes(val)) {
                                            return true
                                        } else {
                                            return false
                                        }
                                    }}
                                    options={gatewaylist}
                                    onChange={submit}
                                ></Select>
                            </Item>
                            <Item label="端口号查询" name="port" style={{ marginBottom: 0 }} >
                                <Select
                                    options={portList}
                                    style={{ width: 164 }}
                                    onChange={submit}

                                ></Select>
                            </Item>
                        </Space>
                        <div style={{ display: 'flex' }}><CustButtonT onClick={onClear} text="清除测量点" />
                            <CustButtonT onClick={onInitialize} style={{ marginLeft: '16px' }} text="数据区初始化" /></div>

                    </Form>
                    <div>
                        <Table columns={columns} dataSource={dataSource} scroll={{ y: 600 }}></Table>
                        {showLoading ? <Cspin tip="操作中……" delay={300} className='loading' /> : null}
                        <Modal mold='cust' ref={modalRef} onOk={onsubmit} title={modalTitle}>
                            <div style={{ margin: '16px 32px 0', display: 'flex', alignItems: 'center' }}>
                                <div><img src={restart}></img></div>
                                <div style={{ paddingLeft: 32, fontSize: 16 }}>
                                    请确认是否对网关是<span style={{ color: '#ff4d4f' }}>{gatewayName}</span>,
                                    <p>端口号是<span style={{ color: '#ff4d4f' }}>{portName}</span>的设备进行
                                        <span style={{ color: '#ff4d4f' }}>{modalTitle}</span> 操作?</p>
                                </div>
                            </div>

                        </Modal>
                    </div>
                </ContainerDiv>
            </Titlelayout>
        </Pagecont>
    )
}
