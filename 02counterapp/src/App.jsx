import { useState } from 'react';
import './App.css'

function App() {
  let count =5;
  let [counter,setCounter]=useState(count);
  const addcount=()=>{
    if(counter>=20){
      setCounter(counter=20);
    }
    else{
    setCounter(counter+1);
    }
    
  }
  const decreasecount=()=>{
    if(counter<=1){
      setCounter(counter=0);
    }
    else{
    setCounter(counter-1);
  }
    
  }

  return (
    <>
      <h1>Counter value {counter}</h1>
      <button onClick={addcount}>Increase count {counter}</button>
      <br/>
      <button onClick={decreasecount}>Decrease count {counter}</button>
    </>
  )
}

export default App
