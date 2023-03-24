// import Comp from './comp'
import moment from 'moment'
import { energyReport } from '@api/api'
import { useSelector } from 'react-redux'
import React, { useRef, forwardRef, useImperativeHandle, useState, useContext, useEffect, useCallback, useMemo } from 'react'
import { Form, Select, Button, Divider, DatePicker, Input,message } from 'antd'
import Table from '@com/useTable'
import style from './style.module.less'
import CustContext from '@com/content'
const { RangePicker } = DatePicker;
export default function Energymeter({ areavalue, arealistRef }) {

  const contentRef = useRef()
  const projectId = useSelector(state => state.system.menus.projectId)
  const [columns,setColumns] =useState([
    {
      title: '名称',
      dataIndex: 'name'
    },
    {
      title: '设备编号',
      dataIndex: 'sn'
    },
    {
      title: '测点',
      dataIndex: ''
    },
    {
      title:moment().endOf('month').format("YYYY-MM-DD") ,
      dataIndex: 'start'
    },
    {
      title: moment().endOf('month').format("YYYY-MM-DD"),
      dataIndex: 'end'
    },
    {
      title: '差值(kWh)',
      dataIndex: 'consume'
    },
    {
      title: '费用(元)',
      dataIndex: 'cost'
    }
  ])

 
  useEffect(() => {
    
  }, [])
  const compProps = {
    columns,
    ref: contentRef,
    api:energyReport.QueryReading,
    setColumns,
  }
  return (
    <div>
      <Comp {...compProps} />
    </div>
  )
}

const Comp =({api,columns,setColumns},ref)=>{
    const [dataSource, setDataSource] = useState([])
    const [loading, setLoading] = useState(false)
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
    //查询
    const search = () => {
        getTableData(areavalue)
    }

    //获取数据
    const getTableData = async (areaId = 0) => {
        try {
            setLoading(true)
            const formvalues = form.getFieldValue()
            let parmas ={
                projectId,
                meterType: formvalues.energytype,
                type:1,
                startDate:moment(formvalues.timeRanger[0]).format('YYYY-MM-DD'),
                endDate:moment(formvalues.timeRanger[1]).format('YYYY-MM-DD')
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
               const mapcolumns =  columns.map(it=>{
                    if(it.dataIndex==='start'){
                        return {
                            ...it,
                            title:parmas.startDate
                        }
                    }
                    if(it.dataIndex==='end'){
                        return {
                            ...it,
                            title:parmas.endDate
                        }
                    }
                    return it
                })
                setColumns([...mapcolumns])
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
        areavalue&& getTableData(areavalue)
       
    }, [areavalue])
    
    return (
        <div>
            <Form
                form={form}
                layout="inline"
                initialValues={
                    {
                        energytype: 1,
                        timeRanger:[moment().startOf('month'),moment().endOf('month')]
                    }
                }
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Form.Item label="能源类型" style={{ marginBottom: 0 }} name="energytype">
                        <Select style={{ width: 112 }} options={energyoptions}></Select>
                    </Form.Item>
                    <Divider type="vertical" style={{ height: 30, margin: '0 32px',borderColor:'#d7d7d7' }} dashed></Divider>

               
                    <Form.Item name="timeRanger">
                        <RangePicker separator={<span>至</span>}/>
                    </Form.Item>
                </div>
                <div>
                    <Button style={btncss} onClick={search}>查询</Button>
                    <Button style={{ ...btncss, marginLeft: 16 }} onClick={() => { tableRef.current.download() }}>导出</Button>
                </div>

            </Form>
            <Divider dashed style={{borderColor:'#d7d7d7' }}></Divider>
            <div style={{ width: 1645 }} className={style.tablecss}>
                <Table dataSource={dataSource} columns={columns} ref={tableRef} loading={loading} ></Table>

            </div>

        </div>

    )
}
