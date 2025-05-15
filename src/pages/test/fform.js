import React from 'react';
import ReactDOM from 'react-dom';
import { Line } from '@ant-design/plots';

export default  function Index()  {
  const config = {
    data:{
      value: [
      {
        "year": "1850",
        "value": 0,
        "category": "Liquid fuel"
      },
      {
        "year": "1850",
        "value": 54,
        "category": "Solid fuel"
      },
      {
        "year": "1850",
        "value": 0,
        "category": "Gas fuel"
      },
      {
        "year": "1850",
        "value": 0,
        "category": "Cement production"
      },
      {
        "year": "1850",
        "value": 0,
        "category": "Gas flarinl"
      },
      {
        "year": "1851",
        "value": 0,
        "category": "Liquid fuel"
      },
      {
        "year": "1851",
        "value": 54,
        "category": "Solid fuel"
      },
      {
        "year": "1851",
        "value": 0,
        "category": "Gas fuel"
      },
      {
        "year": "1851",
        "value": 0,
        "category": "Cement production"
      },
      {
        "year": "1851",
        "value": 0,
        "category": "Gas flarinl"
      },
      {
        "year": "1852",
        "value": 0,
        "category": "Liquid fuel"
      },
      {
        "year": "1852",
        "value": 57,
        "category": "Solid fuel"
      },
      {
        "year": "1852",
        "value": 0,
        "category": "Gas fuel"
      },
      {
        "year": "1852",
        "value": 0,
        "category": "Cement production"
      },
      {
        "year": "1852",
        "value": 0,
        "category": "Gas flarinl"
      },
      {
        "year": "1853",
        "value": 0,
        "category": "Liquid fuel"
      },
      {
        "year": "1853",
        "value": 59,
        "category": "Solid fuel"
      },
      {
        "year": "1853",
        "value": 0,
        "category": "Gas fuel"
      },
      {
        "year": "1853",
        "value": 0,
        "category": "Cement production"
      },
      {
        "year": "1853",
        "value": 0,
        "category": "Gas flarinl"
      },
      {
        "year": "1854",
        "value": 0,
        "category": "Liquid fuel"
      },
      {
        "year": "1854",
        "value": 69,
        "category": "Solid fuel"
      },
      {
        "year": "1854",
        "value": 0,
        "category": "Gas fuel"
      },
      {
        "year": "1854",
        "value": 0,
        "category": "Cement production"
      },
      {
        "year": "1854",
        "value": 0,
        "category": "Gas flarinl"
      },
      {
        "year": "1855",
        "value": 0,
        "category": "Liquid fuel"
      },
      {
        "year": "1855",
        "value": 71,
        "category": "Solid fuel"
      },
      {
        "year": "1855",
        "value": 0,
        "category": "Gas fuel"
      },
      {
        "year": "1855",
        "value": 0,
        "category": "Cement production"
      },
      {
        "year": "1855",
        "value": 0,
        "category": "Gas flarinl"
      },
      {
        "year": "1856",
        "value": 0,
        "category": "Liquid fuel"
      },
      {
        "year": "1856",
        "value": 76,
        "category": "Solid fuel"
      },
      {
        "year": "1856",
        "value": 0,
        "category": "Gas fuel"
      }

    ]
    },
    xField: (d) => new Date(d.year),
    yField: 'value',
    sizeField: 'value',
    shapeField: 'trail',
    legend: { size: false },
    colorField: 'category',
  };
  return <Line {...config} />
};

 