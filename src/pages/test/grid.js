import React from 'react'
import styled from 'styled-components'
const Grid = styled.div`
 display: grid;
  grid-template-columns: repeat(9, 1fr);
  grid-template-rows: repeat(4, minmax(100px, auto));
  .item {
  display: grid;
  grid-column: 2 / 7;
  grid-row: 2 / 4;
  grid-template-columns: subgrid;
  grid-template-rows: repeat(3, 80px);
}

.subitem {
  grid-column: 3 / 6;
  grid-row: 1 / 3;
}
`

export default function Index() {
  return (
    <Grid>
    <div class="item">
      <div class="subitem"></div>
    </div>
  </Grid>
  )
}
