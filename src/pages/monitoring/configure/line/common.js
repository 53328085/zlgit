import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle, Fragment, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Divider, Select, Tree, Row, Col, Input, Form, message, Drawer, Table } from 'antd'

import commonstyle from './commonstyle.module.less'
import Modal from '@com/useModal';
import BlueColumn from '@com/bluecolumn'

import { Monitoring } from '@api/api'
import Mask from '@com/mask'
// import Table from '@com/useTable'
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { publishState } from '@redux/systemconfig'
const { LineManager: {
    AeraQueryAll,
    LineManagerQuery,
    LineManagerAdd,
    LineManagerUpdate,
    LineManagerDelete,
    QueryUnusedMeter,
    ConfigureMeter
} } = Monitoring



export default function Common({ type }) {
    const [tdata, setTdata] = useState([])
    const [areaOpts, setAreaOpts] = useState([])
    const [open, setOpen] = useState(false)
    const [treelist, setTreeList] = useState([])
    const [addmianform] = Form.useForm()
    const [selform] = Form.useForm()
    const projectId = useSelector(state => state.system.menus.projectId)
    const publish = useSelector(publishState)
    const oneLevel = useSelector(state=>state.system.onelevel)
    const addmianRef = useRef()
    const setforwardRef = useRef()
    const titlelinecss = {
        background: '#ecf5ff',
        height: 32,
        lineHeight: '32px',
    }
    //查询区域
    const getAeraQueryAll = async () => {
        const res = await AeraQueryAll(projectId)
        if (res.success && Array.isArray(res.data)) {
            setAreaOpts([...res.data])
            selform.setFieldsValue({ area: res.data[0].id })
            getLineManagerQuery(res.data[0].id)
        } else {
            setAreaOpts([])
        }
    }
    //线路查询
    const getLineManagerQuery = async (id = 0) => {
        let params = {
            projectId,
            type,
            areaId: id ? id : selform.getFieldsValue().area
        }
        const res = await LineManagerQuery(params)
        if (res.success && Array.isArray(res.data)) {
            setTdata(() => maptreeData([...res.data]))
            gettablelineData()
        } else {
            setTdata([])
        }
        console.log(res)
    }
    //确认新增主线
    const addmianline = async () => {
        let params = {
            id: 0,
            projectId,
            name: addmianform.getFieldsValue().mainname,
            lineType: type,
            areaId: selform.getFieldsValue().area
        }
        const res = await LineManagerAdd(params)
        console.log(res)
        if (res.success) {
            message.success("新增主线成功")
            getLineManagerQuery()
            addmianRef.current.onCancel()
        } else {
            message.error(res.errMsg)
        }
    }
    //数据递归渲染
    const maptreeData = (data) => {
        return data.map(it => {
            if (!it.nodes) {
                return {
                    ...it,
                    title: <Treeline tree={it} alldata={tdata} openDrawer={openDrawer} getLineManagerQuery={getLineManagerQuery} selform={selform} type={type}></Treeline>
                }
            } else {
                return {
                    ...it,
                    title: <Treeline tree={it} alldata={tdata} openDrawer={openDrawer} getLineManagerQuery={getLineManagerQuery} selform={selform} type={type}></Treeline>,
                    children: maptreeData(it.nodes)
                }
            }
        })
    }
    //打开新增主线窗口
    const addMainLine = () => {
        if(oneLevel.length == 0){
            message.warning('请新增园区!')
            return 
          }
        addmianRef.current.onOpen()
    }
    //打开配置抽屉
    const openDrawer = (tree) => {
        console.log('tree', tree)
        setOpen(true)
        setTreeList(tree)
        //setforwardRef.current.setSelectedRowKeys([])
        setforwardRef.current.setLineId(tree.id)
        gettablelineData(tree)
    }

    //获取线路数据
    const gettablelineData = async (tree = '') => {
        try {
            let params = {
                projectId,
                type,
                areaId: selform.getFieldsValue().area,
                alike: ''
            }
            const res = await QueryUnusedMeter(params)
            if (res.success && Array.isArray(res.data)) {
                setforwardRef.current.setDataSource([...res.data])
                setforwardRef.current.setCopydataSource([...res.data])
                setforwardRef.current.setSelectedRowKeys([])
                setforwardRef.current.setSubMeterRowKeys([])
                setforwardRef.current.setSummaryRowKeys([])
                if (tree) {
                    tree.deviceSub ? setforwardRef.current.setSubMeter([...tree.deviceSub]) : setforwardRef.current.setSubMeter([])
                    tree.deviceSummary ? setforwardRef.current.setSummaryMeter([...tree.deviceSummary]) : setforwardRef.current.setSummaryMeter([])
                } else {
                    treelist.deviceSub ? setforwardRef.current.setSubMeter([...treelist.deviceSub]) : setforwardRef.current.setSubMeter([])
                    treelist.deviceSummary ? setforwardRef.current.setSummaryMeter([...treelist.deviceSummary]) : setforwardRef.current.setSummaryMeter([])
                }
            } else {
                setforwardRef.current.setDataSource([])
            }

        } catch (error) {
            
        }
       
    }
    //关闭抽屉
    const closeDrawer = () => {
        setOpen(false)
    }
    //改变区域
    const changeSelection = (v, option) => {
        setforwardRef.current.setSearchValue("")
        getLineManagerQuery(v)
        closeDrawer()
    }
    useEffect(() => {
        //setTdata(() => maptreeData(tdata))
        getAeraQueryAll()

    }, [])
    //新增主线props
    const addmianprops = {
        addmianRef,
        addmianform,
        width: 570,
        onOk: addmianline
    }
    //抽屉props
    const setprops = {
        open,
        closeDrawer,
        ref: setforwardRef,
        getLineManagerQuery,
        gettablelineData,
        treelist
    }
    return (
        <>
            <div style={{ height: '100%', position: 'relative', overflow: 'hidden', }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Form form={selform}>
                        <Form.Item name="area">
                            <Select 
                             showSearch
                             filterOption={(val,opts)=>{
                                if(opts.name.includes(val)){
                                    return true
                                }else{
                                    return false
                                }        
                            }}
                             style={{ width: 264 }} 
                             options={areaOpts} 
                             fieldNames={{ label: 'name', value: 'id' }} 
                             onChange={changeSelection}></Select>
                        </Form.Item>
                    </Form>
                    {publish ? null : <div className={commonstyle.divBtn} onClick={addMainLine}>新增主线</div>}

                </div>
                <Divider style={{ borderColor: '#d7d7d7', margin: '16px 0' }} dashed></Divider>
                <div style={{ display: 'flex', margin: '16px 0 24px 0' }}>
                    <div style={{ ...titlelinecss, width: 416, paddingLeft: 24 }}>线路图</div>
                    <div style={{ ...titlelinecss, width: 48, margin: '0 16px' }}>设备数</div>
                    <div style={{ ...titlelinecss, width: 208, textAlign: 'center' }}>操作</div>
                </div>
                <Tree
                    className={commonstyle.treeclass}
                    selectable={false}
                    defaultExpandAll
                    treeData={tdata}
                />
                <AddMianMianModal {...addmianprops}></AddMianMianModal>
              <Mask task={open}> <SetLine {...setprops}></SetLine></Mask> 
            </div>

        </>

    )
}

//树节点
let Treeline = forwardRef(
    ({ tree, alldata, openDrawer, getLineManagerQuery, selform, type }, ref) => {
        const [addform] = Form.useForm()
        const [editform] = Form.useForm()
        const addmodalRef = useRef()
        const editmodalRef = useRef()
        const delmodalRef = useRef()
        const projectId = useSelector(state => state.system.menus.projectId)
        const publish = useSelector(publishState)
        const optcss = {
            color: '#237ae4',
            textDecoration: 'underline',
            textAlign: 'center',
            width: 52
        }
        //打开新增窗口
        const openAdd = (tree, alldata) => {
            addform.setFieldsValue({ linename: '' })
            addmodalRef.current.onOpen()
            console.log(tree, alldata)
        }
        //确认新增线路
        const addOk = async () => {
            const name = addform.getFieldsValue().linename
            let params = {
                id: tree.id,
                projectId,
                name,
                lineType: type,
                parentId: tree.id,
                areaId: selform.getFieldsValue().area
            }
            const res = await LineManagerAdd(params)
            if (res.success) {
                addmodalRef.current.onCancel()
                message.success('新增线路成功')
                getLineManagerQuery()
            } else {
                message.error(res.errMsg)
            }
            console.log(addform.getFieldsValue())
        }
        //打开编辑窗口
        const openEdit = () => {
            editmodalRef.current.onOpen()
            editform.setFieldsValue({ linename: tree.name })
        }
        //确认编辑
        const editOk = async () => {
            const name = editform.getFieldsValue().linename

            let params = {
                id: tree.id,
                projectId,
                name: encodeURIComponent(name),
            }
            console.log(params)
            const res = await LineManagerUpdate(params)
            if (res.success) {
                message.success('编辑成功')
                getLineManagerQuery()
                editmodalRef.current.onCancel()
            } else {
                message.error(res.errMsg)
            }
        }
        //打开配置窗口
        const opneSet = () => {
            openDrawer(tree)

        }
        //关闭配置窗口
        const onClose = () => {

        }
        //打开删除窗口
        const openDel = () => {
            delmodalRef.current.onOpen()
        }
        //确认删除
        const delOk = async () => {
            let params = {
                projectId,
                id: tree.id
            }
            const res = await LineManagerDelete(params)
            console.log(res)
            if (res.success) {
                message.success('删除成功')
                delmodalRef.current.onCancel()
                getLineManagerQuery()
            } else {
                message.error(res.errMsg)
            }
        }
        const addmodalprops = {
            addmodalRef,
            width: 592,
            onOk: addOk,
            addform
        }
        const editmodalprops = {
            editmodalRef,
            width: 592,
            onOk: editOk,
            editform
        }
        const delmodalprops = {
            delmodalRef,
            width: 592,
            name: "删除提示",
            content: "确认要删除选中线路?",
            onOk: delOk
        }
        useImperativeHandle(ref, () => ({
            opneSet,
            tree
        }))
        return (
            (<>


                <div style={{ display: 'flex', justifyContent: 'space-between' }} >
                    <div>
                        {tree.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div className={commonstyle.numcss}>
                            {tree.deviceCount}
                        </div>
                        <div style={{ display: 'flex',width:208,justifyContent:publish?'center':'none' }}>
                            {publish ? null : <>
                                <div style={optcss} onClick={() => { openAdd(tree, alldata) }}>新增</div>
                                <div style={optcss} onClick={() => { openEdit(tree) }}>编辑</div>
                            </>}
                            <div style={optcss} onClick={() => { opneSet() }}>配置</div>
                            {
                                publish ? null : <div style={{ ...optcss, color: '#ff0000' }} onClick={() => { openDel(tree) }}>删除</div>
                            }

                        </div>
                    </div>
                    <AddModal {...addmodalprops}></AddModal>
                    <EditModal {...editmodalprops}></EditModal>
                    <DeleteModal {...delmodalprops}></DeleteModal>

                </div>
            </>
            )
        )

    }
)
//新增主线
let AddMianMianModal = forwardRef(({ addmianRef, addmianform, ...other }) => {
    return (
        <Modal mold='cust' ref={addmianRef} {...other} title="新增主线">
            {/* <BlueColumn name="新增主线" styled={{ padding: '24px 0px' }}></BlueColumn> */}
            <Form
                form={addmianform}
                preserve={false}
            >
                <Form.Item label="主线名称" name="mainname">
                    <Input style={{ width: 435 }} ></Input>
                </Form.Item>
            </Form>
        </Modal>
    )
})
//新增线路
let AddModal = forwardRef(({ addmodalRef, addform, ...other }) => {
    return (
        <Modal mold='cust' ref={addmodalRef} {...other} title="新增线路">
            {/* <BlueColumn name="新增线路" styled={{ padding: '24px 0px' }}></BlueColumn> */}
            <Form
                form={addform}
            >
                <Form.Item label="线路名称" name="linename">
                    <Input style={{ width: 435 }} ></Input>
                </Form.Item>
            </Form>
        </Modal>
    )
})
//编辑线路
let EditModal = ({ editmodalRef, editform, ...other }) => {
    return (
        <Modal mold='cust' ref={editmodalRef} {...other} title="编辑线路">
            {/* <BlueColumn name="编辑线路" styled={{ padding: '24px 0px' }}></BlueColumn> */}
          
            <Form
                form={editform}
            >
                <Form.Item label="线路名称" name="linename">
                    <Input style={{ width: 435 }} ></Input>
                </Form.Item>
            </Form>
        </Modal>
    )
}
//删除线路
let DeleteModal = ({ delmodalRef, name = '', content = '', ...other }) => {
    return (
        <Modal mold='cust' ref={delmodalRef} {...other} className={commonstyle.DelModal} title={name} type='warn'>
               {content}
        </Modal>
    )
}

//配置线路
let SetLine = forwardRef(({ open, closeDrawer, getLineManagerQuery, treelist }, ref) => {
    const publish = useSelector(publishState)
    const { Search } = Input;
    const [dataSource, setDataSource] = useState([])//未选data
    const [copydataSource, setCopydataSource] = useState([])
    const [selectedRowKeys, setSelectedRowKeys] = useState(null);//未选线路check
    const [selectedRows, setSelectedRows] = useState([]);//未选线路选中data
    const [subMeter, setSubMeter] = useState([]); //分表data
    const [subMeterRowKeys, setSubMeterRowKeys] = useState([]);//分表选中check
    const [subSelectedRows, setSubSelectedRows] = useState([]);//分表选中data
    const [summaryMeter, setSummaryMeter] = useState([]);//总表data
    const [summaryRowKeys, setSummaryRowKeys] = useState();//总表选中check
    const [summarySelectedRows, setSummarySelectedRows] = useState()//总表选中data
    const [lineId, setLineId] = useState(null);
    const [searchValue, setSearchValue] = useState(""); //搜索值
    const projectId = useSelector(state => state.system.menus.projectId)
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
    //关闭抽屉
    const close = () => {
        closeDrawer()
        setSearchValue("")
        setSelectedRowKeys([])
        setSubMeterRowKeys([])
        setSummaryRowKeys([])
        setDataSource([])
        setSelectedRows([])
        setSubSelectedRows([])
        setSummarySelectedRows([])
    }
    //未选择线路check
    const onSelectChange = (newSelectedRowKeys, selectedRows, info) => {
        setSelectedRowKeys(newSelectedRowKeys)
        setSelectedRows(selectedRows)
    }
    //分表check
    const subMeterSelectChange = (newSelectedRowKeys, selectedRows) => {
        setSubMeterRowKeys(newSelectedRowKeys)
        setSubSelectedRows(selectedRows)
    }
    //总表check
    const summarySelectChange = (newSelectedRowKeys, selectedRows) => {
        setSummaryRowKeys(newSelectedRowKeys)
        setSummarySelectedRows(selectedRows)
    }
    //未选择to分表
    const subToLeft = () => {
        if (selectedRows.length <= 0) {
            message.warning('请至少选择一项!')
            return
        }
        const arr = dataSource.filter(it => !selectedRowKeys.includes(it.id))
        const unarr = copydataSource.filter(it => !selectedRowKeys.includes(it.id))
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
        const arr = subMeter.filter(it => !subMeterRowKeys.includes(it.id))
        console.log(arr, selectedRowKeys, selectedRows)
        setDataSource([...subSelectedRows, ...dataSource])
        setCopydataSource([...subSelectedRows, ...copydataSource])
        setSubMeter([...arr])
        setSelectedRowKeys([])
        setSubSelectedRows([])
        setSubMeterRowKeys([])
    }
    //未选择to总表
    const summaryToLeft = () => {
           
       /*  if (selectedRows.length !== 1 || summaryMeter.length === 1) {
            message.warning('总表最多为一条')
            return
        } */
        if (dataSource.length <= 0) {
            message.warning('请至少选择一项!')
            return
        }
        const arr = dataSource.filter(it => !selectedRowKeys.includes(it.id))
        const unarr = copydataSource.filter(it => !selectedRowKeys.includes(it.id))
        setSummaryMeter([...summaryMeter,...selectedRows])
        setDataSource([...arr])
        setCopydataSource([...unarr])
        setSelectedRowKeys([])
        setSelectedRows([])


    }
    //总表to未选择
    const summaryToRight = () => {
        if (!summarySelectedRows || summarySelectedRows?.length <= 0) {
            message.warning('请至少选择一项!')
            return
        }
        setDataSource([...summarySelectedRows, ...dataSource])
        setCopydataSource([...summarySelectedRows, ...copydataSource])
        setSummaryMeter([])
        setSelectedRowKeys([])
        setSummaryRowKeys([])
        setSummarySelectedRows([])
    }
    //保存线路编辑
    const saveConfig = async () => {
        setSearchValue("")
        const summatysn = summaryMeter.map(it => it.sn)
        const subsn = subMeter.map(it => it.sn)
        let params = {
            projectId,
            lineId,
            deviceSummary: summatysn,
            deviceSub: subsn
        }
        const resp = await ConfigureMeter(params)
        if (resp.success) {
            message.success('线路配置成功')
            closeDrawer()
            getLineManagerQuery()
        } else {
            message.error(resp.errMsg)
        }
    }
    //搜索
    const onSearch = async (value, event) => {
        setSelectedRowKeys([])
        setSelectedRows([])
        if (!value) {
            setDataSource([...copydataSource])
            return
        }
        const filterarr = copydataSource.filter(it => {
            return (it.sn.includes(value) || it.name.includes(value) || it.address.includes(value))
        })

        setDataSource([...filterarr])
        console.log(filterarr)
    }
    useImperativeHandle(ref, () => ({
        setDataSource,
        setSelectedRowKeys,
        setSubMeter,
        setSummaryMeter,
        setLineId,
        setCopydataSource,
        setSubMeterRowKeys,
        setSummaryRowKeys,
        setSearchValue
    }))
    return (
        <div style={{position: 'absolute', width: 1686, height: 755, top: '50%', left: '200px', transform: 'translateY(-50%)', background: "#003366", padding: 32, display: 'flex' }}>
            <div style={{ position: 'relative', width: 692 }}>
                <div style={{ marginBottom: 32, background: "#ffffff", padding: 16, height: 259 }} key="up" >
                    <BlueColumn name="线路总表" styled={{ marginBottom: 16 }}></BlueColumn>
                    <Table
                        bordered
                        pagination={false}
                        rowSelection={{ selectedRowKeys: summaryRowKeys, onChange: summarySelectChange }}
                        columns={columns}
                        scroll={{ y: "100%" }}
                        size={'small'}
                        rowKey={record => record.id}
                        style={{height: 139 }}
                        dataSource={summaryMeter}
                    ></Table>
                </div>
                <div style={{ background: "#ffffff", padding: 16, height: 397 }} key="down">
                    <BlueColumn name="线路分表" styled={{ marginBottom: 16 }}></BlueColumn>
                    <Table
                        bordered
                        pagination={false}
                        rowSelection={{ onChange: subMeterSelectChange, selectedRowKeys: subMeterRowKeys }}
                        columns={columns}
                        scroll={{ y: 260 }}
                        size={'small'}
                        dataSource={subMeter}
                        rowKey={record => record.id}
                    ></Table>
                </div>

            </div>
            <div style={{ position: 'relative', flex: 1, padding: '0 32px' }}>
                {publish ? null : <>
                    <div style={{ marginTop: 21 }}>
                        <div style={{ color: '#fff', marginBottom: 16 }}>选择线路总表</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={btncss} className={commonstyle.btnhover} onClick={summaryToLeft}><LeftOutlined style={{ color: '#fff', fontSize: 20 }} /></div>
                            <div style={btncss} className={commonstyle.btnhover} onClick={summaryToRight}><RightOutlined style={{ color: '#fff', fontSize: 20 }} /></div>
                        </div>
                    </div>
                    <div style={{ marginTop: 150 }}>
                        <div style={{ color: '#fff', marginBottom: 16 }}>选择线路分表</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={btncss} className={commonstyle.btnhover} onClick={subToLeft}><LeftOutlined style={{ color: '#fff', fontSize: 20 }} /></div>
                            <div style={btncss} className={commonstyle.btnhover} onClick={subToRight}><RightOutlined style={{ color: '#fff', fontSize: 20 }} /></div>
                        </div>
                    </div>
                </>}

                <div style={{marginTop:publish?560:0}}>
                    {publish ? null : <div style={{ ...btnstyle, marginTop: 200, marginBottom: 16 }} className={commonstyle.bghover} onClick={saveConfig}>保存</div>}
                    <div style={{ ...btnstyle, color: '#000', background: 'rgb(247,247,247)' }} className={commonstyle.closehover} onClick={close}>关闭</div>
                </div>
            </div>
            <div style={{ position: 'relative', width: 714 }}>
                <div style={{ background: "#ffffff", padding: 16, height: '99%', width: '100%', overflow: 'hidden', }}>
                    <BlueColumn name="未选中的设备" styled={{ marginBottom: 16 }}></BlueColumn>
                    <div style={{ marginBottom: 16 }} className={commonstyle.searchinp}>
                        <span>设备搜索</span>
                        <Search style={{ width: 372, borderRadius: 16, marginLeft: 16 }} placeholder="请设备编号/安装地址" onSearch={onSearch} value={searchValue} onChange={(e) => { setSearchValue(e.target.value) }}></Search>
                    </div>
                    <Table
                        bordered
                        pagination={false}
                        rowSelection={{ selectedRowKeys, onChange: onSelectChange }}
                        columns={columns}
                        dataSource={dataSource}
                        scroll={{ y: 500 }}
                        size={'small'}
                        rowKey={record => record.id}
                    ></Table>
                </div>
            </div>
        </div>
    )
})

