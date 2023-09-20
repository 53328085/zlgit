import React, { useState, useEffect } from 'react'
import { useRequest } from 'ahooks';
import style from './style.module.less';
import { message, Empty } from 'antd';
import { Sankey } from '@ant-design/plots';
import { useSelector } from 'react-redux'
import { selectProjectId } from '@redux/systemconfig.js'
import { EnergyFlowRuntime } from '@api/api.js'
import kong from '@imgs/empty.png'

export default function Index(props) {
    const headerData = props.headerData
    const [messageApi, contextHolder] = message.useMessage();
    const messageContent = (type, content) => {
        messageApi.open({
            type,
            content,
        })
    }
    const projectId = useSelector(selectProjectId);
    const { queryComprehensive, queryElectric, queryWater, queryGas } = EnergyFlowRuntime

    //获取数据
    //综合能耗
    const getComprehensive = () => {
        let { type, date, areaId } = props.headerData
        let dateType = type == 'year' ? 3 : type == 'month' ? 2 : 1
        queryComprehensive(projectId, dateType, date, [areaId]).then(res => {
            if (res.success) {
                if (res.data) {
                    setData(res.data.link)
                } else {
                    setData([])
                }
            } else {
                messageContent('error', res.errMsg)
            }
        })
    }
    const { run: runCompre } = useRequest(getComprehensive, {
        manual: true
    })
    //电
    const getElectric = () => {
        let { type, date, areaId } = props.headerData
        let dateType = type == 'year' ? 3 : type == 'month' ? 2 : 1
        queryElectric(projectId, dateType, date, [areaId]).then(res => {
            if (res.success) {
                if (res.data) {
                    setData(res.data.link)
                } else {
                    setData([])
                }
            } else {
                messageContent('error', res.errMsg)
            }
        })
    }
    const { run: runElectric } = useRequest(getElectric, {
        manual: true
    })
    //水
    const getWater = () => {
        let { type, date, areaId } = props.headerData
        let dateType = type == 'year' ? 3 : type == 'month' ? 2 : 1
        queryWater(projectId, dateType, date, [areaId]).then(res => {
            if (res.success) {
                if (res.data) {
                    setData(res.data.link)
                } else {
                    setData([])
                }
            } else {
                messageContent('error', res.errMsg)
            }
        })
    }
    const { run: runWater } = useRequest(getWater, {
        manual: true
    })
    //燃气
    const getGas = () => {
        let { type, date, areaId } = headerData
        let dateType = type == 'year' ? 3 : type == 'month' ? 2 : 1
        queryGas(projectId, dateType, date, [areaId]).then(res => {
            if (res.success) {
                if (res.data) {
                    setData(res.data.link)
                } else {
                    setData([])
                }
            } else {
                messageContent('error', res.errMsg)
            }
        })
    }
    const { run: runGas } = useRequest(getGas, {
        manual: true
    })
    useEffect(() => {
        if (headerData.areaId == 0) return;
        if (headerData.energyType == 0) {
            runCompre()
        }
        if (headerData.energyType == 1) {
            runElectric()
        }
        if (headerData.energyType == 2) {
            runWater()
        }
        if (headerData.energyType == 3) {
            runGas()
        }
    }, [props.headerData])

    //图表数据
    const [data, setData] = useState([])
    const config = {
        data: data,
        sourceField: 'source',
        targetField: 'target',
        weightField: 'value',
        nodeWidthRatio: 0.01,
        nodePaddingRatio: 0.03,
    };
    return (
        <div>
            {contextHolder}
            {data.length == 0 ? <img src={kong} style={{ marginTop: 150, marginLeft: 700 }}></img> : <Sankey style={{ width: '1400px', height: 650, marginLeft: '60px' }} {...config} />}
        </div>
    )

}