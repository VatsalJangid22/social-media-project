import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useNavigate } from 'react-router-dom'

const SearchedUsers = ({user}) => {
    const navigate = useNavigate();
  return (
    <div className='flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer' onClick={()=>navigate(`/profile/${user._id}`)}>
        <Avatar className="h-10 w-10">
            <AvatarImage src={user.profilePicture}/>
            <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <h1 className='font-semibold text-sm text-gray-900 truncate'>{user.username}</h1>
    </div>
  )
}

export default SearchedUsers