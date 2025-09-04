import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'
import RightSidebar from './RightSidebar'

const MainLayout = () => {
  return (
    <div className="flex flex-row min-h-screen">
        {/* Fixed sidebars are rendered, main content gets responsive padding to avoid overlap */}
        <div className='w-[60px] xl:w-[240px] flex-shrink-0'><LeftSidebar /></div>
        <div className='flex-1 w-full px-3 sm:px-4'>
          <div className="w-full py-4 sm:py-6">
            <Outlet />
          </div>
        </div>
        <div className='hidden xl:block w-[240px] flex-shrink-0'><RightSidebar /></div>
    </div>
  )
}

export default MainLayout

