import React from 'react'
import { useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Link } from 'react-router-dom';

const RightSidebar = () => {

    const {user} = useSelector(store=>store.auth);

  return (
    <div className='fixed top-0 right-0 h-screen w-[60px] xl:w-[240px] border-l border-gray-300 bg-white hidden xl:block'>
        <div className='p-6'>
            <div className='flex items-center gap-3 p-4 bg-gray-50 rounded-lg'>
                <Link to={`/profile/${user?._id}`}>
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={user?.profilePicture} />
                        <AvatarFallback>{user?.username ? user.username.charAt(0).toUpperCase() : "."}</AvatarFallback>
                    </Avatar>
                </Link>
                <div className="flex flex-col">
                    <h1 className='font-bold text-gray-900'>
                        <Link to={`/profile/${user?._id}`}>{user?.username ? user.username : "."}</Link>
                    </h1>
                    <span className='text-sm text-gray-600'>{user?.bio ? user.bio : "No bio yet"}</span>
                </div>
            </div>  
        </div>
    </div>
  )
}

export default RightSidebar