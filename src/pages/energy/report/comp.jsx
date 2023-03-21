import React, { useRef, forwardRef, useImperativeHandle, useState, useContext, useEffect,useCallback, useMemo } from 'react'
import { Form, Select, Button, Divider, DatePicker } from 'antd'
import Table from '@com/useTable'
import style from './style.module.less'
import CustContext from '@com/content'
import moment from 'moment'
export default forwardRef(
    function Comp({ istime = false, isenergy = true, getTableData, ...other }, ref) {
        const [dataSource, setDataSource] = useState([])
        const [pickertype, setPickertype] = useState(1)
        const [loading,setLoading] =useState(true)
        const [form] = Form.useForm()
        const {areavalue} = useContext(CustContext)
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
            getTableData(areavalue)
        }
        
        //开始时间禁用
        const disabledStartDate=(current)=>{
            return current && current > form.getFieldValue('endtime');
        }
        //结束时间禁用
        const disabledEndDate=(current)=>{
            return current && current < form.getFieldValue('starttime');
        }
        const getTableData = async (areaId = 0) => {
            try {
              const formvalues = form.getFieldValue()
              const fomatstyle = pickertype === 1 ? 'YYYY-MM-DD' : pickertype === 2 ? 'YYYY-MM-01' : 'YYYY-01-01'
              let parmas = {
                projectId,
                meterType: formvalues.energytype,
                type: formvalues.time,
                startDate: formvalues.starttime.format(fomatstyle),
                endDate: formvalues.endtime.format(fomatstyle)
              }
              let arrs = []
              if (areaId === 0) {
                arealistRef.shift()
                arrs = arealistRef.map(it => it.id)
              } else {
                arrs = [areaId]
              }
              const res = await energyReport.QueryReading(parmas, arrs)
              console.log(62,contentRef)
              contentRef.current.setLoading(false)
              if (res.success) {
                if(Array.isArray(res.data)){
                  contentRef.current.setDataSource([...res.data])
                }else{
                  contentRef.current.setDataSource([])
                } 
              } else {
                message.error(res.errMsg)
              }
            } catch (e) {
              console.log(e)
            }
          }
        useEffect(() => {
          
        }, [areavalue])
        useImperativeHandle(ref, () => ({
            setDataSource,
            form,
            pickertype,
            setLoading
        }))
        return (
            <div>
                <Form
                    form={form}
                    initialValues={
                        {
                            energytype: 1,
                            time: 1,
                            starttime: moment(),
                            endtime: moment()
                        }
                    }
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Form.Item label="能源类型" style={{ marginBottom: 0 }} name="energytype">{
                            isenergy ? <Select style={{ width: 112 }} options={energyoptions}></Select> :
                                <Input style={{ width: 112 }} disabled></Input>
                        }
                        </Form.Item>
                        <Divider type="vertical" style={{ height: 30, margin: '0 32px' }} dashed></Divider>
                        <Form.Item label="时间" style={{ marginBottom: 0, marginRight: 16 }} name="time">
                            <Select style={{ width: 80 }} options={dateOptions} onChange={changeTime}></Select>
                        </Form.Item>
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


