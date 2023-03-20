import React from 'react'
import { Calendar, theme } from 'antd';
const onPanelChange = (value, mode) => {
  console.log(value.format('YYYY-MM-DD'), mode);
};
const App = () => {
  //const { token } = theme.useToken();
  const wrapperStyle = {
    width: 300,
    border: `1px solid #d7d7d7`,
    borderRadius:'4px',
  };
  const onSelect = (e) => {
    console.log(e.date());
  }
  return (
    <div style={wrapperStyle}>
      <Calendar fullscreen={false} onSelect={onSelect} onPanelChange={onPanelChange} />
    </div>
  );
};
export default App;