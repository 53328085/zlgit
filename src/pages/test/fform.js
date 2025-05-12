import React from 'react';
import ReactDOM from 'react-dom';
import { Line } from '@ant-design/plots';
import styled from 'styled-components';
const Mainbox = styled.div`
   height: 800px;
   width: 1024px;
   margin: 32px;
`
const data = [
  { year: '1991', value: 3, "category": "a"},
  { year: '1992', value: 4 ,"category": "a"},
  { year: '1993', value: 3.5, "category": "b"},
  { year: '1994', value: 5,"category": "b" },
  { year: '1995', value: 4.9,"category": "b" },
  { year: '1996', value: 6,"category": "b" },
  { year: '1997', value: 7,"category": "c" },
  { year: '1998', value: 9,"category": "c" },
  { year: '1999', value: 13,"category": "c" },
];
const DemoLine = () => {
 
  const config = {
    data,
    xField: "year",
    yField: 'value',
    point: {
      shapeField: 'square',
      sizeField: 14,
    },
    interaction: {
      tooltip: {
        marker: false,
      },
    },
    style: {
      lineWidth: 2,
    },
  };
  return <Mainbox> <Line {...config} /> </Mainbox>;
};
  
 
export default DemoLine