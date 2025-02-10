import React, { useState, useEffect } from 'react'
import styled, { css } from "styled-components";
import { CustLink, CustButtonT } from '@com/useButton'
import { useSelector } from "react-redux"
import CModal from '@com/useModal'
import Pagecount from '@com/pagecontent'
import style from './style.module.less'
import { themeColor, adaptation } from '@redux/systemconfig.js'
import { Button, Form, Input, Row, Col, Select, InputNumber, Space, message, Typography, Divider, Modal, Timeline } from 'antd';
const Content = styled.div`
width:1100px;
margin: 24px auto;
&&{
    .substationName{
        font-weight: bold;
        font-size: 16px;
    }
    .addCupboard{
        width: 100%;
        margin-top: 10px;
    }
    .box{
        height:390px;
        overflow-y: scroll;

    .row{
         margin-top: 16px;
         display: flex;
    .boxLeft{
        width: 110px;
        height:230px;
        line-height: 230px;    
        border: 1px solid rgba(215, 215, 215, 1);
        font-family: "微软雅黑 Bold", "微软雅黑 Regular", 微软雅黑;
        font-weight: 700;
        font-size: 16px;
        color: rgb(102, 102, 102);
        text-align: center;
    }
    .boxRight{
        margin-left:10px;
        width: 950px;
        height:230px;
        background-color: rgba(242, 242, 242, 1);
        .boxRightTop{
            display: flex;
        .addBusbarBtn{
            width: 90px;
            height:40px;
        }
        .busbar{
            width: 190px;
            height:40px;
            line-height: 40px;
            text-align: center;
            margin-right: 10px;
        }
          .noFlipped .front{
                width: 190px;
                height:40px;
                line-height: 40px;
                background-color:#fff;
                border:1px solid rgba(215, 215, 215, 1);
                text-align: center;
                position:relative;
                overflow: hidden;
                .tag {
                    position: absolute;
                    width: 90px;
                    height: 22px;
                    line-height: 22px;
                    background-color: #ececec;
                    color: #999999;
                    text-align: center;
                    right: -31px;
                    top: 2px;
                    transform: rotate(38deg);
                    font-size: 10px;
					
				}
            }
            
           
        }
        .boxRightBottom{
            margin-top: 10px;
            display: flex;
        .addCabinetBtn{
            width: 90px;
            height:180px;
        }
        
        .cabinet{
            width: 90px;
            height:180px;
            line-height: 40px;
            text-align: center;
            margin-right: 10px;
        }
          .noFlipped .front{
                width: 90px;
                height:180px;
                line-height: 40px;
                background-color:#fff;
                border:1px solid rgba(215, 215, 215, 1);
                text-align: center;
                position:relative;
                overflow: hidden;
                
            .title1{
                display:block;
                margin-top: 50px;
            }
            .title2{
                display:block;
            }
            
            .tag {
                position: absolute;
                width: 90px;
                height: 22px;
                line-height: 22px;
                background:${props => props.theme.primaryColor || '#237ae4'};
                color: #fff;
                text-align: center;
                right: -31px;
                top: 2px;
                transform: rotate(38deg);
                font-size: 10px;
                
            }
            }
        
        }
        }
    }
}
}
}
}`
export default function Index() {
    const { primaryColor, primaryderived } = useSelector(themeColor)
    const [busbar, setBusbar] = useState([{}]);
    // const [busbarShow, setBusbarShow] = useState(false);
    const [busbarShow, setBusbarShow] = useState(new Map());
    const [cabinet, setCabinet] = useState([{}]);
    const [cabinetShow, setCabinetShow] = useState(new Map());
    const [rows, setRows] = useState([{ busbarShow: new Map(), cabinetShow: new Map(), busbar: busbar, cabinet: cabinet }]);
    const [deleteTip, setDeleteTip] = useState(1);
    const [modalAddOrEdit, seModalAddOrEdit] = useState('add');
    //删除弹窗
    const [deleteModalType, setDeleteModalType] = useState('');
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteRow, setDeleteRow] = useState(1);
    const [deleteBusbar, setDeleteBusbar] = useState(1);
    //编辑母线弹窗
    const [editBusbarModal, setEditBusbarModal] = useState(false);
    const [form] = Form.useForm();
    const [editCabinetModal, setEditCabinetModal] = useState(false);
    const [cabinetForm] = Form.useForm();
    const [distributionCabinetNum, setDistributionCabinetNum] = useState(5);
    //母线配置弹窗参数
    const [busbarDeviceId, setBusbarDeviceId] = useState();
    const [busbarDeviceIdAdd, setBusbarDeviceIdAdd] = useState([]);
    const brandList = [
        { label: 'chint', value: 1 },
    ]
    const belongingList = [
        { label: 'T3 变压器柜', value: 1 },
        { label: 'T4 变压器柜', value: 2 },
        { label: '进线柜', value: 3 },
    ]
    const situationList = [
        { label: '使用', value: 1 },
        { label: '备用', value: 2, }
    ]
    const circuit1List = [
        { label: '进线回路', value: 1 },
    ]
    const linebrandList = [
        { label: '单母线', value: 1 },
        { label: '双母线', value: 2 },
        { label: '住母线带旁路母线', value: 3 },
        { label: '环形母线', value: 4 },
    ]

    const busbarDeviceList = [
        { label: '测量设备', value: 1 },
        { label: '无线温度传感器', value: 2 },
    ]
    const circuit2List = [
        { label: '无', value: 1 },
        { label: '变压器', value: 2 },
        { label: '出线回路1', value: 3 },
    ]
    const measurementModelList = [
        { label: 'PMA901', value: 1 },
        { label: 'Ex9TJ', value: 2 },
        { label: 'Ex9TJV', value: 3 },
        { label: 'PMA600', value: 4 },
        { label: 'PMA710-3-C', value: 5 },
        { label: 'PMA710-8-I-T', value: 6 },
    ]
    const deviceCircuit1List = [
        { label: '母线1-1', value: 1 },
        { label: '变压器', value: 2 },
        { label: '出线回路1', value: 3 },
    ]
    const temperatureModelList = [
        { label: 'WTS-1', value: 1 },
        { label: 'WTS-3', value: 2 },
    ]
    const phaseLineList = [
        { label: 'A', value: 1 },
        { label: 'B', value: 2 },
        { label: 'C', value: 3 },
        { label: 'N', value: 4 },
    ]


    const onBrandchange = () => {

    }
    const onStylechange = () => {

    }
    const onModelchange = () => {

    }
    const onTypechange = () => {

    }


    //母线编辑删除----开始
    const onEditBusbar = (event) => {
        event.stopPropagation(); // 阻止点击事件冒泡到外层div
        setEditBusbarModal(true)
        seModalAddOrEdit('edit')
    };
    const onDeleteBusbar = (event, rowIndex, index) => {
        setDeleteModalType('母线')
        event.stopPropagation(); // 阻止点击事件冒泡到外层div
        setDeleteModal(true);
        setDeleteTip('是否确认删除母线？')
        setDeleteRow(rowIndex)
        setDeleteBusbar(index)
    };
    //母线编辑删除----结束

    //柜体编辑删除----开始
    const onEditCabinet = (event) => {
        event.stopPropagation(); // 阻止点击事件冒泡到外层div
        seModalAddOrEdit('edit')
        setEditCabinetModal(true)
    };
    const onDeleteCabinet = (event) => {
        setDeleteModalType('柜体')
        event.stopPropagation(); // 阻止点击事件冒泡到外层div
        setDeleteModal(true);
        setDeleteTip('是否确认删除选中的柜体？')
    };
    //柜体编辑删除----结束

    const onBusbarOk = () => {
        setEditBusbarModal(false)
        if (modalAddOrEdit == 'add') {
            setBusbar(busbar + 1)
            setBusbar([...busbar, { text: '' }]);
        } else {

        }
    };
    const onCabinetOk = () => {
        setEditCabinetModal(false)
        if (modalAddOrEdit == 'add') {
            setCabinet(cabinet + 1)
            setCabinet([...cabinet, { text: '' }]);
        } else {

        }
    };
    const onBusbarConfigure = async (row, index) => {
        setEditBusbarModal(true)
    }
    const onCabinetConfigure = async (row, index) => {
        setEditCabinetModal(true)
    }

    //删除确认
    const deleteOk = async () => {
        if (deleteModalType == '整行') {
            setRows(rows.filter((item, index) => index !== deleteRow));
        } else if (deleteModalType == '柜体') {

        } else if (deleteModalType == '母线') {
            console.log(rows[deleteRow - 1].busbarShow.get(deleteBusbar))
            // setRows(rows[deleteRow-1].busbarShow.get().filter((item, index) => index !== deleteBusbar));
        }

        setDeleteModal(false);
        console.log(rows)
    }

    //删除取消
    const onCancel = () => {
        setDeleteModal(false);
        setEditBusbarModal(false)
        setEditCabinetModal(false)
    };
    const onSave = () => {
        setEditBusbarModal(false)
        form.resetFields();
        setBusbarDeviceId()
        setBusbarDeviceIdAdd([])
    };
    const BusbarDeviceChange = (e) => {
        setBusbarDeviceId(e)
    };
    const onAddDevice = () => {
        //添加时判断是否存在已添加‘母线设备’
        if (busbarDeviceIdAdd.length < 1) {
            setBusbarDeviceIdAdd([...busbarDeviceIdAdd, busbarDeviceId])
        } else {
            if (!busbarDeviceIdAdd.includes(busbarDeviceId)) {
                setBusbarDeviceIdAdd([...busbarDeviceIdAdd, busbarDeviceId])
            } else {
                return message.warning('该母线设备类型已存在')
            }
        }
    };
    const renderRows = () => {
        // return Array.from({ length: rows }, (_, index) => (
        //     {
        return rows?.map((row, index) => (
            <div key={index} className='row'>
                <div className='boxLeft'>
                    <div className='title'>第{index + 1}行  柜体</div>
                </div>
                <div className='boxRight'>
                    <div className='boxRightTop'>
                        {renderAddBusbar(row, index + 1)}
                    </div>
                    <div className='boxRightBottom'>
                        {renderAddCabinet(row, index + 1)}
                    </div>
                </div>
            </div>
        ))
    }
    //     ));
    // };
    const renderAddBusbar = (rowItem, row) => {
        // return Array.from({ length: busbar }, (_, index) => (
        return busbar?.map((item, index) => (
            <div key={index} className='busbar noFlipped'>
                <div className='front' onClick={() => onBusbarConfigure(row, index)}>母线{row}-{index + 1}
                    <view class="tag">
                        待处理
                    </view>
                </div>
            </div>
        ));
    };

    const renderAddCabinet = (rowItem, row) => {
        // return Array.from({ length: cabinet }, (_, index) => (
        return cabinet?.map((item, index) => (
            <div key={index} className='cabinet noFlipped'>
                <div className='front' onClick={() => onCabinetConfigure(row, index)}>
                    <span className='title1'>列{index + 1}</span>
                    <span className='title2'>柜体{index + 1}</span>
                    <view class="tag">
                        已完成
                    </view>
                </div>
            </div>
        ));
    };

    const validatorfunc = (_, value) => {
        console.log(value, !Number(value))
        if (!Number(value)) {
            return Promise.reject(new Error("请输入正确的柜体属性"))
        } else {
            if (Number(value) <= 0) {
                return Promise.reject(new Error("请输入正确的柜体属性"))
            } else {
                return Promise.resolve()
            }
        }
    }
    return (
        <Pagecount pd="0" bgcolor="transparent">
            <Content>
                <div className='substationName'>1#正泰物联变电站</div>
                <div className='box'>
                    {renderRows()}
                </div>

                <CModal
                    open={deleteModal}
                    onOk={deleteOk}
                    onCancel={onCancel}
                    width={512}
                    closable={false}
                    type="warn"
                    mold="cust"
                    title="删除提示"
                    key="delete"
                >
                    {deleteTip}
                </CModal>
                <Modal
                    open={editBusbarModal}
                    closable={false}
                    width={1400}
                    className={style.setBusbarModal}
                    title={<CustButtonT ghost onClick={onSave} text="保存配置" />}
                    footer={null}

                >
                    <div className={style.content}>
                        <div className={style.left}>
                            <div className={style.redLineTop}>

                            </div>
                            <div className={style.distributionCabinet}>
                                {Array.from({ length: distributionCabinetNum }, (_, index) => (
                                    <div className={[index + 1 == distributionCabinetNum ? style.boxLast : style.box]}>
                                        <div className={style.redLine}>

                                        </div>
                                        <div className={style.con}>
                                            <div className={style.info}>
                                                <p>配电柜</p>
                                                <p>行1列{index + 1}</p>
                                            </div>
                                            <div className={style.distribution}>

                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={style.center}>
                            <div className={style.arrowHead} style={{ borderRight: `15px solid ${primaryColor}` }}></div>
                            <div className={style.arrowBoady} style={{ backgroundColor: primaryColor }}></div>
                        </div>
                        <div className={style.right} style={{ border: `1px solid  ${primaryColor}` }}>
                            <div className={style.title} style={{ backgroundColor: primaryColor }}>
                                <div className={style.titleName} style={{ color: primaryColor }}>
                                    母线设置
                                </div>
                            </div>
                            <div className={style.busbarSet}>
                                <p className={style.title}>母线1-1</p>
                                <div className={style.set1}>
                                    <Form form={form} preserve={false} labelCol={{ flex: "103px" }}>
                                        <Row gutter={16}>
                                            <Col span={11}>
                                                <Form.Item label="母线名称" name="name" rules={[{ required: true, }]}>
                                                    <Input allowClear />
                                                </Form.Item>
                                                <Form.Item label="归属盘柜" name="belonging" rules={[{ required: true }]} >
                                                    <Select options={belongingList} />
                                                </Form.Item>
                                                <Form.Item label="设备情况" name="situation" rules={[{ required: true }]} >
                                                    <Select options={situationList} />
                                                </Form.Item>
                                                <Form.Item label="上级回路1" name="circuit1" rules={[{ required: true }]} >
                                                    <Select options={circuit1List} />
                                                </Form.Item>
                                            </Col>
                                            <Col span={11}>
                                                <Form.Item label="母线SN" name="sn" rules={[{ required: true, }]}>
                                                    <Input allowClear />
                                                </Form.Item>
                                                <Form.Item label="母线样式" name="lineStyle" rules={[{ required: true }]} >
                                                    <Select options={linebrandList} />
                                                </Form.Item>
                                                <Form.Item label="母线规格" name="specs" rules={[{ required: true }]} >
                                                    <Input allowClear />
                                                </Form.Item>
                                                <Form.Item label="上级回路1" name="circuit2" rules={[{ required: true }]} >
                                                    <Select options={circuit2List} />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Form>
                                </div>
                                <div className={style.set2}>
                                    <div className={style.device}>
                                        <p className={style.title}>母线设备</p>
                                        <Select options={busbarDeviceList} value={busbarDeviceId} style={{ width: 135, marginRight: 16 }} onChange={BusbarDeviceChange} />
                                        <CustButtonT ghost onClick={onAddDevice} text="添加" />
                                    </div>
                                    {busbarDeviceIdAdd.map(item => (
                                        item == 1 ?
                                            <div className={style.set}>
                                                <div className={style.del}>
                                                    <p className={style.title}>测量设备</p>
                                                    <Button danger className='exit'>删除设备</Button>
                                                </div>
                                                <Form form={form} preserve={false} labelCol={{ flex: "103px" }}>
                                                    <Row >
                                                        <Form.Item label="设备型号" name="measurementModel" rules={[{ required: true, }]}>
                                                            <div style={{ display: 'flex' }}>
                                                                <Select options={measurementModelList} style={{ width: 150 }} />
                                                                <CustButtonT ghost text="选择设备" style={{ marginLeft: 16 }} />
                                                            </div>
                                                        </Form.Item>
                                                        <Form.Item label="上级回路1" name="name" rules={[{ required: true, }]}>
                                                            <div style={{ display: 'flex' }}>
                                                                <Select options={deviceCircuit1List} style={{ width: 150 }} />
                                                            </div>
                                                        </Form.Item>
                                                        {/* <Col span={16}></Col> */}
                                                    </Row>
                                                    <Row gutter={16}>
                                                        <Col span={11}>
                                                            <Form.Item label="额定电流" name="name" rules={[{ required: true, }]}>
                                                                <Input allowClear suffix={<span>A</span>} />
                                                            </Form.Item>
                                                            <Form.Item label="长延时电流" name="cabinet" rules={[{ required: true }]} >
                                                                <Input allowClear suffix={<span>A</span>} />
                                                            </Form.Item>
                                                            <Form.Item label="短延时电流" name="situation" rules={[{ required: true }]} >
                                                                <Input allowClear suffix={<span>A</span>} />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={11}>
                                                            <Form.Item label="瞬动电流" name="sn" rules={[{ required: true, }]}>
                                                                <Input allowClear suffix={<span>A</span>} />
                                                            </Form.Item>
                                                            <Form.Item label="长延时时间" name="style" rules={[{ required: true }]} >
                                                                <Input allowClear suffix={<span>S</span>} />
                                                            </Form.Item>
                                                            <Form.Item label="短延时时间" name="specs" rules={[{ required: true }]} >
                                                                <Input allowClear suffix={<span>S</span>} />
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                </Form>
                                            </div>

                                            : item == 2 ?
                                                <div className={style.set}>
                                                    <div className={style.del}>
                                                        <p className={style.title}>无线测温设备</p>
                                                        <Button danger className='exit'>删除设备</Button>
                                                    </div>
                                                    <Form form={form} preserve={false} labelCol={{ flex: "103px" }}>
                                                        <Row>
                                                            <Form.Item label="设备型号" name="temperatureModel" rules={[{ required: true, }]}>
                                                                <div style={{ display: 'flex' }}>
                                                                    <Select options={temperatureModelList} style={{ width: 150 }} />
                                                                    <CustButtonT ghost text="选择设备" style={{ marginLeft: 16 }} />
                                                                </div>
                                                            </Form.Item>
                                                        </Row>
                                                        <Row gutter={16}>
                                                            <Col span={11}>
                                                                <Form.Item label="相线" name="phaseLine" rules={[{ required: true, }]}>
                                                                    <Select options={phaseLineList} />
                                                                </Form.Item>
                                                            </Col>
                                                            <Col span={11}>
                                                                <Form.Item label="温度上限" name="sn" rules={[{ required: true, }]}>
                                                                    <Input allowClear suffix={<span>℃</span>} />
                                                                </Form.Item>
                                                            </Col>
                                                        </Row>
                                                    </Form>
                                                </div>

                                                : null
                                    ))
                                    }
                                </div>

                            </div>
                        </div>
                    </div>

                </Modal>
                <CModal
                    open={editCabinetModal}
                    onOk={onCabinetOk}
                    onCancel={onCancel}
                    width={720}
                    closable={false}
                    mold="cust"
                    title={modalAddOrEdit == 'add' ? "新增柜体" : "编辑柜体"}
                >
                    <Form form={cabinetForm} preserve={false} layout="vertical"
                        initialValues={{ brand: 1, style: 1, model: 1, type: 1 }}
                    >
                        <Row gutter={16}>
                            <Col span={10}>
                                <Form.Item label='柜体名称' name="area" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                                <Form.Item label="柜体品牌" name="brand" rules={[{ required: true }]}
                                >
                                    <Select options={brandList} onChange={onBrandchange} />

                                </Form.Item>
                                <Form.Item label="柜体样式" name="style" rules={[{ required: true }]}>
                                    <Select options={brandList} onChange={onStylechange} />
                                </Form.Item>
                                <Form.Item label="柜体高度(cm)" name="remark" rules={[{ required: true, validator: validatorfunc }]}>
                                    <Input suffix={<span>(cm)</span>} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col>
                                <Divider type='vertical' style={{ height: '100%', borderColor: '#bcbcbc' }} dashed />
                            </Col>
                            <Col span={10}>

                                <Form.Item label="柜体SN" name="heartInterval" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                                <Form.Item label="柜体型号" name="model" rules={[{ required: true }]}>
                                    <Select options={brandList} onChange={onModelchange} />
                                </Form.Item>
                                <Form.Item label="柜体类型" name="type" rules={[{ required: true }]}>
                                    <Select options={brandList} onChange={onTypechange} />
                                </Form.Item>
                                <Form.Item label="柜体宽度(cm)" name="name" rules={[{ required: true, validator: validatorfunc }]}>
                                    <Input suffix={<span>(cm)</span>} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                        </Row>

                    </Form>
                </CModal>
            </Content>
        </Pagecount >
    )
}