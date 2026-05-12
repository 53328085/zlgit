import {ReactComponent as AllocationIcon} from './icon/allocation.svg'

/// 1  电表
/// 2  冷水表
/// 3  燃气表
/// 4  传感器
/// 5  变压器
/// 6  视频
/// 7  热水表
/// 8  蒸汽表
/// 9  电炭表
/// 10 燃油表
/// 11 储能设备
/// 12 断路器
/// 13 触点测温
/// 14 光纤测温
/// 15 直流屏
/// 16 出线柜
/// 17 电能质量分析仪
/// 18 流量计
/// 19 光伏设备
/// 20 微机保护
/// 21 空调
/// 22 路灯控制器

import { Flex } from "antd"

/// 23 智能控制
export function getTabLabelByType(type) {
    switch (type) {
        case 1:
            return '电表'
        case 2:
            return '冷水表'
        case 3:
            return '燃气表'
        case 4:
            return '传感器'
        case 5:
            return '变压器'
        case 6:
            return '视频'
        case 7:
            return '热水表'
        case 8:
            return '蒸汽表'
        case 9:
            return '电炭表'
        case 10:
            return '燃油表'
        case 11:
            return '储能设备'
        case 12:
            return '断路器'
        case 13:
            return '触点测温'
        case 14:
            return '光纤测温'
        case 15:
            return '直流屏'
        case 16:
            return '出线柜'
        case 17:
            return '电能质量分析仪'
        case 18:
            return '流量计'
        case 19:
            return '光伏设备'
        case 20:
            return '微机保护'
        case 21:
            return '空调'
        case 22:
            return '路灯控制器'
        case 23:
            return '智能控制'
        default:
            return '其他'
    }
}

export function getAllocationTypLabel(type) {
    switch (type) {
        case 1:
            return '面积'
        case 2:
            return '人数'
        case 3:
            return '产值'
        default:
            return '产量'
    }
}

export function getTableColumnsByType(type) {
    switch (type) {
        //电表
        case '1':
        //冷水表
        case '2':
        //燃气表
        case '3':
        //传感器
        case '4':
        //变压器
        case '5':
        //热水表 
        case '7':
        //蒸汽表
        case '8':
        //断路器
        case '12':
        //流量计
        case '18':
            return [
                {
                    title: '设备编号',
                    dataIndex: 'sn',
                    key: 'sn',
                    render: (text, record) => {
                        if (text) {
                            return (
                                <Flex gap={4} align="center">
                                    <AllocationIcon />
                                    {text}
                                </Flex>
                            )
                        } else {
                            return text
                        }
                    },
                },
                {
                    title: '设备名称',
                    dataIndex: 'name',
                    key: 'name',
                },
                {
                    title: '分摊类型',
                    dataIndex: 'allocationType',
                    key: 'allocationType',
                    render: (text) => {
                        return getAllocationTypLabel(text)
                    }
                },
                {
                    title: '分摊比例%',
                    dataIndex: 'areaRatio',
                    key: 'areaRatio',
                },
                {
                    title: '安装地址',
                    dataIndex: 'address',
                    key: 'address',
                },
            ]
        default:
            return [
                {
                    title: '设备编号',
                    dataIndex: 'sn',
                    key: 'sn',
                },
                {
                    title: '设备名称',
                    dataIndex: 'name',
                    key: 'name',
                },
                {
                    title: '安装地址',
                    dataIndex: 'address',
                    key: 'address',
                },
            ]
    }
}