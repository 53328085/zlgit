import React,{useEffect, useState} from 'react'
import { Form, Select, Button, Checkbox, message } from 'antd'
import WarnContent from './warncontent'
import style from './style.module.less'
import { useSelector } from 'react-redux'
import total from '../imgs/total.png'
import first from '../imgs/first.png'
import second from '../imgs/second.png'
import third from '../imgs/third.png'
import {warnDetail} from '@api/api'
const { Item } = Form
export default function Index() {
    const projectId = useSelector(state => state.system.menus.projectId)
    const arealist = useSelector(state => state.system.onelevel)
    const onelevel = arealist[0]?.levelName
    const [form] = Form.useForm()
    const [warndata,setWarndata]=useState(null)
    //获取告警
    const warnTotal = async (areaId) => {
        let param={
            projectId,
            areaId:areaId?areaId:0
        }
        const res = await warnDetail.QueryWarningStatistics(param)
        if(res.success){
            setWarndata(res.data)
        }else{
            message.error(res.errMsg)
        }
    }
    //改变区域
    const changeArea=async(v)=>{
        console.log(v)
     warnTotal(v)
     
    }
    useEffect(()=>{
        console.log(onelevel)
        if(onelevel){
            warnTotal() 
        }
       
    },[])
    return (
        <div className={style.warning}>
            <div className={style.header}>
                <Form
                    layout='inline'
                    form={form}
                    className={style.formstyle}
                    colon={false}
                    initialValues={
                        {
                            area:onelevel?0:null
                        }
                    }
                >
                    <Item label={onelevel} name="area">
                        <Select
                            style={{ width: 200 }}
                            options={onelevel?[{ name: onelevel, id: 0 }, ...arealist]:[]}
                            fieldNames={{ label: 'name', value: 'id' }}
                            onChange={changeArea}
                        >
                        </Select>
                    </Item>
                </Form>
            </div>
            <div style={{ display: 'flex' }}>
                <Card count={warndata?.allCnt} />
                <Card png={first} count={warndata?.levelOneCnt} percent={warndata?.levelOneRate} name="一级告警"/>
                <Card png={second} count={warndata?.levelTwoCnt} percent={warndata?.levelTwoRate} name="二级告警"/>
                <Card png={third} count={warndata?.levelThreeCnt} percent={warndata?.levelThreeRate} name="三级告警"/>
            </div>

            <WarnContent style={style} form={form}/>
        </div>
    )
}

let Card = ({ png = total ,count=0,percent=0,name="告警总数"}) => {
    const divcss = {
        width: 320,
        height: 64,
        border: '1px solid #d7d7d7',
        background: '#fff',
        borderRadius: 4,
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        fontSize: 18,
        marginTop: 16,
        marginRight: 16
    }
    return (
        <div style={divcss}>
            <img src={png} alt="" />
            <span style={{ fontSize: 16, paddingLeft: 16 }}>{name}</span>  
            {png!==total?
            <>
             <div style={{ paddingLeft:32}}>{count}</div>
             <div style={{ fontSize: 14,marginLeft: 'auto' }}>{percent}%</div>
            </>
            :<div style={{ marginLeft: 'auto'}}>{count}</div>}   
        </div>
    )
}
