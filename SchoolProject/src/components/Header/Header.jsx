import React ,{useState,useEffect,useRef}from 'react'
import { useSelector,useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/authSlice';
import './Header.css'
import {Menu,X} from 'lucide-react';

function Header() {
    const authStatus = useSelector(state => state.auth.isAuthenticated);
    const authRole=useSelector(state=>state.auth?.user?.role);
    const dispatch=useDispatch();
    const navigate = useNavigate();
    const [isOpen ,setIsOpen]=useState(false);
    const toggleButton=()=>setIsOpen(!isOpen);
    const menuRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                !event.target.closest('.md\\:hidden') // Ensure the toggle button is not clicked
              ) {
                setIsOpen(false); // Close the menu
              }
        };
    
        // Add event listener when the component mounts
        document.addEventListener('mousedown', handleClickOutside);
    
        // Clean up the event listener when the component unmounts
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);
      const logoutHandler=(e)=>{
        e.preventDefault();
        dispatch(logout())
        navigate("/")

      }
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
            link:"/login",
            status:!authStatus
        },
    ]

  return (
    <header>
        <div className='bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 w-full  min-h-[7vh]  flex flex-wrap justify-between items-center nav-bar'>
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
                    {
                        (authStatus && authRole==='admin')&& <li className='pl-2 pr-2 nav-li'><button onClick={()=>navigate('admin')} className='cursor-pointer nav-button w-full h-full font-normal'>Admin</button></li>
                    }
                    {authStatus && <li className='pl-2 pr-2 nav-li'><button onClick={logoutHandler} className='cursor-pointer nav-button w-full h-full font-normal'>Log out</button></li>}
                    
                </ul>
            </div>
            <div className='md:hidden mr-3'>
                <button onClick={toggleButton}>
                    {isOpen ? <X/>:<Menu/>}
                </button>
            </div>
            {
                isOpen && (
                   <div ref={menuRef} className='flex basis-full flex-col items-center mob-nav '>
                        <ul className='w-full flex flex-wrap flex-col justify-around items-center ' >
                            {
                                navItems.map(item=>item.status?(
                                    <li key={item.name} className='pl-2 pr-2 nav-li'>
                                        <button onClick={()=>navigate(item.link)} className='cursor-pointer nav-button w-full h-full font-normal'>{item.name}</button>
                                    </li>
                                ):null)
                            }
                            {
                            (authStatus && authRole==='admin')&& <li className='pl-2 pr-2 nav-li'><button onClick={()=>navigate('admin')} className='cursor-pointer nav-button w-full h-full font-normal'>Admin</button></li>
                            }
                            {authStatus && <li className='pl-2 pr-2 nav-li'><button onClick={logoutHandler} className='cursor-pointer nav-button w-full h-full font-normal'>Log out</button></li>}
                            
                        </ul>
                   </div> 
                )
            }
        </div>
    </header>
  )
}

export default Header;
