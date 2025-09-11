import React, { useEffect, useState } from 'react'
import Pagecount from '@com/pagecontent'
import styled from 'styled-components'
import moment from 'moment'
import { Trans, Translation, useTranslation } from 'react-i18next'
import { Form, Space, Tooltip, InputNumber, message } from 'antd'
import Usetable from "@com/useTable"
import Titlelayout from "@com/titlelayout"
import {
  QutoSlice, useQuotaQuery, useEmissionQuery, useSaveTargetMutation,
  useSaveQuotaMutation
} from "@redux/carbon"
import { CustButtonT, CustLink, CustTransO, i18warning, i18success } from "@com/useButton"
import { Cdivider } from "@com/comstyled"
import { useSelector } from 'react-redux'
import { selectProjectId, enterprise } from '@redux/systemconfig'
import { Carbon } from '@api/api'
import { isObject } from '@com/usehandler'
const Mainbox = styled.div`
  //  margin-top: 16px;
  //  padding-top: 16px;
  
    display: flex;
    flex-direction: column;
    gap: 16px;
    flex:1;
    .content {
      flex: 1;
     // padding-top: 16px;
      position: relative;
      .tbbox {
        position: absolute;
        width: 100%;
      }
    }
`


export default function Index() {
  const [form] = Form.useForm()
  const [formt] = Form.useForm()
  const { t } = useTranslation()
  const { enterpriseId } = useSelector(enterprise)

  const [targetData, setTargetData] = useState([])
  const curyear = moment().year()
  const [curtal, setCurtal] = useState(0)
  const [pretal, setPretal] = useState(0)
  const rate = pretal != 0 ? ((curtal - pretal) / pretal * 100).toFixed(2) : 0
  const arrow = (curtal - pretal) > 0 ? <b style={{ color: "#f00" }}>&#x25B2;</b> : (curtal - pretal) < 0 ? <b style={{ color: "#080" }}>&#x25BC;</b> : null
  const onValuesChange = (_, allvalue) => {
    let total = Object.values(allvalue).reduce((a, b) => a + b, 0);
    setCurtal(total)
  }


  const [editable, setEditable] = useState(false);

  const Ctd = ({ i, text, index }) => {
    const form = Form.useFormInstance();
    console.log()
    form.setFieldValue(`${i}`, (typeof text == 'number') ? text : parseFloat(text))
    return editable ? (<Form.Item name={`${i}`} style={{ marginBottom: '0px' }} >
      <InputNumber min={0} defaultValue={text} />
    </Form.Item>) :
      (<>{text}</>)
  }
  const columns = [
    {
      title: <CustTransO ns="comm" text="电价方案名称" />,
      dataIndex: 'name',
      width: 180,
      render: (text) => <>{text} <CustTransO ns="carbon" text="Carbonemissionl" param="(tCO2)" /></>
    },
    ...Array.from({ length: 12 }, (_, i) => ({
      title: <CustTransO ns="comm" text={i + 1 + '月'} />,
      dataIndex: i + 1,
      key: i + 1,
      width: 100,
      align: 'center',
      render: (text, _, index) => <Ctd text={text} index={index} i={i + 1} />
    })), {
      title: "操作",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          {!editable ?
            < CustLink
              text="edit"
              onClick={() => editRecord(record)}
            /> :
            <Space>
              < CustLink
                text="保存"
                onClick={() => saveRecord(record)}
              /> < CustLink
                text="cancel"
                onClick={() => cancel(record)}
              /></Space>}

        </Space >
      ),
    },


  ]

  const editRecord = (record) => {
    setEditable(true)
  };

  // 取消编辑
  const cancel = () => {
    setEditable(false)
  };
  //保存
  const saveRecord = async (key) => {
    try {
      setEditable(false)
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };






  const getTarget = async () => {
    try {

      let { success, data, errMsg } = await Carbon.QueryCarbonTarget(enterpriseId, curyear)
      if (success && Array.isArray(data) && data.length > 0) {
        let target = {}
        data.forEach(d => {
          if (!target.year) {
            target.year = d.year
          }
          target[d.month] = d.carbonMonthlyTarget

        })
        setTargetData([target])
      } else {
        if (!success) i18warning(errMsg) // message.warning(errMsg || '数据出错')
        setTargetData([])
      }

    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    if (Number.isInteger(enterpriseId)) {
      getTarget()
    }

  }, [enterpriseId])



  return (
    <Pagecount bgcolor="transparent" pd="0">
      <Mainbox>
        <Titlelayout title={`光伏发电电价设置（元）`} layout="flex" key="target">
          <Form form={formt} component={false}>
            <div className='content'>
              <div className="tbbox">
                <Usetable columns={columns} dataSource={targetData} scroll={{ x: 1620 }} hbg="#ecf5ff" hbc="#515151" />
              </div>
            </div>
          </Form>

        </Titlelayout>
      </Mainbox>
    </Pagecount>
  )
}
