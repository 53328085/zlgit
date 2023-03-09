import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useLayoutEffect,
} from "react";
import { Button, Typography, Checkbox, Tabs, Space, Spin } from "antd";
import styled from "styled-components";
import { User } from "@api/api.js";
import { custMsg } from "@com/usehandler";
import CModal from "@com/useModal";
const { Text, Link, Paragraph } = Typography;
const CheckboxGroup = Checkbox.Group;
const Checkdiv = styled.div`
  display: flex;
  align-items: stretch;
  padding: 12px 0;
  border-bottom: 1px dotted #d7d7d7;
  && {
    .ant-checkbox-wrapper {
      height: 32px;
      border: 1px solid #e4e4e4;
      display: flex;
      align-items: center;
      padding: 0 4px;
      min-width: 128px;
      .ant-checkbox {
        margin-right: 8px;
        top: 0;
        & + span {
          color: #515151;
        }
      }
    }
    .checktitle {
      background-color: #f2f2f2;
      margin-right: 32px;
      min-width: 168px;
    }
  }
`;

function Index({ projectId, userId }, ref) {
  console.log('userId', userId)
/*   const [powerData, setTableData] = useState({
    area: [],
    energy: [],
    device: [],
   
  }); */
  const [area, setArea] = useState([]);
  const [energy, setEnergy] = useState([]);
  const [device, setDevice] = useState([]);
  const mref = useRef();

  const onClose = () => {
    mref.current.onCancal();
  };
  const onOpen = () => {
    mref.current.onOpen();
  };
  useImperativeHandle(ref, () => ({
    onClose,
    onOpen,
  }));
  const MenuNos = {};
  const saveMenu = async () => {
    try {
    let finish = false
    for(let [key, data] of Object.entries(MenuNos)) {
       let params = null
       if (key == 'area') {
          params = data
       }else {
        params = {};
        for (let key of data) {
          params[key] = 1;
        }
       }
       let { success, errMsg } = await User[`SetDataRights${key}`]({ projectId, userId }, params);
       finish = success
       !success && custMsg({type: 'warning', content: errMsg || '数据出错'})
    }
    finish && custMsg({content: '设置成功'})
    } catch (error) {
      console.log(error);
    }
  };

  const dkeyname = {
    meterEnable: "测点",
    gatewayEnable: "网关",
    cameraEnable: "摄像头",
    sensorEnable: "传感器",
  };
  const ekeyname = {
    coalEnabled: "煤炭",
    electricEnabled: "电",
    gasEnabled: "燃气",
    oilEnabled: "燃油",
    steamEnabled: "蒸汽",
    waterColdEnabled: "冷水",
    waterHotEnabled: "热水",
  };
  const getDataRights = () => {
    let f = !!projectId && !!userId;
  console.log('userId'+userId)
    if (!f) return;
    User.GetDataRights({ projectId, userId })
      .then((res) => {
        let { success, data } = res;
        if (success && data) {
          let { area, device, energy } = data || {};
          let devicedata = [],
            energydata = [];
          for (let [key, value] of Object.entries(energy)) {
            energydata.push({
              name: ekeyname[key],
              select: value,
              id: key,
            });
          }
          for (let [key, value] of Object.entries(device)) {
            devicedata.push({
              name: dkeyname[key],
              select: value,
              id: key,
            });
          }
          setArea([...area])
          setDevice([...devicedata])
          setEnergy([...energydata]) 
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useLayoutEffect(() => {
    getDataRights();
  }, [userId]);

  const CheckboxList = ({ data, mod, title }) => {
    const [checkedList, setCheckedList] = useState(() =>
      data?.filter((d) => d.select == 1)?.map((d) => d.id)
    );
    const [allSelect] = useState(() => data.map((d) => d.id) || []);
    const [indeterminate, setIndeterminate] = useState(data.find(i => i.select == 0));
    const [checkAll, setCheckAll] = useState(
      () => data.length === checkedList.length
    );

    const onCheckAllChange = (e) => {
      setCheckedList(e.target.checked ? allSelect : []);
      setIndeterminate(false);
      setCheckAll(e.target.checked);
    };

    const onChange = (list) => {
      console.log(list);
      setCheckedList(list);
      setIndeterminate(!!list.length && list.length < data.length);
      setCheckAll(list.length === data.length);
    };
  
    useEffect(() => {
      MenuNos[mod] = checkedList;
    }, [checkedList]);
    return (
      <div>
        <Checkdiv style={{ paddingTop: "0px" }}>
          <Checkdiv
            style={{ backgroundColor: "#e4e4e4", padding: "0px", flex: 1, borderBottom: 'none' }}
          >
            <Checkbox
              indeterminate={indeterminate}
              onChange={onCheckAllChange}
              checked={checkAll} 
            >
              {`${title}权限(至少选择一项)`}
            </Checkbox>
          </Checkdiv>
        </Checkdiv>

        <Checkdiv>
          <CheckboxGroup value={checkedList} onChange={onChange}>
            <Space size={32} wrap>
              {data?.map((d) => (
                <Checkbox value={d.id} key={d.id}>{d.name}</Checkbox>
              ))}
            </Space>
          </CheckboxGroup>
        </Checkdiv>
      </div>
    );
  };

 
 
 
  return (
    <CModal
      mold="cust"
      title="数据权限"
      footer={false}
      ref={mref}
      width={832}
      closable={true}
      closeIcon={
        <Button
          type="primary"
          onClick={saveMenu}
          style={{ top: "18px", right: "32px" }}
        >
          保存
        </Button>
      }
    >
      {<CheckboxList data={area} mod='area' key='area' title='园区' />}
      {<CheckboxList data={energy} mod='energy' key='energy' title='能耗类型' />}
      {<CheckboxList data={device} mod='device' key='device' title='设备' />}
    </CModal>
  );
}
export default forwardRef(Index);
