import React from 'react'
import { Form, Button, Select } from 'antd'
import selectStyle from './selectstyle.module.less'
import PropTypes from 'prop-types'

export default function Index({
    isexports = true,
    isset = true,
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
                Time: null
            }} >
            <Item label="园区选择" name="RegionId">
                <Select defaultValue="lucy" style={{ width: 320 }} allowClear>
                    <Option value="lucy">正泰园区</Option>
                    <Option value="lucy">滨江园区</Option>
                </Select>
            </Item>
            <Item label="能源类型" name="EnergyType">
                <Select defaultValue="lucy" style={{ width: 120 }} allowClear>
                    <Option value="lucy">水</Option>
                    <Option value="lucy">电</Option>
                    <Option value="lucy">燃气</Option>
                </Select>
            </Item>
            <Item label="时间" name="Time">
                <Select defaultValue="lucy" style={{ width: 120 }} allowClear>
                    <Option value="lucy">日</Option>
                    <Option value="lucy">月</Option>
                    <Option value="lucy">年</Option>
                </Select>
            </Item>
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
