import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./operationButton";
import "./index.css"
export const ACTIONS={ //ALL CAPITAL FOR GLOBAL VARIABLES ..IT CONTAINS LIST OF VARIOUS ACTIONS TO BE PERFORMED ON CALCULATOR
ADD_DIGIT: 'add-digit',
CHOOSE_OPERATION: 'choose-operation',
CLEAR:'clear',
DELETE_DIGIT:'delete-digit',
EVALUATE:'evaluate'
}
function reducer(state,{type,payload}){ //state is the state which this func will return and this function will perform some action of certain type and return some parameters named payload
switch(type){

  case ACTIONS.ADD_DIGIT: 
  if(state.overwrite){
    return {
      ...state,
      currentOperand: payload.digit,
      overwrite:false
    }
  }
  if(payload.digit==="0" && state.currentOperand==="0") return state 
  if(payload.digit==="." && state.currentOperand.includes(".")) return state 
  return{
    ...state ,//current state jo uper as parameter ayi
    currentOperand: `${state.currentOperand ||""}${payload.digit}`
  }

  case ACTIONS.CHOOSE_OPERATION:
    if(state.currentOperand==null && state.previousOperand==null) return state
    if(state.previousOperand==null){
      return{
      ...state,
      operation: payload.operation,
      previousOperand: state.currentOperand,
      currentOperand:null
      }
    }
    if(state.currentOperand==null){
      return {
        ...state,
        operation:payload.operation
      }
    }
    return {
      ...state,
      previousOperand: evaluate(state),
      currentOperand: null,
      operation: payload.operation
    }  

    case ACTIONS.CLEAR:
     return {}

    case ACTIONS.EVALUATE:
    if(state.operation==null || state.currentOperand==null || state.previousOperand==null) return state
     return{
      ...state,
      overwrite:true,
      previousOperand:null,
      operation:null,
      currentOperand: evaluate(state)
     }
    
    case ACTIONS.DELETE_DIGIT:
    if(state.overwrite){
      return{
        ...state,
        currentOperand:null,
        overwrite:false
      }
    }
    if(state.currentOperand==null) return state
    if(state.currentOperand.length===1){
      return{
        ...state,
        currentOperand:null
      }
    }
    return{
      ...state,
      currentOperand: state.currentOperand.slice(0,-1) //delete last digit
    }
}
  
}
function evaluate({currentOperand,previousOperand,operation}){
  const prev=parseFloat(previousOperand)
  const curr=parseFloat(currentOperand)
  let computation=" "
  if(isNaN(prev)|| isNaN(curr)) return ""
  switch(operation){
    case "+":
      computation=prev+curr
      break
    case "-":
      computation=prev-curr
      break
    case "*":
      computation=prev*curr
      break
    case "/":
      computation=prev/curr
      break
  }
  return computation.toString()
}


function App() {
  const [{currentOperand,previousOperand,operation},dispatch]=useReducer(reducer,{})
  return (
    <div className="calculator">
      <h1>CALCULATOR</h1>
      <div className="output">
        <div className="previous-value">{previousOperand} {operation}</div>
        <div className="current-value">{currentOperand}</div>
      </div>
      <button className="span-two" onClick={()=>dispatch({type: ACTIONS.CLEAR})}>AC</button>
      <button onClick={()=>dispatch({type:ACTIONS.DELETE_DIGIT})}>DEL</button>

      <OperationButton operation="/" dispatch={dispatch} /> 
      <DigitButton digit="1" dispatch={dispatch} /> 
      <DigitButton digit="2" dispatch={dispatch} /> 
      <DigitButton digit="3" dispatch={dispatch} /> 
      <OperationButton operation="*" dispatch={dispatch}/>
      <DigitButton digit="4" dispatch={dispatch} /> 
      <DigitButton digit="5" dispatch={dispatch} /> 
      <DigitButton digit="6" dispatch={dispatch} /> 
      <OperationButton operation="+" dispatch={dispatch}/>
      <DigitButton digit="7" dispatch={dispatch} /> 
      <DigitButton digit="8" dispatch={dispatch} /> 
      <DigitButton digit="9" dispatch={dispatch} /> 
      <OperationButton operation="-" dispatch={dispatch}/>
      <DigitButton digit="." dispatch={dispatch} /> 
      <DigitButton digit="0" dispatch={dispatch} /> 
      <button className="span-two" onClick={()=>dispatch({type:ACTIONS.EVALUATE})}>=</button>
    </div>
  );
}

export default App;
