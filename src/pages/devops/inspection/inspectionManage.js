import React, { useState } from "react";
import style from './style.module.less';
import { DatePicker,Button, Table, Pagination, Switch, Space, Modal, Form, Select, Input, message } from 'antd';
import { SearchOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';
import deleteImg from '../../../assets/image/delete.png'

export default function Index(){

    const { RangePicker } = DatePicker;
    const { Option } = Select;
    const nowTime = ()=>{
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      month = month> 9? month :'0' + month;
      var day = date.getDate();
      day = day>9?day: '0' + day;
      var time = year + "-" + month + "-" + day;
      return time;
    }

    const columns = [{
        title:'计划名称',
        dataIndex:'PlanName',
    },{
        title:'巡检区域',
        dataIndex:'RegionName',
    },{
        title:'计划内容',
        dataIndex:'Task',
    },{
        title:'有效期',
        dataIndex:'Validity',
    },{
        title:'巡检周期',
        dataIndex:'Circle',
    },{
        title:'创建日期',
        dataIndex:'BuildTime',
    },{
        title:'是否启用',
        dataIndex:'Enable',
        render:text => <Switch checked={text} checkedChildren="启用" unCheckedChildren="停用" disabled></Switch>
    },{
        title:'巡检人员',
        dataIndex:'Operator',
    },{
        title:'操作',
        key:'action',
        render:(text, record) => (
            <Space size="middle">
                <span style={{color:'#237ae4',textDecoration:'underline', cursor:'pointer'}} onClick={()=>edit(record)}>编辑</span>
                <span style={{color:'#f00',textDecoration:'underline', cursor:'pointer'}} onClick={()=>deleteData(record)}>删除</span>
            </Space>
        )
    }]

    const dataSource = [
        {   key:'1',
            PlanName:'巡检计划1',
            RegionName:'正泰物联滨江园区',
            Task:'all',
            Validity:'2020/09/10-2020/11/25',
            Circle:'天',
            BuildTime:'2020/08/20',
            Enable:false,
            Operator:'xxx',
        },{ 
            key:'2',
            PlanName:'巡检计划2',
            RegionName:'正泰物联滨江园区',
            Task:'all',
            Validity:'2020/09/11-2020/10/25',
            Circle:'天',
            BuildTime:'2020/08/20',
            Enable:true,
            Operator:'xxx',
        },{
            key:'3',
            PlanName:'巡检计划3',
            RegionName:'正泰物联滨江园区',
            Task:'all',
            Validity:'2020/09/10-2020/11/25',
            Circle:'天',
            BuildTime:'2020/08/20',
            Enable:true,
            Operator:'xxx',
        },
    ]
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const onSelectChange = (newSelectedRowKeys) => {
        console.log( newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
      };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const [dialogTitle, setDialogTitle] = useState('新增巡检计划');
    
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setDialogTitle('新增巡检计划');
        setIsModalOpen(true);
    };
    const [form] = Form.useForm();
    const cancel = () =>{
        form.resetFields();
        setIsModalOpen(false);
    }

    const onFinish = (value) => {
        const values = {
            ...value,
            'StartTime': value['StartTime'].format('YYYY-MM-DD'),
            'EndTime': value['EndTime'].format('YYYY-MM-DD'),
        }
        values.BuildTime = nowTime();
        console.log(values);
        form.resetFields();
        setIsModalOpen(false);
    }

    const [showDate, setShowDate] = useState(false);
    const [options, setOptions] = useState([]);
    const ChangeCircle = (e) => {
        if(e == 'week'){
            setShowDate(true);
            setOptions([{
                label:'周一',
                value:'Mon'
            },{
                label:'周二',
                value:'Tue'
            },{
                label:'周三',
                value:'Wed'
            },{
                label:'周四',
                value:'Thur'
            },{
                label:'周五',
                value:'Fri'
            },{
                label:'周六',
                value:'Sat'
            },{
                label:'周日',
                value:'Sun'
            }])
        }else if(e =='month'){
            setShowDate(true);
            setOptions([{
                label:'1号',
                value:1
            },{
                label:'2号',
                value:2
            }])
        }else{
            setShowDate(false);
        }
    }

    const [disabledStart, setdisabledStart] = useState(null);  
    const changeEndDate = (date,dateString) => {
        setdisabledStart(date);
    }
    const [disabledEnd, setdisabledEnd] = useState(null);  
    const changeStartDate = (date,dateString) => {
        setdisabledEnd(date);
    }
    const disabledDate = (current) => {
        return current > disabledStart;
    };
    const disabledStartDate = (current) => {
        return current < disabledEnd;
    };

    const edit = (value)=>{
        console.log(value);
        setDialogTitle('编辑巡检计划');
        setIsModalOpen(true);
        form.setFieldsValue(value);   
    }

    const [deleteModal, setDeleteModal] = useState(false);
    const deleteData = value => {
        setDeleteModal(true);
    }
    const cancelDelete = () => {
        setDeleteModal(false);
    }
    const confirmDelete = () => {
        setDeleteModal(false);
        message.success('删除成功！');
    }
    

    return(
        <>
            <div className={style.contentHeader}>
                <RangePicker size="middle" style={{width:372}}></RangePicker>
                <Button type="primary" size="middle" icon={<SearchOutlined />} style={{marginLeft:16,width:96}}>查询</Button>
                <Button size="middle" type="primary" icon={<PlusOutlined />} style={{marginLeft:'auto',marginRight:16,width:96,border:'none', background:'#1ab394'}} onClick={showModal}>新增</Button>
                <Button size="middle" type="primary" icon={<CloseOutlined />} style={{marginRight:16,width:100}} danger>批量删除</Button>
                <Button size="middle" style={{width:96}}>导出</Button>
            </div>
            <div className={style.contentTable}>
                <Table rowSelection={rowSelection} bordered dataSource={dataSource} columns={columns} pagination={false}></Table>
                <Pagination 
                total={85} 
                showTotal={total => `共 ${total} 条记录`} 
                defaultCurrent={1}
                showSizeChanger={false} 
                defaultPageSize={10}></Pagination>
            </div>
            <Modal footer={null} closable={false} maskClosable={false} open={isModalOpen}>
                <div className={style.modalTitle}>{dialogTitle}</div>
                <Form form={form}   className={style.dialogForm} onFinish={onFinish} requiredMark={false} >
                    <Form.Item name='RegionId' label='区域名称' 
                    rules={[{required: true,message:'请选择区域'}]}>
                        <Select
                        placeholder="请选择区域"
                        size="middle"
                        style={{width: '320px', marginLeft: '12px'}}>
                            <Option value="1">正泰物联全部园区</Option>
                            <Option value="2">正泰物联滨江园区</Option>
                            <Option value="3">正泰物联温州园区</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name='PlanName' label='计划名称' rules={[{required: true,message:'请输入计划名称'}]}>
                        <Input size="middle" style={{width: '320px', marginLeft: '12px'}}></Input>
                    </Form.Item>
                    <Form.Item name='Task' label='计划内容' rules={[{required: true,message:'请输入计划内容'}]}>
                        <Input size="middle" style={{width: '320px', marginLeft: '12px'}}></Input>
                    </Form.Item>
                    <Form.Item name='Circle' label='巡检周期' 
                    rules={[{required: true,message:'请选择巡检周期'}]}>
                        <Select
                        placeholder="请选择巡检周期"
                        size="middle"
                        onChange={ChangeCircle}
                        style={{width: '320px', marginLeft: '12px'}}>
                            <Option value="day">每日</Option>
                            <Option value="week">每周</Option>
                            <Option value="month">每月</Option>
                        </Select>
                    </Form.Item>
                    {showDate ? <Form.Item name='SelectDate' label='巡检日期' 
                    rules={[{required: true,message:'请选择巡检日期'}]}>
                        <Select
                        placeholder="请选择巡检日期"
                        size="middle"
                        style={{width: '320px', marginLeft: '12px'}}>
                            {options.map((item,index)=>{
                                return <Option value={item.value} key={index}>{item.label}</Option>
                            })}
                        </Select>
                    </Form.Item> : null}
                    <Form.Item name='StartTime' label='开始日期' rules={[{required: true,message:'请选择开始日期'}]}>
                        <DatePicker 
                        size="middle" 
                        style={{width: '320px', marginLeft: '12px'}}
                        onChange={changeStartDate}
                        disabledDate={disabledStart? disabledDate :null} 
                        ></DatePicker>
                    </Form.Item>
                    <Form.Item name='EndTime' label='结束日期' rules={[{required: true,message:'请选择结束日期'}]}>
                        <DatePicker size="middle" style={{width: '320px', marginLeft: '12px'}} 
                        disabledDate={disabledEnd? disabledStartDate :null}  
                        onChange={changeEndDate}></DatePicker>
                    </Form.Item>
                    <Form.Item name='OperatorId' label='巡检人员' rules={[{required: true,message:'请选择巡检人员'}]}>
                        <Select
                        placeholder="请选择巡检人员"
                        size="middle"
                        onChange={ChangeCircle}
                        style={{width: '320px', marginLeft: '12px'}}>
                            <Option value="71">巡检员工001</Option>
                            <Option value="72">巡检员工002</Option>
                            <Option value="73">巡检员工003</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name='Enable' label='是否启用' valuePropName="checked">
                        <Switch style={{marginLeft: 12}} checkedChildren="启用" unCheckedChildren="停用"></Switch>
                    </Form.Item>
                    <Form.Item name='BuildTime' label='创建日期' valuePropName="checked">
                        <span style={{marginLeft: 12,fontSize: 14, color:'#aeaeae'}}>{nowTime()}</span>
                    </Form.Item>
                    <Form.Item style={{display:'flex',justifyContent:'flex-end',paddingBottom: 32,marginRight:48}}>
                        <Button size="middle"  style={{marginLeft:'auto',marginRight:12}} onClick={cancel}>取消</Button>
                        <Button size="middle" type="primary" htmlType="submit" >
                        保存
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal className={style.deleteModal} footer={null} closable={false} maskClosable={false} open={deleteModal}>
                <div className={style.deleteTitle}>删除巡检计划</div>
                <div className={style.deleteContent}>
                    <img src={deleteImg} className={style.deleteImg}></img>
                    <span>确认是否删除选中项目？</span>
                </div>
                <div className={style.deleteFooter}>
                    <Button size="middle"  style={{marginLeft:'auto',marginRight:12}} onClick={cancelDelete}>取消</Button>
                    <Button size="middle" type="primary" danger  onClick={confirmDelete}>确认</Button>
                </div>
            </Modal>
        </>
    )
}