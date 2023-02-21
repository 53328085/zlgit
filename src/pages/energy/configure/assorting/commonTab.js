import React, { useState, useRef, useEffect } from "react";
import ClassfyTree from './classfyTree'
import { energyDesigner } from '@api/api.js'
import { useRequest } from "ahooks";
import Custmodl from '@com/useModal'
import { Input, Form, message, Spin } from "antd";
import warning from '@imgs/warning.png'

export default function Index (props) {
    const [loading, setLoading] = useState(true);
    const aref = useRef()
    const eref = useRef()
    const dref = useRef()
    const iref = useRef()
    const [messageApi, contextHolder] = message.useMessage();
    const [value, setValue] = useState()
    const [changeTag, setChangeTag] = useState('')
    const { queryElectricClassifys, insertEnergyClassify, updateEnergyClassify, deleteEnergyClassify } = energyDesigner
    const type = props.type
    const [form] = Form.useForm()
    const [editform] = Form.useForm()
    const Item = Form.Item
    const getData = () => {
        return queryElectricClassifys(type).then( res => {
            let { success, data } = res
            if(success && data){
                setLoading(false);
                setArrList(data)
            }else{
                messageApi.open({
                    type:'error',
                    content:res.errMsg
                })
            }
        })
    }
    const [arrList, setArrList] = useState()
    const { run:queryData } = useRequest(getData, {
        refreshDeps:[changeTag],
        manual: true,
    })
    useEffect(()=> {
        queryData()
    }, [])
    const dataProps = {
        title: props.title,
        treeData:arrList,
    }

    let changeItem = {};
    let tag = '';
    let inputName = '';

    const getFromChild = values => {
        if(values.tag == 'addSon' || values.tag == 'addParent'){
            aref.current.onOpen()
        }
        if(values.tag == 'edit'){
            console.log(values.data)
            editform.setFieldValue('name',values.data.energyName);
            eref.current.onOpen()
        }
        if(values.tag == 'delete'){
            dref.current.onOpen()
        }
        if(values.tag == 'importData'){
            iref.current.onOpen()
        }
        changeItem = values.data;
        tag = values.tag;
    }
    //新增
    const insertData = () => {
        return insertEnergyClassify(changeItem.energyId? changeItem.energyId:0, type, inputName).then(res => {
            let { success, data }  = res
            if(success){
                messageApi.open({
                    type:'success',
                    content:'新增能耗分类成功',
                })
            }else{
                messageApi.open({
                    type:'error',
                    content:res.errMsg
                })
            }
            form.resetFields();
        })
    }

    const { run:insertRun } = useRequest(insertData, {
        manual: true,
        onSuccess: (result, params) => {
            queryData()
        },
        onError: (err) => { console.log('请求失败了'); },
    })
    //编辑
    const updateData = () => {
        return updateEnergyClassify(type, changeItem.energyId, inputName).then(res =>{
            let {success} = res
            if(success){
                messageApi.open({
                    type:'success',
                    content:'分类名称修改成功'
                })
            }else{
                messageApi.open({
                    type:'error',
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
        return deleteEnergyClassify(changeItem.energyId).then (res => {
            let { success } = res
            if(success){
                messageApi.open({
                    type:'success',
                    content:'删除能耗分类成功',
                })
            }else{
                messageApi.open({
                    type:'error',
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
            const values = await form.validateFields();
            inputName = values.name
            aref.current.onCancel()
            insertRun()
        }catch(errorInfo){}
    }
    const onUpdate = async () => {
        try {
            const values = await editform.validateFields();
            inputName = values.name
            eref.current.onCancel()
            updateRun()
        }catch(errorInfo){}
    }
    const onDelete = () => {
        dref.current.onCancel()
        deleteRun()
    }
    //批量导入
    const onUpload = () => {
        iref.current.onCancel()
    }
    
    return (
        <Spin tip='Loading...' spinning={loading}>
            {contextHolder}
            <ClassfyTree getValues={getFromChild} {...dataProps}></ClassfyTree>
            <Custmodl title='新增能耗分类' ref={aref}  mold="cust" width={512} onOk={onOk}>
                <div style={{display:"flex", alignItems: "center"}}>
                    <Form name='addform' labelCol={{span:7}} form={form} labelAlign={'left'} requiredMark={false} autoComplete='off'>
                        <Item label='新增分类名称' name='name' rules={[{required:true, message:'分类名称不能为空'}]}>
                            <Input style={{width:'315px'}} placeholder={'请输入分类名称'}></Input>
                        </Item>
                    </Form>
                </div>
            </Custmodl>
            <Custmodl title='编辑能耗分类' ref={eref}  mold="cust" width={512} onOk={()=>onUpdate()}>
                <div style={{display:"flex", alignItems: "center"}}>
                    <Form name='editform' labelCol={{span:7}} form={editform} labelAlign={'left'} requiredMark={false} autoComplete='off'>
                        <Item label='编辑分类名称' name='name' rules={[{required:true, message:'分类名称不能为空'}]}>
                            <Input style={{width:'315px'}} placeholder={'请输入分类名称'}></Input>
                        </Item>
                    </Form>
                </div>
            </Custmodl>
            <Custmodl title='删除能耗分类' ref={dref}  mold="cust" width={512} type="warn" onOk={()=>onDelete()}>
                <div style={{display:"flex", alignItems: "center"}}>
                    <img style={{marginLeft:64, marginRight: 32}} src={warning}></img>
                    <span> 是否确认删除选中的能耗分类名称？ </span>
                </div>
            </Custmodl>
            <Custmodl title='批量导入' ref={iref}  mold="cust" width={600} onOk={()=>onUpload()}>
                <div style={{display:"flex", alignItems: "center"}}>
                    
                </div>
            </Custmodl>
        </Spin>
        
    )
}