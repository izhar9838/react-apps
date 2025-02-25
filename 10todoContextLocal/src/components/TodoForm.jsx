import { useTodoContext } from "../contexts";
import { useState } from "react";
function TodoForm() {
    const [todo, setTodo] = useState("");
   const {addTodo}= useTodoContext();
    const add = (e) => {
        e.preventDefault();
        if (!todo) return;
        addTodo({todo,completed:false});
        setTodo("");
    }

    return (
        <form onSubmit={add} classNameNameName="flex">
            <input
                type="text"
                placeholder="Write Todo..."
                classNameNameName="w-full border border-black/10 rounded-l-lg px-3 outline-none duration-150 bg-white/20 py-1.5"
                value={todo}
                onChange={(e) => setTodo(e.target.value)}
            />
            <button type="submit" classNameNameName="rounded-r-lg px-3 py-1 bg-green-600 text-white shrink-0">
                Add
            </button>
        </form>
    );
}

export default TodoForm;

