import React , {useState, useEffect} from "react";
import {nanoid} from '@reduxjs/toolkit'
import {connect} from 'react-redux'
import {addPersonAction} from '../../redux/actions/person'
import store from '../../redux/store'
function Person({persons, addperson, coun}) {
    let [name, setName] = useState('')
    let [age, setAge] = useState('')
    const add = () => {
      const person = {name, age, id: nanoid()}
      setName('')
      setAge('')
      addperson(person)
      console.log(person)
    }
    const lis =persons && persons.map(p => <li key={p.id}>name: {p.name}, age: {p.age}</li>)
    useEffect(() => {
       const unsubscribe = store.subscribe(() => {
            console.log(store.getState())
        }) 
       return unsubscribe
    })
   
    return (
        <div>
           <h1>{coun}</h1>

           <p> <input value={name} placeholder="请输入姓名" onChange={e => setName(e.target.value)}></input></p>
           <p> <input value={age} type="number" placeholder="请输入年龄" onChange={e => setAge(e.target.value)}></input></p>
           <p><button onClick={add}>新增</button></p>
           <ul>{lis}</ul>
        </div>
    )
}
export default connect(
    state => ({persons:state.persons, coun: state.data.counter}),
    {addperson: addPersonAction}
)(Person)