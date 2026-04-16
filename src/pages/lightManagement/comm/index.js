import React, { useEffect, useMemo } from "react";
import { Space, Form, Select, Input } from "antd";
import { ComDatePicker } from "@com/comstyled";
import {useSelector} from "react-redux"
import dayjs from 'dayjs';
import { Cform, AreaSelect } from "@com/useSerach/comhead";
import { selectProjectId, levelDefaultLabel,lightlevel } from "@redux/systemconfig.js";
import { publicdateType } from "@com/useSerach/data.js";
import {  ExportExcel } from "@com/useButton";
export default function Index({ setParams,allselect=true, tbref }) {
  const varlabel = useSelector(levelDefaultLabel);
  const projectId = useSelector(selectProjectId);
    const lightone = useSelector(lightlevel)
    console.log(lightone)
  const [form] = Form.useForm();
  const initialValues =useMemo(() => {
    const params =  {
        projectId,
        areaId: allselect ? 0 : lightone?.[0]?.id ,
        type: 1,
        date: dayjs(),
      };
    if(typeof setParams === 'function'){
        setParams(params)
    }
    return params
},[allselect,projectId,lightone,setParams]) 
  const changedate = () => {
    form.setFieldValue("date", dayjs());
  };
 
  const isall =useMemo(()=> {
    if(varlabel && allselect) {
       return { name: `${varlabel}(全部)`, id: 0, levelName: varlabel };
    }else{
      return null;
    }

  }, [allselect, varlabel]) 
  return (
    <Cform
      form={form}
      layout="inline"
      onValuesChange={(_, all) => setParams?.(all)}
      initialValues={initialValues}
    >
      <Space size={16}>
        <Form.Item label={varlabel} name="areaId"  >
          <AreaSelect isall={isall} />
        </Form.Item>
        <Form.Item name="type">
          <Select
            options={publicdateType.slice(0, 3)}
            style={{ width: 80 }}
            onChange={changedate}
          ></Select>
        </Form.Item>
        <Form.Item noStyle shouldUpdate={(pre, cur) => pre.type != cur.type}>
          {({ getFieldValue }) => {
            let type = ["date", "date", "month", "year"][getFieldValue("type")];
            return (
              <Form.Item name="date" initialValue={dayjs()}>
                <ComDatePicker picker={type} style={{ width: 200 }} />
              </Form.Item>
            );
          }}
        </Form.Item>
      {tbref &&  <ExportExcel tb={tbref}></ExportExcel>} 
      </Space>
      <Form.Item noStyle hidden name="projectId">
        <Input ></Input>
      </Form.Item>
    </Cform>
  );
}
