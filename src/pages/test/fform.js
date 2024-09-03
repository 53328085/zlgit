import { Select } from 'antd';
import React from 'react';
const onChange = (value) => {
  console.log(`selected ${value}`);
};
const onSearch = (value) => {
  console.log('search:', value);
};
const filterOption =(input, option)=> {
  console.log(input)
  return  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
}

const filterSort=(a, b) => {
    return  (a?.label ?? '').toLowerCase().localeCompare((b?.label ?? '').toLowerCase())
}
const App = () => (
  <div style={{padding: '30px'}}>
  <Select
    style={{width: '200px'}}
    showSearch
    placeholder="Select a person"
    optionFilterProp="children"
    onChange={onChange}
    onSearch={onSearch}
    filterOption={filterOption}
    filterSort={filterSort}
    options={[
      {
        value: 'jack',
        label: 'aJack',
      },
     
     
      {
        value: 'lucy',
        label: 'bLucy',
      },
     
      {
        value: 'tom',
        label: 'dTom',
      },
      {
        value: 'Joseph',
        label: 'eJoseph',
      },
      {
        value: 'gtom',
        label: 'gTom',
      },
      {
        value: 'Justin',
        label: 'cJustin',
      },
    ]}
  />
  </div>
);
export default App;