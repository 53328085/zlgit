import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import BlueColumn from '@com/bluecolumn'
import { Select, Divider, Input, Button, message, Form, Switch, DatePicker, TimePicker } from 'antd'
import Modal from '@com/useModal'
import { useSelector } from 'react-redux'
import Table from '@com/useTable'
import { operationDesigin } from '@api/api'
import moment from 'moment'
import WarningPng from '@imgs/warning.png'
import style from './style.module.less'
import { publishState } from '@redux/systemconfig'
import { SetLine } from './inspectcomp.jsx'
import { ExportExcel } from '@com/useButton'
const ContainerDiv = styled.div`
      border: 1px solid #d7d7d7;
      background-color: #fff;
      height: 100%;
      padding: 16px;
      .searchbtn:hover,.searchbtn:focus{
          border-color: #d9d9d9 !important;
          color: #000;
      }
      .flexcss{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        .btnflex{
          display: flex;
          div:nth-of-type(1){
            margin-right: 16px;
          }
          .btncss{
            width: 96px;
            height: 32px;
            background-color: #237ae4;
            border-radius: 2px;
            color: #fff;
            text-align: center;
            line-height: 32px;
            cursor: pointer;
            &:hover{
              opacity: .7;
            }
          }
        }
      }
      
  `
const { RangePicker } = DatePicker;
export default function Index() {

  const [tableParams, setTableParams] = useState({
    current: 1,
    pageSize: 10
  })
  const onelevel = useSelector(state => state.system.onelevel);
  const options = onelevel.length > 0 ? useMemo(() => ([{ name: onelevel[0]?.levelName + '(全部)', id: 0 }, ...onelevel]), [onelevel]) : []
  const [tableData, setTableData] = useState()
  const addmodalRef = useRef() //modal的ref
  const addformRef = useRef() //addform的ref
  const delModalRef = useRef() //del
  const tableRef = useRef() //table
  const publish = useSelector(publishState)
  const [planAddress, setPlanAddress] = useState([])
  const projectId = useSelector(state => state.system.menus.projectId)
  const [form] = Form.useForm()
  const PlanAddresRef = useRef()
  const [key, setKey] = useState()
  const columns = [
    { title: onelevel[0]?.levelName, dataIndex: 'area' },
    { title: '巡检计划名称', dataIndex: 'name' },
    { title: '计划内容', dataIndex: 'content' },
    { title: '计划开始日期', dataIndex: 'startTime' },
    { title: '计划结束日期', dataIndex: 'endTime' },
    { title: '巡检周期', dataIndex: 'cycle', render(text) { return (text === 1 ? '每日' : text === 2 ? '每周' : text === 3 ? '每月' : '/') } },
    { title: '巡检日期', dataIndex: 'timeS' },
    { title: '创建日期', dataIndex: 'createTime' },
    { title: '巡检人', dataIndex: 'operator' },
    {
      title: '操作', dataIndex: '',export:false, render(text) {
        return (
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <span style={{ textDecoration: 'underline', color: '#237ae4', cursor: 'pointer' }} onClick={async () => {
              setPlanAddress(text.usedAddress)
              PlanAddresRef.current.onOpen();
            }}>查看巡检点</span>
            <span style={{ color: '#ff0000', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => openDel(text)}>删除</span>
          </div>
        )
      }
    }
  ]
  columns.forEach(it => { it.align = "center" })
  if (publish) {
    columns.pop()
  }
  let planId;


  //获取设备
  const getInspectionPlanPage = async (pageNum) => {
    const { areaId, alike } = form.getFieldsValue()
    let params = {
      projectId,
      pageNum: pageNum ? pageNum : tableParams.current,
      pageSize: tableParams.pageSize,
      areaId,
      alike,
    }
    const res = await operationDesigin.InspectionPlanPage(params)
    if (res.success) {

      setTableData(res.data)
      setTableParams({
        current: res.pageNum,
        pageSize: res.pageSize,
        total: res.total,
      })
    } else {
      message.error(res.errMsg)
    }
  }
  //查询运维人员
  const getQueryProjectMaintenance = async (areaId, callback) => {
    const res = await operationDesigin.QueryProjectMaintenanceArea({ projectId, areaId })
    if (res.success) {
      if (res.data && Array.isArray(res.data)) {
        callback([...res.data])
      } else {
        callback([])
      }

    } else {
      message.error(res.errMsg)
    }
  }
  //打开新增
  const openAdd = async () => {
    addmodalRef.current.onOpen()

  }
  //确认新增
  const confirmAdd = () => {
    addformRef.current.form.validateFields().then(async (result) => {
      const flag = await addformRef.current.getInsertInspectionPlan()
      if (flag) {
        getInspectionPlanPage()
        addmodalRef.current.onCancel()
      }
    }).catch((e) => {
      console.log(e)
    })


  }
  //打开删除
  const openDel = (text) => {
    delModalRef.current.onOpen()
    planId = text.id
  }
  //确认删除
  const delOk = async () => {
    const { success, errMsg } = await operationDesigin.DeleteInspectionPlan({
      projectId,
      planId
    })
    if (success) {
      message.success('删除成功')
      delModalRef.current.onCancel()
      getInspectionPlanPage(1)
    } else {
      message.error(errMsg)
    }
  }
  const changePage = (page) => {
    getInspectionPlanPage(page.current)
  }
  const search = (e) => {

    getInspectionPlanPage(1)
  }
  const changeSelect = (v) => {
    getInspectionPlanPage(1)
  }
  const onExport = () => {
    return new Promise(async (resolve, reject) => {
      const { areaId, alike } = form.getFieldsValue()
      let params = {
        projectId,
        pageNum: 1,
        pageSize: tableParams.total,
        areaId,
        alike,
      }
      const res = await operationDesigin.InspectionPlanPage(params)
      if (res.success) {
        resolve({
          total: res.total,
          list: res.data
        })
      } else {
        reject(res.errMsg)
      }
    })

  }



  useEffect(() => {
    getInspectionPlanPage()
  }, [])
  // useEffect(() => {
  //   if (key == 1) {
  //     tableRef.current.download()
  //   } else if (key == 2) {
  //     tableRef.current.downloadAll()
  //   }

  // }, [key])
  return (
    <ContainerDiv>
      <BlueColumn name="巡检计划管理" />
      <div className='flexcss'>
        <Form
          layout="inline"
          form={form}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
          initialValues={{
            areaId: onelevel.length > 0 ? 0 : null,
            alike: ''
          }}
        >
          <Form.Item name="areaId" noStyle={true} labelAlign="left">
            <Select
              options={options}
              style={{ width: 264 }}
              fieldNames={{ label: 'name', value: 'id' }}
              className="pdtop8 pdbottom12"
              onChange={changeSelect}
            ></Select>
          </Form.Item>
          <Divider style={{ margin: '0 32px', borderColor: '#999999', height: 32 }} dashed type="vertical"></Divider>
          <Form.Item style={{ marginRight: 'auto' }} >
            <div >
              <Form.Item noStyle={true} name="alike">
                <Input
                  style={{
                    width: 290,
                    margin: '16px 0'
                  }}
                  placeholder="巡检点名称/具体位置"
                />
              </Form.Item>
              <Button style={{ width: 80, borderLeft: 'none', background: '#f5f7fa' }} className='searchbtn' onClick={search}>查询</Button>
            </div>
          </Form.Item>


        </Form>
        <div className='btnflex'>
          {publish ? null : <div className='btncss' onClick={openAdd}>
            新增
          </div>}

          {/* <div className='btncss' onClick={() => { tableRef.current.download() }}>
            导出
          </div> */}
          <ExportExcel setKey={setKey} tb={tableRef}/>
        </div>
      </div>
      <Divider style={{ margin: '0 0 24px 0', borderColor: '#d7d7d7' }} dashed ></Divider>
      <div style={{ height: 673, display: 'flex' }}>
        <Table columns={columns} dataSource={tableData} pagination={tableParams} ref={tableRef} onChange={changePage} onExport={onExport}></Table>
      </div>
      <Modal mold='cust' ref={addmodalRef} width={538} onOk={confirmAdd}>
        <BlueColumn name="新建巡检计划" styled={{ padding: '16px 0', color: "#237ae4", fontSize: 16 }} />
        <AddPlan projectId={projectId} ref={addformRef} getQueryProjectMaintenance={getQueryProjectMaintenance} />
      </Modal>
      <PlanAddres PlanAddresRef={PlanAddresRef} planAddress={planAddress} />
      <DeleteModal delModalRef={delModalRef} name="删除巡检计划" content="确认是否要删除巡检计划？" onOk={delOk} />
    </ContainerDiv>
  )
}

//新增巡检计划组件
let AddPlan = forwardRef(
  ({ projectId, getQueryProjectMaintenance }, ref) => {
    const [form] = Form.useForm()
    const [userList, setUserList] = useState([])//运维人员列表
    const onelevel = useSelector(state => state.system.onelevel);
    const arealist = onelevel.length > 0 ? onelevel : []
    const dateopts = [{ label: '每日', value: 1 }, { label: '每周', value: 2 }, { label: '每月', value: 3 }]
    const [dateCycle, setDataCycle] = useState(1)
    const mapuserlist = userList?.map(it => ({ ...it, label: it.name + "/" + it.mobile }))
    const rule = {
      required: true
    }
    let capitalAr = '一二三四五六日'.split('')
    const time = []
    useMemo(() => {
      for (let i = 0; i < 24; i++) {
        time.push({
          label: `${i <= 9 ? '0' + i : i}:00`,
          value: i
        })
      }
    }, [dateCycle, userList])


    const weekCycle = [];
    useMemo(() => {
      for (let i = 0; i < 7; i++) {
        weekCycle.push({
          label: `周${capitalAr[i]}`,
          value: i + 1
        })
      }
    }, [dateCycle, userList])

    const monthCycle = []
    useMemo(() => {
      for (let i = 0; i < 28; i++) {
        monthCycle.push({
          label: `${i + 1}号`,
          value: i + 1
        })
      }
    }, [dateCycle, userList])

    //开始时间禁用
    const disabledStartDate = (current) => {

      console.log(form.getFieldValue('endtime'))

      if (!form.getFieldValue('endtime')) {
        form.setFieldValue('endtime', undefined)
      }
      return current && (current < moment().subtract(1, 'days') || current > form.getFieldValue('endtime'));
    }
    //结束时间禁用
    const disabledEndDate = (current) => {
      if (!form.getFieldValue('starttime')) {
        form.setFieldValue('starttime', undefined)
      }
      return current && (current < moment().subtract(1, 'days') || current <= form.getFieldValue('starttime'));
    }
    //获取巡检点
    const QueryInspectionPlanAddress = async () => {
      const { areaId } = form.getFieldsValue()
      const res = await operationDesigin.QueryInspectionPlanAddress({
        projectId,
        areaId,
        alike: ''
      })
      if (res.success) {
        inspectRef.current.setDataSource(res.data.unused)
        inspectRef.current.setCopydataSource(res.data.unused)
        inspectRef.current.setSubMeter(res.data.used)
      } else {
        message.error(res.errMsg)
      }
    }
    //新增巡检计划
    const getInsertInspectionPlan = () => {
      return new Promise(async (resolve, reject) => {
        const { areaId, userId, name, content, cycle, time, triggerTime, span, timeRange } = form.getFieldsValue()
        const group = inspectRef.current.subMeter.map(it => it.id)
        let params = {
          projectId,
          areaId,
          userId,
          name,
          content,
          cycle,
          time,
          triggerTime: moment(triggerTime).format('HH:mm'),
          span,
          group,
          startTime: moment(timeRange[0]).format('YYYY-MM-DD'),
          endTime: moment(timeRange[1]).format('YYYY-MM-DD'),
        }
        const res = await operationDesigin.InsertInspectionPlan(params)
        if (res.success) {
          message.success('新增巡检计划成功')
          resolve(true)
        } else {
          message.error(res.errMsg)
          reject(false)
        }
      })

    }
    const changeCycle = (v) => {
      form.setFieldValue('date', null)
      setDataCycle(v)
    }
    const format = 'HH:mm';
    const houropts = [{ label: '2小时', value: 2 }, { label: '4小时', value: 4 },
    { label: '8小时', value: 8 }, { label: '12小时', value: 12 },
    { label: '24小时', value: 24 }, { label: '48小时', value: 48 }, { label: '72小时', value: 72 },]
    useImperativeHandle(ref, () => ({
      getInsertInspectionPlan,
      form
    }))
    const inspectRef = useRef()
    const chooseAddress = () => {
      inspectRef.current.setOpen(true)
      QueryInspectionPlanAddress()
    }
    useEffect(() => {
      getQueryProjectMaintenance(arealist[0].id, setUserList)
    }, [])

    return (
      <>
        <Form
          form={form}
          colon={false}
          labelAlign='left'
          labelCol={{ span: 5 }}
          initialValues={{
            areaId: arealist[0].id,
            cycle: 1
          }}
        >
          <Form.Item label={onelevel.length > 0 ? onelevel[0].levelName : '园区名称'} name="areaId" rules={[rule]}>
            <Select
              options={arealist}
              fieldNames={{ label: 'name', value: 'id' }}
              onChange={(v) => {
                getQueryProjectMaintenance(v, setUserList)
              }}
            ></Select>
          </Form.Item>
          <Form.Item label="计划名称" name="name" rules={[rule]}>
            <Input></Input>
          </Form.Item>
          <Form.Item label="计划有效期" name="timeRange" rules={[rule]}>
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="巡检内容" name="content" rules={[rule]}>
            <Input></Input>
          </Form.Item>
          <Form.Item label="添加巡检点" name="group"  >
            <div className={style.btncss} onClick={chooseAddress}>选择巡检点</div>
          </Form.Item>
          <Form.Item label="巡检人员" name="userId" rules={[rule]}>
            <Select options={mapuserlist} fieldNames={{ value: 'id' }}></Select>
          </Form.Item>
          <Form.Item label="巡检周期" name="cycle" rules={[rule]}>
            <Select
              style={{ width: 128 }}
              options={dateopts}
              onChange={changeCycle}
            ></Select>
          </Form.Item>
          {
            dateCycle !== 1 ? (<Form.Item label="巡检日期" name="time" rules={[rule]}>
              <Select
                style={{ width: 128 }}
                options={dateCycle == 2 ? weekCycle : dateCycle == 3 ? monthCycle : []} ></Select>
            </Form.Item>) : null
          }

          <Form.Item label="开始时间" name="triggerTime" rules={[rule]}>
            <TimePicker format={format} style={{ width: 128 }} />
          </Form.Item>
          <Form.Item label="有效期时长" name="span" rules={[rule]}>
            <Select options={houropts} style={{ width: 128 }}>

            </Select>
          </Form.Item>
          {/* <Form.Item label="开始周期" name="starttime" rules={[rule]}>
          <DatePicker style={{ width: '100%' }} disabledDate={disabledStartDate}></DatePicker>
        </Form.Item>
        <Form.Item label="结束周期" name="endtime" rules={[rule]}>
          <DatePicker style={{ width: '100%' }} disabledDate={disabledEndDate}></DatePicker>
        </Form.Item> */}

        </Form>
        <SetLine ref={inspectRef} />
      </>


    )
  }
)
//查看巡检点
let PlanAddres = ({ PlanAddresRef, planAddress }, ref) => {
  const columns = [
    { title: '巡检点名称', dataIndex: 'name', align: "center", },
    { title: '具体位置', dataIndex: 'position', align: "center", },
  ]
  console.log(planAddress)
  return (
    <Modal mold='cust' ref={PlanAddresRef}>
      <BlueColumn name="查看巡检点" styled={{ padding: '16px 0', color: "#237ae4", fontSize: 16 }} />
      <Table columns={columns} dataSource={planAddress}
        scroll={{
          y: 240,
        }}
      ></Table>
    </Modal>
  )

}
//删除组件
let DeleteModal = ({ delModalRef, name = '', content = '', ...other }) => {
  return (

    <Modal mold='cust' ref={delModalRef} {...other} className={style.DelModal}>
      <BlueColumn name={name} styled={{ padding: '24px 0px', color: '#ff4d4f' }} bg={{ backgroundColor: '#ff4d4f' }}></BlueColumn>
      <div>
        <img src={WarningPng} style={{ margin: '0 32px', width: 48, height: 48 }}></img>
        <span>{content}</span>
      </div>
    </Modal>


  )
}
