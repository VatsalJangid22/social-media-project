import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const Comment = ({comment}) => {
  return (
    <div className='flex gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors'>
        <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={comment?.author?.profilePicture} />
            <AvatarFallback className="text-xs">
                {comment?.author?.username ? comment.author.username.charAt(0).toUpperCase() : "."}
            </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
                <span className='font-semibold text-sm text-gray-900'>
                    {comment?.author?.username || "User"}
                </span>
            </div>
            <p className='text-sm text-gray-700 mt-1 break-words'>
                {comment?.content || comment?.text || "No content"}
            </p>
        </div>
    </div>
  )
}

export default Comment