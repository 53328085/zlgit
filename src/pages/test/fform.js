import { Button, Drawer } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';
const Divbox = styled.div`
  position: relative;
  height: 200px;
  padding: 48px;
  overflow: hidden;
  text-align: center;
  background: #fafafa;
  border: 1px solid #ebedf0;
  border-radius: 2px;
  

`
const App = () => {
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  return (
    <Divbox>
      Render in this
      <div
        style={{
          marginTop: 16,
        }}
      >
        <Button type="primary" onClick={showDrawer}>
          Open
        </Button>
      </div>
      <Drawer
        title="Basic Drawer"
        placement="right"
        closable={false}
        onClose={onClose}
        open={open}
      //  getContainer={false}
        style={{
          position: 'absolute',
        }}
      >
        <p>Some contents...</p>
      </Drawer>
    </Divbox>
  );
};
export default App;