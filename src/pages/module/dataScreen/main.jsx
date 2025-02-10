import React, { useEffect, useState, useRef } from 'react'
import styled, {css} from 'styled-components'
import {Form,message,} from 'antd' 
import {useRequest} from 'ahooks'
import { useDispatch } from "react-redux";
import {BigScreen} from '@api/api'

import Titlelayout from '@com/titlelayout'
import {SaveButton} from '@com/useButton'
 
import {  getdataScreen } from "@redux/systemconfig";
import Citem from './Citem'
import {useTranslation} from "react-i18next"
const Mainbox = styled.div`
    && {
       flex: 1; 
       display: flex;
       }
`
const csstys =css`
    row-gap: 16px;
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
        grid-template-columns: 1fr;
         .ant-form-item {
            margin-right: 0;
           
        }
         .ant-form-item-with-help {
            margin-bottom: 0px;
        }
        .ant-form-item-label > label.ant-form-item-required:not(.ant-form-item-required-mark-optional)::before {
            display: none;
        }
        ${props => props.theme.laptop ? csstys : null}
    }
`





export default function Main({projectId}) {
    const dispath = useDispatch()
    const [form] = Form.useForm()
    const {t} =useTranslation("common","comm")
    const screens = [
        {label: t("common:ProjectComprehensiveScreen"), name1: 'bigScreenEnabled', name2: 'bigScreenUrl'},
        {label: t("common:OperationMonitoring"), name1: 'monitorBigScreenEnabled', name2: 'monitorBigScreenUrl'},
        {label: t("common:ElectricalSafety"), name1: 'safeBigScreenEnabled', name2: 'safeBigScreenUrl'},
        {label: t("common:DistributionManagemet"), name1: 'distributionEnabled', name2: 'distributionScreenUrl'},
        {label: t("common:SettlementFee"), name1: 'prepayEnabled', name2: 'prepayScreenUrl'},
        {label: t("common:EnergyManagement"), name1: 'energyEnabled', name2: 'energyScreenUrl'},
        {label: t("common:PhotovoltaicEnergy"), name1: 'solarEnabled', name2: 'solarScreenUrl'},
        {label: t("common:StorageManagement"), name1: 'storageEnabled', name2: 'storageScreenUrl'},
        {label: t("common:CarbonEmissionManagement"), name1: 'carbonEnabled', name2: 'carbonScreenUrl'},
        {label: t("common:OperationMaintenanceManagement"), name1: 'maintenanceEnabled', name2: 'maintenanceScreenUrl'},
    
    ]
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
             
            <Formbox layout="inline" form={form}  colon={false} labelCol={{ span: 4 }} labelAlign='left'>
            {screens.map(s => <Citem label={s.label} name1={s.name1} name2={s.name2} key={s.name2} form={form} /> )}
           </Formbox> 
                
            </Mainbox>
          
    </Titlelayout>
  )
}
