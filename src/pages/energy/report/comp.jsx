import React, { useRef, forwardRef, useImperativeHandle, useState, useContext, useEffect, useCallback, useMemo } from 'react'
import { Form, Select, Button, Divider, DatePicker, Input } from 'antd'
import Table from '@com/useTable'
import style from './style.module.less'
import CustContext from '@com/content'
import moment from 'moment'
import { useSelector } from 'react-redux'
const { RangePicker } = DatePicker;
export default forwardRef(

    function Comp({ istime = false, isenergy = true, api, setColumns, ismeter = false, ...other }, ref) {
        const [dataSource, setDataSource] = useState([])
        const [pickertype, setPickertype] = useState(istime ? 0 : 1)
        const [loading, setLoading] = useState(true)
        const [form] = Form.useForm()
        const { areavalue, arealistRef } = useContext(CustContext)
        const tableRef = useRef()
        const projectId = useSelector(state => state.system.menus.projectId)
        const btncss = {
            width: 96,
            height: 32
        }
        const energyoptions = [
            {
                label: '电',
                value: 1
            }, {
                label: '水',
                value: 2
            }, {
                label: '燃气',
                value: 3
            }
        ]
        //日期选项
        const datearr = [{
            label: '天',
            value: 1
        }, {
            label: '月',
            value: 2
        }, {
            label: '年',
            value: 3
        }]
        const dateOptions = istime ? [
            {
                label: '时',
                value: 0
            },
            ...datearr
        ] : datearr
        //日期类型改变
        const changeTime = (v) => {
            setPickertype(v)
            console.log(v, typeof v)
        }
        //查询
        const search = () => {
            const starttime = form.getFieldValue('starttime')
            const starttitle = pickertype == 1 ? moment(starttime).startOf('month').format("YYYY-MM-DD") :
                pickertype == 2 ? moment(starttime).format("YYYY-MM") : moment(starttime).format("YYYY")
            console.log(starttitle)
            getTableData(areavalue)
        }

        //开始时间禁用
        const disabledStartDate = (current) => {
            return current && current > form.getFieldValue('endtime');
        }
        //结束时间禁用
        const disabledEndDate = (current) => {
            return current && current < form.getFieldValue('starttime');
        }
        //获取数据
        const getTableData = async (areaId = 0) => {
            try {
                const formvalues = form.getFieldValue()
                const startstyle =pickertype === 1 ? 'YYYY-MM-01' : pickertype === 2 ? 'YYYY-01-01' : 'YYYY-01-01'
                const endDate =pickertype === 1 ? moment(formvalues.endtime).endOf('month').format('YYYY-MM-DD')
                    : pickertype === 2 ? moment(formvalues.endtime).endOf('year').format('YYYY-MM-01')
                        : moment(formvalues.endtime).format('YYYY-01-01')
                let parmas ={
                    projectId,
                    meterType: formvalues.energytype,
                }
                //能耗抄表
                if(ismeter){
                    parmas={
                       ...parmas,
                       type:1,
                       startDate:moment(formvalues.timeRanger[0]).startOf('month').format('YYYY-MM-DD'),
                       endDate:moment(formvalues.timeRanger[1]).endOf('month').format('YYYY-MM-DD')
                    }   
                }
                //能耗用量
                else if(istime){
                    if(pickertype===0){
                        parmas={
                            ...parmas,
                            type:0,
                            startDate:moment().format('YYYY-MM-DD'),
                            endDate:moment().format('YYYY-MM-DD'),
                         }
                       
                    }else{
                        parmas={
                            ...parmas,
                            type:formvalues.time,
                            startDate:formvalues.starttime.format(startstyle),
                            endDate,
                         }
                    }
                   
                }
                //分时能耗
                else{
                    parmas={
                        ...parmas,
                        type:1,
                        startDate:formvalues.starttime.format(startstyle),
                        endDate,
                    } 
                }
             
                let arrs = []
                let list = [...arealistRef]
                if (areaId === 0) {
                    list?.shift()
                    arrs = list?.map(it => it.id)
                } else {
                    arrs = [areaId]
                }
                const res = await api(parmas, arrs)
                setLoading(false)
                if (res.success) {
                    if (Array.isArray(res.data)) {
                        setDataSource([...res.data])
                    } else {
                        setDataSource([])
                    }
                } else {
                    message.error(res.errMsg)
                }
            } catch (e) {
                console.log(e)
            }
        }
        useEffect(() => {
            getTableData()
        }, [])
        useImperativeHandle(ref, () => ({
            setDataSource,
            form,
            pickertype,
            setLoading
        }))
        return (
            <div>
                {pickertype }

                   {moment(new Date()).format('YYYY-MM-01')}
                <Form
                    form={form}
                    layout="inline"
                    initialValues={
                        {
                            energytype: 1,
                            time: istime ? 0 : 1,
                            starttime:pickertype===1?moment().format('YYYY-MM-01'):moment(),
                            endtime:pickertype===1?moment().endOf('month'):pickertype===2?moment().format('YYYY-12-01'):moment().format('YYYY-01-01'),
                            day: moment(),
                            timeRanger:[moment().startOf('month'),moment().endOf('month')]
                        }
                    }
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Form.Item label="能源类型" style={{ marginBottom: 0 }} name="energytype">
                            <Select style={{ width: 112 }} options={energyoptions} disabled={isenergy ? false : true}></Select>
                        </Form.Item>
                        <Divider type="vertical" style={{ height: 30, margin: '0 32px' }} dashed></Divider>

                        {ismeter ? (
                        <Form.Item name="timeRanger">
                            <RangePicker separator={<span>至</span>}/>
                        </Form.Item>
                        ) : (
                            <>
                                <Form.Item label="时间" style={{ marginBottom: 0, marginRight: 16 }} name="time">
                                    <Select style={{ width: 80 }} options={dateOptions} onChange={changeTime}></Select>
                                </Form.Item>
                                {
                                    !istime ? <>
                                        <Form.Item style={{ marginBottom: 0 }} name="starttime">
                                            <DatePicker
                                                disabledDate={disabledStartDate}
                                                picker={pickertype === 1 ? 'date' : pickertype === 2 ? 'month' : 'year'}
                                            />
                                        </Form.Item>
                                        <p style={{ margin: '0 16px' }}>至</p>
                                        <Form.Item style={{ marginBottom: 0 }} name="endtime">
                                            <DatePicker
                                                picker={pickertype === 1 ? 'date' : pickertype === 2 ? 'month' : 'year'}
                                                disabledDate={disabledEndDate}
                                            />
                                        </Form.Item>
                                    </> 
                                    :
                                     pickertype === 0 ? (
                                        <>
                                            <Form.Item style={{ marginBottom: 0 }} name="day">
                                                <DatePicker
                                                    picker='date'
                                                />
                                            </Form.Item>
                                        </>
                                    )
                                     : 
                                    (
                                        <>
                                            <Form.Item style={{ marginBottom: 0 }} name="starttime">
                                                <DatePicker
                                                    disabledDate={disabledStartDate}
                                                    picker={pickertype === 1 ? 'date' : pickertype === 2 ? 'month' : 'year'}
                                                />
                                            </Form.Item>
                                            <p style={{ margin: '0 16px' }}>至</p>
                                            <Form.Item style={{ marginBottom: 0 }} name="endtime">
                                                <DatePicker
                                                    picker={pickertype === 1 ? 'date' : pickertype === 2 ? 'month' : 'year'}
                                                    disabledDate={disabledEndDate}
                                                />
                                            </Form.Item>
                                        </>
                                    )
                                }
                            </>
                        )}

                    </div>
                    <div>
                        <Button style={btncss} onClick={search}>查询</Button>
                        <Button style={{ ...btncss, marginLeft: 16 }} onClick={() => { tableRef.current.download() }}>导出</Button>
                    </div>

                </Form>
                <Divider dashed ></Divider>
                <div style={{ width: 1645 }} className={style.tablecss}>
                    <Table dataSource={dataSource} {...other} ref={tableRef} loading={loading} ></Table>

                </div>

            </div>

        )
    }
)


