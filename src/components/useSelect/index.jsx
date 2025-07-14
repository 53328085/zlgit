import React from 'react'
import { Form, Button, Select } from 'antd'
import selectStyle from './selectstyle.module.less'
import PropTypes from 'prop-types'

export default function Index({
    isexports = true,
    isset = true,
    isplan = false,
    ...otherprops
}) {
    const { Item } = Form
    const { Option } = Select
    return (
        <Form
            layout='inline'
            className={selectStyle.selectForm}
            initialValues={{
                RegionId: null,
                EnergyType: null,
                Time: null,
                Plan: "1",
            }}
        >
            <Form.Item label="园区选择" name="RegionId">
                <Select style={{ width: 320 }} allowClear>
                    <Option value="1">正泰园区</Option>
                    <Option value="2">滨江园区</Option>
                </Select>
            </Form.Item>
            <div className={selectStyle.line}></div>
            <Item label="能源类型" name="EnergyType">
                <Select style={{ width: 120 }} allowClear>
                    <Option value="1">水</Option>
                    <Option value="2">电</Option>
                    <Option value="3">燃气</Option>
                </Select>
            </Item>
            <div className={selectStyle.line}></div>
            {
                isplan ? <>
                    <Item name="Plan">
                        <Select style={{ width: 120 }} allowClear>
                            <Option value="1">全部班次</Option>
                            <Option value="2">早班</Option>
                            <Option value="3">中班</Option>
                            <Option value="4">晚班</Option>
                        </Select>
                    </Item> <div className={selectStyle.line}></div>
                </> : null

            }

            <Item label="时间" name="Time">
                <Select style={{ width: 120 }} allowClear>
                    <Option value="1">日</Option>
                    <Option value="2">月</Option>
                    <Option value="3">年</Option>
                </Select>
            </Item>
            <div className={selectStyle.line}></div>

            <div className={selectStyle.btnStyle}>
                {
                    isexports ? <Item style={!isset ? { marginRight: 0 } : {}}>
                        <Button style={{ width: 96 }}>导出</Button>
                    </Item> : null
                }
                {isset ? <Item style={{ marginRight: 0 }}>
                    <Button style={{ width: 96 }}>设置</Button>
                </Item> : null}
            </div>
        </Form>


    )

}
