import React, { useRef, useState, useMemo, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useAntdTable } from 'ahooks'
import { useOutletContext } from 'react-router-dom'
import Usetable from '@com/useTable'
import dayjs from 'dayjs';
import BindAir from './bind'
import { Mainbox } from './style'
import { Serach } from "@com/comstyled"
import { PlusOutlined } from "@ant-design/icons";
import {
  Space,
  Form,
  message,
  Select,
} from "antd";
import {
  levelDefaultLabel
} from "@redux/systemconfig.js";
import {
  useDeleteGridTiedCabinet
} from './api'
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
  const areaFirstName = useSelector(levelDefaultLabel) || '园区'
  const totalItem = useRef();
  const curPage = useRef(1); // 初始化页码为1
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
    curPage.current = current; // 更新当前页码
    if (!projectId) return { list: [], total: 0 };

    const { name, stationId } = await form.validateFields()
    const params = {
      projectId,
      areaId,
      stationId,
      name,
      pageNum: current,
      pageSize
    }

    try {
      let { success, data, errMsg, total } = await useGetGridTiedCabinetList(params)

      totalItem.current = Number.isInteger(total) ? total : 0;

      if (success) {
        return {
          list: Array.isArray(data) ? data : [],
          total: total || 0
        }
      } else {
        message.error(errMsg || "获取数据失败");
        return { list: [], total: 0 };
      }
    } catch (error) {
      message.error('获取数据时发生错误');
      return { list: [], total: 0 };
    }
  }

  //删除告警类型弹窗
  const [deleteTypeModal, setDeleteTypeModal] = useState(false);
  //新增 true 修改 false
  const [modalTitle, setModalTitle] = useState("");

  const columns = useMemo(() =>
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
    ], [areaFirstName, cabinetColumns])

  const ref = useRef()

  //点击新增 打开弹框
  const onAdd = useCallback(() => {
    setEditData({})
    setModalTitle("新增光伏并网柜");
    setTimeout(() => {
      ref.current?.onOpen()
    }, 0)
  }, [])

  //编辑
  const [cabinetId, setCabinetId] = useState(0)
  const [cabinetName, setCabinetName] = useState(0)
  const [editData, setEditData] = useState({})

  const editRecord = useCallback((record) => {
    setEditData(record)
    setModalTitle("编辑光伏并网柜");
    setTimeout(() => {
      ref.current?.onOpen()
    }, 0)
  }, [])

  //删除
  const deleteRecord = (record) => {
    setCabinetId(record.id)
    setCabinetName(record.name)
    setDeleteTypeModal(true);
  };

  //删除站点确认
  const deleteOk = async () => {
    try {
      let res = await useDeleteGridTiedCabinet({
        projectId,
        gridTiedCabinetId: cabinetId
      });

      if (res.success) {
        message.success('并网柜删除成功!');

        // 获取当前页数据量
        const currentPageDataCount = tableProps.dataSource?.length || 0;

        // 如果当前页只有一条数据且不是第一页，则删除后跳转到上一页
        if (currentPageDataCount === 1 && curPage.current > 1) {
          run({
            current: curPage.current - 1,
            pageSize: PageSize
          }, form.getFieldsValue());
        } else {
          // 否则刷新当前页
          refresh();
        }
      } else {
        message.error(res.errMsg || "删除失败");
      }
    } catch (error) {
      message.error('删除操作发生错误');
      console.error('删除错误:', error);
    } finally {
      setDeleteTypeModal(false);
    }
  };

  //删除站点取消
  const deleteCancel = () => {
    setDeleteTypeModal(false);
  };

  const Title = (
    <div style={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
      <span>光伏并网柜列表</span>
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
      editData
    }
  }, [projectId, modalTitle, editData, run])

  useEffect(() => {
    RuntimStation();
    form.setFieldsValue({ stationId: 0 });
  }, [areaId, projectId, form])

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
              <Form.Item label="关键字" name="name" style={{ marginLeft: "16px" }} >
                <Serach onSearch={submit} placeholder="光伏并网柜名称/编号" />
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
          key="deleteCabinet"
        >
          是否确认删除“{cabinetName}”？
        </CModal>
        <BindAir   {...airprop} ref={ref} />
      </Titlelayout>
    </Pagecont>
  );
}
