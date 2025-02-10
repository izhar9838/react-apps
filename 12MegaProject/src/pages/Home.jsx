import React ,{useState,useEffect}from 'react';
import { Container,PostCard} from '../components';
import appwriteService from '../appwrite/config';

function Home() {
    const [post, setPosts] = useState([]);
    useEffect(()=>{
    appwriteService.getPosts([]).then(posts=>{
      if (posts) {
        setPosts(posts.documents)
        
      }
    })
    },[])
  if (post.length === 0) {
    return (
      <div className='w-full py-8 mt-4 text-center'>
        <Container>
          <div className='flex flex-wrap'>
            <div className='w-full p-2'>
              <h1 className='text-2xl text-center font-bold hover:text-gray-500'>Login to read post</h1>
            </div>
          </div>
        </Container>
      </div>
    )
  }
    return (
        <div className='w-full py-8'>
        <Container>
            <div className='flex flex-wrap'>
            {post.map(post=>(
            <div key={post.$id} className='w-1/4 p-2'>
                <PostCard post={post}/>
            </div>
            ))}
            </div>
        </Container>
        
        </div>
    )
}

export default Home
