import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useNavigate } from 'react-router-dom'

const SearchedUsers = ({user}) => {
    const navigate = useNavigate();
  return (
    <div className='flex items-center gap-4' onClick={()=>navigate(`/profile/${user._id}`)}>
        <div className='flex items-center gap-4'>
            <Avatar>
                <AvatarImage src={user.profilePicture}/>
                <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <h1 className='font-bold text-sm text-gray-900'>{user.username}</h1>
        </div>
    </div>
  )
}

export default SearchedUsers