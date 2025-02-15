import { useCallback, useState,useEffect } from 'react'

import './App.css'
import { use } from 'react';

function App() {
  const [length, setLength] = useState(8);
  const [numberAllowed, setNumberAllowed] = useState(false);
  const [symbolAllowed, setSymbolAllowed] = useState(false);
  const [password ,setPassword]=useState("");

  const passwordGenerator = useCallback(() =>{
    let pass="";
    let str="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if(numberAllowed) str+="0123456789";
    if(symbolAllowed){ str+="!@#$%^&*()_+";}
    for(let i=1;i<=length;i++){
      let char=Math.floor(Math.random()*str.length+1);
      pass+=str.charAt(char);
    
      
      
    }
    setPassword(pass);
  },[length,numberAllowed,symbolAllowed])

  useEffect(()=>{
    passwordGenerator()
  },[length,numberAllowed,symbolAllowed,passwordGenerator])
  return (
    <>
      <div classNameNameName='max-w-full h-full bg-cyan-500 m-1  '>
        <div classNameNameName=' '>
          <input type="text" classNameNameName="max-w-full w-2/3 h-9 bg-slate-700 m-3 p-4 rounded-md" placeholder='Password' value={password}
          readOnly />
          
        </div>
        <div classNameNameName='flex justify-start items-center'>
        <div classNameNameName=' p-1 ml-2'>
          <input type="range" min={6} max={100} name='range' onChange={(e)=>{
            setLength(e.target.value);
          }} />
          <label htmlFor="range">Range {length}</label>
        </div>
        <div classNameNameName=' p-1 ml-2'>
          <input type="checkbox"  name='number' defaultChecked={numberAllowed} onChange={()=>{
            setNumberAllowed((prev)=>!prev);
          }}/>
          <label htmlFor="number">Numbers</label>
        </div>
        <div classNameNameName=' p-1 ml-2'>
          <input type="checkbox"  name='symbol' defaultChecked={symbolAllowed} onChange={()=>{
            setSymbolAllowed(pre=>!pre);
          }} />
          <label htmlFor="symbol">Symbols</label>
        </div>
        </div>
      </div>
    </>
  )
}

export default App
