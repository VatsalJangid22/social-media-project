import React from 'react'
import { Outlet } from 'react-router-dom'
import Feed from './Feed'
import useGetAllPosts from '@/hooks/useGetAllPosts'

const Home = () => {
    useGetAllPosts();
  return (
    <div className='flex'>
        <div className='flex-grow'>
            <Feed/>
            <Outlet/>
        </div>
    </div>
  )
}

export default Home