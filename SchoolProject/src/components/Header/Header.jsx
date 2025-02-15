import React ,{useState}from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './Header.css'
import {Menu,X} from 'lucide-react';

function Header() {
    const authStatus = useSelector(state => state.auth.status);
    const navigate = useNavigate();
    const [isOpen ,setIsOpen]=useState(false);
    const toggleButton=()=>setIsOpen(!isOpen);
    const navItems=[
        {
            name:"Home",
            link:"/",
            status:true
        },
        {
            name:"Contact us",
            link:"/contact-us",
            status:true
        },
        {
            name:"Sign in",
            link:"/",
            status:!authStatus
        },
        {
            name:"Login",
            link:"/",
            status:!authStatus
        },
    ]

  return (
    <header>
        <div className='w-full  h-15 flex flex-wrap justify-between items-center nav-bar'>
            <div className='w-1/4'>
                <h1>School Logo</h1>
            </div>
            <div className='w-2/4  h-full flex flex-wrap' >
                <ul className='w-full hidden md:flex flex-wrap justify-around items-center ' >
                    {
                        navItems.map(item=>item.status?(
                            <li key={item.name} className='pl-2 pr-2 nav-li'>
                                <button onClick={()=>navigate(item.link)} className='cursor-pointer nav-button w-full h-full font-normal'>{item.name}</button>
                            </li>
                        ):null)
                    }
                </ul>
            </div>
            <div className='md:hidden mr-3'>
                <button onClick={toggleButton}>
                    {isOpen ? <X/>:<Menu/>}
                </button>
            </div>
            {
                isOpen && (
                   <div className='flex basis-full flex-col items-center mob-nav '>
                        <ul className='w-full flex flex-wrap flex-col justify-around items-center ' >
                            {
                                navItems.map(item=>item.status?(
                                    <li key={item.name} className='pl-2 pr-2 nav-li'>
                                        <button onClick={()=>navigate(item.link)} className='cursor-pointer nav-button w-full h-full font-normal'>{item.name}</button>
                                    </li>
                                ):null)
                            }
                        </ul>
                   </div> 
                )
            }
        </div>
    </header>
  )
}

export default Header;
