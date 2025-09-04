import React from 'react'
import Posts from './Posts'

const Feed = () => {
  return (
    <div className='flex-1 py-4 sm:py-6 flex flex-col items-center'>
        <div className="w-full max-w-2xl mx-auto px-3 sm:px-4">
            <Posts/>
        </div>
    </div>
  )
}

export default Feed