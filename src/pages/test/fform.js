import { Button, Modal } from 'antd';
import React, { useState } from 'react';

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
   Modal.info('这是一条通知')
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Open Modal
      </Button>
      <Modal title="Basic Modal" open={true} onOk={handleOk} onCancel={handleCancel} bodyStyle={{height: '400px', width: '400ox'}}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </>
  );
};

export default App;