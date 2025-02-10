import React, { useState, useEffect } from 'react'
import styled, { css } from "styled-components";
import { Button, Space, message, Typography, Divider, Modal, Timeline } from 'antd';
import { CustLink, CustButtonT } from '@com/useButton'
import Usetable from '@com/useTable'
import { selectProjectId } from '@redux/systemconfig.js'
import Mask from '@com/mask.jsx'
import UseTransfer from "./transfer.js";
import { useRequest } from "ahooks";
import { useSelector } from 'react-redux'
import { Monitoring } from "@api/api.js";
import CModal from '@com/useModal'
const Content = styled.div`
width:1200px;
margin: 50px auto;
&&{
   .addDevice{
    margin-bottom: 32px;
    width: 140px;
   }
}
`

export default function Index() {
    const [siteDevicesfData, setSiteDevicesfData] = useState([])

    const columns = [
        {
            align: 'center',
            title: '序号',
            dataIndex: 'index',
            render: (text, recoder, index) => <span>{index + 1}</span>
        },
        {
            align: 'center',
            title: '设备名称',
            dataIndex: 'name',
        }, {
            align: 'center',
            title: '设备编号',
            dataIndex: 'sn',
        }, {
            align: 'center',
            title: '设备型号',
            dataIndex: 'category',
        }, {
            align: 'center',
            title: '设备类型',
            dataIndex: 'deviceType',
        }, {
            align: 'center',
            title: '安装位置',
            dataIndex: 'address',
        },
        {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <Space size="middle">
                    <CustLink type="danger" onClick={() => onDeleteDevice(record)} text="delete" />
                </Space>
            ),
        },
    ];
    //删除告警类型弹窗
    const [deleteModal, setDeleteModal] = useState(false);
    const [selecDeltId, setSelectDelId] = useState(0)
    const onDeleteDevice = async (record) => {
        setSelectDelId(record.id)
        setDeleteModal(true)
    }

    //删除站点确认
    const deleteOk = async () => {
        // let res = await DeleteSite(projectId, selectId)
        // if (res.success) {
        //     message.success('站点删除成功!')
        //     try {
        //         let current = Math.ceil((totalItem.current - 1) / PageSize) < curPage.current

        //         if (current) {
        //             let values = form.getFieldsValue()
        //             run({ current: curPage.current - 1, pageSize: PageSize }, values)
        //         } else {
        //             refresh()
        //         }

        //     } catch (error) {

        //     }
        // } else {
        //     message.error(res.errMsg)
        // }
        setDeleteModal(false);
    };

    //删除站点取消
    const deleteCancel = () => {
        setDeleteModal(false);
    };
    //添加站点设备弹窗代码-----（开始）
    const {
        ComparativeAnalysis: { QueryCompareDevice },
    } = Monitoring;
    const projectId = useSelector(selectProjectId);
    const [transTag, setTransTag] = useState(false)
    const [transferTitle, setTransferTitle] = useState({});
    const [subTable, setSubTable] = useState([])
    const [unknownTable, setUnknownTable] = useState([])

    //未选设备
    const addColumns = [
        {
            align: 'center',
            title: '设备编号',
            dataIndex: 'sn',
            key: 'sn'
        }, {
            align: 'center',
            title: '设备名称',
            dataIndex: 'name',
            key: 'deviceName'
        }, {
            align: 'center',
            title: '安装地址',
            dataIndex: 'address',
            key: 'address'
        }
    ]
    const onAddDevice = async () => {
        setTransferTitle({
            subTitle: "选择站点设备",
            unknownTitle: "未选中的设备",
        });
        const resp = await QueryCompareDevice(projectId, 0, "");
        if (resp.success && Array.isArray(resp.data)) {
            setUnknownTable(resp.data || []);

        } else {
            message.error(resp.errMsg);
        }
        setTransTag(true);
    }
    const getCloseValue = params => {
        setTransTag(false)
    }
    const getSaveValue = (values) => {
        let snData = [];
        console.log(values);

        // values.subData.map((item) => {
        //   snData.push(item.sn);
        // });
        // state.snGroup = snData;
    };
    //添加站点设备弹窗代码-----（结束）
    useEffect(() => {
        let list = [{
            name: "烟感传感器1",
            sn: '43t547658',
            category: 'WSD-001',
            deviceType: 2,
            address: "2#正泰物联变电站",
        }, {
            name: "温湿度传感器",
            sn: '43t547658',
            category: 'WSD-001',
            deviceType: 2,
            address: "2#正泰物联变电站",
        }]
        setSiteDevicesfData(list)
    }, [])
    return (
        <Content>
            <CustButtonT className='addDevice' ghost onClick={onAddDevice} text="添加站点设备" />
            <Usetable bordered columns={columns} rowKey='id' dataSource={siteDevicesfData} ></Usetable>

            <Mask task={transTag}>
                <UseTransfer transferTitle={transferTitle} columns={addColumns} subTable={subTable} unknownTable={unknownTable} saveValue={getSaveValue} closeValue={getCloseValue} modalName={'添加站点设备'}></UseTransfer>
            </Mask>
            <CModal
                open={deleteModal}
                onOk={deleteOk}
                onCancel={deleteCancel}
                width={512}
                closable={false}
                type="warn"
                mold="cust"
                title="删除提示"
                key="ma"
            >
                是否确认删除该设备？
            </CModal>
        </Content>
    )
}