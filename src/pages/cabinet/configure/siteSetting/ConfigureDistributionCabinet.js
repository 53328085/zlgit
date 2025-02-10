import React, { useState, useEffect } from 'react'
import styled, { css } from "styled-components";
import { CustLink, CustButtonT } from '@com/useButton'
import CModal from '@com/useModal'
import Pagecount from '@com/pagecontent'
import { Button, Form, Input, Row, Col, Select, Space, message, Typography, Divider, Modal, Timeline } from 'antd';
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
        font-family: "微软雅黑 Bold", "微软雅黑 Regular", 微软雅黑;
        font-weight: 700;
        font-size: 16px;
        color: rgb(102, 102, 102);
        text-align: center;
        // background:${props => props.theme.asiderbgcolorA || '#e5effc'};
        background-color: rgba(35, 122, 228, 0.117647058823529);
        .title{
            padding-top: 60px;
        }
        .deleteRowBtn{
            margin-top: 90px;
        }
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
            position: relative;
            margin-right: 10px;
        }
        .flipped .front {
            position: absolute;
            transform: rotateX(-180deg);
            backface-visibility: hidden;
          }
          .flipped .back  { 
            transform-style: preserve-3d; /* 保持3D效果 */
            transition: transform 0.5s; /* 平滑旋转 */
            width: 190px;
            height:40px;
            line-height: 40px;
            background-color:#fff;
            border:1px solid rgba(215, 215, 215, 1);
            text-align: center;
            position: absolute;
            backface-visibility: visible;
            transform: rotateX(0deg);
            display: flex;
            justify-content: space-evenly;
            align-items: center;
            .edit{
                width: 60px;
                height: 26px;
                line-height: 13px;
                font-size: 12px;
            }
            .delete{
                width: 60px;
                height: 26px;
                line-height: 13px;
                font-size: 12px;
            }
          }
          .noFlipped .front{
                transform-style: preserve-3d; /* 保持3D效果 */
                transition: transform 0.5s; /* 平滑旋转 */
                width: 190px;
                height:40px;
                line-height: 40px;
                background-color:#fff;
                border:1px solid rgba(215, 215, 215, 1);
                text-align: center;
                position: absolute;
                backface-visibility: visible;
                transform: rotateX(0deg);
            }
           .noFlipped  .back{
                position: absolute;
                transform: rotateX(-180deg);
                backface-visibility: hidden;
                
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
            position: relative;
            margin-right: 10px;
        }
        .flipped .front {
            position: absolute;
            transform: rotateY(-180deg);
            backface-visibility: hidden;
          }
          .flipped .back  { 
            transform-style: preserve-3d; /* 保持3D效果 */
            transition: transform 0.5s; /* 平滑旋转 */
            width: 90px;
            height:180px;
            line-height: 40px;
            background-color:#fff;
            border:1px solid rgba(215, 215, 215, 1);
            text-align: center;
            position: absolute;
            backface-visibility: visible;
            transform: rotateY(0deg);
            .title1{
                margin-top: 20px;
                display:block;
            }
            .title2{
                display:block;
                margin-top: -20px;
            }
            .edit{
                width: 75px;
                height: 26px;
                line-height: normal;
                font-size: 12px;
            }
            .delete{
                width: 75px;
                height: 26px;
                line-height: normal;
                font-size: 12px;
            }
          }
          .noFlipped .front{
                transform-style: preserve-3d; /* 保持3D效果 */
                transition: transform 0.5s; /* 平滑旋转 */
                width: 90px;
                height:180px;
                line-height: 40px;
                background-color:#fff;
                border:1px solid rgba(215, 215, 215, 1);
                text-align: center;
                position: absolute;
                backface-visibility: visible;
                transform: rotateY(0deg);
                
            .title1{
                display:block;
                margin-top: 50px;
            }
            .title2{
                display:block;
            }
            }
           .noFlipped  .back{
                position: absolute;
                transform: rotateY(-180deg);
                backface-visibility: hidden;
                
            }
        
        
        }
        }
    }
}
}
}
}`
export default function Index() {
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

    const brandList = [
        { label: 'chint', value: 1, },
    ]
    const styleList = [
        { label: '柜组合式', value: 1, },
        { label: '变压器室', value: 2 },
        { label: '柜式 (单柜)', value: 3 },
        { label: '箱式', value: 4 },
        { label: '终端箱式', value: 5 },
    ]
    const modelList = [
        { label: 'NGC8', value: 1, }
    ]
    const typeList = [
        { label: '进线柜', value: 1, },
        { label: '有源滤波柜', value: 2 },
        { label: '馈线柜', value: 3 },
        { label: '馈线柜', value: 4 },
    ]
    const onBrandchange = () => {

    }
    const onStylechange = () => {

    }
    const onModelchange = () => {

    }
    const onTypechange = () => {

    }
    const addNewRow = (index, event) => {
        // setRows(rows + 1);
        // setBusbarShow(new Map(busbarShow.set(index, !busbarShow.get(index))));
        // new Map(busbarShow.set(index, !busbarShow.get(index)))
        // setBusbarShow(new Map(busbarShow.set(0, false)))
        // setCabinetShow(new Map())
        setRows([...rows, { busbarShow: new Map(), cabinetShow: new Map(), busbar: [{}], cabinet: [{}] }]);
        console.log(rows)
    };
    const onDeleteRow = (index) => {
        setDeleteModalType('整行')
        setDeleteTip('是否确认删除选中整行柜体？')
        setDeleteModal(true);
        setDeleteRow(index)
    };


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
    const onAddBusbar = async () => {
        setEditBusbarModal(true)
        seModalAddOrEdit('add')
    }
    const onAddCabinet = async () => {
        setEditCabinetModal(true)
        seModalAddOrEdit('add')
    }
    const onCabinetOk = () => {
        setEditCabinetModal(false)
        if (modalAddOrEdit == 'add') {
            setCabinet(cabinet + 1)
            setCabinet([...cabinet, { text: '' }]);
        } else {

        }
    };
    const onBusbarShow = async (row, index) => {
        new Map(rows[row - 1].busbarShow.set(index, !rows[row - 1].busbarShow.get(index)));
        setBusbarShow(new Map(busbarShow.set(index, !busbarShow.get(index))));
        console.log(rows, '----setBusbarShow')
    }
    const onCabinetShow = async (row, index) => {
        setCabinetShow(new Map(cabinetShow.set(index, !cabinetShow.get(index))));
        new Map(rows[row - 1].cabinetShow.set(index, !rows[row - 1].cabinetShow.get(index)));
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
    const renderRows = () => {
        // return Array.from({ length: rows }, (_, index) => (
        //     {
        return rows?.map((row, index) => (
            <div key={index} className='row'>
                <div className='boxLeft'>
                    <div className='title'>第{index + 1}行  柜体</div>
                    <Button danger className='deleteRowBtn' onClick={() => onDeleteRow(index)}>删除整行</Button>
                </div>
                <div className='boxRight'>
                    <div className='boxRightTop'>
                        {renderAddBusbar(row, index + 1)}
                        <CustButtonT className='addBusbarBtn' ghost onClick={onAddBusbar} text="新增母线" />
                    </div>
                    <div className='boxRightBottom'>
                        {renderAddCabinet(row, index + 1)}
                        <CustButtonT className='addCabinetBtn' ghost onClick={onAddCabinet} text="新增柜体" />
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
            <div key={index} className={`busbar ${rowItem.busbarShow.get(index) ? 'flipped' : 'noFlipped'}`}>
                <div className='front' onClick={() => onBusbarShow(row, index)}>母线{row}-{index + 1}</div>
                <div className='back' onClick={() => onBusbarShow(row, index)}>
                    <Button className="edit" type='primary' onClick={onEditBusbar}>编辑</Button>
                    <Button className="delete" danger onClick={e => onDeleteBusbar(e, row, index)}>删除</Button>
                </div>
            </div>
        ));
    };

    const renderAddCabinet = (rowItem, row) => {
        // return Array.from({ length: cabinet }, (_, index) => (
        return cabinet?.map((item, index) => (
            <div key={index} className={`cabinet ${rowItem.cabinetShow.get(index) ? 'flipped' : 'noFlipped'}`}>
                <div className='front' onClick={() => onCabinetShow(row, index)}>
                    <span className='title1'>列{index + 1}</span>
                    <span className='title2'>柜体{index + 1}</span>
                </div>
                <div className='back' onClick={() => onCabinetShow(row, index)}>
                    <span className='title1'>列{index + 1}</span>
                    <span className='title2'>柜体{index + 1}</span>
                    <Button className="edit" type='primary' onClick={onEditCabinet}>编辑</Button>
                    <Button className="delete" danger onClick={onDeleteCabinet}>删除</Button>
                </div>
            </div>
        ));
    };
    return (
        <Pagecount pd="0" bgcolor="transparent">
            <Content>
                <div className='substationName'>1#正泰物联变电站</div>
                <div className='box'>
                    {renderRows()}
                </div>
                <CustButtonT className='addCupboard' ghost onClick={addNewRow} text="+ 新增行" />

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
                <CModal
                    open={editBusbarModal}
                    onOk={onBusbarOk}
                    onCancel={onCancel}
                    width={512}
                    closable={false}
                    mold="cust"
                    title={modalAddOrEdit == 'add' ? "新增母线" : "编辑母线"}
                    key="editBusbar"
                >
                    <Form form={form} preserve={false}>
                        <Form.Item label="母线名称" name="name"
                            normalize={value => value.trim()}
                            rules={[{
                                required: true,
                            }]}>
                            <Input allowClear />
                        </Form.Item>

                    </Form>
                </CModal>
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
                                    <Select options={styleList} onChange={onStylechange} />
                                </Form.Item>
                                <Form.Item label="柜体高度(cm)" name="remark" rules={[{ required: true }]}>
                                    <Input />
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
                                    <Select options={modelList} onChange={onModelchange} />
                                </Form.Item>
                                <Form.Item label="柜体类型" name="type" rules={[{ required: true }]}>
                                    <Select options={typeList} onChange={onTypechange} />
                                </Form.Item>
                                <Form.Item label="柜体宽度(cm)" name="name" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>

                    </Form>
                </CModal>
            </Content>
        </Pagecount >
    )
}