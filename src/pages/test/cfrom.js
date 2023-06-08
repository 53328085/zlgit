import React, {memo, useContext} from 'react'
import {ageContext, jobContext} from './context'
export default memo(function Greeting({ name }) {
  console.log("Greeting was rendered at", new Date().toLocaleTimeString());
  const job = useContext(jobContext)
  const age = useContext(ageContext)
  return (
     <div>
     <h3  >Hello, {name}! 年龄: {age}， 职业： {job}</h3>
     
     </div>
  );
});
