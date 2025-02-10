import React ,{useState}from 'react';
import {login} from '../store/authSlice';
import {Input,Button,Logo} from './index';
import {Link,useNavigate} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import { useDispatch } from 'react-redux';
import authService from '../appwrite/auth';

function Signup() {
  const {register,handleSubmit}=useForm();
  const dispatch=useDispatch();
  const [error,setError]=useState('');
  const navigate=useNavigate();


  const signup=async(data)=>{
    setError("");
        try {
          const userData=await authService.createAccount(data);
         if (userData) {
          const userData=await authService.getAccount();
          if (userData) dispatch(login(data))
            navigate("/")
            
          
         }
          
        } catch (error) {
          setError(error.message);
        }
        
  }
  return (
    <div className='flex items-center justify-center'>
      <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10  border-black/10`}>
        <div className='mb-2 flex justify-center '>
          <span className='inline-block w-full max-w-[100px]'>
            <Logo width='100p%'/>
          </span>
        </div>
        <h2 className='text-center text-2xl font-bold leading-tight'>Sign up to create account</h2>
        <p className='mt-2 text-center text-base text-black/60'>Already have an account?&nbsp;
          <Link to='/login' className='font-medium text-primary transition-all duration-200 hover:underline'>Sign in</Link>
        </p>
        {error && <p className='text-red-600 mt-8 text-center'>{error}</p>}
        <form  onSubmit={handleSubmit(signup)} className='mt-8'>
                        <div className='space-y-5'>
                            <Input
                            label='Full Name'
                            placeholder='Enter full name'
                            type='text'
                            {...register('name',{
                              required:true,
                            })}
                            />
                            <Input
                            label="Email"
                            placeholder="Enter your email"
                            type="email"
                            {...register("email",{
                                required:true,
                                validate:{
                                    matchPattern:(value)=>{
                                            /^\w+([.-]?\w+)*@\w+([.-]?\w)*(\.\w{2,3})+$/.test(value)||
                                            "Email address must be a valid address"
                                    }
                                }
                            })}
                            />
                            <Input 
                            type='password'
                            placeholder='Enter your password'
                            label='Password'
                            {...register("password",{
                                validate:true,
                            })
                            }
                            />
                            <Button className='w-full' type='submit'>Create Account</Button>
        
                        </div>
        
                    </form>

      </div>
      
    </div>
  )
}

export default Signup
