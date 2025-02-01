import React from 'react';
import { useLoaderData } from 'react-router-dom';

export default function Github() {
   const data= useLoaderData()
    return(
        <div className='text-center w-full h-screen flex  justify-center items-center'>
            <h1 className='text-3xl text-center'>Github Follower : {data.followers}</h1>
            <img src={data.avatar_url} alt="github photo" />
        </div>
            
    )
}
export const loaderGithub= async()=>{
    const res= await fetch('https://api.github.com/users/izhar9838')
    const data= await res.json()
    return data
}