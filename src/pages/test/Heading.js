import React, { useContext } from "react";
import { levelContext, objCOntext } from "./context";
export default function Heading({ children }) {
  const level = useContext(levelContext);
  const {name, handler} = useContext(objCOntext)
  console.log(new Date().toISOString())
  switch (level) {
    case 0:
      return <p>标题必须在section标签中</p>;
    case 1:
      return (<div>
        <strong>{name}</strong>
         <button onClick={handler}>handler</button>
        <h1>{children}</h1>
        </div>);
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
  }
}
