import React,{useState,useEffect} from 'react';
import {Link,useNavigate,useParams} from 'react-router-dom';
import { useSelector } from 'react-redux';
import appwriteService from '../appwrite/config';
import { Container,Button } from '../components';
import parse from 'html-react-parser';


export default function Post() {
    const [post, setPost] = useState([])
    const {slug}=useParams();
    const navigate=useNavigate();
    const userData = useSelector(state => state.auth.userData);
    const isAuthtor=post && userData ? post.userId===userData.$id : false;
    useEffect(()=>{
        if(slug){
            appwriteService.getPost(slug).then(post=>{
                if(post){
                    setPost(post)
                }
                else{
                    navigate('/');
                }
            })
        }
        else{
            navigate('/')
        }
    },[slug,navigate])
    const deletePost=()=>{
        appwriteService.deletePost(post.$id).then((status)=>{
            if(status){
                appwriteService.deleteFile(post.featuredImage);
                navigate('/');
            }
        })
    }
  return post ?(
    <div classNameNameName='py-8'>
        <Container>
            <div classNameNameName='flex flex-wrap w-full justify-center mb-4 relative border rounded-xl p-2 '>
                <img
                src={appwriteService.privewFile(post.featuredImage)}
                alt={post.title}
                classNameNameName='rounded-xl'
                />
                {isAuthtor && (
                    <div classNameNameName='absolute top-6 right-6'>
                        <Link to={`/edit-post/${post.$id}`}>
                            <Button
                            bgColor='bg-blue-500'
                            classNameNameName='mr-2'
                            >Edit</Button>
                        </Link>
                        <Button bgColor='bg-blue-500' onClick={deletePost}>
                            Delete
                        </Button>
                    </div>
                )}
            </div>
            <div classNameNameName='w-full mb-6'>
                <h1 classNameNameName='text-2xl font-bold'>{post.title}</h1>
            </div>
            <div classNameNameName='browser-css'>
                {parse(post.content)}
            </div>

        </Container>
    </div>
  ):null;
}

