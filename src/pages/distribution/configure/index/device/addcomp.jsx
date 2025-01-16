
import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle, Fragment, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Divider, Select, Tree, Row, Col, Input, Form, message,  Typography, Space} from 'antd'
import { publishState,adaptation } from '@redux/systemconfig'
import styled, {css} from 'styled-components'
 
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import {operationDesigin} from '@api/api'
import UsetTable from "@com/useTable";
 
 
import {CustButton, CustButtonT} from "@com/useButton"
const {Link} = Typography
//配置线路
const csssty = css`
  .transferContent {
    padding: 16px;
  }
  .leftTable {
    row-gap: 16px;
  }
  .actions {
    margin: 0px 8px;
    .finalButton {
      row-gap: 8px;
    }
  }
`;
const Mainbox = styled.div`
   &&{
   
    height: inherit;
    background-color: #003366;
    padding: 32px;
    display: flex;
    position: absolute;
    left: 0px;
    top: 50%;
    transform: translate(200px, -50%);
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    grid-template-rows: 1fr;
    width: calc(100% - 200px);
 
   
  .leftTable {
    height: inherit;
    display: flex;
    flex-direction: column;
    row-gap: 32px;
  }

  .subTable {
    padding: 16px;
    background-color: #fff;
    border-radius: 2px;
     display: flex;
     flex-direction: column;
     row-gap: 16px;
    flex: 1;
  }

  .otherSubTable {
    flex: 1;
    padding: 16px 16px 0 16px;
    background-color: #fff;
    border-radius: 2px;
    display: flex;
    flex-direction: column;
    row-gap: 16px;
  }

  .mainContent {
    flex: 1;
    position: relative;
    overflow: auto;
  }

  .actions {
    margin: 0 32px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    .firstButton {
      // margin-top: 64px;
      display: flex;
      justify-content: space-between;
    }

    .secondButton {
      //  margin-top: 182px;
      display: flex;
      justify-content: space-between;
    }

    .leftButton {
      display: inline-block;
      width: 68px;
      height: 46px;
      background-color: var(--ant-primary-color);
      border-radius: 4px;
      cursor: pointer;
      color: #fff;
      font-size: 20px;
      line-height: 46px;
      text-align: center;

      &:hover {
        background-color: rgba(64, 158, 255, 1);
      }
    }

    .rightButton {
      display: inline-block;
      width: 68px;
      height: 46px;
      margin-left: 10px;
      background-color: var(--ant-primary-color);
      border-radius: 4px;
      cursor: pointer;
      color: #fff;
      font-size: 20px;
      line-height: 46px;
      text-align: center;

      &:hover {
        background-color: rgba(64, 158, 255, 1);
      }
    }

    .finalButton {
      // margin-top: 180px;
      display: flex;
      flex-direction: column;
      row-gap: 16px;
      .saveButton {
        width: 146px;
        height: 40px;
        background-color: var(--ant-primary-color);
        border-radius: 4px;
        cursor: pointer;
        color: #fff;
        font-size: 14px;
        line-height: 40px;
        text-align: center;

        &:hover {
          background-color: rgba(64, 158, 255, 1);
        }
      }

      .closeButton {
        margin-top: 16px;
        width: 146px;
        height: 40px;
        background-color: #fff;
        border-radius: 4px;
        cursor: pointer;
        color: #212121;
        font-size: 14px;
        line-height: 40px;
        text-align: center;

        &:hover {
          opacity: 0.5;
        }
      }
    }
  }

  .rightTable {
    //  width: 714px;
    //  height: 696px;
    border-radius: 2px;
    padding: 16px 16px 0 16px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    row-gap: 16px;
  }
  .rightTable,
  .leftTable {
    .publicTitle {
      height: 32px;
      padding-left: 16px;
      line-height: 32px;
      font-size: 14px;
      color: #333;
      border-left: 4px solid var(--ant-primary-color);
    }
    .searchInput {
      display: flex;
      align-items: center;
      column-gap: ${props=> props.theme.laptop ? "8px" : "16px"};
      height: 32px;
      .ipt {
        display: flex;
        column-gap: 8px;
        align-items: center;

       

      }
      
    }
    .mainTable {
      padding: 16px;
      background-color: #fff;
      border-radius: 2px;
      display: flex;
      flex-direction: column;
      row-gap: 16px;
      flex: 1;
      
    }
    .tbwrap {
        position: absolute;
        width: 100%; 
      }
  }

  ${(props) => (props.theme.laptop ? csssty : null)}
}
`;
export let SetLine = forwardRef(({  getQueryPageDevice,areaId, setTarg }, ref) => {
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
    const {laptop} = useSelector(adaptation)
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
        { title: '设备编号', dataIndex: 'sn', align: "center",  },
        { title: '设备名称', dataIndex: 'name', align: "center",   },
        { title: '安装地址', dataIndex: 'address', align: "center", },

    ]
    const btnsty = laptop
    ? {
        height: "32px",
        width: "55px",
      }
    : {
        height: "46px",
        width: "68px",
      };
  const savesty = laptop
    ? {
        height: "34px",
        width: "120px",
      }
    : {
        height: "46px",
        width: "146px",
      };
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
       // setOpen(false)
       setTarg(false)
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
        <Mainbox>
            <div className="leftTable">
                <div className="otherSubTable" >
                    <div style={{display:'flex',justifyContent:'space-between'}}>
                    <div  className='publicTitle'>选择设备</div>
                    <CustButton wh="auto" onClick={setlocal}>设置坐标</CustButton>
                    </div>
                    <div className="mainContent">
                         <div className="tbwrap">
                    <UsetTable
                        pagination={false}
                        rowSelection={{ onChange: subMeterSelectChange, selectedRowKeys: subMeterRowKeys }}
                        columns={columns}
                        dataSource={subMeter}
                        rowKey={record => record.sn}
                    ></UsetTable>
                    </div>
                    </div>
                </div>

            </div>
            <div className="actions">
                {publish ? null : <>
                    <div>
                        <div style={{ color: '#fff', marginBottom: 16 }}>选择线路分表</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <CustButton style={btnsty} icon={<LeftOutlined   />} onClick={subToLeft} /> 
                            <CustButton style={btnsty} icon={<RightOutlined   />} onClick={subToRight} /> 
                        </div>
                    </div>
                </>}

                <Space direction="vertical">
                    {publish ? null : <CustButtonT style={savesty} onClick={saveConfig} text="save" />}
                    <CustButtonT onClick={close} style={savesty} type="default" text="cancel"  /> 
                </Space>
            </div>
            <div className="rightTable">  
            <div className="publicTitle">未选中的设备</div> 
                <div className="searchInput">                     
                <div className='ipt'>
                    <div>设备类型</div>
                    <Select style={{width: laptop ? "100px" : "150px"}}  options={deviceoptions} defaultValue={0} onChange={changeType} value={devicetype}></Select>
                    </div>    
                    <div  className='ipt'   >
                        <div>设备搜索</div>
                        <Search  style={{width: laptop ? "160px" : "256px" }}  placeholder="请设备编号/安装地址" onSearch={onSearch} value={searchValue} onChange={(e) => { setSearchValue(e.target.value) }}></Search>
                    </div>
                </div>
                


              
               <div className="mainContent">
                <div className="tbwrap">
                    <UsetTable
                        bordered
                        pagination={false}
                        rowSelection={{ selectedRowKeys, onChange: onSelectChange }}
                        columns={columns}
                        dataSource={dataSource} 
                        rowKey={record => record.sn}
                    ></UsetTable>
                    </div>
                    </div>
                 
            </div>
            {/* <SetPosition positionRef={positionRef} savePosition={savePosition}/> */}
        </Mainbox>
    )
})
