import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectProjectId, adaptation } from "@redux/systemconfig.js";
import Pagecount from "@com/pagecontent";
import UseTree from "@com/useTree";
import { Container } from "./style";
import { Tabs,Leakage,LeakageTrend ,PartAlarm} from "./comps";
export default function Index() {
  const [treeId, setTreeId] = useState();
  const [tabId, setTabId] = useState("1");
 
  return (
    <Pagecount bgcolor="transparent" pd="0 0 0 0">
      <Container>
        <div className="tree-box">
          <UseTree
            areaId={0}
            setTreeId={setTreeId}
            setLine={() => {}}
            showline={false}
            datatype={3}
            energytype={1}
            multiple={false}
            allselect={false}
          />
        </div>
        <div className="right-box">
          <Tabs setTabId={setTabId}></Tabs>
          {tabId == "1" ? (
            <>
              <div className="card1"><Leakage/></div>
              <div className="card2">
                <LeakageTrend />
              </div>
            </>
          ) : (
            <>
              <div><PartAlarm></PartAlarm></div>
            </>
          )}
        </div>
      </Container>
    </Pagecount>
  );
}
