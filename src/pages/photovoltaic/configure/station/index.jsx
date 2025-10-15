import React, {
  useRef, useState, useMemo,
} from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useAntdTable } from 'ahooks'
import Usetable from '@com/useTable'
import moment from "moment";
import BindAir from './bind'
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
import { useOutletContext } from 'react-router-dom'
import { GetPVStationList, AddPVStation, UpdatePVStation, DeletePVStation, useQueryACsUnConfigByPage } from "./api.js";
import Pagecont from "@com/pagecontent"
import Titlelayout from '@com/titlelayout'
import CModal from '@com/useModal'
import { CustButtonT, CustLink } from '@com/useButton'
import {
  useGetPVStationList, useDeletePVStation
} from './api'
export default function Index() {
  const tableRef = useRef();
  let { exparams } = useOutletContext()
  let { areaId, projectId } = exparams
  const ispublish = useSelector(publishState);
  const areaFirstName = useSelector(levelDefaultLabel) || '园区'

  const totalItem = useRef();
  const curPage = useRef();
  const PageSize = 14

  const getTableData = async ({ current, pageSize }) => {
    curPage.current = current
    if (!projectId) return new Promise((resolve) => {
      resolve({
        list: [],
        total: 0
      })
    })
    const params = {
      projectId,
      areaId,
      pageNum: current,
      pageSize // 增加分页大小，确保获取足够数据
    }
    let { success, data, errMsg, total } = await useGetPVStationList(params)
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
  const { tableProps, refresh, run } = useAntdTable(getTableData, {
    defaultPageSize: PageSize,
    refreshDeps: [projectId, areaId]
  })

  //删除告警类型弹窗
  const [deleteTypeModal, setDeleteTypeModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  const columns =
    [
      {
        align: "center",
        title: "所属" + areaFirstName + "名称",
        dataIndex: "areaName",
        key: "areaName",
      },
      {
        align: "center",
        title: "光伏站点名称",
        dataIndex: "name",
        key: "name",
      },
      {
        align: "center",
        title: "光伏站点编号",
        dataIndex: "no",
        key: "no",
      },
      {
        title: "总表名称",
        dataIndex: "meterName",
        key: "meterName",
        align: "center",
      },
      {
        align: "center",
        title: "总表编号",
        dataIndex: "meterSn",
        key: "meterSn",
      },
      {
        title: "光伏并网柜数",
        dataIndex: "gridTiedCabinetCount",
        key: "gridTiedCabinetCount",
        align: "center",
      },
      {
        title: "逆变器数",
        dataIndex: "inverterCount",
        key: "inverterCount",
        align: "center",
      },
      {
        align: "center",
        title: "装机容量(kW)",
        dataIndex: "capacity",
        key: "capacity",
      },
      {
        title: "安装地址",
        dataIndex: "address",
        key: "address",
        align: "center",
      },
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
  const [selectId, setSelectId] = useState(0)
  const [editData, setEditData] = useState({})
  //点击新增 打开弹框
  const showAdd = () => {
    setEditData({})
    setModalTitle("新增站点");
    ref.current.onOpen()
  };
  //编辑
  const editRecord = (record) => {
    setEditData({ ...record }); // 创建新对象确保引用更新
    setModalTitle("编辑站点");
    setTimeout(() => {
      ref.current.onOpen();
    }, 0);
  };
  //删除
  const deleteRecord = (record) => {
    setSelectId(record.id)
    setDeleteTypeModal(true);
  };
  //删除站点确认
  const deleteOk = async () => {
    let res = await useDeletePVStation({ projectId, stationId: selectId })
    if (res.success) {
      message.success('光伏站点删除成功!')
      try {
        let current = Math.ceil((totalItem.current - 1) / PageSize) < curPage.current

        if (current) {
          run({ current: curPage.current - 1, pageSize: PageSize })
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

  const Title = (
    <div style={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
      <span>光伏站点列表</span>
      {ispublish ? null : (
        <CustButtonT
          text="new"
          src="new"
          onClick={showAdd}
        >

        </CustButtonT>
      )}
    </div>
  )

  const airprop = useMemo(() => {
    return {
      projectId,
      updata: run,
      modalTitle,
      curPage: curPage.current,
      editData: editData
    }
  }, [projectId, modalTitle, editData])
  return (
    <Pagecont showserach={false} custserach pd="0px" >
      <Titlelayout title={Title} layout="flex">
        <Usetable
          rowKey={(record) => record.id}
          ref={tableRef}
          columns={columns}
          {...tableProps}
        ></Usetable>
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
          是否确认删除光伏站点？
        </CModal>
        <BindAir {...airprop} ref={ref} />

      </Titlelayout>
    </Pagecont>
  );
}
