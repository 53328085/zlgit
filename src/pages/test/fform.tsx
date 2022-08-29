import React, { useState, useEffect, useMemo, useRef } from "react";
import useUrlState  from '@ahooksjs/use-url-state'
import {
  Form,
  Input,
  Button,
  InputNumber,
  Space,
  Tooltip,
  Typography,
  Select,
  DatePicker,
  TimePicker,
  Row,
  Col,
  Checkbox
} from "antd";

import Cfrom from "./ccform";
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";

import { useSetState, useToggle, useBoolean, useVirtualList, useHistoryTravel, useNetwork, useCountDown, useSelections, useCounter, useTextSelection, useMount } from "ahooks";

interface State { // 接口
  hello: string,
  count: number,
  [key: string]: any;
 }
export default () => {
/*  const [state, setState] = useSetState<State>({ // 泛型
   hello: '',
   count: 1
 }) */
 const [state, { toggle, setLeft, setRight }] = useToggle('hello', 'world');
  return (
    <div>
    <p>Effects：{`${state}`}</p>
    <p>
      <button type="button" onClick={toggle}>
        Toggle
      </button>
      <button type="button" onClick={setLeft} style={{ margin: '0 8px' }}>
        Toggle False
      </button>
      <button type="button" onClick={setRight}>
        Toggle True
      </button>
    </p>
  </div>
  
  )
}