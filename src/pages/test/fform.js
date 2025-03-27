import { Timeline, Button } from 'antd';
import React,{useState} from 'react';
const App = () => {
  const [reverse, setReverse] = useState(false);
  const handleClick = () => {
    setReverse(!reverse);
  };
  return ( 
    <div style={{padding:"32px"}}> 
      <Button onClick={handleClick}>切换</Button>
  <Timeline pending="加载中……" reverse={reverse} mode="alternate"  pendingDot={<span>*</span>}>
    <Timeline.Item color="#ff7313" label={new Date().toLocaleString()}>Create a services site 2015-09-01</Timeline.Item>
    <Timeline.Item>Solve initial network problems 2015-09-01</Timeline.Item>
    <Timeline.Item>Technical testing 2015-09-01</Timeline.Item>
    <Timeline.Item>Network problems being solved 2015-09-01</Timeline.Item>
  </Timeline>
  </div>
)};
export default App;