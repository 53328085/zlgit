import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState, useCallback } from 'react'
import styled from 'styled-components'

import { Select, Divider, Input, message, Form, Space, DatePicker, TimePicker, Typography } from 'antd'
import Modal from '@com/useModal'
import { useSelector } from 'react-redux'
import Table from '@com/useTable'
import { operationDesigin } from '@api/api'
import dayjs from 'dayjs'
import { useAntdTable } from 'ahooks'
import style from './style.module.less'
import { publishState,adaptation } from '@redux/systemconfig'
import { SetLine } from './inspectcomp.jsx'
import { ExportExcel, CustButton, CustLink } from '@com/useButton'
import Pagecont from "@com/pagecontent"
import Titlelayout from '@com/titlelayout'
import { Serach } from '@com/comstyled'
import { CustButtonT } from "@com/useButton"
const DropstartDiv = styled.div`
.ant-form-item-label > label.ant-form-item-required:not(.ant-form-item-required-mark-optional)::before{
  display: none;
}

`
const { Link } = Typography
const ContainerDiv = styled.div`
      display: flex;
      flex-direction: column;
   //   padding-top: 16px;
      flex: 1;
      row-gap: 32px;
  `
const { RangePicker } = DatePicker;
export default function Index() {


  const [isAdd, setIsAdd] = useState(false)
  const onelevel = useSelector(state => state.system.onelevel);
  const options = onelevel.length > 0 ? useMemo(() => {
    let isall = onelevel.find(o => o.id == 0)
    return isall ? onelevel : ([{ name: onelevel[0]?.levelName + '(全部)', id: 0 }, ...onelevel])
  }, [onelevel]) : []
  const {laptop} = useSelector(adaptation)
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
  const [total, setTtoal] = useState(0)
  const curPage = useRef();
  const PageSize = 14
  const columns = [
    { title: onelevel[0]?.levelName, dataIndex: 'area' },
    { title: '巡检计划名称', dataIndex: 'name' },
    { title: '计划内容', dataIndex: 'content' },
    { title: '计划开始日期', dataIndex: 'startTime' },
    { title: '计划结束日期', dataIndex: 'endTime' },
    { title: '巡检周期', dataIndex: 'cycle', render(text) { return (text === 0 ? '即刻生效' : text === 1 ? '每日' : text === 2 ? '每周' : text === 3 ? '每月' : '/') } },
    { title: '巡检时间', dataIndex: 'timeS' },
    { title: '创建日期', dataIndex: 'createTime' },
    { title: '巡检人', dataIndex: 'operator' },
    {
      title: '操作', dataIndex: '', export: false, render(text) {
        return (
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <CustLink underline onClick={async () => {
              setPlanAddress(text.usedAddress)
              PlanAddresRef.current.onOpen();
            }} text="viewingis" />
            <CustLink type="danger" underline onClick={() => openDel(text)} text="delete" />
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
  const getInspectionPlanPage = ({ current, pageSize }, formData) => {
    curPage.current = current
    const { areaId, alike } = formData
    if (!Number.isInteger(areaId)) return new Promise(resolve => {
      setTtoal(0)
      return resolve({
        list: [],
        total: 0
      })
    })
    let params = {
      projectId,
      pageNum: current,
      pageSize,
      areaId,
      alike,
    }
    return operationDesigin.InspectionPlanPage(params).then(res => {
      const { success, data, total } = res
      setTtoal(Number.isFinite(total) ? total : 0)
      if (success) {
        return {
          list: Array.isArray(data) ? data : [],
          total: Number.isFinite(total) ? total : 0
        }

      } else {
        return {
          list: [],
          total: 0
        }
      }
    })

  }

  const { tableProps, refresh, run, search } = useAntdTable(getInspectionPlanPage, {
    form,
    defaultPageSize: PageSize,
  })
  const { submit } = search
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
    if (onelevel.length == 0) {
      message.warning('请新增园区!')
      return
    }
    setIsAdd(true)
    addmodalRef?.current.onOpen()

  }
  //确认新增
  const confirmAdd = async () => {
    try {
      return addformRef.current.form.validateFields().then(async () => {
        const flag = await addformRef.current.getInsertInspectionPlan()
        console.log(addformRef.current.form, addformRef.current, flag)
        if (flag) {
          //  addformRef.current.form.resetFields()
          refresh()
          // addmodalRef?.current.onCancel()
          // addmodalRef.current.onCancel()
        }
      })
    } catch (error) {
      console.log(error)
      return Promise.reject(error)

    }
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
      try {
        let current = Math.ceil((total - 1) / 14) < curPage.current
        if (current) {
          let values = form.getFieldsValue()
          run({ current: curPage.current - 1, pageSize: PageSize }, values)
        } else {
          refresh()
        }
      } catch (error) {

      }
    } else {
      message.error(errMsg)
    }
  }

  const onExport = () => {
    return new Promise(async (resolve, reject) => {
      const { areaId, alike } = form.getFieldsValue()
      let params = {
        projectId,
        pageNum: 1,
        pageSize: total,
        areaId,
        alike,
      }
      const res = await operationDesigin.InspectionPlanPage(params)
      if (res.success) {
        resolve({
          total: res.total,
          list: res.data ? res.data : []
        })
      } else {
        reject(res.errMsg)
      }
    })

  }

  const inspectRef = useRef()
  const chooseAddress = async () => {
    
      try {
      const { areaId } = addformRef.current.form?.getFieldsValue()
      const res = await operationDesigin.QueryInspectionPlanAddress({
        projectId,
        areaId,
        alike: ''
      })
      if (res.success) {
        inspectRef.current.setDataSource(res.data.unused)
        inspectRef.current.setCopydataSource(res.data.unused)
        inspectRef.current.setSubMeter(res.data.used)
        inspectRef.current.setOpen(true)
      } else {
        message.error(res.errMsg)
      }
    
    } catch(e) {
        console.log(e)
    }
    
  }
  
  return (
    <Pagecont showserach={false} pd="0px" >
      <Titlelayout title="巡检计划管理" layout="flex" dr="column" style={{ height: "823px", overflow: "hidden" }}>
        <ContainerDiv>

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
            <Space size={16}>
              <Form.Item name="areaId" style={{ marginRight: 0, marginBottom: 0 }}>
                <Select
                  options={options}
                  style={{ width: 264 }}
                  fieldNames={{ label: 'name', value: 'id' }}
                  className="pdtop8 pdbottom12"
                  onChange={submit}
                ></Select>
              </Form.Item>

              <Form.Item name="alike" style={{ marginRight: 0, marginBottom: 0 }}>
                <Serach
                  placeholder="巡检点名称/具体位置"
                  onSearch={submit}
                />
              </Form.Item>
            </Space>
            <Space size={16}>
              {publish ? null : <CustButtonT onClick={openAdd} text="new" src="new" />

              }
              <ExportExcel setKey={setKey} tb={tableRef} />
            </Space>
          </Form>
          <Table columns={columns} ref={tableRef}  {...tableProps} onExport={onExport} sheetName="巡检计划管理"></Table>

          <Modal mold='cust' ref={addmodalRef} width={538} onOk={confirmAdd} custft={isAdd} title="新建巡检计划" getContainer={false} >

            <AddPlan projectId={projectId} ref={addformRef} laptop={laptop} getQueryProjectMaintenance={getQueryProjectMaintenance} chooseAddress={chooseAddress}  />
          </Modal>
          <SetLine ref={inspectRef} form={() =>addformRef.current?.form} laptop={laptop} />
          <PlanAddres PlanAddresRef={PlanAddresRef} planAddress={planAddress} />
          <DeleteModal delModalRef={delModalRef} name="删除巡检计划" content="确认是否要删除巡检计划？" onOk={delOk} />
        </ContainerDiv>
      </Titlelayout>
    </Pagecont>
  )
}

//新增巡检计划组件
let AddPlan = forwardRef(
  ({ projectId, getQueryProjectMaintenance, chooseAddress }, ref) => {
    const [form] = Form.useForm()
    const [userList, setUserList] = useState([])//运维人员列表
    const onelevel = useSelector(state => state.system.onelevel);
    const arealist = onelevel.length > 0 ? onelevel : []
    const dateopts = [{ label: '即刻生效', value: 0 }, { label: '每日', value: 1 }, { label: '每周', value: 2 }, { label: '每月', value: 3 }]
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
      return current && (current < dayjs().subtract(1, 'days') || current > form.getFieldValue('endtime'));
    }
    //结束时间禁用
    const disabledEndDate = (current) => {
      if (!form.getFieldValue('starttime')) {
        form.setFieldValue('starttime', undefined)
      }
      return current && (current < dayjs().subtract(1, 'days') || current <= form.getFieldValue('starttime'));
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
        const { areaId, userId, name, content, cycle, time, triggerTime, span, timeRange, group } = form.getFieldsValue()

        let params = {}
        const groups = group.map(it => it.id)
        if (cycle != 0) {
          params = {
            projectId,
            areaId,
            userId,
            name,
            content,
            cycle,
            time,
            triggerTime: dayjs(triggerTime).format('HH:mm'),
            span,
            group: groups,
            startTime: dayjs(timeRange[0]).format('YYYY-MM-DD'),
            endTime: dayjs(timeRange[1]).format('YYYY-MM-DD'),
          }
        } else {
          params = {
            projectId,
            areaId,
            userId,
            name,
            content,
            cycle,
            time,
            triggerTime: defaultHM,
            span,
            group: groups,
            startTime: defaultStartDate,
            endTime: threeDaysLater,
          }
        }

        console.log(params)
        const res = await operationDesigin.InsertInspectionPlan(params)
        if (res.success) {
          message.success('新增巡检计划成功')
          resolve(true)
        } else {
          message.error(res.errMsg)
          // reject(false)
        }
      })

    }
    const format = 'HH:mm';
    const threeDaysLater = dayjs().add(3, 'days').format('YYYY-MM-DD');
    // 默认开始日期为今天
    const defaultStartDate = dayjs().format('YYYY-MM-DD');
    const [defaultHM, setDefaultHM] = useState(dayjs().format('HH:mm'))
    // const defaultHM = dayjs().format('HH:mm');
    console.log(defaultStartDate, threeDaysLater, defaultHM)
    const houropts = [{ label: '2小时', value: 2 }, { label: '4小时', value: 4 },
    { label: '8小时', value: 8 }, { label: '12小时', value: 12 },
    { label: '24小时', value: 24 }, { label: '48小时', value: 48 }, { label: '72小时', value: 72 },]
    useImperativeHandle(ref, () => ({
      getInsertInspectionPlan,
      form
    }))
    const changeCycle = (v) => {
      form.setFieldValue('date', null)
      form.setFieldValue('time', null)
      setDataCycle(v)
      setDefaultHM(dayjs().format('HH:mm'))
      console.log(v, dateCycle)
    }
    const inspectRef = useRef()
   /*  const chooseAddress = () => {
      inspectRef.current.setOpen(true)
      QueryInspectionPlanAddress()
    } */
    const onChangeStartTime = (time, timeString) => {
      setDefaultHM(timeString)
      console.log(defaultHM)
    }

    useEffect(() => {
      getQueryProjectMaintenance(arealist[0]?.id, setUserList)
    }, [])

    return (
      <DropstartDiv>
        <Form
          form={form}
          colon={false}
          labelAlign='left'
          labelCol={{ span: 5 }}
          initialValues={{
            areaId: arealist[0]?.id,
            cycle: 1
          }}
        >
          <Form.Item label={onelevel.length > 0 ? onelevel[0].levelName : '园区名称'} name="areaId" rules={[rule]}>
            <Select
              placeholder="请选择园区"
              options={arealist}
              fieldNames={{ label: 'name', value: 'id' }}
              onChange={(v) => {
                getQueryProjectMaintenance(v, setUserList)
              }}
            ></Select>
          </Form.Item>
          <Form.Item label="计划名称" name="name" rules={[rule]}>
            <Input placeholder="请输入计划名称"></Input>
          </Form.Item>
          {dateCycle == 0 ? <Form.Item label="计划有效期" >
            <RangePicker style={{ width: '100%' }} defaultValue={[dayjs(defaultStartDate), dayjs(threeDaysLater)]} disabled />
          </Form.Item> : <Form.Item label="计划有效期" name="timeRange" rules={[rule]}>
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>}


          <Form.Item label="巡检内容" name="content" rules={[rule]}>
            <Input placeholder="请输入巡检内容"></Input>
          </Form.Item>
          <Form.Item label="添加巡检点" name="group" rules={[rule]}>
            <CustButton onClick={chooseAddress}>选择巡检点</CustButton>
          </Form.Item>
          <Form.Item label="巡检人员" name="userId" rules={[rule]}>
            <Select options={mapuserlist} fieldNames={{ value: 'id' }} placeholder="请选择巡检人员"></Select>
          </Form.Item>
          <Form.Item label="巡检周期" name="cycle" rules={[rule]}>
            <Select
              style={{ width: 128 }}
              options={dateopts}
              onChange={changeCycle}
            ></Select>
          </Form.Item>
          {
            dateCycle > 1 ? (<Form.Item label="巡检时间" name="time" rules={[rule]}>
              <Select
                placeholder="请选择巡检日期"
                style={{ width: 128 }}
                options={dateCycle == 2 ? weekCycle : dateCycle == 3 ? monthCycle : []} ></Select>
            </Form.Item>) : null
          }

          {dateCycle == 0 ? <Form.Item label="开始时间">
            <TimePicker allowClear={false} format={format} style={{ width: 128 }} onChange={onChangeStartTime} defaultValue={dayjs(defaultHM, "HH:mm")} />
          </Form.Item>
            : <Form.Item label="开始时间" name="triggerTime" rules={[rule]}>
              <TimePicker format={format} style={{ width: 128 }} />
            </Form.Item>}
          <Form.Item label="有效期时长" name="span" rules={[rule]}>
            <Select placeholder="请选择有效时长" options={houropts} style={{ width: 128 }}>

            </Select>
          </Form.Item>
          {/* <Form.Item label="开始周期" name="starttime" rules={[rule]}>
          <DatePicker style={{ width: '100%' }} disabledDate={disabledStartDate}></DatePicker>
        </Form.Item>
        <Form.Item label="结束周期" name="endtime" rules={[rule]}>
          <DatePicker style={{ width: '100%' }} disabledDate={disabledEndDate}></DatePicker>
        </Form.Item> */}

        </Form>
       {/*  <SetLine ref={inspectRef} form={form} laptop={laptop} /> */}
      </DropstartDiv >


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
    <Modal mold='cust' ref={PlanAddresRef} onOk={() => { PlanAddresRef.current.onCancel() }} title="查看巡检点">
      {/* <BlueColumn name="查看巡检点" styled={{ padding: '16px 0', color: "#237ae4", fontSize: 16 }} /> */}
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

    <Modal mold='cust' ref={delModalRef} {...other} className={style.DelModal} title={name} type="warn">
      {/* <BlueColumn name={name} styled={{ padding: '24px 0px', color: '#ff4d4f' }} bg={{ backgroundColor: '#ff4d4f' }}></BlueColumn> */}

      {content}

    </Modal>


  )
}
