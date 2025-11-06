import React, { useEffect } from "react";
import { Space, Form, Select, Input } from "antd";
import { ComDatePicker } from "@com/comstyled";
import {useSelector} from "react-redux"
import moment from "moment";
import { Cform, AreaSelect } from "@com/useSerach/comhead";
import { selectProjectId, levelDefaultLabel } from "@redux/systemconfig.js";
import { publicdateType } from "@com/useSerach/data.js";
export default function Index({ setParams }) {
  const varlabel = useSelector(levelDefaultLabel);
  const projectId = useSelector(selectProjectId);
  const [form] = Form.useForm();
  const initialValues = {
    projectId,
    areaId: 0,
    type: 1,
    date: moment(),
  };
  const changedate = () => {
    form.setFieldValue("date", moment());
  };
  useEffect(() => {
    setParams?.(initialValues);
  }, []);
  const isall = { name: `${varlabel}(全部)`, id: 0, levelName: varlabel };
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
              <Form.Item name="date" initialValue={moment()}>
                <ComDatePicker picker={type} style={{ width: 200 }} />
              </Form.Item>
            );
          }}
        </Form.Item>
      </Space>
      <Form.Item noStyle name="projectId">
        <Input hidden></Input>
      </Form.Item>
    </Cform>
  );
}
