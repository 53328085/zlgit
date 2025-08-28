import React from 'react'
import Building from '@com/building'
import Pagecount from "@com/pagecontent";
import { Container, Header } from "./style";
export default function Index() {
  return (
    // <div style={{flex: 1, display:"flex", justifyContent: 'center', alignContent: 'center'}}>
    //   <Building pagename="电站监控" />
    // </div>

    <Pagecount bgcolor="#eeeff4" pd={0}>
      <Container>
        <Header>

        </Header>
      </Container>
    </Pagecount>
  )
}
