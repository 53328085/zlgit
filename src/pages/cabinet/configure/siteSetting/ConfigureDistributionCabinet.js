import React, { useState, useEffect } from 'react'
import styled, { css } from "styled-components";
import { CustLink, CustButtonT } from '@com/useButton'
import CModal from '@com/useModal'
import { Button, Form, Input, Space, message, Typography, Divider, Modal, Timeline } from 'antd';
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
    const [rows, setRows] = useState(1);
    const [busbar, setBusbar] = useState(1);
    // const [busbarShow, setBusbarShow] = useState(false);
    const [busbarShow, setBusbarShow] = useState(new Map());
    const [cabinet, setCabinet] = useState(1);
    const [cabinetShow, setCabinetShow] = useState(new Map());
    const [deleteTip, setDeleteTip] = useState(1);
    //删除弹窗
    const [deleteModal, setDeleteModal] = useState(false);
    //编辑母线弹窗
    const [editBusbarModal, setEditBusbarModal] = useState(false);
    const [form] = Form.useForm()
    const addNewRow = () => {
        setRows(rows + 1);
    };
    const onDeleteRow = () => {
        setDeleteTip('是否确认删除选中整行柜体？')
        setDeleteModal(true);
    };


    //母线编辑删除----开始
    const onEditBusbar = (event) => {
        event.stopPropagation(); // 阻止点击事件冒泡到外层div
        setEditBusbarModal(true)
    };
    const onDeleteBusbar = (event) => {
        event.stopPropagation(); // 阻止点击事件冒泡到外层div
        setDeleteModal(true);
        setDeleteTip('是否确认删除母线？')
    };
    //母线编辑删除----结束

    //柜体编辑删除----开始
    const onEditCabinet = (event) => {
        event.stopPropagation(); // 阻止点击事件冒泡到外层div
        setEditBusbarModal(true)
    };
    const onDeleteCabinet = (event) => {
        event.stopPropagation(); // 阻止点击事件冒泡到外层div
        setDeleteModal(true);
        setDeleteTip('是否确认删除选中的柜体？')
    };
    //柜体编辑删除----结束

    const editBusbareOk = () => {
        setEditBusbarModal(false)
    };
    const onAddBusbar = async () => {
        setBusbar(busbar + 1)
    }
    const onAddCabinet = async () => {
        setCabinet(cabinet + 1)
    }
    const onBusbarShow = async (index) => {
        event.stopPropagation(); // 阻止点击事件冒泡到外层div
        setBusbarShow(new Map(busbarShow.set(index, !busbarShow.get(index))));
        console.log(busbarShow, '----setBusbarShow')
    }
    const onCabinetShow = async (index) => {
        setCabinetShow(new Map(cabinetShow.set(index, !cabinetShow.get(index))));
    }

    //删除确认
    const deleteOk = async () => {
        setRows(rows - 1);
        setDeleteModal(false);
    }

    //删除取消
    const onCancel = () => {
        setDeleteModal(false);
        setEditBusbarModal(false)
    };
    const renderRows = () => {
        return Array.from({ length: rows }, (_, index) => (
            <div key={index} className='row'>
                <div className='boxLeft'>
                    <div className='title'>第{index + 1}行  柜体</div>
                    <Button danger className='deleteRowBtn' onClick={onDeleteRow}>删除整行</Button>
                </div>
                <div className='boxRight'>
                    <div className='boxRightTop'>
                        {renderAddBusbar(index + 1)}
                        <CustButtonT className='addBusbarBtn' ghost onClick={onAddBusbar} text="新增母线" />
                    </div>
                    <div className='boxRightBottom'>
                        {renderAddCabinet(index + 1)}
                        <CustButtonT className='addCabinetBtn' ghost onClick={onAddCabinet} text="新增柜体" />
                    </div>
                </div>
            </div>
        ));
    };
    const renderAddBusbar = (row) => {
        return Array.from({ length: busbar }, (_, index) => (
            <div key={index} className={`busbar ${busbarShow.get(index) ? 'flipped' : 'noFlipped'}`}>
                <div className='front' onClick={() => onBusbarShow(index)}>母线{row}-{index + 1}</div>
                <div className='back' onClick={() => onBusbarShow(index)}>
                    <Button className="edit" type='primary' onClick={onEditBusbar}>编辑</Button>
                    <Button className="delete" danger onClick={onDeleteBusbar}>删除</Button>
                </div>
            </div>
        ));
    };

    const renderAddCabinet = (row) => {
        return Array.from({ length: cabinet }, (_, index) => (
            <div key={index} className={`cabinet ${cabinetShow.get(index) ? 'flipped' : 'noFlipped'}`}>
                <div className='front' onClick={() => onCabinetShow(index)}>
                    <span className='title1'>列{index + 1}</span>
                    <span className='title2'>柜体{index + 1}</span>
                </div>
                <div className='back' onClick={() => onCabinetShow(index)}>
                    <span className='title1'>列{index + 1}</span>
                    <span className='title2'>柜体{index + 1}</span>
                    <Button className="edit" type='primary' onClick={onEditCabinet}>编辑</Button>
                    <Button className="delete" danger onClick={onDeleteCabinet}>删除</Button>
                </div>
            </div>
        ));
    };
    return (
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
                onOk={editBusbareOk}
                onCancel={onCancel}
                width={512}
                closable={false}
                mold="cust"
                title="编辑母线"
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
        </Content>
    )
}