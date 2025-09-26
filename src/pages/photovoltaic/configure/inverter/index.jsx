import React, { useRef, useState, useMemo, useEffect } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useAntdTable } from 'ahooks'
import { useOutletContext } from 'react-router-dom'
import Usetable from '@com/useTable'
import moment from "moment";
import BindAir from './bind'
import { Mainbox } from './style'
import { Serach } from "@com/comstyled"
import { PlusOutlined } from "@ant-design/icons";
import {
  InputNumber,
  Space,
  Form,
  Input,
  message,
  Select,
  DatePicker,
  Upload,
  Typography
} from "antd";
import {
  selectProjectId,
  publishState,
  selectOneLevel,
  levelDefaultLabel
} from "@redux/systemconfig.js";
import { SiteManagerDesigner } from '@api/api.js'
import Pagecont from "@com/pagecontent"
import Titlelayout from '@com/titlelayout'
import CModal from '@com/useModal'
import { CustButtonT, CustLink } from '@com/useButton'
import {
  useQueryStationList, useGetGridTiedCabinetList

} from './api'
import { cabinetColumns } from './data'
export default function Index() {
  let { exparams } = useOutletContext()
  let { areaId, projectId } = exparams
  const tableRef = useRef();
  const [form] = Form.useForm();
  const ispublish = useSelector(publishState);
  const areaFirstName = useSelector(levelDefaultLabel) || '园区'

  const { GetSites, AddSite, UpdateSite, DeleteSite } = SiteManagerDesigner

  const totalItem = useRef();
  const curPage = useRef();
  const PageSize = 14
  const [stationData, setStationData] = useState([]);

  // 获取站点数据函数
  const RuntimStation = async () => {
    if (projectId == undefined || areaId == undefined) return
    try {
      const params = {
        projectId,
        areaId,
      }

      let { success, data, total, errMsg } = await useQueryStationList(params)

      if (success) {
        // 检查数据结构是否正确
        if (data && Array.isArray(data)) {
          setStationData(data)
        } else {
          setStationData([])
        }
      } else {
        setStationData([])
        message.warning(errMsg || "获取设备数据失败")
      }
    } catch (error) {
      setStationData([])
      message.error('网络异常，无法获取设备数据')
    }
  }
  const getTableData = async ({ current, pageSize }) => {
    console.log(1111)
    curPage.current = current
    if (!projectId) return new Promise((resolve) => {
      resolve({
        list: [],
        total: 0
      })
    })
    const { name, stationId } = await form.validateFields()
    const params = {
      projectId,
      areaId,
      stationId,
      name,
      pageNum: current,
      pageSize

    }
    let { success, data, errMsg, total } = await useGetGridTiedCabinetList(params)
    return
    totalItem.current = Number.isInteger(total) ? total : 0
    if (success) {
      console.log(Array.isArray(data) && data?.length > 0)
      if (Array.isArray(data) && data?.length > 0) {
        return {
          list: data,
          total
        }
      } else {
        return {
          list: [],
          total: 0
        }
      }
    } else {
      message.error(res.errMsg)
    }
  }
  //删除告警类型弹窗
  const [deleteTypeModal, setDeleteTypeModal] = useState(false);
  //新增 true 修改 false
  const [modalTitle, setModalTitle] = useState("");
  const columns =
    [
      {
        align: "center",
        title: "所属" + areaFirstName + "名称",
        dataIndex: "areaName",
        key: "areaName",
      },
      ...cabinetColumns,
      {
        title: "操作",
        key: "action",
        align: "center",
        render: (_, record) => (
          <Space size="middle">
            <CustLink
              text="edit"
              onClick={() => editRecord(record)}
            />

            <CustLink
              type="danger"
              text="delete"
              onClick={() => deleteRecord(record)}
            />

          </Space>
        ),
      },
    ]



  const ref = useRef()
  //点击新增 打开弹框
  const onAdd = () => {
    setEditData({})
    setModalTitle("新增光伏并网柜");
    ref.current.onOpen()
  };
  //编辑
  const [selectId, setSelectId] = useState(0)
  const [editData, setEditData] = useState({})
  const editRecord = (record) => {
    setEditData(record)
    setModalTitle("编辑光伏并网柜");
    ref.current.onOpen()
  };
  //删除
  const deleteRecord = (record) => {
    setSelectId(record.id)
    setDeleteTypeModal(true);
  };
  //删除站点确认
  const deleteOk = async () => {
    let res = await DeleteSite(projectId, selectId)
    if (res.success) {
      message.success('逆变器关联关系删除成功!')
      try {
        let current = Math.ceil((totalItem.current - 1) / PageSize) < curPage.current

        if (current) {
          let values = form.getFieldsValue()
          run({ current: curPage.current - 1, pageSize: PageSize }, values)
        } else {
          refresh()
        }

      } catch (error) {

      }
    } else {
      message.error(res.errMsg)
    }
    setDeleteTypeModal(false);
  };
  //删除站点取消
  const deleteCancel = () => {
    setDeleteTypeModal(false);
  };
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      if (file.status === "removed") {
        setImageUrl();
      } else {
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      }
    });

  const Title = (
    <div style={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
      <span>光伏并网柜列表</span>
      {/* {ispublish ? null : (
        <CustButtonT
          text="new"
          src="new"
          onClick={onAdd}
        >

        </CustButtonT>
      )} */}
    </div>
  )

  const { tableProps, search, run, refresh } = useAntdTable(getTableData, {
    defaultPageSize: 18,
    refreshDeps: [projectId, areaId]
  })
  const { submit } = search
  const airprop = useMemo(() => {
    return {
      projectId,
      updata: run,
      modalTitle,
      curPage: curPage.current,
      editData: editData
    }
  }, [projectId, modalTitle, editData])
  useEffect(() => {

    RuntimStation()
    form.setFieldsValue({ stationId: 0 })
  }, [areaId, projectId])
  return (
    <Pagecont showserach={false} custserach pd="0px" >
      <Titlelayout title={Title} layout="flex" dr="column">
        <Mainbox>
          <div className="search">
            <Form form={form} layout="inline"  >
              <Form.Item label="所属站点" name="stationId" initialValue={0}>
                <Select
                  style={{ width: "210px" }}
                  onChange={submit}
                  options={[{ name: '全部', id: 0 }, ...stationData]}
                  fieldNames={{
                    label: "name",
                    value: "id",
                    options: "options",
                  }}
                />
              </Form.Item>
              <Form.Item label="光伏并网柜" name="name" style={{ marginLeft: "16px" }} >
                <Serach onSearch={submit} />
              </Form.Item>
            </Form>
            <Space size={16}>
              <CustButtonT text="new"
                src="new" onClick={() => onAdd()}></CustButtonT>
            </Space>
          </div>
          <Usetable
            rowKey={(record) => record.id}
            ref={tableRef}
            columns={columns}
            {...tableProps}
          ></Usetable>
        </Mainbox>
        <CModal
          open={deleteTypeModal}
          onOk={deleteOk}
          onCancel={deleteCancel}
          width={512}
          closable={false}
          type="warn"
          mold="cust"
          title="删除提示"
          key="ma"
        >
          是否确认删除逆变器关联关系？
        </CModal>
        <BindAir   {...airprop} ref={ref} />
      </Titlelayout>
    </Pagecont>
  );
}
