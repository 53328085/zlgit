import React, { useEffect, useRef, useState } from 'react'
import { useReactive, useAntdTable } from 'ahooks'
import { useSelector } from 'react-redux'
import { selectProjectId,prodeviceType } from "@redux/systemconfig";
import UseTable from '@com/useTable'
import { Button, Space, message, TimePicker, Divider, Table, Form, Input, DatePicker } from 'antd';
import styled from 'styled-components'
import Pagecount from '@com/pagecontent'
import Titlelayout from '@com/titlelayout'
import { Serach } from "@com/comstyled";
import { Monitoring } from '@api/api.js'
import CModal from '@com/useModal'
import moment from 'moment'

export default function Index() {
    const projectId = useSelector(selectProjectId)
    const deviceTypes = useSelector(prodeviceType)
    console.log(deviceTypes)
    const { Runtime: { GetInpuList, ManualInput } } = Monitoring;
    const tbref = useRef()
    const ref = useRef()
    const [form] = Form.useForm()
    const state = useReactive({
        searchInput: '',
        selectSN: ''
    })

    const HeaderDiv = styled.div`
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #515151;
    `
    const columns = [
        {
            align: 'center',
            title: '设备编号',
            dataIndex: 'sn',
            key: 'sn',
            width: 270,
        },
        {
            align: 'center',
            title: '设备类型',
            dataIndex: 'deviceStyle',
            key: 'deviceStyle',
            width: 270,
            render: (_, record) =>{
               let name =  deviceTypes.find(d => d.deviceStyle ==record.deviceStyle)?.name
              return  (
                <span>{name}</span>
            )},
        }, {
            align: 'center',
            title: '设备名称',
            dataIndex: 'name',
            key: 'name',
            width: 270,
        }, {
            align: 'center',
            title: '安装地址',
            dataIndex: 'address',
            key: 'address',
            width: 590,
        }, {
            align: 'center',
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render: (_, record) => (
                <span style={{ color: '#237ae4', textDecoration: 'underline', cursor: 'pointer' }} onClick={()=>settingClick(record)}>手动录入</span>
            ),
        },
    ];

    const [page, setPage] = useState({
        current: 1,
        pageSize: 14,
        hideOnSinglePage: false
    })

    const getTableData = ({ current, pageSize }) => {
        if (state.searchInput == '') {
            return {
                list: [],
                total: 0
            }
        } else {
            return GetInpuList(projectId, state.searchInput).then(res => {
                console.log(res)
                if (res.success) {
                    if (Array.isArray(res.data) && res?.data?.length > 0) {
                        return {

                            list: res.data,
                            total: res.data.length
                        }
                    } else {
                        return {
                            list: [],
                            total: 0
                        }
                    }

                } else {
                    message.error(res.errMsg)
                }
            })
        }

    }

    const { tableProps, refresh: queryTable } = useAntdTable(getTableData, {
        defaultPageSize: 14,
        refreshDeps: [projectId]
    })
   console.log(tableProps)
    const handleSearch = val => {
        console.log(val)
        if (val == '') {
            message.warn('请先输入设备编号/设备名称')
        } else {
            state.searchInput = val
            queryTable()
        }

    }

    const settingClick = (item) => {
        state.selectSN = item.sn
        form.resetFields()
        ref.current.onOpen()
    }

    const addOk = async () => {
        try {
            const {value, date, time} = await form.validateFields();
            let params = {
                value, date, time
            }
            params.date = date.format('YYYY-MM-DD')
            params.time = time.format('HH:mm:ss')
            

            ManualInput(projectId, state.selectSN, params.value, params.date, params.time).then(res => {
                if(res.success){
                    message.success('手动录入成功!')
                }else{
                    message.error(res.errMsg)
                }
                ref.current.onCancel()
            })

        } catch (errorInfo) {
            return Promise.reject('验证不通过，请正确填写！');
            console.log(errorInfo)
        }
    }

    return (
        <Pagecount bgcolor="#eeeff3" pd="0px" custserach="true">
            <Titlelayout layout="flex" dr="column">
                {/* <HeaderDiv>
                    <span style={{ marginRight: 16 }}>设备查询</span>
                    <Serach
                        size="middle"
                        placeholder="输入设备编号/设备名称"
                        style={{ width: "340px" }}
                        allowClear
                        onSearch={handleSearch}
                    />
                </HeaderDiv> */}
                <Form
            layout="line"
            form={form}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between"
            }}
            initialValues={{
              alike: '',
              category: '',
              state: 0
            }}
          >           
                <Form.Item name="alike" label="设备查询" style={{marginBottom: 0}}  >
                  <Serach
                    size="middle"
                    placeholder="输入设备编号/设备名称"
                    style={{ width: "340px" }}
                    allowClear
                    onSearch={handleSearch}
                  />
                </Form.Item>

          </Form>
                <Divider dashed style={{ margin: '16px 0' }}></Divider>
                <UseTable columns={columns} rowKey='id'  {...tableProps} pagination={false} scroll={{ y: 696 }} even hbg="#ecf5ff" hbc="#515151" ref={tbref}></UseTable>

                <CModal title={"手动录入"}   onOk={addOk} width={439} mold="cust" ref={ref} key="edit">
                    <Form labelCol={{ span: 12, }} form={form}
                        name="basic" style={{ maxWidth: 600, }}
                        layout="vertical"
                    >
                        <Form.Item label="请输入表码值" name="value" rules={[{ required: true, message: '请输入表码值!', },]}>
                            <Input style={{ width: 375 }}></Input>
                        </Form.Item>
                        <Form.Item label="确认表码值" name="revalue" rules={[
                            { required: true, message: '请输入表码值!',  },
                            ({ getFieldValue }) => ({
                                validator(_, value) { 
                                  if (value && getFieldValue('value') == value) {
                                    return Promise.resolve();
                                  }else {
                                    return Promise.reject(new Error('两次输入的表码值不匹配'));
                                  }
                                  
                                },
                              }),
                        ]}>
                            <Input style={{ width: 375 }}></Input>
                        </Form.Item>
                        <Form.Item label="请输入抄表日期" name="date" rules={[{ required: true, message: '请输入抄表日期!', },]}>
                            <DatePicker style={{ width: 375 }} />
                        </Form.Item>

                        <Form.Item label="请输入抄表时间" name="time" rules={[{ required: true, message: '请输入抄表时间!', },]}>
                            <TimePicker style={{ width: 375 }} />
                        </Form.Item>
                    </Form>
                </CModal>
            </Titlelayout>
        </Pagecount>
    )
}