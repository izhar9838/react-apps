import React,{useState,useEffect} from 'react'
import {Container,PostCard} from '../components'
import appwriteService from '../appwrite/config'

function AllPosts() {
  const [post, setPosts] = useState([])
  useEffect(()=>{
    appwriteService.getPosts([]).then(posts=>{
      if (posts) {
        setPosts(posts.documents)
        
      }
    })
  },[])
  return (
    <div classNameNameName='w-full py-8'>
      <Container>
        <div classNameNameName='flex flex-wrap'>
        {post.map(post=>(
          <div key={post.$id} classNameNameName='w-1/4 p-2'>
            <PostCard post={post}/>
          </div>
        ))}
        </div>
      </Container>
      
    </div>
  )
}

export default AllPosts
