import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
} from "react";
import {
  Input,
  Button,
  Space,
  Form,
  message,
  Typography,
  Select,
  Drawer,
} from "antd";

import styled, { css } from "styled-components";
import UserTable from "@com/useTable";
import { Area } from "@api/api.js";
import { WarningFilled, LeftOutlined, RightOutlined } from "@ant-design/icons";

import { Serach } from '@com/comstyled'
import { useAntdTable } from "ahooks"
import { selectOneLevel, selectOneLevelDefaultId, getOnelevel, publishState, filterDeviceStyle, adaptation } from '@redux/systemconfig.js'
import { useSelector, useDispatch } from 'react-redux'
import Mask from '@com/mask.jsx'
import { CustLink, CancelButton, CustButton } from "@com/useButton"
import { useQueryACsUnConfigByPage, useQueryACsConfigByPage, useAddACsConfig, useRemoveACsConfig } from "./api"
import { Mainbox } from "./style"

import BindAir from './bind'

const { Link, Text, Paragraph } = Typography;
const { Item } = Form;
export default function Index({ projectId, level, name, id, allLevel }) {

  const dispatch = useDispatch();
  const oneLevel = useSelector(selectOneLevel) // 一级 
  const oneLevelDefaultId = useSelector(selectOneLevelDefaultId) // 一级默认id
  const ispublish = useSelector(publishState)
  const [levelone] = useState(allLevel[0]);
  const { laptop } = useSelector(adaptation)
  const limitlevle = allLevel.slice(0, level - 1);
  const fields = allLevel?.find(item => item.level == level)?.fields || [];
  const [form] = Form.useForm();
  const [sfrom] = Form.useForm();

  const boxref = useRef();
  const [Record, setRecord] = useState({});



  const [tabelData, setTableData] = useState([])
  const [columns, setColumns] = useState([]);
  const airRef = useRef()
  const [topAreaId, setTopAreaId] = useState(oneLevelDefaultId)


  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0
  })





  let params = {
    //查询
    pageNum: pagination.current,
    pageSize: pagination.pageSize,
    level,
    topAreaId: 0,
    name: "",
    projectId,
  };













  const config = async (record) => {
    console.log(record)
    airRef.current.onOpen()
    try {
      setRecord({ ...record });

    } catch (error) {
      console.log(error);
    }
  };







  //  配置 end

  const getTableData = () => {
    // 列表查询
    if (isNaN(level)) return;

    let value = form.getFieldsValue()
    //setTopAreaId(value.topAreaId)
    params = { ...params, ...value }

    Area.QueryByPage(params)
      .then((res) => {
        let { success, data, total } = res;
        let {
          body = [],
          header = [],
          idGroup = [],
          type = [],
          parentIdGroup = [],
        } = data || {};
        let cols = [];
        let index = header.findIndex(h => h == '备注')
        // if(index > -1) header.splice(index,1)
        if (index > -1) {
          header.splice(index, '备注')
        }
        for (let k of header) {
          let col = {
            title: k,
            dataIndex: k,
            key: k,
          };
          cols.push(col);
        }
        let colums = ispublish ? [...cols] : [
          ...cols,
          // index > -1 ?   {title: '备注', dataIndex: '备注', key: '备注'}: {},
          {
            title: "操作",
            key: "action",
            align: "center",
            render: (_, record) => (
              <Space size={32}>
                <CustLink text="configure" onClick={() => config(record)} />

                {/*  <Link underline onClick={() => edit(record)}>
                  编辑
                </Link>
                <Link underline type="danger" onClick={() => del(record)}>
                  删除
                </Link> */}
              </Space>
            ),
          },
        ];

        setColumns(colums);
        let formart = body.map((r, i) => {
          let row = {
            areaId: idGroup[i],
            parentId: parentIdGroup[i],
            type: type,
          };
          header.forEach((e, i) => {
            row[e] = r[i];
            // row.id= nanoid()
          });
          return row;
        });
        //  console.log(formart);
        if (success && data) {
          setTableData([...formart])
          // console.log(tabelData);
          setPagination({
            ...pagination,
            total: total,
          })
          /*  return {
             total: colums.length,
             list: formart,
           }; */
        } else {
          setTableData([])
          /*   return {
              total: 0,
              list: [],
            }; */
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };



  const tableOnchange = (e) => {
    console.log(e)
    let { current } = e
    setPagination({
      ...pagination,
      current,
    })

  }
  useEffect(() => {
    getTableData()

  }, [pagination.current])
  useEffect(() => {
    // getLevelOption();
    if (level == 1) {
      form.setFieldsValue({
        topAreaId: null,
      });
      getTableData()
    } else if (level > 1) {
      form.setFieldsValue({
        topAreaId: 0,
      });
      getTableData()
    }

  }, [level]);
  const airprop = useMemo(() => {
    return {
      projectId,
      updata: getTableData,
      //  rId:id,
      areaId: Record?.areaId
      // ...config
    }
  }, [projectId, Record])

  return (
    <Mainbox ref={boxref}>

      <Form form={form} layout="inline" initialValues={{ name: "" }}>
        <Space size={16}>
          {level == 1 && (
            <Form.Item name="name" label={`${name}查询`}>
              <Serach
                placeholder={`请输入${name}名称`}
                style={{ width: "340px" }}
                onSearch={getTableData}
              />
            </Form.Item>
          )}
          {level > 1 && (
            <>
              <Item label={`${levelone.name}名称`} name="topAreaId">
                <Select
                  options={[...oneLevel, { name: '全部', id: 0 }]}
                  fieldNames={{
                    label: "name",
                    value: "id",
                    options: "options",
                  }}
                  style={{ width: "200px" }}
                  onChange={getTableData}
                ></Select>
              </Item>
              <Form.Item name="name" label={`${name}查询`}>
                <Serach
                  placeholder={`请输入${name}名称`}
                  style={{ width: "340px" }}
                  onSearch={getTableData}
                />
              </Form.Item>
            </>
          )}

        </Space>
      </Form>
      <UserTable columns={columns} dataSource={tabelData} pagination={pagination} onChange={tableOnchange} rowKey="areaId" />
      <BindAir   {...airprop} ref={airRef} />

    </Mainbox>
  );
}
