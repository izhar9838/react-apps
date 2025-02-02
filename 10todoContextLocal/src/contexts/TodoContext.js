import {useContext,createContext} from 'react';

export const TodoContext = createContext({
    todos:[{
        id:1,
        todo:"Hello world",
        isCompleted:false
    }],
    addTodo:()=>{},
    updateTodo:()=>{},
    deleteTodo:()=>{},
    toggleComplete:()=>{}
});

export const useTodoContext = () => {
    return useContext(TodoContext);
}
export const TodoProvider = TodoContext.Provider;
