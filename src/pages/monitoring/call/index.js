import React, { useState,  useRef} from 'react'
import { useSelector} from 'react-redux'
import { useAntdTable } from 'ahooks'
import {  Remote} from '@api/api.js'
import { Form,  Button,  Select, message,  Spin ,Space} from 'antd' 
import styled from 'styled-components'
import Pagecount from '@com/pagecontent'
import UserTable from '@com/useTable'
import CustContext from '@com/content.js'
import { selectProjectId, selectOneLevelDefaultId, deviceStyle } from '@redux/systemconfig.js'
import {CustButton} from '@com/useButton'
import CModal from '@com/useModal'
import {Serach, Cdivider} from "@com/comstyled"


const Mainbox = styled.div`
   display: flex;
   flex-direction: column;
   flex: 1;

`
export default function Index() {
  const projectId = useSelector(selectProjectId)
  const deviceStyles = useSelector(deviceStyle)
  const areaId = useSelector(selectOneLevelDefaultId);      
  const [value, setvalue] = useState('1')
  let [dataSourceRead, setdataSourceRead] = useState([])
  let [DataSourceReadR, setDataSourceReadR] = useState([]) 
  const tableRef = useRef()
  tableRef.current = DataSourceReadR
  // let [alike, setalike] = useState('')
  // let [deviceStyle, setdeviceStyle] = useState(0)
  let [readout, setreadout] = useState(false)
  // const [selectTableList, setselectTableList] = useState([])
  const [loading, setLoading] = useState(false);
  const tableRefs= useRef()

  const [form] = Form.useForm()
    const {Item} = Form
    const getData = ({current, pageSize}, form={}) => {
       let {alike, deviceStyle} = form
       let params ={pageNum: current, pageSize, projectId, areaId, gatewayId: 0, state: 0,category: '', deviceStyle, alike}
       return Remote.AllCallMeter(params).then(res => {
        let {success, data, total} = res
        if(success && Array.isArray(data) && data.length > 0) {
           return {
            list: data,
            total,
           }
        }else {
            return {
                list: [],
                total: 0,
               }
        }
       }).catch(e => {
        console.log(e)
       })

    }
   const {tableProps, search} = useAntdTable(getData, {
    form,
    defaultPageSize: 18,
    refreshDeps: [areaId]
   })
   const {submit} = search


  const columnsLog = [
    {
      title: '设备编号',
      dataIndex: 'sn',
      key: 'sn',
      id: 'id'
    },
    {
      title: '设备型号',
      dataIndex: 'category',
      key: 'sn',
      id: 'id'
    },
    {
      title: '设备名称',
      dataIndex: 'name',
      key: 'sn',
      id: 'id'
    },
    {
      title: '安装地址',
      dataIndex: 'address',
      key: 'sn',
      id: 'id'
    },
    {
      title: '设备状态',
      dataIndex: 'status',
      render: (status) => <span> {status == 1 ? '离线' : '在线'} </span>,
      key: 'sn',
      id: 'id'
    },
  ];
  let realcolumns = [
    {
      title: '抄读时间',
      dataIndex: 'LastSampleTime',

    },
    {
      title: '设备编号',
      dataIndex: 'sn',

    },
    {
      title: 'A相电压(V)',
      dataIndex: 'Ua',

    },
    {
      title: 'B相电压(V)',
      dataIndex: 'Ub',

    },
    {
      title: 'C相电压(V)',
      dataIndex: 'Uc',
  
    },
    {
      title: 'A相电流(A)',
      dataIndex: 'Ia',
 
    },
    {
      title: 'B相电流(A)',
      dataIndex: 'Ib',

    },

    {
      title: 'C相电流(A)',
      dataIndex: 'Ic',
      // render: (data) => <span> {JSON.parse(data).Ic} </span>,

    },
    {
      title: '总电度(kWh)',
      dataIndex: 'EP',

    }
  ]


  let snList = []
  const [isClick, setIsClick] = useState(false)
  const rowSelectionRadio = {
    tableRefs,
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      // setselectTableListRadio(selectedRows)
      // setselectTableList(selectedRows)
      tableRefs.current=selectedRows
      if (selectedRows[0].status == 1) {
        setIsClick(true)
      } else {
        setIsClick(false)
      }
    },
  }
  const rowSelectionCheckbox = {
    tableRefs,
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      // setselectTableListCheckbox(selectedRows)
      // setselectTableList(selectedRows)
      tableRefs.current=selectedRows
      if (selectedRowKeys.length > 0) {
        selectedRows.map(item => {
          if (item.status == 1) {
            setIsClick(true)
          } else {
            setIsClick(false)
          }
        })
      } else {
        setIsClick(false)
      }
    },
  }

   const changeReadout = () => {
    snList = []
    if (tableRefs.current&&tableRefs.current.length > 0) {
      tableRefs.current.map((item, index) => {
        snList.push(item.sn)
      })
    }
    let parmas = {
      Sns: snList,
      ProjectId: projectId
    }
    if (tableRefs.current&&tableRefs.current.length > 0) {
      setLoading(true)
      Remote.StartCalling(parmas).then(res => {
        let { success, data } = res
        if (success) {
          let isOkList = []
          let isresetOk = []
          let setResultInfo = {}
          let setResultInfoList = []
          data.map((item, index) => {
            setResultInfo = { id: "", status: 2 }
            setResultInfoList.push(setResultInfo)
            setResultInfoList[index].id = item.id
            if (item.isOk == true && item.errorCode == 0) {
              isOkList.push({ sn: item.sn, taskNo: item.taskNo })
            } else {
              message.error('设备' + item.sn + '抄读失败！')
              setLoading(false)
            }
          })
          if (isOkList.length > 0) {
            let count = [1, 2, 3,4,5,6,7,8,9,10,11,12]
            let arr = []
            let resData = []
            let status = true
            count.map((item, index) => {
              console.log(index)
              setTimeout(() => {
                if (status) {
                  Remote.CallingResponse(isOkList).then(res => {
                    arr.push(index)
                    let { success, data } = res
                    if (success) {
                      resData = []
                      isOkList = []
                      data.map((item, index) => {
                        if (item.isOk  && item.errorCode == 0) {
                          resData.push(item)
                          setResultInfoList[index].status = 1
                        } else {
                          
                          isOkList.push({ sn: item.sn, taskNo: item.taskNo })
                        }
                        console.log(arr, resData)
                        if (arr.length == 12 || resData.length == data.length) {
                          setreadout(true)
                          setLoading(false)
                          status = false
                          let arrlist = []
                          resData.map(item => {
                            arrlist.push({ ...JSON.parse(item.data), sn: item.sn })
                          })
                          setdataSourceRead(arrlist)
                          console.log(dataSourceRead,arrlist)
                          Remote.SetResult(setResultInfoList, projectId).then((res) => {console.log(res) })
                        }
                      })
                    } else {
                      message.error(res.errMsg)
                      setLoading(false)
                    }

                  })
                }

              }, 5000*index)

            })

          }

        } else {
          message.error(res.errMsg)
        }
      }).catch(() => {
        setLoading(false)
      })
    } else {
      message.error('请先选择设备！')
    }
  }  
  const tabs = [
    {
        label:"单表抄读",
        key: 1,

    },
    {
        label:"批量抄读",
        key: 2,

    }
]
let dataProps = {
    value,
    setvalue,
    tabs,
  }
  return (
    <CustContext.Provider value={dataProps}>
      <Pagecount>
    <Spin tip="正在抄读，请稍候……" size="large" spinning={loading}>
    <Mainbox>   
       
                    <Form form={form}  layout='inline' initialValues={{deviceStyle: 1, alike: ''}}>
                        <Space size={64}  split={<Cdivider />}>
                        <Item name="deviceStyle" style={{marginBottom: '0px', marginRight: '0px'}}>
                        <Select
                           style={{width: "128px"}}
                            fieldNames={{label: "name", value: "deviceStyle"}}
                            onChange={submit}
                            options={deviceStyles}
                        />
                        </Item>
                       
                        <Item name="alike" label="设备查询" style={{marginBottom: '0px', marginRight: '0px'}}>
                            <Serach placeholder='请输入设备编号/安装地址'  style={{width: '370px'}}  size='middle'   onSearch={submit} /> 
                             
                        </Item>
                        
                         <Item> 
                          <CustButton onClick={changeReadout}>实时抄读</CustButton>
                       {/*  <Button size='middle' disabled={isClick} style={{ width: 96, height: 32, backgroundColor: '#237AE4', color: '#fff',borderRadius:2 }} onClick={() => { changeReadout() }}>实时抄读</Button> */}
                         </Item>
                        </Space>
                    </Form>
                    <Cdivider type="h" margin="16px 0" />
                    {value == '1' ? <div style={{display: 'flex', flex: 1}}>
                        <UserTable columns={columnsLog}   rowKey={columnsLog => columnsLog.sn} {...tableProps}  rowSelection={{
                            type: 'radio',  
                            ...rowSelectionRadio,
                          
                        }} bordered></UserTable>
                   
                    </div> : <div style={{display: 'flex', flex: 1}}>
                        <UserTable columns={columnsLog}   rowKey={columnsLog => columnsLog.sn}  {...tableProps}  rowSelection={{
                            type: 'checkbox',
                            ...rowSelectionCheckbox,
                        }} bordered></UserTable>
                     
                    </div>}
        <CModal
          title="实时抄读"
          open={readout}
          onCancel={() => { setreadout(false) }}
          mold="cust"
          width={1218}         
          footer={[<Button type='primary' style={{ width: 96, height: 36 }} onClick={() => { setreadout(false) }}>关闭</Button>]}
        >
          <UserTable  columns={realcolumns} dataSource={dataSourceRead} rowKey={realcolumns => realcolumns.sn} ></UserTable>

        </CModal>
      </Mainbox>
    </Spin>
    </Pagecount>
    </CustContext.Provider>
  )
}
