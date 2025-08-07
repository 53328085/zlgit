import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle, Fragment, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from "react-i18next"
import { Divider, Select, Tree, Row, Col, Input, Form, message, Space, Button, Typography, Popconfirm } from 'antd'
import { useAntdTable } from 'ahooks'
import styled, { css } from 'styled-components'
import commonstyle from './commonstyle.module.less'
import Modal from '@com/useModal';
import BlueColumn from '@com/bluecolumn'
import { CustButton } from "@com/useButton"
import { Monitoring } from '@api/api'
import Mask from '@com/mask'
import Ctable from '@com/useTable'
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { publishState, adaptation } from '@redux/systemconfig'
import { Serach } from "@com/comstyled";
import Table from "@com/useTable";
const { LineManager: {
    AeraQueryAll,
    LineManagerQuery,
    LineManagerAdd,
    LineManagerUpdate,
    LineManagerDelete,
    QueryUnusedMeter,
    ConfigureMeter,
    LineDevicePage,
    RemoveUsedMeter
} } = Monitoring

const { Link } = Typography

const sty = css`
padding: 16px;
 .content {
    .left {
        column-gap: 16px;
        .leftup{
            flex: 1;
            padding: 8px;
        }
        .leftdown {
            flex: 1;
            padding: 8px;
        }
    }
    .right {
       column-gap: 8px;
       padding: 8px; 
    }
 }
`
const Mainbox = styled.div`
position: absolute;
  width:calc(100% - 200px); //1686 ;
  //height:  calc(100% - 84px);          //  ${props => props.theme.laptop ? "100%" : "755px"};
  height: calc(100% - 64px);
  top:  64px ;
  left: 200px;
   
 //transform: translateY(calc((100% - 64px) / -2));
  background: #003366;
  padding: 32px;
  display: flex;
  flex-direction: column;
  .title {
      color: #fff;
      font-size: 16px;
  }
  .content {
     flex: 1;
     display: flex;
     height: inherit;
     .left {
        flex : 1 1 692px;
        display: flex;
        flex-direction: column;
        column-gap: 32px;
        .leftup {
            flex: 1 1 259px;
            background-color: #fff;
            padding: 16px; 
            overflow-y: auto;
        }
        .leftdown {
            flex: 1 1 397px;
            background-color: #fff;
            padding: 16px; 
            overflow-y: auto;
        }
     }
     .middle {
        flex: 1;
        padding: 0 32px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
     }
     .right {
        flex: 1 1 714px;
        display: flex;
        flex-direction: column;
        column-gap:16px;
        background-color: #fff;
        padding: 16px;
     //   overflow-y: auto;
        .rightup{
            display: flex;
            flex-direction: column;
            row-gap: 16px;
            .searchinp{
            display: flex;
            align-items: center;
            column-gap: 16px;
        }
        }
      
     }
  }
  ${props => props.theme.laptop ? sty : null}
`

export default function Common({ type }) {
    const { t } = useTranslation(["button"])
    const [tdata, setTdata] = useState([])
    const [areaOpts, setAreaOpts] = useState([])
    const [open, setOpen] = useState(false)
    const [lineName, setLineName] = useState('')
    const [treelist, setTreeList] = useState([])
    const [addmianform] = Form.useForm()
    const [selform] = Form.useForm()
    const projectId = useSelector(state => state.system.menus.projectId)
    const publish = useSelector(publishState)
    const oneLevel = useSelector(state => state.system.onelevel)
    const { laptop } = useSelector(adaptation)
    const addmianRef = useRef()
    const setforwardRef = useRef()
    const titlelinecss = {
        background: '#ecf5ff',
        height: 32,
        lineHeight: '32px',
    }
    // 查询已接入的表
    let areaId = Form.useWatch('area', selform)
    const [lineform] = Form.useForm()
    const linecolumns = [
        { title: '设备编号', dataIndex: 'deviceSn', align: "center", kye: 'deviceSn', },
        { title: '设备名称', dataIndex: 'deviceName', align: "center", key: 'deviceName', },
        { title: '线路名称', dataIndex: 'lineName', align: "center", key: 'lineName' },
        { title: '安装地址', dataIndex: 'deviceAddress', key: "deviceAddress", align: "center", },
        {
            title: '总分表', dataIndex: 'subSummary', key: "subSummary", align: "center", render: (text) => {
                return text == 0 ? '分表' : text == 1 ? "总表" : null
            }
        },
        {
            title: '操作', dataIndex: 'deviceAddress', key: "deviceAddress", align: "center",
            render: (_, record) => {
                //  return    <Link onClick={() => ononConfirm(record)}>解绑</Link> 
                return <Popconfirm title="是否确认解绑" onConfirm={() => ononConfirm(record)} ><Link>解绑</Link></Popconfirm>
            }
        },
    ]
    const linedevicePage = async ({ current, pageSize }, formdata) => {
        try {

            let { alike = '' } = formdata
            if ([projectId, areaId].every(d => Number.isInteger(d))) {
                let params = {
                    projectId,
                    areaId,
                    alike,
                    pageNum: current,
                    pageSize,
                    meterType: type
                }
                let { success, errMsg, data, total } = await LineDevicePage(params)
                if (success && Array.isArray(data) && data?.length > 0) {
                    return {
                        list: data,
                        total
                    }

                } else {
                    if (!success) message.warning(errMsg || "数据出错")
                    return {
                        list: [],
                        total: 0
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }


    }
    const { tableProps, search, params, refresh, run } = useAntdTable(linedevicePage, {
        form: lineform,
        defaultPageSize: 14,
        refreshDeps: [projectId, areaId]
    })
    console.log(params)
    const { submit: linesubmit } = search
    const ononConfirm = async ({ deviceSn }) => {
        try {
            if (!Number.isInteger(projectId)) return message.warning("没有项目id")
            let body = {
                projectId,
                sn: deviceSn
            }
            let { success, errMsg } = await RemoveUsedMeter(body)
            if (success) {
                message.success('解绑成功')
                let formdata = lineform.getFieldsValue()
                console.log(formdata)
                getLineManagerQuery()
                run({ ...params[0] }, formdata)
            } else {
                message.warning(errMsg || "数据出错")
            }
        } catch (error) {
            console.log(error)
        }
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
        const name = addmianform.getFieldsValue().mainname?.trim();
        if (!name) return message.warning("名字不能为空")
        let params = {
            id: 0,
            projectId,
            name,
            lineType: type,
            areaId: selform.getFieldsValue().area
        }
        const res = await LineManagerAdd(params)
        console.log(res)
        if (res.success) {
            message.success("新增主线成功")
            getLineManagerQuery()
            //  addmianRef.current.onCancel()
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
                    title: <Treeline tree={it} alldata={tdata} params={params} openDrawer={openDrawer} getLineManagerQuery={getLineManagerQuery} refresh={refresh} selform={selform} lineform={lineform} type={type}></Treeline>
                }
            } else {
                return {
                    ...it,
                    title: <Treeline tree={it} alldata={tdata} params={params} openDrawer={openDrawer} getLineManagerQuery={getLineManagerQuery} refresh={refresh} selform={selform} lineform={lineform} type={type}></Treeline>,
                    children: maptreeData(it.nodes)
                }
            }
        })
    }
    //打开新增主线窗口
    const addMainLine = () => {
        if (oneLevel.length == 0) {
            message.warning('请新增园区!')
            return
        }
        addmianRef.current.onOpen()
    }
    //打开配置抽屉
    const openDrawer = (tree, name) => {
        setLineName(name)
        setOpen(true)
        setTreeList(tree)
        //setforwardRef.current.setSelectedRowKeys([])
        setforwardRef.current.setLineId(tree.id)
        gettablelineData(tree)
    }

    //获取线路数据
    const gettablelineData = async (tree = '') => {
        let areaId = selform.getFieldsValue().area
        if (!areaId) return
        try {
            let params = {
                projectId,
                type,
                areaId,
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
        treelist,
        lineName,
        refresh,

    }
    return (
        <div style={{ flex: 1 }}>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Form form={selform}>
                    <Form.Item name="area" style={{ marginBottom: "16px" }}>
                        <Select
                            showSearch
                            filterOption={(val, opts) => {
                                if (opts.name.includes(val)) {
                                    return true
                                } else {
                                    return false
                                }
                            }}
                            style={{ width: 264 }}
                            options={areaOpts}
                            fieldNames={{ label: 'name', value: 'id' }}
                            onChange={changeSelection}></Select>
                    </Form.Item>
                </Form>
                {publish ? null : <CustButton onClick={addMainLine} wh="auto">{t("button:newMainLine")}</CustButton>}

            </div>
            {/*   <Divider style={{ borderColor: '#d7d7d7', margin: '0 0 16px 0' }} dashed></Divider> */}
            <div style={{ display: 'flex', columnGap: "32px", flexDirection: laptop ? "column" : "row", overflow: "auto" }}>
                <div style={{ overflow: "auto" }}>
                    <div style={{ display: 'flex', margin: '0 0 24px 0' }}>
                        <div style={{ ...titlelinecss, width: 416, paddingLeft: 24 }}>线路图</div>
                        <div style={{ ...titlelinecss, width: 48, margin: '0 16px', textAlign: 'center' }}>设备数</div>
                        <div style={{ ...titlelinecss, width: 208, textAlign: 'center' }}>操作</div>
                    </div>

                    <div style={{ height: "600px", overflow: "auto" }}>
                        <Tree
                            className={commonstyle.treeclass}
                            selectable={false}
                            defaultExpandAll
                            treeData={tdata}
                        />
                    </div>
                </div>
                <div style={{ display: 'flex', flex: 1, flexDirection: "column", rowGap: '16px', }}>
                    <Form form={lineform} layout='line' >
                        <Form.Item name="alike" initialValue=''>
                            <Serach
                                size="middle"
                                placeholder="输入编号/设备地址/设备名称"
                                style={{ width: "340px" }}
                                allowClear
                                onSearch={linesubmit}
                            />
                        </Form.Item>
                    </Form>
                    <Ctable columns={linecolumns} {...tableProps}></Ctable>
                </div>
            </div>
            <AddMianMianModal {...addmianprops}></AddMianMianModal>
            <Mask task={open}> <SetLine {...setprops}></SetLine></Mask>
        </div>
    )
}

//树节点
let Treeline = forwardRef(
    ({ tree, alldata, params, openDrawer, getLineManagerQuery, refresh, selform, lineform, type }, ref) => {
        const { t } = useTranslation(['button'])
        const [addform] = Form.useForm()
        const [editform] = Form.useForm()
        const addmodalRef = useRef()
        const editmodalRef = useRef()
        const delmodalRef = useRef()
        const projectId = useSelector(state => state.system.menus.projectId)
        const publish = useSelector(publishState)

        //打开新增窗口
        const openAdd = (tree, alldata) => {
            addform.setFieldsValue({ linename: '' })
            addmodalRef.current.onOpen()
            console.log(tree, alldata)
        }
        //确认新增线路
        const addOk = async () => {
            const name = addform.getFieldsValue().linename?.trim()
            if (!name) return message.warning("名字不能为空")
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
                //   addmodalRef.current.onCancel()
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
            const name = editform.getFieldsValue().linename?.trim()
            if (!name) return message.warning("名字不能为空")
            let params = {
                id: tree.id,
                projectId,
                name: encodeURIComponent(name),
            }

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
        const opneSet = (name) => {
            openDrawer(tree, name)


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
            let paramsDel = {
                projectId,
                id: tree.id
            }
            const res = await LineManagerDelete(paramsDel)
            console.log(res)
            if (res.success) {
                message.success('删除成功')
                delmodalRef.current.onCancel()
                getLineManagerQuery()
                let formdata = lineform.getFieldsValue()
                refresh({ ...params[0] }, formdata)
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
                        <Space size={16} style={{ width: 208, justifyContent: publish ? 'center' : 'none' }}>
                            {publish ? null : <>
                                <Link onClick={() => { openAdd(tree, alldata) }}>{t("button:new")}</Link>
                                <Link onClick={() => { openEdit(tree) }}>{t("button:edit")}</Link>
                            </>}
                            <Link onClick={() => { opneSet(tree.name) }}>{t("button:configure")}</Link>
                            {
                                publish ? null : <Link type="danger" onClick={() => { openDel(tree) }}>{t("button:delete")}</Link>
                            }

                        </Space>
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
let AddMianMianModal = forwardRef(({ addmianRef, addmianform, onOk, ...other }) => {
    return (
        <Modal mold='cust' ref={addmianRef} onOk={onOk} {...other} custft={true} title="新增主线">
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
let AddModal = forwardRef(({ addmodalRef, addform, onOk, ...other }) => {
    return (
        <Modal mold='cust' ref={addmodalRef} onOk={onOk} {...other} custft title="新增线路">
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
let SetLine = forwardRef(({ open, lineName, closeDrawer, getLineManagerQuery, treelist, refresh }, ref) => {
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
    const { laptop } = useSelector(adaptation)
    const columns = [
        { title: '设备编号', dataIndex: 'sn', align: "center", },
        { title: '设备名称', dataIndex: 'name', align: "center", },
        { title: '安装地址', dataIndex: 'address', align: "center", },

    ]
    const btncss = laptop ? {
        width: 48,
        height: 32
    } : {
        width: 68,
        height: 46,
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
        console.log(newSelectedRowKeys)
        console.log(selectedRows)
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

        setDataSource([...subSelectedRows, ...dataSource])
        setCopydataSource([...subSelectedRows, ...copydataSource])
        setSubMeter([...arr])
        setSelectedRowKeys([])
        setSubSelectedRows([])
        setSubMeterRowKeys([])
    }
    //未选择to总表
    const summaryToLeft = () => {
        summaryMeter

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
        setSummaryMeter([...summaryMeter, ...selectedRows])
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
        let ids = summarySelectedRows.map(s => s.id)
        let summary = summaryMeter.filter(m => !ids.includes(m.id))
        setSummaryMeter(summary)
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
            refresh()
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
        <Mainbox>
            <div className='title'>
                {lineName}
            </div>
            <div className="content">
                <div className='left'>
                    <div className='leftup' key="up" >
                        <BlueColumn name="线路总表" styled={{ marginBottom: 16 }}></BlueColumn>
                        <Table
                            bordered
                            pagination={false}
                            rowSelection={{ selectedRowKeys: summaryRowKeys, onChange: summarySelectChange }}
                            columns={columns}

                            size={'small'}
                            rowKey={record => record.id}

                            dataSource={summaryMeter}
                        ></Table>
                    </div>
                    <div className='leftdown' key="down">
                        <BlueColumn name="线路分表" styled={{ marginBottom: 16 }}></BlueColumn>
                        <Table
                            bordered
                            pagination={false}
                            rowSelection={{ onChange: subMeterSelectChange, selectedRowKeys: subMeterRowKeys }}
                            columns={columns}

                            size={'small'}
                            dataSource={subMeter}
                            rowKey={record => record.id}
                        ></Table>
                    </div>

                </div>
                <div className='middle'>
                    {publish ? null : <>
                        <div >
                            <div style={{ color: '#fff', marginBottom: 16 }}>选择线路总表</div>
                            <Space size={16}>
                                <Button type='primary' icon={<LeftOutlined />} onClick={summaryToLeft} style={btncss} />
                                <Button type='primary' icon={<RightOutlined />} onClick={summaryToRight} style={btncss} />
                            </Space>
                        </div>
                        <div >
                            <div style={{ color: '#fff', marginBottom: 16 }}>选择线路分表</div>
                            <Space size={16}>
                                <Button type="primary" style={btncss} onClick={subToLeft} icon={<LeftOutlined />} />
                                <Button type="primary" style={btncss} onClick={subToRight} icon={<RightOutlined />} />
                            </Space>
                        </div>
                    </>}

                    <Space direction="vertical" size={16}>
                        {publish ? null : <Button type="primary" block onClick={saveConfig}>保存</Button>}
                        <Button block onClick={close}>关闭</Button>
                    </Space>
                </div>
                <div className='right'>
                    <div className='rightup'>
                        <BlueColumn name="未选中的设备" ></BlueColumn>
                        <div style={{ marginBottom: 16 }} className="searchinp">
                            <span>设备搜索</span>
                            <Search style={{ flexBasis: "320px" }} placeholder="请设备编号/安装地址" onSearch={onSearch} value={searchValue} onChange={(e) => { setSearchValue(e.target.value) }}></Search>
                        </div>
                    </div>
                    <Table
                        style={{ overflow: "auto" }}
                        bordered
                        pagination={false}
                        rowSelection={{ selectedRowKeys, onChange: onSelectChange }}
                        columns={columns}
                        dataSource={dataSource}
                        size={'small'}
                        rowKey={record => record.id}
                    ></Table>
                </div>
            </div>
        </Mainbox>
    )
})

