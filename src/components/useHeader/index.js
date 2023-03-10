import React, { useState, useEffect } from 'react'
import style from './style.module.less';
import { SearchOutlined } from '@ant-design/icons';
import { Select, Input, Button, Form, Radio, DatePicker ,Space} from 'antd';
import dayjs from 'dayjs';
export default function Index({
    isexport = false,
    isset = false,
    ischangetab = false,
    isbuilding = false,
    isfloor = false,
    iscircle = false,
    isSearch = false,
    isenergy = false,
    istime = false,
}) {
    const { Option } = Select
    const [form] = Form.useForm()
    const onChange = ({ target: { value } }) => {
        console.log('radio checked', value);
        setValue(value);
    };
    const disabledDate = (current) => {
        return current && current < dayjs().endOf('day');
      };
    return (
        <div className={style.header}>
            <Form layout='inline'
                style={{ display: 'flex', alignItems: 'center' }}
                initialValues={{
                    RegionId: null,
                }}>
                <Form.Item label='园区选择' name='RegionId' style={{ marginLeft: 12 }}>
                    <Select
                        placeholder="请选择园区"
                        size="middle"
                        style={{ width: '320px' }}
                        defaultValue="1"
                    >
                        <Option value="1">正泰物联全部园区</Option>
                        <Option value="2">正泰物联滨江园区</Option>
                        <Option value="3">正泰物联温州园区</Option>
                    </Select>
                </Form.Item>
                {ischangetab ? <>
                    <Form.Item label='' name='energyId'>
                        <Radio.Group onChange={onChange} defaultValue="1" buttonStyle="solid">
                            <Radio.Button style={{ width: '96px', marginLeft: 16, textAlign: 'center', borderRadius: 16, borderTopRightRadius: 0, borderBottomRightRadius: 0 }} value="1">能耗</Radio.Button>
                            <Radio.Button style={{ width: '96px', textAlign: 'center', borderRadius: 16, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }} value="2">费用</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    <div className={style.date}>
                        <Form.Item label='' name='dateId'>
                            <Select
                                placeholder=""
                                size="middle"
                                style={{ width: '80px' }}
                                defaultValue="1"
                            >
                                <Option value="1">日</Option>
                                <Option value="2">月</Option>
                                <Option value="3">年</Option>
                            </Select>
                            
                        </Form.Item>
                        <Form.Item label='' name='date'>
                        <DatePicker
                                format="YYYY-MM-DD"
                                disabledDate={disabledDate}
                            />
                            </Form.Item>
                    </div>
                </> : null}
                {isbuilding ? <>
                    <div className={style.line}></div>
                    <Form.Item label='' name='BuildingId'>
                        <Select
                            placeholder="请选择建筑物"
                            size="middle"
                            style={{ width: '224px' }}
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
                            style={{ width: '128px' }}
                        >
                            <Option value="0">全部楼层</Option>
                            <Option value="1">1F</Option>
                            <Option value="2">2F</Option>
                            <Option value="3">3F</Option>
                        </Select>
                    </Form.Item>
                </> : null}

                {iscircle ? <>
                    <div className={style.line}></div>
                    <Form.Item label='周期' name='FloorId'>
                        <Select
                            placeholder="请选择周期"
                            size="middle"
                            style={{ width: '96px' }}
                        >
                            <Option value="0">月度</Option>
                            <Option value="1">季度</Option>
                            <Option value="2">年度</Option>
                        </Select>
                    </Form.Item>
                </> : null}

                {isSearch ? <>
                    <div className={style.line}></div>
                    <Form.Item label='' name='Input'>
                        <Input size="middle" placeholder='请输入房间号' style={{ width: '260px' }} />
                    </Form.Item>
                    <Button style={{ width: 96 }} type='primary' size="middle" icon={<SearchOutlined />}>查询</Button>
                </> : null}
            </Form>

        </div>
    )
}