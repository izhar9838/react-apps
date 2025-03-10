import React from 'react'
import {Link} from 'react-router-dom'
import appwriteService from '../appwrite/config'

function PostCard({$id,title,featuredImage}) {
  return (
    <Link
    to={`/post/${$id}`}
    >
        <div classNameNameName='w-full bg-gray-100 rounded-xl p-4 '>
            <div classNameNameName='w-full justify-center mb-4'>
                <img src={appwriteService.privewFile(featuredImage)} alt={title} />
            </div>
            <h2 classNameNameName='text-xl font-bold'>{title}</h2>
        </div>
    </Link>
  )
}

export default PostCard
