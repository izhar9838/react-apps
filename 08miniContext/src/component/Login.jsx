import React from 'react';
import UserContext from '../context/UserContext';

export default function Login() {
    const { setUser } = React.useContext(UserContext)
    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        setUser({username, password})
    }
    return (
        <div>
            <h1>Login</h1>
            <input type="text" onChange={(e)=>
                setUsername(e.target.value)
            } placeholder="username" /> <br/>
            <input type="password" 
            onChange={(e)=>setPassword(e.target.value)}
            placeholder='password' />
            <br/>
            <button onClick={handleSubmit}>Submit</button>
        </div>
    )
}