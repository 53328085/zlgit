import React, {useState} from 'react'

export default function useInput(n) {
  const [name, setName] = useState(n)
  function onChange(e) {
     setName(e.target.value)
  }
  return  {
    value: name,
    onChange
  }
}
