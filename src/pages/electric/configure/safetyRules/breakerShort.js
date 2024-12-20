import React, { useState, useRef, useEffect } from "react";
import { DeviceRuler } from '@api/api.js'
import { useRequest } from "ahooks";
import { Input, Form, message, Spin, Upload, Modal, Table } from "antd";

import { Cspin } from "@com/comstyled"
import Mask from '@com/mask.jsx'
import UseTransfer from '@com/useTransfer'
import { useSelector } from 'react-redux'
import { selectProjectId } from '@redux/systemconfig.js'
export default function Index(props) {
    const projectId = useSelector(selectProjectId);
    const [messageApi, contextHolder] = message.useMessage();
    const {
        QueryBrokerShortcircuit,
        SetBrokerShortcircuit
    } = DeviceRuler
    const messageContent = (type, content) => {
        console.log(type, content, messageApi)
        messageApi.open({
            type,
            content
        })
        console.log(type, content, messageApi)
    }
    //transfer
    const mainTable = []
    const [subTable, setSubTable] = useState([])
    const [unknownTable, setUnknownTable] = useState([])
    const getData = () => {
        return QueryBrokerShortcircuit(projectId).then(res => {
            let { success, data } = res
            if (success && data) {
                setSubTable(res.data.used)
                setUnknownTable(res.data.unused)
            } else {
                messageContent('error', res.errMsg)
            }
        })
    }
    const { run: queryData } = useRequest(getData, {
        manual: true,
    })
    useEffect(() => {
        queryData()
    }, [])

    const transferTitle = {
        mainTitle: '',
        subTitle: '已配置断路器',
        unknownTitle: '未配置断路器'
    }
    const columns = [
        {
            align: 'center',
            title: '设备编号',
            dataIndex: 'sn',
            key: 'sn'
        }, {
            align: 'center',
            title: '设备名称',
            dataIndex: 'name',
            key: 'name'
        }, {
            align: 'center',
            title: '安装地址',
            dataIndex: 'address',
            key: 'address'
        }, {
            align: 'center',
            title: '设备型号',
            dataIndex: 'category',
            key: 'category'
        }
    ]


    const getCloseValue = params => {
        setTransTag(params)
        props.getValues(params)
    }

    const getSaveValue = params => {
        let arr = [];
        let setparams = {}
        if (params.subData.length > 0) {
            params.subData.map(item => {
                arr.push(item.sn)
            })
        }
        setparams = {
            projectId,
            "sns": arr
        }
        SetBrokerShortcircuit(setparams).then(res => {
            if (res.success) {
                getData()
                messageContent('success', '设备配置成功!')
            } else {
                messageContent('error', res.errMsg || '设备配置保存失败，请重试！')

            }
        })
    }
    return (
        <Mask task={false} maskBack={false}>
            {contextHolder}
            <UseTransfer maskBack={false} transferTitle={transferTitle} columns={columns} mainTable={mainTable} subTable={subTable} unknownTable={unknownTable} saveValue={getSaveValue} closeValue={getCloseValue}></UseTransfer>
        </Mask>
    )
}