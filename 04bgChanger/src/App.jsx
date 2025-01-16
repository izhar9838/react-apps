import { useState } from 'react'
import './App.css'

function App() {
  const [color, setColor] = useState("olive")

  return (
    <div className="w-screen h-screen duration-200" style={{backgroundColor: color}}>
      <div className='fixed flex flex-wrap justify-center bottom-12 inset-x-0 px-2'>
        <div className='flex flex-wrap justify-center gap-3 shadow-lg'>
          <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded' onClick={() => setColor("red")}>Red</button>
          <button className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded' onClick={() => setColor("green")}>Green</button>
          <button className='bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded' onClick={() => setColor("orange")}>Orange</button>
          <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={() => setColor("blue")}>Blue</button>

        </div>
      </div>
      
    </div>
   
  )
}

export default App
