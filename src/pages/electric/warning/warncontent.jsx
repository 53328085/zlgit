import React, { useEffect, useState } from 'react'
import {useSelector} from 'react-redux'
import { Input, Button,Form,Select,DatePicker,Divider, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons'
import UserTable from '@com/useTable'
import { columns } from './columns'
import { useAntdTable, usePagination } from 'ahooks'
import BlueColumn from '@com/bluecolumn'
import {warnDetail} from '@api/api'
import moment from 'moment';

const { Search } = Input;
const {RangePicker } = DatePicker
export default function Warncontent({ style,form }) {

    const [warnform] =Form.useForm()
    const projectId = useSelector(state => state.system.menus.projectId)

    const [tableParams, setTableParams] = useState({
          current: 1,
          pageSize: 10,
          hideOnSinglePage:false
      });
    const [tabledata,setTabledata]=useState([])
    const datetypes=[
        {
            label:'日',
            value:0
        },
        {
            label:'月',
            value:1
        },
        {
            label:'年',
            value:2
        }
    ]
    const warntype=[
        {label:'全部告警',value:0},
        {label:'一级告警',value:1},
        {label:'二级告警',value:2},
        {label:'三级告警',value:3},
    ]
    const statusOptions=[{
        label:'全部',
        value:0,
    },{
        label:'告警',
        value:1,
    },{
        label:'消警',
        value:2,
    }]
     //获取日期格式
//   const getdateformat = () => {
//     let date = warnform.getFieldsValue().datevalue
//     const type =warnform.getFieldsValue().datetype
//     if (type === 0) {
//       date = moment(date).format('YYYY-MM-DD')
//     } else if (type === 1) {
//       date = moment(date).format('YYYY-MM-01')
//     } else if (type === 2) {
//       date = moment(date).format('YYYY-01-01')
//     }
//     return date
//   }
  
    //获取告警信息
    const getTableData=async(pageNum,pageSize)=>{
        const datevalue =warnform.getFieldsValue().datetype
        const start = datevalue[0].format('YYYY-MM-DD')
        const end = datevalue[1].format('YYYY-MM-DD')
        
        let param = {
            pageNum:pageNum?pageNum:tableParams.current,
            pageSize:pageSize?pageSize:tableParams.pageSize,
            projectId,
            level:warnform.getFieldsValue().warn,
            start,
            end,
            status:warnform.getFieldsValue().status,
            areaId:form.getFieldValue('area')?form.getFieldValue('area'):0
        }
        const res = await warnDetail.QueryWarningDetails(param)
      
        if(res.success){
            setTableParams({
                ...tableParams,
                current: res.pageNum,
                pageSize: res.pageSize,
                total:res.total
            })
            if(res.data&&res.data.length>0){
                setTabledata(()=>(res.data)) 
            }else{
                setTabledata([])
            }
           
        }else{
           message.error(res.errMsg) 
        }
    }
    //改变告警等级
    const changeWarnType=()=>{
        getTableData(1)
    }
 
    //日历面板切换
    const changeDateType=(v)=>{
        if(!v){
            getTableData(1)
        }    
    }
  
    //改变日期
    // const changeDate=()=>{
    //     getTableData(1)
    // }
    //页码修改
    const changePage=(page,pageSize)=>{
        console.log(page,pageSize)
        getTableData(page.current,page.pageSize)
        // setTableParams({...page})
       
    }
    const changeStatus=()=>{
        getTableData(1)
    }
    useEffect(()=>{
        getTableData()
        // if(form.getFieldValue('area')){
           
        // }
     
    },[form.getFieldValue('area')])

    return (
        <div className={style.WarnContent}>
            <div className={style.SearchContent}>
                <BlueColumn name="告警信息"/>
                <Form 
                 layout="inline"
                 colon={false}
                 form={warnform}
                 initialValues={{
                    status:0,
                    warn:0,
                    datetype:[moment(),moment()]
              
                 }}
                >
                    <Form.Item
                    label="告警状态"
                    name="status"
                    >
                    <Select options={statusOptions} style={{width:112}} onChange={changeStatus}></Select>
                    </Form.Item>
                    <Divider type='vertical' dashed style={{borderColor:'#d7d7d7',height:'100%',margin:'0 32px'}}></Divider>
                    <Form.Item
                    label="告警等级"
                    name="warn"
                    >
                    <Select options={warntype} style={{width:112}} onChange={changeWarnType}></Select>
                    </Form.Item>
                    <Divider type='vertical' dashed style={{borderColor:'#d7d7d7',height:'100%',margin:'0 32px'}}></Divider>
                    <Form.Item
                    label="告警时间"
                    name="datetype"
                    >
                    {/* <Select options={datetypes} style={{width:80}} onChange={changeDateType}></Select> */}
                    <RangePicker 
                    separator="至"
                    onOpenChange={changeDateType}
                    ></RangePicker>
                    </Form.Item>
                    {/* <Form.Item name="datevalue">
                    <DatePicker  style={{width:160}} picker={type===0?'date':type===1?'month':'year'} onChange={changeDate}></DatePicker>
                    </Form.Item> */}
                </Form>
            </div>
         
            <div style={{ marginTop: 16,minHeight:650,display:'flex',flexDirection:'column' }}>
            <Divider  dashed style={{borderColor:'#d7d7d7',margin:' 16px 0'}}></Divider>
                <UserTable 
                columns={columns} 
                dataSource ={tabledata}   
                rowKey="sn"  
                pagination={tableParams} 
                onChange={changePage}
                className={style.tbheight}
                ></UserTable>
            </div>

        </div>
    )
}
