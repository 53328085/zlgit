import { Checkbox, Col, Row } from 'antd';
import { set } from 'lodash';
import React,{useState} from 'react';

const App = () => {
  const allval =["A","B","C","D","E"]
  const [checkedlist, setCheckedlist] =useState(["A","B"])
  const [indeterminate, setIndeterminate] = useState(true)
  const [checked, setChecked] = useState(false)
  const onChange = (checkedValues) => {
      setCheckedlist(checkedValues)
      setIndeterminate(checkedValues?.length!=allval?.length)
      setChecked(checkedValues.length == allval?.length)
  };
  const allOnchange = (e) => {
    let f = e.target.checked
    setChecked(f)
    setCheckedlist(f ? allval: [])
    setIndeterminate(false)
  }
  return (
  
   <div>
    <Checkbox indeterminate={indeterminate} checked={checked} onChange={allOnchange}>全选</Checkbox>
  <Checkbox.Group
    style={{
      width: '100%',
    }}
    onChange={onChange}
    defaultValue={checkedlist}
    value={checkedlist}
  >
    <Row>
      <Col span={8}>
        <Checkbox value="A">A</Checkbox>
      </Col>
      <Col span={8}>
        <Checkbox value="B">B</Checkbox>
      </Col>
      <Col span={8}>
        <Checkbox value="C">C</Checkbox>
      </Col>
      <Col span={8}>
        <Checkbox value="D">D</Checkbox>
      </Col>
      <Col span={8}>
        <Checkbox value="E">E</Checkbox>
      </Col>
    </Row>
  </Checkbox.Group>
  </div>
)
};
export default App;