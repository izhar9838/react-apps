import React, { act } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import{LogoutBtn,Container,Logo ,} from '../index';


export default function Header() {
  const navigate=useNavigate();
  const authStatus=useSelector((state)=>state.auth.status)
  console.log(authStatus);
  
  const navItems=[
    {
      name:'Home',
      slug:'/',
      acttive:true
    },
    {
      name:'Login',
      slug:'/login',
      acttive:!authStatus
    },
    {
      name:'Signup',
      slug:'/signup',
      acttive:!authStatus
    },
    {
      name:'All Posts',
      slug:'/all-posts',
      acttive:authStatus
    },
    {
      name:'Add Post',
      slug:'/add-post',
      acttive:authStatus,
    },
  ]
  return (
    <header className='py-3 shadow bg-gray-500'>
      <Container>
        <nav className='flex'>
          <div>
            <Link to='/'>
              <Logo width='70px'/>
            </Link>
          </div>
          <ul className='flex ml-auto'>
            {navItems.map((item)=>item.acttive?(
              <li key={item.name}>
                  <button onClick={()=>navigate(item.slug)} className='inline-block px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'>{item.name}</button>
              </li>
            ):null)}
            {authStatus &&(
              <li>
                <LogoutBtn/>
              </li>
            )}

          </ul>

        </nav>
      </Container>
      
    </header>
  );
}