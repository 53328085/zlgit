import React from 'react'
import GridLayout, {Responsive as ResponsiveGridLayout} from 'react-grid-layout';
import styled from 'styled-components';
//import "react-draggable/css/styles.css"
// import "react-resizable/css/styles.css"
const Box = styled.div`
   background-color: aliceblue;
`
export default function fform() {
  const layout = [
    {i: 'a', x: 0, y: 0, w: 1, h: 2, static: true},
    {i: 'b', x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4},
    {i: 'c', x: 4, y: 0, w: 1, h: 2}
  ];
 
    return (
      <ResponsiveGridLayout className="layout" layouts={layout}
        breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
        cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}>
        <div key="a">1</div>
        <div key="b">2</div>
        <div key="c">3</div>
      </ResponsiveGridLayout>
    )

 
}
