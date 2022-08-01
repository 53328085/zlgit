import React from 'react'

import Statemg from './Statemg'
import ContainerCount from '../containers/Counter' 
import Person from '../containers/Person'
import "../index.css"
const App = () => (
  <div>
    <ContainerCount></ContainerCount>
    <hr />
    <Person/>
   {/*  <Statemg></Statemg>  redux*/}
  {/*   <AddTodo />
   
      <Clis active="y" className='activeul' />
  
      <Clis active="n" className='normalul' />
    */}
  </div>
)

export default App