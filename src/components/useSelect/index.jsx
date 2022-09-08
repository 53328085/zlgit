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
                Plan: null,
            }} >
            <Item label="园区选择" name="RegionId">
                <Select defaultValue="1" style={{ width: 320 }} allowClear>
                    <Option value="1">正泰园区</Option>
                    <Option value="2">滨江园区</Option>
                </Select>
            </Item>
            <Item label="能源类型" name="EnergyType">
                <Select defaultValue="1" style={{ width: 120 }} allowClear>
                    <Option value="1">水</Option>
                    <Option value="2">电</Option>
                    <Option value="3">燃气</Option>
                </Select>
            </Item>
            <Item label="时间" name="Time">
                <Select defaultValue="1" style={{ width: 120 }} allowClear>
                    <Option value="1">日</Option>
                    <Option value="2">月</Option>
                    <Option value="3">年</Option>
                </Select>
            </Item>
            {
               isplan?  <Item  name="Plan">
                 <Select defaultValue="1" style={{ width: 120 }} allowClear>
                     <Option value="1">全部班次</Option>
                     <Option value="2">早班</Option>
                     <Option value="3">中班</Option>
                     <Option value="4">晚班</Option>
                 </Select>
             </Item>:null
            }
           
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
