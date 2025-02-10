import React ,{useCallback,useEffect}from 'react';
import {useSelector} from 'react-redux';
import {get, set, useForm} from 'react-hook-form';
import authService from '../../appwrite/config';
import {useNavigate} from 'react-router-dom';
import {Button,Input,Select,RTE} from '../index';

function PostForm({post}) {
  const {register,handleSubmit,watch,getValues,control,setValue}=useForm({
    defaultValues:{
      title:post?.title || '',
      content:post?.content||'',
      image:post?.featuredImage||'',
      status:post?.status||'active',
    }
  });
  const navigate=useNavigate();
  const userData=useSelector(state=>state.auth.userData);
  const submit=async (data)=>{
    if(post){
        const file=data.image[0] ? await authService.uploadFile(data.image[0]) : null;
        if(file){
          authService.deleteFile(post.featuredImage);
        }
        const dbPost=await authService.updatePost(post.$id,{
          ...data,
          featuredImage:file ? file.$id : post.featuredImage,
        });
        if(dbPost){
          navigate(`/post/${dbPost.$id}`);
        }
    }
    else{
      const file=await authService.uploadFile(data.image[0]);
      if(file){
        const fileId=file.$id;
        data.featuredImage=fileId;
        const dbPost=await authService.createPost({
          ...data,
          userId:userData.$id,
        });
        if(dbPost){
          navigate(`/post/${dbPost.$id}`);
        }
    }
  }
}
const slugtransform=useCallback((value)=>{
  if(value && typeof(value)==='string')
    return value.
                toLowerCase().
                trim().
                replace(/[^a-z0-9\d\s]+/g,'-').
                replace(/\s+/g,'-');

      return '';
},[])

useEffect(()=>{
  const subscription=watch((value,{name})=>{
    if (name==='title'){
      setValue('slug',slugtransform(value.title,{
        shouldValidate:true,
      }));
      
    }
  });
  return ()=>{
    subscription.unsubscribe();
  }

},[watch,slugtransform,setValue])
  return (
    <form onSubmit={handleSubmit(submit)} className='flex flex-wrap'>
      <div className='w-2/3 px-2'>
        <Input
        lable='Title'
        placeholder='Title'
        {...register('title',{
          required:'Title is required',
        })}
        />
        <Input
        lable='Slug :'
        placeholder='Slug'
        className='mt-4'
        {...register('slug',{
          required:true,
        })}
        onInput={(e)=>{
          setValue('slug',slugtransform(e.target.value),{shouldValidate:true});
        }}
        />
        <RTE
        label='Content :'
        name='content'
        control={control}
        defaultValue={getValues('content')}
        />

      </div>
      <div className='w-1/3 px-2'>
        <Input
          label='Featured Image :'
          type='file'
          className='mt-4'
          accept='image/png,image/jpeg,image/jpg,image/gif'
          {...register('image',{
            required:!post
          })}
        />
        {post && (
          <div className='w-full mb-4'>
            <img src={authService.privewFile(post.featuredImage)} alt={post.title} className='rounded-lg' />
          </div>
        )}
        <Select
        options={['active','inactive']}
        label='Status :'
        {...register('status',{
          required:true,
        })}
        />
        <Button type='submit' bgColor={post ? 'bg-green-500' : undefined}
        className='w-full'
        >
          {post ? 'Update' : 'Submit'}
        </Button>

      </div>

    </form>
  )
}

export default PostForm
