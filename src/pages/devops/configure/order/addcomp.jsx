
import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle, Fragment, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Divider, Select, Tree, Row, Col, Input, Form, message, Drawer, Table,Button } from 'antd'
import { publishState } from '@redux/systemconfig'
import BlueColumn from '@com/bluecolumn'
import commonstyle from './commonstyle.module.less'
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import {operationDesigin} from '@api/api'
import {SetPosition} from './position'

//配置线路
export let SetLine = forwardRef(({  getQueryPageDevice,areaId }, ref) => {
    const [open,setOpen] = useState(false)
    const publish = useSelector(publishState)
    const { Search } = Input;
    const [dataSource, setDataSource] = useState([])//未选data
    const [copydataSource, setCopydataSource] = useState([])
    const [selectedRowKeys, setSelectedRowKeys] = useState(null);//未选线路check
    const [selectedRows, setSelectedRows] = useState([]);//未选线路选中data
    const [subMeter, setSubMeter] = useState([]); //已选择设备data
    const [subMeterRowKeys, setSubMeterRowKeys] = useState([]);//选中check
    const [subSelectedRows, setSubSelectedRows] = useState([]);//选中设备data

    const [lineId, setLineId] = useState(null);
    const [searchValue, setSearchValue] = useState(""); //搜索值
    const [devicetype,setDeviceType] = useState(0);//设备类型
    const projectId = useSelector(state => state.system.menus.projectId)
    const positionRef =useRef()
    const deviceoptions=[
        {label:'全部',value:0},
        {label:'电表',value:1},
        {label:'水表',value:2},
        {label:'燃气表',value:3},
        {label:'传感器',value:4},
        {label:'变压器',value:5},
        {label:'储能设备',value:11}
    ]
    const columns = [
        { title: '设备编号', dataIndex: 'sn', align: "center", width: 201 },
        { title: '设备名称', dataIndex: 'name', align: "center", width: 201 },
        { title: '安装地址', dataIndex: 'address', align: "center", },

    ]
    const btncss = {
        width: 68,
        height: 46,
        background: "#237ae4",
        textAlign: 'center',
        lineHeight: '46px',
        borderRadius: 4,
        cursor: 'pointer',
    }
    const btnstyle = {
        width: 146,
        height: 40,
        background: '#237ae4',
        textAlign: 'center',
        lineHeight: '40px',
        color: '#fff',
        borderRadius: 4,
        cursor: 'pointer',
    }
     //获取已选和未选设备
  const getQueryDeviceList=async(deviceStyle=0,alike="")=>{
    let params={
      projectId,
      areaId,
      deviceStyle,
      alike
    }
   const res = await operationDesigin.QueryDeviceList(params)
   if(res.success){
    setDataSource([...res.data.unused])
    setCopydataSource([...res.data.unused])
    setSubMeter([...res.data.used])
   }else{
    setDataSource([])
    setSubMeter([])
    message.error(res.errMsg)
   }
  }
    //关闭抽屉
    const close = () => {
        setOpen(false)
        setSearchValue("")
        setDeviceType(0)
        setSelectedRowKeys([])
        setSelectedRows([])
        setSubMeterRowKeys([])
        setSubSelectedRows([])
        // setSummaryRowKeys([])
    }
    //未选择线路check
    const onSelectChange = (newSelectedRowKeys, selectedRows, info) => {
        console.log(newSelectedRowKeys)
        setSelectedRowKeys(newSelectedRowKeys)
        setSelectedRows(selectedRows)
    }
    //分表check
    const subMeterSelectChange = (newSelectedRowKeys, selectedRows) => {
        setSubMeterRowKeys(newSelectedRowKeys)
        setSubSelectedRows(selectedRows)
    }
    //总表check
    // const summarySelectChange = (newSelectedRowKeys, selectedRows) => {
    //     setSummaryRowKeys(newSelectedRowKeys)
    //     setSummarySelectedRows(selectedRows)
    // }
    //未选择to分表
    const subToLeft = () => {
        if (selectedRows.length <= 0) {
            message.warning('请至少选择一项!')
            return
        }
        const arr = dataSource.filter(it => !selectedRowKeys.includes(it.sn))
        const unarr = copydataSource.filter(it => !selectedRowKeys.includes(it.sn))
        console.log(489, selectedRows)
        setSubMeter([...selectedRows, ...subMeter])
        setSubMeterRowKeys([])
        setDataSource([...arr])
        setCopydataSource([...unarr])
        setSelectedRowKeys([])
        setSelectedRows([])
    }
    //分表to未选择
    const subToRight = () => {
        if (subSelectedRows.length <= 0) {
            message.warning('请至少选择一项!')
            return
        }
        const arr = subMeter.filter(it => !subMeterRowKeys.includes(it.sn))
        console.log(arr, selectedRowKeys, selectedRows)
        setDataSource([...subSelectedRows, ...dataSource])
        setCopydataSource([...subSelectedRows, ...copydataSource])
        setSubMeter([...arr])
        setSelectedRowKeys([])
        setSubSelectedRows([])
        setSubMeterRowKeys([])
    }
    //未选择to总表
    // const summaryToLeft = () => {
    //     if (selectedRows.length !== 1 || summaryMeter.length === 1) {
    //         message.warning('总表最多为一条')
    //         return
    //     }
    //     if (dataSource.length <= 0) {
    //         message.warning('请至少选择一项!')
    //         return
    //     }
    //     const arr = dataSource.filter(it => !selectedRowKeys.includes(it.id))
    //     const unarr = copydataSource.filter(it => !selectedRowKeys.includes(it.id))
    //     setSummaryMeter([...selectedRows])
    //     setDataSource([...arr])
    //     setCopydataSource([...unarr])
    //     setSelectedRowKeys([])
    //     setSelectedRows([])


    // }
    //总表to未选择
    // const summaryToRight = () => {
    //     if (!summarySelectedRows || summarySelectedRows?.length <= 0) {
    //         message.warning('请至少选择一项!')
    //         return
    //     }
    //     setDataSource([...summarySelectedRows, ...dataSource])
    //     setCopydataSource([...summarySelectedRows, ...copydataSource])
    //     setSummaryMeter([])
    //     setSelectedRowKeys([])
    //     setSummaryRowKeys([])
    //     setSummarySelectedRows([])
    // }


    //保存线路编辑
    const saveConfig = async () => {
        setSearchValue("")
        const subsn = subMeter.map(it =>({sn:it.sn,lngLat:it.lngLat,lngLatAddress:it.lngLatAddress}) )
        console.log(subMeter)
        let params = {
            projectId,
            group:subsn,
            areaId,
        }
        const resp = await operationDesigin.ConfigureDevice(params)
        if (resp.success) {
            message.success('线路配置成功')
            setOpen(false)
            getQueryPageDevice()
        } else {
            message.error(resp.errMsg)
        }
    }
    //搜索
    const onSearch = async (value, event) => {
        setSelectedRowKeys([])
        setSelectedRows([])
        let filterarr;
        if(devicetype===0){
            if (!value) {
                setDataSource([...copydataSource])
                return
            }else{
                filterarr = copydataSource.filter(it => {
                    return (it.sn.includes(value) || it.address.includes(value))
                }) 
            }
          
        }else{
            if (!value) {
                filterarr=  copydataSource.filter(it=>{
                    return it.deviceStyle === devicetype
                })
                setDataSource([...filterarr])
                return
            }else{
                filterarr = copydataSource.filter(it => {
                    return (it.sn.includes(value) || it.address.includes(value))&&it.deviceStyle === devicetype
                })
            }
        
        }
        setDataSource([...filterarr])
    }
    //设备类型改变
    const changeType=(v)=>{
        setDeviceType(v)
        setSelectedRowKeys([])
        setSelectedRows([])
        let filterarr;
        if(!searchValue){
            if(v===0){
                setDataSource([...copydataSource])
                return
            }else{
                filterarr  =  copydataSource.filter(it=>{
                    return  it.deviceStyle === v
                })
            }
           
        }else{

            if(v===0){
             filterarr= copydataSource.filter(it=>{
                    return it.sn.indexOf(searchValue)!==-1||it.address.indexOf(searchValue)!==-1
                })
                // setDataSource([...filterarr])
                // return
            } else{
                filterarr= copydataSource.filter(it=>{
                    return (it.sn.indexOf(searchValue)!==-1||it.address.indexOf(searchValue)!==-1)&&it.deviceStyle === v
                })
            }
          
            // setDataSource([...copydataSource])
        }
        console.log(filterarr)
        setDataSource([...filterarr])
    }
    //设置坐标
    const setlocal=()=>{

        if(Array.isArray(subSelectedRows)&&subSelectedRows.length===0){
            message.warning("请先选择设备！")
            return
        }
        positionRef.current.onOpen()      
    }
    //保存坐标
    const savePosition=(local)=>{
        console.log(local,subSelectedRows,subMeter)
        if(!local.local){
            message.warning("请先设置坐标！")
            return
        }
        if(Array.isArray(subSelectedRows)&&subSelectedRows.length>0){
            const arr =subSelectedRows.map(it=>{return {...it,lngLat:local.local,lngLatAddress:local.inpvalue}})
            let updatearr=[...subMeter]
            // for(let i=0;i<subMeter.length;i++){
            //     updatearr.push(false)
            // }  
           
           for(let i=0;i<subMeter.length;i++){
             for(let j=0;j<arr.length;j++){

                if (subMeter[i].sn === arr[j].sn){
                    updatearr[i]=arr[j]
                }
             }
           }
           console.log(updatearr,subMeter)
         setSubMeter(()=>[...updatearr])
         positionRef.current.onCancel()
             
        }else{
            message.warning("请先选择设备！")
        }       
    }
    useImperativeHandle(ref, () => ({
        setDataSource,
        setSelectedRowKeys,
        setSubMeter,
        setLineId,
        setCopydataSource,
        setSubMeterRowKeys,
        setSearchValue,
        setOpen,
        getQueryDeviceList
    }))
    useEffect(()=>{
        // getQueryDeviceList()
    },[areaId])
    return (
        <div style={{ position: 'absolute', width: 1686, height: 770, top: 101, left: open ? 0 : 2000, background: "#003366", transition: 'all .5s linear', padding: 32, display: 'flex' }}>
            <div style={{ position: 'relative', width: 692 }}>
                <div style={{ background: "#ffffff", padding: 16, height: 698 }}>
                    <div style={{display:'flex',justifyContent:'space-between'}}>
                    <BlueColumn name="选择设备" styled={{ marginBottom: 16 }}></BlueColumn>
                    <div className={commonstyle.divBtn} onClick={setlocal}>设置坐标</div>
                    </div>
                    
                    <Table
                        bordered
                        pagination={false}
                        rowSelection={{ onChange: subMeterSelectChange, selectedRowKeys: subMeterRowKeys }}
                        columns={columns}
                        scroll={{ y: 560 }}
                        size={'small'}
                        dataSource={subMeter}
                        rowKey={record => record.sn}
                    ></Table>
                </div>

            </div>
            <div style={{ position: 'relative', flex: 1, padding: '0 32px' }}>
                {publish ? null : <>
                    <div style={{ marginTop: 150 }}>
                        <div style={{ color: '#fff', marginBottom: 16 }}>选择线路分表</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={btncss} className={commonstyle.btnhover} onClick={subToLeft}><LeftOutlined style={{ color: '#fff', fontSize: 20 }} /></div>
                            <div style={btncss} className={commonstyle.btnhover} onClick={subToRight}><RightOutlined style={{ color: '#fff', fontSize: 20 }} /></div>
                        </div>
                    </div>
                </>}

                <div>
                    {publish ? null : <div style={{ ...btnstyle, marginTop: 200, marginBottom: 16 }} className={commonstyle.bghover} onClick={saveConfig}>保存</div>}
                    <div style={{ ...btnstyle, color: '#000', background: 'rgb(247,247,247)' }} className={commonstyle.closehover} onClick={close}>关闭</div>
                </div>
            </div>
            <div style={{ position: 'relative', width: 714 }}>
                <div style={{ background: "#ffffff", padding: 16, height: '99%', width: '100%', overflow: 'hidden', }}>
                    <BlueColumn name="未选中的设备" styled={{ marginBottom: 16 }}></BlueColumn>
                    <div style={{display:'flex',justifyContent:'space-between'}}>
                    <div>
                    <span>设备类型</span>
                    <Select style={{width:128, marginLeft: 16 }} options={deviceoptions} defaultValue={0} onChange={changeType} value={devicetype}></Select>
                    </div>    
                    <div style={{ marginBottom: 16 }} className={commonstyle.searchinp}>
                        <span>设备搜索</span>
                        <Search style={{ width: 304, borderRadius: 16, marginLeft: 16 }} placeholder="请设备编号/安装地址" onSearch={onSearch} value={searchValue} onChange={(e) => { setSearchValue(e.target.value) }}></Search>
                    </div>
                    </div>
                    
                    <Table
                        bordered
                        pagination={false}
                        rowSelection={{ selectedRowKeys, onChange: onSelectChange }}
                        columns={columns}
                        dataSource={dataSource}
                        scroll={{ y: 500 }}
                        size={'small'}
                        rowKey={record => record.sn}
                    ></Table>
                </div>
            </div>
            <SetPosition positionRef={positionRef} savePosition={savePosition}/>
        </div>
    )
})
