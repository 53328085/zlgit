import React, { useState, useRef, useEffect, useMemo } from "react";
import ClassfyTree from './classfyTree'
import { energyDesigner } from '@api/api.js'
import { useRequest } from "ahooks";
import Custmodl from '@com/useModal'
import  CustTable from "@com/useTable"
import { Input, Form, message, Spin, Upload, Modal, Table,DatePicker } from "antd";
import dayjs from 'dayjs';
import style from './style.module.less'
import UseTransfer from '@com/useTransfer/assorting'
import { useSelector } from 'react-redux'
import { selectProjectId } from '@redux/systemconfig.js'
import upload from '@imgs/upload.png'
import { Cspin} from '@com/comstyled'
import { useGetPublicConsumeCategoryQuotas, useSetPublicConsumeCategoryQuotas} from './api'
import {Content} from "./style"
import {useColumns,EditableCell} from "./data"
import { CustButtonT } from "@com/useButton";
 
 
 

export default function Index(props) {
    const firsthalfyear = useColumns(0)
    const secondhalfyear = useColumns(6)
   // console.log(secondhalfyear)
    const [qform] = Form.useForm()
    const [isAdd, setIsAdd] = useState(false)
    const [tableData, setTableData] = useState([])
   
    const  time =useRef(dayjs())
   // const curryear = time.format('YYYY')
    const { Dragger } = Upload
    const projectId = useSelector(selectProjectId);
    const [loading, setLoading] = useState(true);
    const aref = useRef()
    const eref = useRef()
    const dref = useRef()
    const iref = useRef()
    const errRef = useRef()
    const qref =useRef()
    const [messageApi, contextHolder] = message.useMessage();
    const [value, setValue] = useState()
    const [changeTag, setChangeTag] = useState('')
    const {
        queryElectricClassifys,
        insertEnergyClassify,
        updateEnergyClassify,
        deleteEnergyClassify,
        queryEnergyConfigedDevicesInfo,
        queryEnergyNoConfigedDevices,
        saveEnergyDevices,
        insertEnergyClassifys
    } = energyDesigner
    const type = props.type
    const [form] = Form.useForm()
    const [editform] = Form.useForm()
    const Item = Form.Item
    const getData = () => {
        return queryElectricClassifys(projectId, type).then(res => {
            let { success, data } = res
            if (success && data) {
                setLoading(false);
                setArrList(data)
            } else {
                messageApi.open({
                    type: 'error',
                    content: res.errMsg
                })
            }
        })
    }
    const [arrList, setArrList] = useState()
    const { run: queryData } = useRequest(getData, {
        refreshDeps: [changeTag],
        manual: true,
    })
    useEffect(() => {
        queryData()
    }, [])
    const dataProps = {
        title: props.title,
        treeData: arrList,
    }

    let changeItem = {};
    let tag = '';
    let inputName = '';
    const [energyId, setEnergyId] = useState();
    const getQuota =async (id, t)=> {
        try {
             time.current = t
             let publicConsumeCategoryId = id  || energyId;
            if(!publicConsumeCategoryId) return message.error('请选择设备分类！')
            let query = {
                projectId,
                year:time.current.format('YYYY'),
                publicConsumeCategoryId,
            }
          let {success, data} =  await useGetPublicConsumeCategoryQuotas(query)
          if(success ){ 
            if(Array.isArray(data?.datas)&& data?.datas.length) {
                let obj={
                    name: "去年同比能耗（kWh）"  
                }
                let obj2={
                    name:"能耗定额设置（kWh）"
                }
                data.datas?.forEach((item) => { 
                    const {month,quotaValue,referenceValue} = item 
                    obj[month] = referenceValue
                    obj2[month]=quotaValue
                }) 
                
                setTableData([obj,obj2])
                for (let [key, value] of Object.entries(obj2)) {
                    qform.setFieldValue([key, "quotaValue"],  value)
               }
            }
          //  qform.setFieldValue("year", typeof data.year=="number" ? dayjs(data.year, "YYYY")  : dayjs())
            qref.current.onOpen()
            
          }

        } catch (error) {
            console.log(error)
        }

       
    }
    const getFromChild = values => {
        setEnergyId(values.data.energyId);
        changeItem = values.data;
        tag = values.tag;
        if (values.tag == 'addSon' || values.tag == 'addParent') {
            aref.current.onOpen()
            setIsAdd(true)
        }
        if (values.tag == 'edit') {
            editform.setFieldValue('name', values.data.energyName);
            eref.current.onOpen()
            setIsAdd(false)
        }
        if (values.tag == 'settings') {
            setTransferTitle({
                mainTitle: '',
                subTitle: values.data.energyName,
                unknownTitle: '未选中的设备',
            })
            /* setTimeout(() => {
                setRun() 
            }, 200) */
            setTransTag('open');
            props.getValues('open')
        }
        if (values.tag == 'delete') {
            dref.current.onOpen()
        }
        if (values.tag == 'importData') {
            // iref.current.onOpen()
            setFileList([])
            setAddModal(true)
        }else if(values.tag == 'config') {
            getQuota(values.data.energyId, dayjs())
        }

    }
    //新增
    const insertData = () => {
        return insertEnergyClassify(projectId, energyId ? energyId : 0, type, inputName).then(res => {
            let { success, data } = res
            if (success) {
                messageApi.open({
                    type: 'success',
                    content: '新增能耗分类成功',
                })
            } else {
                messageApi.open({
                    type: 'error',
                    content: res.errMsg
                })
            }
            form.resetFields();
        })
    }

    const { run: insertRun } = useRequest(insertData, {
        manual: true,
        onSuccess: (result, params) => {
            queryData()
        },
        onError: (err) => { console.log('请求失败了'); },
    })
    //编辑
    const updateData = () => {
        return updateEnergyClassify(projectId, type, energyId, inputName).then(res => {
            let { success } = res
            if (success) {
                messageApi.open({
                    type: 'success',
                    content: '分类名称修改成功'
                })
            } else {
                messageApi.open({
                    type: 'error',
                    content: res.errMsg
                })
            }
        })
    }
    const { run: updateRun } = useRequest(updateData, {
        manual: true,
        onSuccess: (result, params) => {
            queryData()
        },
        onError: (err) => { console.log('请求失败了'); },
    })
    //删除
    const deleteData = () => {
        return deleteEnergyClassify(projectId, energyId).then(res => {
            let { success } = res
            if (success) {
                messageApi.open({
                    type: 'success',
                    content: '删除能耗分类成功',
                })
            } else {
                messageApi.open({
                    type: 'error',
                    content: res.errMsg,
                })
            }
        })
    }
    const { run: deleteRun } = useRequest(deleteData, {
        manual: true,
        onSuccess: (result, params) => {
            queryData()
        },
        onError: (err) => { console.log('请求失败了'); },
    })

    const onOk = async () => {
        try {
            return form.validateFields().then(async () => {
                const values = await form.validateFields();
                inputName = encodeURIComponent(values.name)
                if (!isAdd) aref.current.onCancel()
                insertRun()
            })
        } catch (errorInfo) { }
    }
    const onUpdate = async () => {
        try {
            const values = await editform.validateFields();
            inputName = encodeURIComponent(values.name)
            eref.current.onCancel()
            updateRun()
        } catch (errorInfo) { }
    }
    const onDelete = () => {
        dref.current.onCancel()
        deleteRun()
    }
    //批量导入
    const [addModal, setAddModal] = useState(false)
    const handleCancel = () => {
        setAddModal(false)
    }
    const [fileList, setFileList] = useState([]);
    const propData = {
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        accept: '.xls,.xlsx',
        beforeUpload: (file) => {
            console.log(file)
            setFileList([file]);
            return false;
        },
        fileList,
    };
    const onUpload = () => {
        let formData = new FormData()
        formData.append('projectId', projectId)
        formData.append('type', type)
        formData.append('file', fileList[0])
        insertEnergyClassifys(formData).then(res => {
            if (res.success) {
                let { success, data } = res.data
                if (success) {
                    messageApi.open({
                        type: 'success',
                        content: '批量导入成功!'
                    })
                    setAddModal(false)
                } else {
                    messageApi.open({
                        type: 'error',
                        content: res.data.errMsg
                    })
                    setErrorData(data);
                    setAddModal(false)
                    errRef.current.onOpen()
                }
            } else {
                messageApi.open({
                    type: "error",
                    content: res.errMsg
                })
                setAddModal(false)
            }
        })
    }
    const [errorData, setErrorData] = useState();
    const errColumns = [{
        title: '错误行数',
        width: 100,
        dataIndex: 'row',
        key: 'row',
        align: 'center',
    }, {
        title: '错误原因',
        dataIndex: 'cause',
        key: 'cause',
        align: 'center',
    }]
    const onCloseError = () => {
        errRef.current.onCancel();
    }

    //transfer
    const [transferTitle, setTransferTitle] = useState({})
    const mainTable = []
    const [subTable, setSubTable] = useState([])

    const [unknownTable, setUnknownTable] = useState([])
    const params =useMemo(()=>({
        projectId,
        type,
        classifyId:energyId,
       // areaId,
      }), [projectId, type, energyId])
       //已选设备
    const getConfigedDevice = () => {
        return queryEnergyConfigedDevicesInfo({projectId, type, classifyId:energyId,areaId}).then(res => {
            if (res.success && res.data) {
                setSubTable(res.data.relations)
                setUnknownTable(res.data.noRelations)
            } else {
                messageApi.open({
                    type: 'error',
                    content: res.errMsg
                })
            }
        })
    }
    const { run: setRun } = useRequest(getConfigedDevice, {
        manual: true,
        onSuccess: (result, params) => { }
    })
    //未选设备
    const columns = [
        {
            align: 'center',
            title: '设备编号',
            dataIndex: 'sn',
            key: 'sn'
        }, {
            align: 'center',
            title: '设备名称',
            dataIndex: 'deviceName',
            key: 'deviceName'
        }, {
            align: 'center',
            title: '安装地址',
            dataIndex: 'address',
            key: 'address'
        }
    ]

    const [transTag, setTransTag] = useState('')

    const getCloseValue = params => {
        setTransTag(params)
        props.getValues(params)
    }

    const getSaveValue = params => {        
        let arr = [];
        if (params.subData.length > 0) {
            params.subData.map(item => {
                arr.push(item.sn)
            })
        }
        let areaId =Array.isArray(params?.areaId)  ?  params?.areaId?.[0] : params?.areaId
        console.log(areaId)
        saveEnergyDevices(projectId, type, energyId, areaId, arr).then(res => {
            if (res.success) {
                messageApi.open({
                    type: 'success',
                    content: '能耗设备配置成功!'
                })
              //  setTransTag('close');
                props.getValues('close')
            } else {
                messageApi.open({
                    type: 'success',
                    content: res.errMsg || '能耗设备配置保存失败，请重试！'
                })
            //    setTransTag('close');
               props.getValues('close')
            }
        })
    }
    const onQuotas=async()=>{
        try {
          let  values =   await qform.validateFields()
          
          let body ={
            year:time.current?.format('YYYY'),
            projectId,
            publicConsumeCategoryId:energyId,
            datas:Object.values(values)
          }
           let {success, errMsg} = await  useSetPublicConsumeCategoryQuotas({}, body)
           if(success) {
              message.success("设置成功")
              qref.current.onCancel()

           }else {
            message.error(errMsg || "设置失败")
           }
        } catch (error) {
            console.log(error)
        }
    }
    const onSwitch=()=> {
        try {
            const [obj1] = tableData
            for (let [key, value] of Object.entries(obj1)) {
                 qform.setFieldValue([key, "quotaValue"],  value)
            }
            
        } catch (error) {
            
        }
        
    }
    const changeTime=(e)=> {
        setTime(e)
        getQuota(undefined,e)
    }
    return (
        <Cspin tip='Loading...' spinning={loading} >
            {contextHolder}
            <ClassfyTree getValues={getFromChild} {...dataProps}></ClassfyTree>
            <Custmodl title='新增能耗分类' ref={aref} mold="cust" width={512} onOk={onOk} custft={isAdd}>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <Form name='addform' labelCol={{ span: 7 }} form={form} labelAlign={'left'} requiredMark={false} preserve={false} >
                        <Item label='新增分类名称' name='name' rules={[{ required: true, message: '请输入分类名称' }]} normalize={v => v.trim()} >
                            <Input style={{ width: '315px' }} placeholder={'请输入分类名称'} allowClear autoComplete='off'></Input>
                        </Item>
                    </Form>
                </div>
            </Custmodl>
            <Custmodl title='编辑能耗分类' ref={eref} mold="cust" width={512} onOk={() => onUpdate()}>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <Form name='editform' labelCol={{ span: 7 }} form={editform} labelAlign={'left'} requiredMark={false} preserve={false}>
                        <Item label='编辑分类名称' name='name' rules={[{ required: true, message: '分类名称不能为空' }]} normalize={v => v.trim()}>
                            <Input style={{ width: '315px' }} placeholder={'请输入分类名称'} autoComplete='off' allowClear></Input>
                        </Item>
                    </Form>
                </div>
            </Custmodl>
            <Custmodl title={`定额配置`} ref={qref} mold="cust" width={890} onOk={onQuotas}>
                <Content>
                
                 <div className="tool">
                    
                        <DatePicker picker="year" style={{ width: 200 }}   onChange={(e)=> getQuota(undefined,e)}  defaultValue={dayjs()} />
                    
                     <CustButtonT  wh="auto" text="matchenergy" onClick={onSwitch}  /></div> 
                     <Form form={qform} component={false} preserve={false}>
                    <div key="first">
                    <CustTable 
                    components={{
                        body: {
                            cell: EditableCell,
                          },

                    }}
                    columns={firsthalfyear} 
                    dataSource={tableData} ></CustTable>
                    </div>
                     <div key="second">
                        <CustTable 
                        components={{
                            body: {
                                cell: EditableCell,
                            },

                        }}
                        columns={secondhalfyear} 
                        dataSource={tableData}></CustTable>
                     </div>
                   
                  </Form>
                   
                </Content>
            </Custmodl>
            <Custmodl title='删除能耗分类' ref={dref} mold="cust" width={512} type="warn" onOk={() => onDelete()}>
                是否确认删除选中的能耗分类名称？
            </Custmodl>
            <Modal className={style.addModal} open={addModal} onOk={onUpload} onCancel={handleCancel} width={600} cancelText={'取消'} centered={true} closable={false} maskClosable={false} okText={'确定'} okType={'primary'} >
                <div className={style.addHeader}>批量导入</div>
                <div className={style.addBody}>
                    <div style={{ display: "flex", alignItems: "center", position: 'relative' }}>
                        <Dragger {...propData} maxCount={1}>
                            <div style={{ width: 536, height: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: 16 }}>
                                <img style={{ width: 84, height: 60, marginTop: 44 }} src={upload}></img>
                                <p style={{ marginTop: 24, marginBottom: 24 }}>将文件拖到此处，或<span style={{ color: '#237ae4', textDecoration: 'underline', cursor: 'pointer' }}>点击上传</span></p>

                            </div>
                        </Dragger>
                        <a style={{ position: 'absolute', top: 180, left: 233, fontSize: 16, width: 70, textAlign: 'center', color: '#237ae4', textDecoration: 'underline', cursor: 'pointer', zIndex: 1000 }} href='/energyTemplate.xlsx' download>下载模板</a>
                    </div>
                </div>
            </Modal>

            <UseTransfer mask={transTag} transferTitle={transferTitle} columns={columns} params={params}  saveValue={getSaveValue} closeValue={getCloseValue} showarea={true}></UseTransfer>

            <Custmodl title='错误原因' ref={errRef} mold="cust" width={600} onOk={() => onCloseError()}>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <Table columns={errColumns} dataSource={errorData} bordered size='middle' rowKey='row' pagination={false} scroll={{ y: 300 }}></Table>
                </div>
            </Custmodl>
        </Cspin>

    )
}