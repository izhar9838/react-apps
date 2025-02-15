import { useState } from 'react'
import './App.css'

function App() {
  const [color, setColor] = useState("olive")

  return (
    <div classNameNameName="w-screen h-screen duration-200" style={{backgroundColor: color}}>
      <div classNameNameName='fixed flex flex-wrap justify-center bottom-12 inset-x-0 px-2'>
        <div classNameNameName='flex flex-wrap justify-center gap-3 shadow-lg'>
          <button classNameNameName='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded' onClick={() => setColor("red")}>Red</button>
          <button classNameNameName='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded' onClick={() => setColor("green")}>Green</button>
          <button classNameNameName='bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded' onClick={() => setColor("orange")}>Orange</button>
          <button classNameNameName='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={() => setColor("blue")}>Blue</button>

        </div>
      </div>
      
    </div>
   
  )
}

export default App
