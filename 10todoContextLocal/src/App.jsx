import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {TodoProvider} from './contexts'
import TodoForm from './components/TodoForm'
import TodoItem from './components/TodoItem'

function App() {
    const [todos,setTodos]=useState([])
    const addTodo=(todo)=>{
        setTodos((prev)=>[{id: Date.now(),...todo},...prev])
    }
    const updateTodo=(id,newTodo)=>{
        setTodos((prev)=>{
          return prev.map((prevTodo)=>prevTodo.id===id?newTodo:prevTodo)
        })
    }
    const deleteTodo=(id)=>{
        setTodos((prev)=>prev.filter((prevTodo)=>prevTodo.id!==id))
    }
    const toggleComplete=(id)=>{
        setTodos((prev)=>{
          return prev.map((prevTodo)=>prevTodo.id===id?{...prevTodo,completed:!prevTodo.completed}:prevTodo)
        })
    }

    useEffect(()=>{
      const todos=JSON.parse(localStorage.getItem('todos'));
      if(todos && todos.length>0){
        setTodos(todos)
      }
    },[])
    useEffect(()=>{
      localStorage.setItem('todos',JSON.stringify(todos))
    },[todos])
  return (
    <TodoProvider value={{todos,addTodo,updateTodo,deleteTodo,toggleComplete}}>
      <div classNameNameName="bg-[#172842] min-h-screen py-8">
                <div classNameNameName="w-full max-w-2xl mx-auto shadow-md rounded-lg px-4 py-3 text-white">
                    <h1 classNameNameName="text-2xl font-bold text-center mb-8 mt-2">Manage Your Todos</h1>
                    <div classNameNameName="mb-4">
                        {/* Todo form goes here */}
                        <TodoForm/> 
                    </div>
                    <div classNameNameName="flex flex-wrap gap-y-3">
                        {/*Loop and Add TodoItem here */}
                        {
                            todos.map((todo)=>(
                                <div key={todo.id} classNameNameName="w-full">
                                    <TodoItem todo={todo}/>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
    </TodoProvider>
  )
}

export default App
