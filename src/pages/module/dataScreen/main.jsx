import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import {Form,message,} from 'antd' 
import {useRequest} from 'ahooks'
import { useDispatch } from "react-redux";
import {BigScreen} from '@api/api'

import Titlelayout from '@com/titlelayout'
import {SaveButton} from '@com/useButton'
 
import {  getdataScreen } from "@redux/systemconfig";
import Citem from './Citem'

const Mainbox = styled.div`
    && {
       flex: 1; 
       display: flex;
       }
`
const Formbox = styled(Form)`
    && {
        flex:1;
        display: grid;
        margin-top: 16px;
        grid-template-rows: 36px;
        row-gap: 32px;
        padding: 32px 0px;
        border-top: 1px dotted #d7d7d7;
        grid-template-columns: 1200px;
         .ant-form-item {
            margin-right: 0;
           
        }
         .ant-form-item-with-help {
            margin-bottom: 0px;
        }
        .ant-form-item-label > label.ant-form-item-required:not(.ant-form-item-required-mark-optional)::before {
            display: none;
        }
    }
`




const screens = [
    {label: "项目综合大屏", name1: 'bigScreenEnabled', name2: 'bigScreenUrl'},
    {label: "运行监控", name1: 'monitorBigScreenEnabled', name2: 'monitorBigScreenUrl'},
    {label: "电气安全", name1: 'safeBigScreenEnabled', name2: 'safeBigScreenUrl'},
    {label: "配电管理", name1: 'distributionEnabled', name2: 'distributionScreenUrl'},
    {label: "结算收费", name1: 'prepayEnabled', name2: 'prepayScreenUrl'},
    {label: "能源管理", name1: 'energyEnabled', name2: 'energyScreenUrl'},
    {label: "光伏发电", name1: 'solarEnabled', name2: 'solarScreenUrl'},
    {label: "储能管理", name1: 'storageEnabled', name2: 'storageScreenUrl'},
    {label: "碳排管理", name1: 'carbonEnabled', name2: 'carbonScreenUrl'},
    {label: "运维管理", name1: 'maintenanceEnabled', name2: 'maintenanceScreenUrl'},

]
export default function Main({projectId}) {
    const dispath = useDispatch()
    const [form] = Form.useForm()
  // UpdateSiteOnOffGrid
  const QueryBigScreen = () => {
    return BigScreen.QueryBigScreen(projectId).then(res => {
         let {success, data} = res
         if (success && data) {
            return data
         }else {
            return {}
         }
    }).catch(e => {
         return e
    })
  }


 const {run } = useRequest(QueryBigScreen, {    
    onSuccess: (res) => {     
        dispath(getdataScreen(res))
        form.setFieldsValue({
            ...res
         })
    },
    onError: (e) => {
        console.log(e)
    },
    refreshDeps: [projectId]
 })

  const onSet = async () => {
    let params = await form.validateFields().then(res => res).catch(() => null)      
   if(!params) return Promise.reject('参数出错')
    return BigScreen.SetBigScreen(projectId, params).then(res => {
       let {success } = res
        return success
    })
  }
 
 const {loading, run: onSave} = useRequest(onSet, {
    manual: true,
    onSuccess: (s) => {
       if(s)  {      
        message.success({content: '保存成功', duration: 0.3})
        run()
       }
       
    },
    onError: (e) => {
        message.error({content: e.message || '数据出错',duration: 0.3})
        console.log(e)
    }
 })

  return (
    <Titlelayout title={<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}><span>数据大屏设置</span><SaveButton    loading={loading} onClick={onSave} isicon={false} /></div>}>
        <Mainbox>
             
            <Formbox layout="inline" form={form}  colon={false} labelCol={{ span: 3 }} labelAlign='left'>
            {screens.map(s => <Citem label={s.label} name1={s.name1} name2={s.name2} key={s.name2} form={form} /> )}
           </Formbox> 
                
            </Mainbox>
          
    </Titlelayout>
  )
}
