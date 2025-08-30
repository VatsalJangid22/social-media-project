import React from 'react'
import Posts from './Posts'

const Feed = () => {
  return (
    <div className='flex-1 py-4 md:py-8 flex flex-col items-center'>
        <div className="w-full max-w-2xl xl:max-w-[450px] mx-auto px-4 md:px-6">
            <Posts/>
        </div>
    </div>
  )
}

export default Feed