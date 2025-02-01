import React from 'react';
import UserContext from '../context/UserContext';

export default function Profile() {
    const { user } = React.useContext(UserContext)
    if (!user) return <h1>Please Login</h1>

    return <h3>Username: {user.username}</h3>
            
        
    
}