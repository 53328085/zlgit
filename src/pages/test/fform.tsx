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
  Checkbox,
  message
} from "antd";

import Cfrom from "./ccform";
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";

import { 
      useCookieState,
      useLocalStorageState,
      useDebounce,
      useMap,
      useEventListener,
      useClickAway,
      useSetState, 
      useToggle, 
      useBoolean,
      useVirtualList,
      useHistoryTravel, 
      useNetwork, 
      useCountDown, 
      useSelections,
      useCounter, 
      useTextSelection, 
      useMount,
      useFullscreen,
      useHover,
      useMutationObserver,
      useKeyPress,
      usePrevious,
      useGetState,
      useResetState,
      useUpdateEffect,
    } 
     from "ahooks";


export default () => {
  const [count, setCount] = useState(0);
  const [effectCount, setEffectCount] = useState(0);
  const [updateEffectCount, setUpdateEffectCount] = useState(0);

  useEffect(() => {
    setEffectCount((c) => c + 1);
  }, [count]);

  useUpdateEffect(() => {
    setUpdateEffectCount((c) => c + 1);
    return () => {
      // do something
    };
  }, [count]); // you can include deps array if necessary

  return (
    <div>
      <p>effectCount: {effectCount}</p>
      <p>updateEffectCount: {updateEffectCount}</p>
      <p>
        <button type="button" onClick={() => setCount((c) => c + 1)}>
          reRender
        </button>
      </p>
    </div>
  );
}