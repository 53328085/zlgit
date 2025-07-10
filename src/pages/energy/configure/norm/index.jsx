import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Space, message, Form, Input, Typography } from 'antd';
import style from './style.module.less'
import SearchTree from '@com/searchTree'
import Custmodl from '@com/useModal'
import dashed from '@imgs/dashed.png'
import { energyQuota, Area } from '@api/api.js'
import { useRequest, useAntdTable } from 'ahooks';
import { useOutletContext } from 'react-router-dom'
import Pagecount from "@com/pagecontent";
import { Cspin, Serach, Cdivider } from '@com/comstyled'
import { CustButton } from '@com/useButton'
import UseTable from '@com/useTable'
const { Link } = Typography
export default function Index() {
  const { t } = useTranslation(["button"])
  let { exparams, setCustview } = useOutletContext()
  let { areaId, projectId } = exparams
  const setRef = useRef()
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm()
  const Item = Form.Item

  const { AllLevel } = Area
  const { querySpaceTrees, queryRoomQuotas, updateRoomQuotas } = energyQuota

  //园区


  const getTreeData = () => {
    if (!Number.isFinite(areaId)) return;
    return querySpaceTrees(projectId, areaId, '').then(res => {
      const { success, data } = res
      if (success) {
        return Array.isArray(data) ? data : []
        // setTreeData(res.data)
      } else {
        messageApi.open({
          type: 'error',
          content: res.errMsg
        })
        return []
      }
    })
  }

  const { data: treeData } = useRequest(getTreeData, {
    refreshDeps: [projectId, areaId]
  })


  useEffect(() => {
    if (areaId > 0 && Number.isInteger(areaId)) {
      setParams([{ id: areaId, level: 1 }])
    }
  }, [areaId])
  //const [treeData, setTreeData] = useState([])
  const fieldNames = {
    title: 'name',
    key: 'areaId',
    children: 'nodes'
  }
  //查询表格
  const [params, setParams] = useState([])
  const [treeValues, setTreeValues] = useState([])
  const getFromChild = values => {

    setTreeValues(values)
    if (values.length == 0) {
      setParams([{ level: 1, id: areaId }])
    } else {
      let arr = []
      values.map(item => {
        if (item?.pos?.length === 3) {
          arr.push({
            level: 1,
            id: item.node.areaId
          })
        }
        if (item?.pos?.length == 5) {
          arr.push({
            level: 2,
            id: item.node.areaId
          })
        }
        if (item?.pos?.length == 7) {
          arr.push({
            level: 3,
            id: item.node.areaId
          })
        }
      })
      if (arr.length == 0) {
        return;
      } else {
        setParams(arr)
      }

    }
  }
  const [columns, setColumns] = useState([
    {
      title: '园区',
      dataIndex: 'area',
      key: 'area',
      align: 'center',
    }, {
      title: '建筑物',
      dataIndex: 'building',
      key: 'building',
      align: 'center'
    }, {
      title: '房间',
      dataIndex: 'room',
      key: 'room',
      align: 'center',
      width: '128px',
    }, {
      title: '年度综合能耗定额(吨标煤)',
      dataIndex: 'quotaComprehensive',
      key: 'quotaComprehensive',
      align: 'center',
      width: '148px',
    }, {
      title: '年度用电定额(kWh)',
      dataIndex: 'quotaElectric',
      key: 'quotaElectric',
      align: 'center',
      width: '128px',
    }, {
      title: (<div>冷水(m³)<br />剩余/定额 </div>),
      dataIndex: 'quotaWaterCold',
      key: 'quotaWaterCold',
      align: 'center',
      width: '128px',
      render: (_, record) => (
        <Space size="middle">
          <span>{record.quotaWaterColdLeave + '/' + record.quotaWaterCold}</span>
        </Space>)
    }, {
      title: (<div>热水(m³)<br />剩余/定额 </div>),
      dataIndex: 'quotaWaterHot',
      key: 'quotaWaterHot',
      align: 'center',
      width: '128px',
      render: (_, record) => (
        <Space size="middle">
          <span>{record.quotaWaterHotLeave + '/' + record.quotaWaterHot}</span>
        </Space>)
    }, {
      title: (<div>燃气(m³)<br />剩余/定额 </div>),
      dataIndex: 'quotaGas',
      key: 'quotaGas',
      align: 'center',
      width: '128px',
      render: (_, record) => (
        <Space size="middle">
          <span>{record.quotaGasLeave + '/' + record.quotaGas}</span>
        </Space>)
    }, {
      title: (<div>煤炭(吨)<br />剩余/定额 </div>),
      dataIndex: 'quotaCoal',
      key: 'quotaCoal',
      align: 'center',
      width: '128px',
      render: (_, record) => (
        <Space size="middle">
          <span>{record.quotaCoalLeave + '/' + record.quotaCoal}</span>
        </Space>)
    }, {
      title: '操作',
      key: 'action',
      align: 'center',
      width: '128px',
      render: (_, record) => (
        <Space size="middle">
          <Link onClick={() => setAll(record)}>{t("button:edit")}</Link>
        </Space>)
    }
  ])
  useEffect(() => {
    if (!Number.isFinite(projectId)) return;
    AllLevel(projectId).then(res => {
      if (res.success) {
        setColumns([
          {
            title: res.data[0]?.name || '园区',
            dataIndex: 'area',
            key: 'area',
            align: 'center',
          }, {
            title: res.data[1]?.name || '建筑物',
            dataIndex: 'building',
            key: 'building',
            align: 'center'
          }, {
            title: res.data[2]?.name || '房间',
            dataIndex: 'room',
            key: 'room',
            align: 'center',
            width: '128px',
          }, {
            title: '年度综合能耗定额(吨标煤)',
            dataIndex: 'quotaComprehensive',
            key: 'quotaComprehensive',
            align: 'center',
            width: '148px',
          }, {
            title: '年度用电定额(kWh)',
            dataIndex: 'quotaElectric',
            key: 'quotaElectric',
            align: 'center',
            width: '128px',
          }, {
            title: (<div>冷水(m³)<br />剩余/定额 </div>),
            dataIndex: 'quotaWaterCold',
            key: 'quotaWaterCold',
            align: 'center',
            width: '128px',
            render: (_, record) => (
              <Space size="middle">
                <span>{record.quotaWaterColdLeave + '/' + record.quotaWaterCold}</span>
              </Space>)
          }, {
            title: (<div>热水(m³)<br />剩余/定额 </div>),
            dataIndex: 'quotaWaterHot',
            key: 'quotaWaterHot',
            align: 'center',
            width: '128px',
            render: (_, record) => (
              <Space size="middle">
                <span>{record.quotaWaterHotLeave + '/' + record.quotaWaterHot}</span>
              </Space>)
          }, {
            title: (<div>燃气(m³)<br />剩余/定额 </div>),
            dataIndex: 'quotaGas',
            key: 'quotaGas',
            align: 'center',
            width: '128px',
            render: (_, record) => (
              <Space size="middle">
                <span>{record.quotaGasLeave + '/' + record.quotaGas}</span>
              </Space>)
          }, {
            title: (<div>煤炭(吨)<br />剩余/定额 </div>),
            dataIndex: 'quotaCoal',
            key: 'quotaCoal',
            align: 'center',
            width: '128px',
            render: (_, record) => (
              <Space size="middle">
                <span>{record.quotaCoalLeave + '/' + record.quotaCoal}</span>
              </Space>)
          }, {
            title: '操作',
            key: 'action',
            align: 'center',
            width: '128px',
            render: (_, record) => (
              <Space size="middle">
                <Link underline onClick={() => setAll(record)}>{t("button:edit")}</Link>
              </Space>)
          }
        ])
      } else {
        message.error(res.errMsg)
      }
    })
  }, [projectId])

  const getTableData = ({ current, pageSize }) => {
    if (!(Number.isInteger(projectId) && Number.isInteger(areaId) && params.length == 1)) return
    return queryRoomQuotas(projectId, current, pageSize, params).then(res => {
      const { success, data, total } = res
      if (success) {
        setSelectedKeys([])
        let f = Array.isArray(data)
        return {
          list: f ? data : [],
          total: f ? total : 0
        }
      } else {
        messageApi.open({
          type: 'error',
          content: res.errMsg
        })
        return {
          list: [],
          total: 0,
        }
      }
    })
  }
  const { run: runTable, tableProps } = useAntdTable(getTableData, {
    refreshDeps: [projectId, areaId, params],
    defaultPageSize: 20
  })
  /*   useEffect(()=>{
      if(params.length == 0){
        return
      }else{
        runTable()
      }
    },[params, pageNum]) */

  const [selectedKeys, setSelectedKeys] = useState([]);
  const [copyKeys, setCopyKeys] = useState([]);
  const onSelect = (record, selected, selectedRows, nativeEvent) => {
    setCopyKeys(record)
    setSelectedKeys(selected);
  };
  const rowSelection = {
    selectedKeys,
    onChange: onSelect,
  };

  const setAll = (record) => {
    if (record) {
      form.resetFields()
      setSelectedKeys([record])
      form.setFieldsValue({
        TotalValue: record.quotaComprehensive,
        TotalWarningValue: record.totalWarningValue,
        ElectricValue: record.quotaElectric,
        ElectricWarningValue: record.electricWarningValue,
        WaterColdValue: record.quotaWaterCold,
        WaterColdWarningValue: record.waterColdWarningValue,
        WaterHotValue: record.quotaWaterHot,
        WaterHotWarningValue: record.waterHotWarningValue,
        GasValue: record.quotaGas,
        GasWarningValue: record.gasWarningValue,
        CoalValue: record.quotaCoal,
        CoalWarningValue: record.coalWarningValue,
      })
    } else if (!record && treeValues.length == 0 && copyKeys.length == 0) {
      messageApi.open({
        type: 'warning',
        content: '请至少选择一项配置项'
      })
      return;
    } else {
      form.resetFields()
    }
    setRef.current.onOpen()
  }
  const onOk = async () => {
    try {
      const values = await form.validateFields();
      let param = [];
      if (selectedKeys.length > 0) {
        selectedKeys.map(item => {
          param.push({
            id: item.id,
            areaId: item.areaId,
            areaLevel: 3,
            ...values
          })
        })
      } else if (params.length > 0 && copyKeys.length == 0) {
        params.map(item => {
          if (item.level == 3) {
            param.push({
              areaId: item.id,
              areaLevel: item.level,
              ...values
            })
          }
        })
      }
      updateRoomQuotas(projectId, param).then(res => {
        if (res.success) {
          messageApi.open({
            type: 'success',
            content: '能耗定额配置成功!'
          })
          setRef.current.onCancel()
          form.resetFields()
          runTable()
        } else {
          // messageApi.open({
          //   type:'error',
          //   content:res.errMsg
          // })
          message.error(res.errMsg)
        }
      })

    } catch (errorInfo) { }

  }
  const view = (<CustButton style={{ marginLeft: 'auto' }} wh="auto" onClick={setAll}>{t("button:batchConfiguration")}</CustButton>)
  useEffect(() => {
    setCustview(view)
  }, [])
  const handelValidate = (rule, value, callback) => {
    if (!Number.isNaN(Number(value))) {
      // callback()
      return Promise.resolve();
    } else {
      // callback('值只能为数字！')
      return Promise.reject('值只能为数字')
    }
  }




  return (
    <Pagecount bgcolor="transparent" pd="0">
      {contextHolder}
      <div className={style.mainContent}>
        <SearchTree treeData={treeData} fieldNames={fieldNames} getValues={getFromChild}></SearchTree>
        <div className={style.rightContent}>
          <UseTable columns={columns} rowKey='id' rowSelection={rowSelection}  {...tableProps} hbg="#ecf5ff" hbc="#515151"></UseTable>
        </div>
      </div>
      <Custmodl title='设置能耗定额' ref={setRef} mold="cust" width={640} onOk={onOk}>
        <Form name='editform' form={form} requiredMark={false} autoComplete='off' style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Item label='综合能耗(吨标煤)' labelCol={{ span: 14 }} labelAlign={'left'} name='TotalValue' style={{ width: 240 }}>
            <Input style={{ width: '128px', textAlign: 'right' }}></Input>
          </Item>
          <Item label='预警值' name='TotalWarningValue' labelCol={{ span: 8 }} labelAlign={'right'} rules={[{ required: true, message: '请输入预警值' }, { validator: handelValidate }]}>
            <Input style={{ width: '128px', textAlign: 'right' }} ></Input>
          </Item>
          <img src={dashed} style={{ width: '100%', marginBottom: 16 }}></img>
          <Item label='年度用电定额(kWh)' labelCol={{ span: 14 }} labelAlign={'left'} name='ElectricValue' style={{ width: 240 }} rules={[{ required: true, message: '请输入用电定额' }]}>
            <Input style={{ width: '128px', textAlign: 'right' }}></Input>
          </Item>
          <Item label='预警值' name='ElectricWarningValue' labelCol={{ span: 8 }} labelAlign={'right'} rules={[{ required: true, message: '请输入预警值' }]}>
            <Input style={{ width: '128px', textAlign: 'right' }}></Input>
          </Item>
          <Item label='年度冷水定额(m³)' labelCol={{ span: 14 }} labelAlign={'left'} name='WaterColdValue' style={{ width: 240 }} rules={[{ required: true, message: '请输入冷水定额' }]}>
            <Input style={{ width: '128px', textAlign: 'right' }}></Input>
          </Item>
          <Item label='预警值' name='WaterColdWarningValue' labelCol={{ span: 8 }} labelAlign={'right'} rules={[{ required: true, message: '请输入预警值' }]}>
            <Input style={{ width: '128px', textAlign: 'right' }}></Input>
          </Item>
          <Item label='年度热水定额(m³)' labelCol={{ span: 14 }} labelAlign={'left'} name='WaterHotValue' style={{ width: 240 }} rules={[{ required: true, message: '请输入热水定额' }]}>
            <Input style={{ width: '128px', textAlign: 'right' }}></Input>
          </Item>
          <Item label='预警值' name='WaterColdWarningValue' labelCol={{ span: 8 }} labelAlign={'right'} rules={[{ required: true, message: '请输入预警值' }]}>
            <Input style={{ width: '128px', textAlign: 'right' }}></Input>
          </Item>
          <Item label='年度用气定额(m³)' labelCol={{ span: 14 }} labelAlign={'left'} name='GasValue' style={{ width: 240 }} rules={[{ required: true, message: '请输入用气定额' }]}>
            <Input style={{ width: '128px', textAlign: 'right' }}></Input>
          </Item>
          <Item label='预警值' name='GasWarningValue' labelCol={{ span: 8 }} labelAlign={'right'} rules={[{ required: true, message: '请输入预警值' }]}>
            <Input style={{ width: '128px', textAlign: 'right' }}></Input>
          </Item>
          <Item label='年度用煤定额(吨)' labelCol={{ span: 14 }} labelAlign={'left'} name='CoalValue' style={{ width: 240 }} rules={[{ required: true, message: '请输入用煤定额' }]}>
            <Input style={{ width: '128px', textAlign: 'right' }}></Input>
          </Item>
          <Item label='预警值' name='CoalWarningValue' labelCol={{ span: 8 }} labelAlign={'right'} rules={[{ required: true, message: '请输入预警值' }]}>
            <Input style={{ width: '128px', textAlign: 'right' }}></Input>
          </Item>
        </Form>
      </Custmodl>
    </Pagecount>
  )
}
