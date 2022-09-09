import React, {useState, useEffect} from 'react'
import style from './style.module.less';
import { SearchOutlined } from '@ant-design/icons';
import { Select,Input, Button, Form } from 'antd';

export default function Index({
    isexport = false,
    isset = false,
    isbuilding = false,
    isfloor = false,
    iscircle = false,
    isSearch = false,
    isenergy = false,
    istime = false,
}){
    const {Option} = Select
    const [form] = Form.useForm()

    return (
        <div className={style.header}>
            <Form layout='inline'
            style={{display:'flex',alignItems:'center'}}
            initialValues={{
                RegionId: null,
            }}>
                <Form.Item label='园区选择' name='RegionId' style={{marginLeft: 12}}>
                    <Select
                        placeholder="请选择园区"
                        size="middle"
                        style={{width: '320px'}}
                    >
                        <Option value="1">正泰物联全部园区</Option>
                        <Option value="2">正泰物联滨江园区</Option>
                        <Option value="3">正泰物联温州园区</Option>
                    </Select>
                </Form.Item>
                <div className={style.line}></div>
                <Form.Item label='' name='BuildingId'>
                    <Select
                    placeholder="请选择建筑物"
                    size="middle"
                    style={{width: '224px'}}
                    >
                        <Option value="0">全部建筑物</Option>
                        <Option value="1">研发1号楼</Option>
                        <Option value="2">研发2号楼</Option>
                        <Option value="3">行政楼</Option>
                    </Select>
                </Form.Item>
                <Form.Item label='' name='FloorId'>
                    <Select
                    placeholder="请选择楼层"
                    size="middle"
                    style={{width: '128px'}}
                    >
                        <Option value="0">全部楼层</Option>
                        <Option value="1">1F</Option>
                        <Option value="2">2F</Option>
                        <Option value="3">3F</Option>
                    </Select>
                </Form.Item>
                <div className={style.line}></div>
                <Form.Item label='周期' name='FloorId'>
                    <Select
                    placeholder="请选择周期"
                    size="middle"
                    style={{width: '96px'}}
                    >
                        <Option value="0">月度</Option>
                        <Option value="1">季度</Option>
                        <Option value="2">年度</Option>
                    </Select>
                </Form.Item>
                <div className={style.line}></div>
                <Form.Item label='' name='Input'>
                    <Input size="middle" placeholder='请输入房间号' style={{width:'260px'}} />
                    <Button type='primary' size="middle" icon={<SearchOutlined />}>查询</Button>
                </Form.Item>
            </Form>
        </div>
    )
}