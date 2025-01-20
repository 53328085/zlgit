import React, { useRef, useState, useEffect, useCallback } from 'react'
import { Button, Space, message, Typography, Divider, Modal, Timeline } from 'antd';
import Draggable from "react-draggable";
import CModal from "@com/useModal"
import { selectOneLevelDefaultId, adaptation } from '@redux/systemconfig.js'
import Pagecount from '@com/pagecontent'
import Titlelayout from '@com/titlelayout';
import { ExportExcel, CustButton, ImportConfigurationFile, CustLink } from '@com/useButton'
import { useTranslation } from 'react-i18next'
import Usetable from '@com/useTable'
import { useAntdTable } from 'ahooks';
import styled, { css } from 'styled-components';
import style from './style.module.less'
import { useSelector } from 'react-redux'
import { MultImport, DeleteModal, ErrorMessage } from './modalCom'

import SetUpSubstation from './SetUpSubstation.js'
import AddSiteDevices from './AddSiteDevices.js'
import ConfigureDistributionCabinet from './ConfigureDistributionCabinet.js'
import AddCabinetEquipment from './AddCabinetEquipment.js'
import ConfigurationPreview from './ConfigurationPreview.js'

const { Link, Text } = Typography
const TimelineBox = styled.div`
display: flex;
justify-content: space-between;
align-items: center;
padding: 20px;
/* 可选：添加分隔线样式 */
&&{
    .exit{
    font-size: 15px;
    width: 130px;
    height:38px;
    border-radius: 80px;
    }
.timeline-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
   .info{
    width: 140px;
    height:38px;
    line-height: 38px;
    display: flex;
    align-items: center;
    border-radius: 80px;
    padding:0px 5px;
    color:#999999;
    background:#fff;
    border:1px solid #999999;
    
  .marker {
    width: 30px;
    height: 30px;
    line-height: 30px;
    font-size: 24px;
    text-align: center;
    color: #fff;
    background-color: #999999;
    border-radius: 50%;
  }
  .content {
    font-size: 15px;
    margin-left: 5px;
  }
}
   
   .infoWrite{
    width: 140px;
    height:38px;
    line-height: 38px;
    display: flex;
    align-items: center;
    border-radius: 80px;
    padding:0px 5px;
    color:${props => props.theme.primaryderived || '#237AE4'};
    background:${props => props.theme.asiderbgcolorA || '#e5effc'};
    border:1px solid  ${props => props.theme.primaryderived || '#237AE4'};
    // color: #0066CC;
    // background-color: rgba(35, 122, 228, 0.117647058823529);
    // border:1px solid rgba(35, 122, 228, 1);
    
  .marker {
    width: 30px;
    height: 30px;
    line-height: 30px;
    font-size: 24px;
    text-align: center;
    color: #fff;
    background-color: ${props => props.theme.primaryderived || '#237AE4'};
    //background-color: rgba(35, 122, 228, 1);
    border-radius: 50%;
  }
  
  .content {
    font-size: 15px;
    margin-left: 5px;
  }
}
   .dot{
    border:1px dashed #999999;
    width: 80px;
    margin: 0px 10px;
   }
 
}
`
export default function Index() {
    const { t } = useTranslation(["button", "overview"])
    const tableRef = useRef()
    const setRef = useRef()
    const modalImportRef = useRef() //导入Ref
    const modalDelRef = useRef() //删除Ref
    // const { laptop } = useSelector(adaptation)
    const [messageApi, contextHolder] = message.useMessage();
    const getTableData = ({ current, pageSize }) => {
    }
    const onExport = useCallback(async () => {
        // console.log(total)
        // return getTableData({ current: 1, pageSize: total })
    }, [])
    const { tableProps, refresh: queryTable } = useAntdTable(getTableData, {
        // manual:true
        // refreshDeps: [roomId, projectId],
        // defaultPageSize: 14
    })
    const [siteSettinfData, setSiteSettinfData] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [timeStatus, setTimeStatus] = useState(1);
    const [disabled, setDisabled] = useState(true)
    const draggleRef = useRef(null)
    const [bounds, setBounds] = useState({
        left: 0,
        top: 0,
        bottom: 0,
        right: 0
    })
    const onStart = (_event, uiData) => {
        const { clientWidth, clientHeight } = window.document.documentElement;
        const targetRect = draggleRef.current?.getBoundingClientRect();
        if (!targetRect) {
            return;
        }
        setBounds({
            left: -targetRect.left + uiData.x,
            right: clientWidth - (targetRect.right - uiData.x),
            top: -targetRect.top + uiData.y,
            bottom: clientHeight - (targetRect.bottom - uiData.y),
        });
    };
    const columns = [
        {
            align: 'center',
            title: '序号',
            dataIndex: 'index',
            render: (text, recoder, index) => <span>{index + 1}</span>
        },
        {
            align: 'center',
            title: '站点地址',
            dataIndex: 'address',
        }, {
            align: 'center',
            title: '站点容量',
            dataIndex: 'rong',
        }, {
            align: 'center',
            title: '电压等级',
            dataIndex: 'dengJi',
        }, {
            align: 'center',
            title: '变压器数量',
            dataIndex: 'bianNum',
        }, {
            align: 'center',
            title: '进线柜数量',
            dataIndex: 'jinBum',
        }, {
            align: 'center',
            title: '补偿柜数量',
            dataIndex: 'buNum',
        }, {
            align: 'center',
            title: '馈线柜数量',
            dataIndex: 'kuiNum',
        }, {
            align: 'center',
            title: '联络柜数量',
            dataIndex: 'lianNum',
        },
        {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <Space size="middle">
                    <Link underline onClick={() => edit(record)}>{t("button:edit")}</Link>
                    <Link underline onClick={() => setAll(record)}>{t("button:export")}</Link>
                    <CustLink type="danger" onClick={() => onDelete(record)} text="delete" />
                </Space>
            ),
        },
    ];
    const timeLine = [
        { content: '设置变电站' },
        { content: '添加站点设备' },
        { content: '配置配电柜' },
        { content: '添加柜体设备' },
        { content: '配置预览' },
    ];
    const edit = () => {
        setTimeStatus(1)
        setIsModalOpen(true);
    }
    const onDelete = () => {
        modalDelRef?.current?.onOpen()
    }

    //确认删除
    const delOk = async () => {
        modalDelRef?.current?.onCancel()
    }
    //打开批量导入窗口
    const siteExport = () => {
        modalImportRef?.current?.onOpen()
    }

    const uploadprops = {
        maxCount: 1,
        beforeUpload(file, fileList) {
            console.log(file, fileList)
            flies = [...fileList]
            return false
        }
    };
    //确认导入
    const onImportOk = async () => {
        modalImportRef.current.onCancel()
    }
    const ImportProps = {
        modalImportRef,
        width: 560,
        link: '/deviceExcel/gateway.xlsx',
        name: '变电站导入',
        uploadprops,
        onOk: onImportOk
    }

    const addClick = () => {
        setTimeStatus(1)
        setIsModalOpen(true);
    }
    const onPreviousStep = () => {
        console.log(timeStatus)
        setTimeStatus(timeStatus - 1)
    }
    const onNextStep = (timeStatus) => {
        console.log(timeStatus)
        setTimeStatus(timeStatus + 1)
    }
    const onFinish = () => {

        setIsModalOpen(false);
    }
    const onExit = () => {

        setIsModalOpen(false);
    }
    useEffect(() => {
        let list = [{
            address: "1#正泰物联变电站",
            rong: "2500 KVA",
            dengJi: 2,
            bianNum: 3,
            jinBum: 4,
            buNum: 8,
            kuiNum: 2,
            lianNum: 9
        }, {
            address: "2#正泰物联变电站",
            rong: "2500 KVA",
            dengJi: 2,
            bianNum: 3,
            jinBum: 4,
            buNum: 8,
            kuiNum: 2,
            lianNum: 9
        }]
        setSiteSettinfData(list)
    }, [])
    const Title = (
        <div style={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
            <span>{t("overview:SiteSettings")}</span>
            <Space>
                <CustButton onClick={() => addClick()}>
                    {t("button:mnuallyAdd")}
                </CustButton>
                <ImportConfigurationFile onClick={() => siteExport()} />
                {/* <ExportExcel tb={tableRef} /> */}
                {/* <CustButton onClick={() => settingClick()}>
                    {t("button:addEquipment")}
                </CustButton> */}
            </Space>
        </div>
    )

    return (
        <Pagecount showserach={false} custserach pd="0px" >
            {contextHolder}
            <Titlelayout title={Title} layout="flex" dr="column">
                <Divider style={{ margin: "16px 0" }} />
                <Usetable ref={tableRef} bordered columns={columns} rowKey='id' dataSource={siteSettinfData} sheetName="变压器管理" onExport={onExport} ></Usetable>
                <Modal
                    open={isModalOpen}
                    closable={false}
                    width={1400}
                    className={style.setModal}
                    title={
                        <Titlelayout title={t("overview:SiteSettings")}
                            style={{ cursor: 'move', height: "30px" }}
                            bordered={'none'}
                            onMouseOver={() => {
                                if (disabled) {
                                    setDisabled(false)
                                }
                            }}
                            onMouseOut={() => {
                                setDisabled(true)
                            }}
                        ></Titlelayout>}
                    modalRender={(modal) => (
                        <Draggable
                            disabled={disabled}
                            bounds={bounds}
                            onStart={(event, uiData) => onStart(event, uiData)}
                        >
                            <div ref={draggleRef}>{modal}</div>
                        </Draggable>
                    )}
                    destroyOnClose

                    footer={timeStatus == 1 ? [
                        <Button key="submit" style={{ width: 160 }} type="primary" onClick={() => onNextStep(timeStatus)}>
                            下一步
                        </Button>
                    ] : timeStatus > 1 && timeStatus < 5 ? [
                        <Button key="back" style={{ width: 160 }} onClick={() => onPreviousStep(timeStatus)}>
                            上一步
                        </Button>,
                        <Button key="submit" style={{ width: 160 }} type="primary" onClick={() => onNextStep(timeStatus)}>
                            下一步
                        </Button>
                    ] : [
                        <Button key="back" style={{ width: 160 }} onClick={() => onPreviousStep(timeStatus)}>
                            上一步
                        </Button>,
                        <Button
                            key="link" style={{ width: 160 }}
                            type="primary"
                            onClick={onFinish}
                        >
                            完成配置
                        </Button>,
                    ]}
                >
                    <TimelineBox>
                        <Button danger className='exit' onClick={onExit}>退出配置</Button>
                        <Divider style={{ margin: "0 16px", height: 38 }} type="vertical" />
                        {timeLine.map((item, index) => (
                            <div className="timeline-item" key={index}>
                                <div className={index < timeStatus ? "infoWrite" : "info"}>
                                    <div className="marker">{index + 1}</div>
                                    <div className="content">
                                        <p>{item.content}</p>
                                    </div>
                                </div>
                                {index != 4 ? <div className="dot"></div> : null}
                            </div>
                        ))}
                    </TimelineBox>
                    {timeStatus == 1 ? <SetUpSubstation></SetUpSubstation> :
                        timeStatus == 2 ? <AddSiteDevices></AddSiteDevices> :
                            timeStatus == 3 ? <ConfigureDistributionCabinet></ConfigureDistributionCabinet> :
                                timeStatus == 4 ? <AddCabinetEquipment></AddCabinetEquipment> :
                                    timeStatus == 5 ? <ConfigurationPreview></ConfigurationPreview> : null}
                </Modal>
                <MultImport {...ImportProps}></MultImport>
                <DeleteModal DelModalRef={modalDelRef} name="删除站点" content="是否确认删除站点？" onOk={delOk}></DeleteModal>
            </Titlelayout>
        </Pagecount >
    )
}