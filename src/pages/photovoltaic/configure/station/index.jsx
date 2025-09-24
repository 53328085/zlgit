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
import { SiteManagerDesigner } from '@api/api.js'
import { GetPVStationList, AddPVStation, UpdatePVStation, DeletePVStation, useQueryACsUnConfigByPage } from "./api.js";
import Pagecont from "@com/pagecontent"
import Titlelayout from '@com/titlelayout'
import CModal from '@com/useModal'
import { CustButtonT, CustLink } from '@com/useButton'
const { Link } = Typography

const Formbox = styled.div`
  && {
    
    .ant-form-item {
      margin-bottom: ${props => props.theme.laptop ? "8px" : "24px"};
    }
  }
`
export default function Index() {
  const tableRef = useRef();
  const [form] = Form.useForm();
  let { exparams } = useOutletContext()
  let { areaId, projectId } = exparams
  const ispublish = useSelector(publishState);
  const areaFirstName = useSelector(levelDefaultLabel) || '园区'

  const { GetSites, AddSite, UpdateSite, DeleteSite } = SiteManagerDesigner

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
    let { success, data, errMsg } = await GetPVStationList(projectId, areaId, current, pageSize)
    totalItem.current = Number.isInteger(total) ? total : 0
    if (success) {
      if (Array.isArray(data) && data?.length > 0) {
        //setDataSource(data)
        //setTotal(res.total)
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
    refreshDeps: [projectId]
  })

  //删除告警类型弹窗
  const [deleteTypeModal, setDeleteTypeModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  const columns =
    [
      {
        align: "center",
        title: "站点名称",
        dataIndex: "name",
        key: "name",
      },
      {
        align: "center",
        title: "站点编号",
        dataIndex: "no",
        key: "no",
      },
      {
        title: "总表名称",
        dataIndex: "address",
        key: "address",
        align: "center",
      },
      {
        align: "center",
        title: "总表编号",
        dataIndex: "no",
        key: "no",
      },
      {
        title: "光伏逆变器数",
        dataIndex: "capacity",
        key: "capacity",
        align: "center",
      },
      {
        align: "center",
        title: areaFirstName + "名称",
        dataIndex: "areaName",
        key: "areaName",
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

  //点击新增 打开弹框
  const showAdd = () => {
    setModalTitle("新增站点");
    ref.current.onOpen()
  };
  //编辑
  const [selectId, setSelectId] = useState(0)
  const editRecord = (record) => {
    record.deliveryTime = moment(record.deliveryTime)
    form.setFieldsValue(record)
    setSelectId(record.id)
    setModalTitle("编辑站点");
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
      message.success('光伏站点删除成功!')
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
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

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
      updata: getTableData,
      modalTitle
    }
  }, [projectId, modalTitle])
  return (
    <Pagecont showserach={false} custserach pd="0px" >
      <Titlelayout title={Title} layout="flex" dr="column">
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
        <BindAir   {...airprop} ref={ref} />

      </Titlelayout>
    </Pagecont>
  );
}
