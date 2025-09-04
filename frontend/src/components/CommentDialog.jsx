import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from './ui/dialog'
import { useDispatch, useSelector } from 'react-redux';
import Comment from './Comment';
import axios from 'axios';
import { toast } from 'sonner';
import { setPosts } from '@/redux/postSlice';
import { X } from 'lucide-react';

const CommentDialog = ({open , setOpen}) => {

    const [text, setText] = useState("");
    const {selectedPost} = useSelector(store => store.post);
    const [comments, setComments] = useState([]);
    const {posts} = useSelector(store => store.post);

    useEffect(() => {
        setComments(selectedPost?.comments || []);
    },[selectedPost]);

    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if(inputText.trim()){
            setText(inputText);
        }
        else{
            setText("");
        }
    }

    const commentHandler = async () => {
        try {
            const res = await axios.post(`https://social-media-project-v2n6.onrender.com/api/v1/post/${selectedPost?._id}/comment`, { text }, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });
            if (res.data.success) {
                const updatedCommentData = [...comments, res.data.comment];
                setComments(updatedCommentData);

                const updatedPostData = posts.map(p => p._id === selectedPost._id ? {...p, comments:updatedCommentData} : p);

                dispatch(setPosts(updatedPostData));

                toast.success(res.data.message);
                setText("");
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Failed to add comment");
        }
    }

    const handleClose = () => {
        setOpen(false);
        setText("");
    }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-md w-[95vw] max-h-[80vh] p-0">
            <DialogHeader className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Comments</h2>
                <button 
                    onClick={handleClose}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X size={20} />
                </button>
            </DialogHeader>
            
            <div className="flex flex-col h-[60vh]">
                {/* Comments List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {comments.length > 0 ? (
                        comments.map((comment) => (
                            <Comment key={comment._id} comment={comment}/>
                        ))
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500 text-sm">No comments yet</p>
                            <p className="text-gray-400 text-xs mt-1">Be the first to comment!</p>
                        </div>
                    )}
                </div>
                
                {/* Comment Input */}
                <div className="border-t border-gray-200 p-4">
                    <div className='flex items-center gap-3'>
                        <input 
                            type="text" 
                            value={text}
                            onChange={changeEventHandler}
                            placeholder='Add a comment...'
                            className='flex-1 outline-none text-sm px-3 py-2 border border-gray-300 rounded-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                        />
                        {text && (
                            <button 
                                onClick={commentHandler}
                                className='text-[#3BADF8] text-sm font-semibold hover:text-[#1DA1F2] transition-colors px-3 py-1'
                            >
                                Post
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </DialogContent>
    </Dialog>
  )
}

export default CommentDialog