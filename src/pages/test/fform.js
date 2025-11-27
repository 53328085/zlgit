import React, { useState } from 'react';
import { Checkbox } from 'antd';

const SingleCheckboxExample = () => {
  const [checked, setChecked] = useState(false);

  const handleChange = (e) => {
    setChecked(e.target.checked);
  };

  return (
    <Checkbox 
      checked={checked}
      onChange={handleChange}
    >
      选项描述
    </Checkbox>
  );
};
export default SingleCheckboxExample;