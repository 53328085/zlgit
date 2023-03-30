import React, { useState } from 'react';
import { useRequest } from 'ahooks';

const userSchool = (id) => {
  switch (id) {
    case '1':
      return 'Tsinghua University';
    case '2':
      return 'Beijing University';
    case '3':
      return 'Zhejiang University';
    default:
      return '';
  }
};
let num = 0
async function getUserSchool(userId){
 
  console.log(num++)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(userSchool(userId));
    }, 1000);
  });
}

export default () => {
  const [userId, setUserId] = useState('1');
  console.log(userId)
  const { data, loading } = useRequest(() => getUserSchool(userId), {
    refreshDeps: [userId],
  });

  return (
    <div>
      <select
        onChange={(e) => setUserId(e.target.value)}
        value={userId}
        style={{ marginBottom: 16, width: 120 }}
      >
        <option value="1">user 1</option>
        <option value="2">user 2</option>
        <option value="3">user 3</option>
      </select>
      <p>School: {loading ? 'Loading' : data}</p>
    </div>
  );
};