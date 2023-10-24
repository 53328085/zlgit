import React, { useState, useMemo, useEffect } from 'react'
import style from './style.module.less'
import { Select, Button, DatePicker, Form, Divider } from 'antd'
import { SyncOutlined, UploadOutlined, RollbackOutlined, SearchOutlined } from '@ant-design/icons';
import LoopSelect from './loopSelect'
import ContentTable from './contentTable';
import LoopDetail from './loopDetail';
import { useSelector, useDispatch } from 'react-redux'
import BlueColumn from '@com/bluecolumn'
import {DistributionRoomRuntime,distributionRoom} from '@api/api.js'
export default function Index() {
    const roomlist = useSelector(state => state.system.roomId)

    const { Option } = Select;
    const { RangePicker } = DatePicker;
    const [showDetail, setShowDetail] = useState(false);
    const [form] = Form.useForm()
    const projectId = useSelector(state => state.system.menus.projectId)
    const oneLevel = useSelector(state => state.system.onelevel)
    const areaOptions = oneLevel.length > 0 ? useMemo(() => ([{ name: oneLevel[0].levelName + '(全部)', id: 0 }, ...oneLevel]), [oneLevel]) : []
    const columns = [
        {
            title: '回路名称',
            dataIndex: 'name',
            width: 180,
            render: (text, record) => <span style={{ color: '#237ae4', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => { showDetailPage(record) }}>{text}</span>
        }, 
        {
            title:"总分表",
            dataIndex:'',
            width:80
        },{
            title:"设备编号",
            dataIndex:'',
            width:160
        },{
            title: '电压',
            children: [
                {
                    title: 'Ua(V)',
                    dataIndex: 'Ua',
                    width: 120
                },
                {
                    title: 'Ub(V)',
                    dataIndex: 'Ub',
                    width: 120
                },
                {
                    title: 'Uc(V)',
                    dataIndex: 'Uc',
                    width: 120
                },
            ]
        }, {
            title: '电流',
            children: [
                {
                    title: 'Ia(V)',
                    dataIndex: 'Ia',
                    width: 120
                },
                {
                    title: 'Ib(V)',
                    dataIndex: 'Ib',
                    width: 120
                },
                {
                    title: 'Ic(V)',
                    dataIndex: 'Ic',
                    width: 120
                },
            ]
        }, {
            title: '功率因数',
            dataIndex: 'PF',
            width: 118
        }, {
            title: '总有功功率',
            dataIndex: 'TWP',
            width: 130,
            children:[
                {
                    title:'(kW)',
                    width:130
                }
            ]
        },{
            title: '总无功功率',
            dataIndex: 'TRP',
            width: 130,
            children:[
                {
                    title:'(kVar)',
                    width: 130,
                }
            ]
        },  {
            title: '总能耗',
            dataIndex: 'TED',
            width: 130,
            children:[
                {
                    title:'(kW·h)',
                    width: 130
                }
            ]
        }
    ]

    const tableData = [
        {
            key: '1',
            name: '总进线1',
            Ua: 42323.23,
            Ub: 233.31,
            Uc: 231.38,
            Ia: 235.36,
            Ib: 301.32,
            Ic: 302.21,
            PF: 0.98,
            TWP: 125.36,
            TRP: 53.36,
            TED: 12568.32
        }, {
            key: '1-1',
            name: '回路1-1',
            Ua: 42323.23,
            Ub: 233.31,
            Uc: 231.38,
            Ia: 235.36,
            Ib: 301.32,
            Ic: 302.21,
            PF: 0.98,
            TWP: 125.36,
            TRP: 53.36,
            TED: 3668.32
        }, {
            key: '1-2',
            name: '回路1-2',
            Ua: 42323.23,
            Ub: 233.31,
            Uc: 231.38,
            Ia: 235.36,
            Ib: 301.32,
            Ic: 302.21,
            PF: 0.98,
            TWP: 125.36,
            TRP: 53.36,
            TED: 5645.32
        }, {
            key: '1-2-1',
            name: '回路1-2-1',
            Ua: 42323.23,
            Ub: 233.31,
            Uc: 231.38,
            Ia: 235.36,
            Ib: 301.32,
            Ic: 302.21,
            PF: 0.98,
            TWP: 125.36,
            TRP: 53.36,
            TED: 1568.32
        }, {
            key: '1-2-2',
            name: '回路1-2-2',
            Ua: 42323.23,
            Ub: 233.31,
            Uc: 231.38,
            Ia: 235.36,
            Ib: 301.32,
            Ic: 302.21,
            PF: 0.98,
            TWP: 125.36,
            TRP: 53.36,
            TED: 1228.97
        }, {
            key: '2',
            name: '总出线2',
            Ua: 42323.23,
            Ub: 233.31,
            Uc: 231.38,
            Ia: 235.36,
            Ib: 301.32,
            Ic: 302.21,
            PF: 0.98,
            TWP: 125.36,
            TRP: 53.36,
            TED: 2568.35
        }, {
            key: '2-1',
            name: '回路2-1',
            Ua: 42323.23,
            Ub: 233.31,
            Uc: 231.38,
            Ia: 235.36,
            Ib: 301.32,
            Ic: 302.21,
            PF: 0.98,
            TWP: 125.36,
            TRP: 53.36,
            TED: 2348.32
        }, {
            key: '2-2',
            name: '回路2-2',
            Ua: 42323.23,
            Ub: 233.31,
            Uc: 231.38,
            Ia: 235.36,
            Ib: 301.32,
            Ic: 302.21,
            PF: 0.98,
            TWP: 125.36,
            TRP: 53.36,
            TED: 1984.32
        }, {
            key: '2-2-1',
            name: '回路2-2-1',
            Ua: 42323.23,
            Ub: 233.31,
            Uc: 231.38,
            Ia: 235.36,
            Ib: 301.32,
            Ic: 302.21,
            PF: 0.98,
            TWP: 125.36,
            TRP: 53.36,
            TED: 3291.32
        }, {
            key: '2-2-2',
            name: '回路2-2-2',
            Ua: 42323.23,
            Ub: 233.31,
            Uc: 231.38,
            Ia: 235.36,
            Ib: 301.32,
            Ic: 302.21,
            PF: 0.98,
            TWP: 125.36,
            TRP: 53.36,
            TED: 1292.92
        }, {
            key: '2-2-3',
            name: '回路2-2-3',
            Ua: 42323.23,
            Ub: 233.31,
            Uc: 231.38,
            Ia: 235.36,
            Ib: 301.32,
            Ic: 302.21,
            PF: 0.98,
            TWP: 125.36,
            TRP: 53.36,
            TED: 3568.32
        }
    ]
    const changeArea = () => {

    }
    const showDetailPage = value => {
        console.log(value);
        setShowDetail(true);
    }

    const goBack = () => {
        setShowDetail(false);
    }
    const getLinePoint=async(roomId,lineId)=>{
        await DistributionRoomRuntime.LineRuntimePoints(projectId,roomId,lineId)
    }
    useEffect(()=>{
        const {roomId} = form.getFieldsValue()
        getLinePoint(roomId,0)
    },[])

    return (
        <div>
            <div style={{ backgroundColor: "#fff", display: 'flex', alignItems: 'center', padding: '8px 16px', marginBottom: 16, border: '1px solid #d7d7d7', borderRadius: 4 }}>
                <Form
                    form={form}
                    colon={false}
                    layout="inline"
                    initialValues={{
                        area: oneLevel.length > 0 ? 0 : null,
                        roomId: roomlist.length > 0 ? roomlist[0].id : null
                    }}
                >
                    <Form.Item label={oneLevel[0]?.levelName} name="area" style={{ marginBottom: 0 }}>
                        <Select style={{ width: 200 }} options={areaOptions} fieldNames={{ label: 'name', value: 'id' }} onChange={changeArea}></Select>
                    </Form.Item>
                    <Form.Item>
                        <Divider dashed type="vertical" style={{ borderColor: "#999", height: '30px' }}></Divider>
                    </Form.Item>
                    <Form.Item name="roomId" >
                        <Select
                            options={roomlist}
                            fieldNames={{ label: 'name', value: 'id' }}
                            style={{ width: 240 }}
                            placeholder="请选择配电房"></Select>
                    </Form.Item>
                </Form>
            </div>
            {/* <div className={style.header}>
        <span style={{marginLeft: '12px'}}>园区选择</span>
              <Form
                  form={form}
                  layout='inline'
              >
                  <Form.Item>
                      <Select
                          placeholder="请选择区域"
                          size="middle"
                          style={{ width: '200px', marginLeft: '12px' }}
                      >
                          <Option value="1">正泰物联全部园区</Option>
                          <Option value="2">正泰物联滨江园区</Option>
                          <Option value="3">正泰物联温州园区</Option>
                      </Select>
                  </Form.Item>
                  <Form.Item>
                    <Divider dashed type='vertical' style={{borderColor:"#999999",height:'100%'}}></Divider>
                  </Form.Item>
                <Form.Item>
                    <Select
                        placeholder="请选择配电房"
                        style={{width: '200px',}}
                        options={roomId}
                        fieldNames={{label:'name',value:'id'}}
                    >

                    </Select>
                </Form.Item>
              </Form>
        
        { showDetail ? (
        <>
          <RangePicker size='middle' style={{width:376, marginLeft:16, marginRight:16}}></RangePicker> 
          <Button size='middle' type='primary' icon={<SearchOutlined />} >查询</Button>
        </>): 
        <span className={style.collectionTime}>参量采集时间：2020-09-03 09:35:21</span> }
        <div className={style.buttonList}>
          {showDetail ? <Button className='refresh' type='primary' icon={<RollbackOutlined />} onClick={goBack} >返回</Button> : null}
          <Button className='refresh' type='primary' icon={<SyncOutlined />} >刷新</Button>
          <Button className='headerButton' type='primary' >回路拓扑图</Button>
          <Button className='headerButton' type='primary' icon={<UploadOutlined />} >导出</Button>
        </div>
      </div> */}
            <div className={style.content}>
                <LoopSelect form={form} projectId={projectId}></LoopSelect>
                <div className={style.contentRight}>
                    <div className={style.contentheader}>
                        <BlueColumn name="详细参数"/>
                        <div className={style.buttonList}>
                            <span style={{paddingRight:40,fontSize:16}}>参量采集时间 : 2020-09-03 09:35:21</span>
                            <Button className='refresh' type='primary' icon={<SyncOutlined />} >刷新</Button>
                            <Button className='headerButton' type='primary' icon={<UploadOutlined />} >导出</Button>
                        </div>
                    </div>
                    <div style={{height:16}}></div>
                    <ContentTable  columns={columns} tableData={tableData}></ContentTable>
                    {/* {!showDetail ? <ContentTable  columns={columns} tableData={tableData}></ContentTable> : <LoopDetail></LoopDetail>} */}
                </div>
            </div>
        </div>
    )
}
