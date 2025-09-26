import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Pagecount from '@com/pagecontent';
import styled from 'styled-components';
import moment from 'moment';
import { Trans, useTranslation } from 'react-i18next';
import { Form, Space, InputNumber, message } from 'antd';
import Usetable from "@com/useTable";
import Titlelayout from "@com/titlelayout";
import { CustButtonT, CustLink, CustTransO, i18warning, i18success } from "@com/useButton";
import { Cdivider } from "@com/comstyled";
import { useSelector } from 'react-redux';
import { selectProjectId, enterprise } from '@redux/systemconfig';
import { isObject } from '@com/usehandler';
import { useGetPVPrice, useUpdatePVPrice } from './api';

// 样式组件 - 提取并优化
const Mainbox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
  
  .content {
    flex: 1;
    position: relative;
    
    .tbbox {
      position: absolute;
      width: 100%;
    }
  }
`;

// 月份数据常量 - 避免重复计算
const MONTHS_COUNT = 12;
const MONTHS_DATA = Array.from({ length: MONTHS_COUNT }, (_, i) => i + 1);
// 工具函数：分转元
const centsToYuan = (cents) => {
  return cents ? Number(cents) / 100 : 0;
};

// 工具函数：元转分
const yuanToCents = (yuan) => {
  return yuan ? Math.round(Number(yuan) * 100) : 0;
};
export default function ElectricityPriceTable() {
  // Redux状态获取
  const projectId = useSelector(selectProjectId);

  // 表单与国际化
  const [form] = Form.useForm();
  const { t } = useTranslation();

  // 状态管理
  const [targetData, setTargetData] = useState([]);
  const [originalData, setOriginalData] = useState(null); // 用于取消编辑时恢复数据
  const [editable, setEditable] = useState(false);
  const [loading, setLoading] = useState(false);
  const curyear = moment().year();



  // 表格单元格渲染组件 - 优化逻辑和性能
  const PriceCell = ({ month, text }) => {
    const formInstance = Form.useFormInstance();
    // 将分转换为元用于展示和编辑
    const priceInYuan = useMemo(() => centsToYuan(text), [text]);
    // 仅在初始渲染或值变化时设置字段值
    useEffect(() => {
      if (text !== undefined) {
        formInstance.setFieldValue(`price${month}`, priceInYuan);
      }
    }, [priceInYuan, month, formInstance]);

    return editable ? (
      <Form.Item
        name={`price${month}`}
        style={{ marginBottom: '0px' }}
        rules={[{ required: true, type: 'number', min: 0, message: t('请输入电价') }]}
      >
        <InputNumber
          min={0}
          style={{ width: '100%' }}
          placeholder={t('请输入')}
        />
      </Form.Item>
    ) : (
      <>{priceInYuan}</> // 格式化显示为两位小数
    );
  };

  // 表格列配置 - 优化结构和可维护性
  const columns = React.useMemo(() => [
    {
      title: <CustTransO ns="comm" text="电价方案名称" />,
      dataIndex: 'name',
      width: 180,
      render: (text) => (
        <>
          {text}
        </>
      )
    },
    ...MONTHS_DATA.map(month => ({
      title: <CustTransO ns="comm" text={`${month}月`} />,
      dataIndex: `price${month}`,
      key: `price${month}`,
      width: 100,
      align: 'center',
      render: (text) => <PriceCell month={month} text={text} />,
    })),
    {
      title: t("操作"),
      key: "action",
      align: "center",
      render: () => (
        <Space size="middle">
          {!editable ? (
            <CustLink
              text={t("编辑")}
              onClick={handleEdit}
            />
          ) : (
            <Space>
              <CustLink
                text={t("保存")}
                onClick={handleSave}
              />
              <CustLink
                text={t("取消")}
                onClick={handleCancel}
              />
            </Space>
          )}
        </Space>
      ),
    }
  ], [editable, t]); // 仅在editable或t变化时重新计算

  // 获取电价数据 - 提取为独立函数并优化
  const fetchPriceData = useCallback(async () => {
    if (!Number.isInteger(projectId)) return;

    setLoading(true);
    try {
      const { success, data, errMsg } = await useGetPVPrice({
        projectId,
        year: curyear
      });

      if (success && isObject(data)) {
        // 转换后端返回的分数据为元
        const convertedData = { ...data };
        MONTHS_DATA.forEach(month => {
          convertedData[`price${month}`] = centsToYuan(data[`price${month}`]);
        });

        // 格式化数据，添加key和name字段
        const formattedData = [{
          key: '1',
          name: t('光伏电价方案'),
          ...data
        }];
        setTargetData(formattedData);
        setOriginalData({ ...formattedData[0] }); // 保存原始数据用于取消编辑
        form.setFieldsValue(formattedData[0]);

      } else {
        if (!success) {
          i18warning(errMsg || t('获取数据失败'));
        }
        // 初始化空数据
        const initData = [{
          key: '1',
          name: t('光伏电价方案'),
          year: curyear,
          ...MONTHS_DATA.reduce((acc, month) => {
            acc[`price${month}`] = 0;
            return acc;
          }, {})
        }];
        setTargetData(initData);
        setOriginalData({ ...initData[0] });
        form.setFieldsValue(initData[0]);
      }
    } catch (error) {
      console.error('获取电价数据异常:', error);
      i18warning(t('网络异常，获取数据失败'));
    } finally {
      setLoading(false);
    }
  }, [projectId, curyear, t, form]);

  // 编辑处理函数
  const handleEdit = () => {
    setEditable(true);
  };

  // 取消编辑处理函数
  const handleCancel = () => {
    setEditable(false);
    if (originalData) {
      form.setFieldsValue(originalData);
    }
  };

  // 保存编辑处理函数
  const handleSave = async () => {
    try {
      // 验证表单
      return form.validateFields().then(async () => {
        const values = await form.validateFields();
        setLoading(true);
        // 将元转换为分，准备提交给后端
        const dataToSave = { ...values };
        MONTHS_DATA.forEach(month => {
          dataToSave[`price${month}`] = yuanToCents(values[`price${month}`]);
        });
        // 调用API保存数据
        const { success, errMsg } = await useUpdatePVPrice({
          projectId
        }, {
          year: curyear,
          ...dataToSave
        }
        );

        if (success) {
          message.success("电价修改成功")
          setLoading(false);
          setEditable(false);
          setOriginalData({ ...values });
          fetchPriceData();
        } else {
          message.error("电价修改失败")
        }
      })
    } catch (error) {
      console.error('保存电价数据异常:', error);
      if (error.errorFields) {
        // 表单验证错误，antd会自动提示
      } else {
        i18warning(t('保存过程中发生错误'));
      }
    } finally {
      setLoading(false);
    }
  };

  // 数据获取副作用
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPriceData();
    }, 300); // 防抖处理，避免频繁调用

    return () => clearTimeout(timer);
  }, [fetchPriceData]);

  return (
    <Pagecount bgcolor="transparent" pd="0">
      <Mainbox>
        <Titlelayout
          title={`${t('光伏发电电价设置')}（${t('单位')}：${t('元')}）`}
          layout="flex"
          key="target"
        >
          <Form
            form={form}
            component={false}
          >
            <div className='content'>
              <div className="tbbox">
                <Usetable
                  columns={columns}
                  dataSource={targetData}
                  scroll={{ x: 1620 }}
                  hbg="#ecf5ff"
                  hbc="#515151"
                  loading={loading}
                />
              </div>
            </div>
          </Form>
        </Titlelayout>
      </Mainbox>
    </Pagecount>
  );
}
