import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'
import RightSidebar from './RightSidebar'

const MainLayout = () => {
  return (
    <div className="flex justify-center items-center flex-row">
        <div className='w-[16%] ml-0'><LeftSidebar /></div>
        <div className='w-full'><Outlet /></div>
        <div className='w-[16%] mr-0'><RightSidebar /></div>
    </div>
  )
}

export default MainLayout

