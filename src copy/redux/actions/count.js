import {INCREMENT, DECREMENT, ASYNCDECREMENT} from '../constant'
export const incrementAction = playload => ({type: INCREMENT, playload})
 export const decrementAction = playload => ({type: DECREMENT, playload})
 export const asyncincrement = (playload, time) => {
     return (dispatch) => {
         
         setTimeout(() => {
           dispatch(incrementAction(playload))
         }, time)
     }
 }
