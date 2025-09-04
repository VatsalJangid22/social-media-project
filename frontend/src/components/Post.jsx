import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import { Button } from './ui/button'
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from './CommentDialog'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import axios from 'axios'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { Link } from 'react-router-dom'

const Post = ({post}) => {

    const [open, setOpen] = useState(false);
    const {user} = useSelector(store => store.auth);
    const {posts} = useSelector(store => store.post);
    const dispatch = useDispatch();
    const [liked, setLiked] = useState(post.likes.includes(user._id) || false);
    const [text, setText] = useState("");
    const [postLikes, setPostLikes] = useState(post.likes.length);
    const [comments, setComments] = useState(post.comments);

    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if(inputText.trim()){
            setText(inputText);
        }
        else{
            setText("");
        }
    }

    const likeDislikeHandler = async () => {
        try {
            const action = liked ? 'dislike' : 'like';
            const res = await axios.get(`https://social-media-project-v2n6.onrender.com/api/v1/post/${post?._id}/${action}`, {withCredentials:true});
            if(res.data.success){
                const updatedLikes = liked ? postLikes - 1 : postLikes + 1;
                setPostLikes(updatedLikes);
                setLiked(!liked);

                const updatedPostData = posts.map(p => 
                    p._id === post._id ? {
                        ...p,
                        likes : liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
                    } : p
                )
                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const commentHandler = async () => {
        try {
            const res = await axios.post(`http://localhost:7000/api/v1/post/${post?._id}/comment`, { text }, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });
            if (res.data.success) {
                const updatedCommentData = [...comments, res.data.comment];
                setComments(updatedCommentData);

                const updatedPostData = posts.map(p => p._id === post._id ? {...p, comments:updatedCommentData} : p);

                dispatch(setPosts(updatedPostData));

                toast.success(res.data.message);
                setText("");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    const deletePostHandler = async () => {
        try {
            const res = await axios.post(`https://social-media-project-v2n6.onrender.com/api/v1/post/${post?._id}/delete`,{}, {withCredentials:true});

            if(res.data.success){
                toast.success(res.data.message)
                const updatedPosts = posts.filter((postItem) => postItem._id !== post?._id);
                dispatch(setPosts(updatedPosts));
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

  return (
    <div className='w-full bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
        {/* Post Header */}
        <div className='flex items-center justify-between p-3 sm:p-4 border-b border-gray-100'>
            <div className='flex items-center gap-3'>
                <Link to={`/profile/${post?.author._id}`}>
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                        <AvatarImage src={post.author?.profilePicture} />
                        <AvatarFallback>{post.author?.username ? post.author.username.charAt(0).toUpperCase() : "."}</AvatarFallback>
                    </Avatar>
                </Link>
                <div>
                    <h3 className="font-semibold text-sm sm:text-base">
                        <Link to={`/profile/${post?.author._id}`} className="hover:underline">
                            {post.author?.username ? post.author.username : "."}
                        </Link>
                    </h3>
                    {/* <p className="text-xs text-gray-500">Just now</p> */}
                </div>
            </div>
            <Dialog>
                <DialogTrigger asChild>
                    <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                        <MoreHorizontal className='h-5 w-5'/>
                    </button>
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center text-sm text-center gap-2">
                    {user && user?._id === post.author?._id && <Button onClick={deletePostHandler} variant="ghost" className="cursor-pointer w-fit">Delete Post</Button>}
                </DialogContent>
            </Dialog>
        </div>

        {/* Post Image */}
        <div className="relative">
            <img 
                className='w-full aspect-square object-cover' 
                src={post.image} 
                alt="post_img" 
            />
        </div>

        {/* Post Actions */}
        <div className='p-3 sm:p-4'>
            <div className='flex items-center justify-between mb-3'>
                <div className='flex items-center gap-4'>
                    <button 
                        onClick={likeDislikeHandler}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        {liked ? 
                            <FaHeart size={24} className='text-red-600'/> : 
                            <FaRegHeart size={24} className='hover:text-gray-700'/>
                        }
                    </button>
                    <button 
                        onClick={() => {
                            dispatch(setSelectedPost(post));
                            setOpen(true);
                        }}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <MessageCircle size={24} className='hover:text-gray-700'/>
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                        <Send size={24} className='hover:text-gray-700'/>
                    </button>
                </div>
            </div>

            {/* Likes Count */}
            <div className='font-semibold text-sm mb-2'>{postLikes} likes</div>

            {/* Caption */}
            <div className="mb-2 text-sm">
                <span className='font-semibold mr-2'>{post.author?.username ? post.author.username : "."}</span>
                <span className="text-gray-900">{post.caption}</span>
            </div>

            {/* View Comments */}
            {comments.length > 0 && (
                <button 
                    onClick={() => {
                        dispatch(setSelectedPost(post));
                        setOpen(true);
                    }}
                    className='text-sm text-gray-500 mb-3 hover:text-gray-700 transition-colors'
                >
                    View all {comments.length} comments
                </button>
            )}

            {/* Comment Input */}
            <div className='flex items-center gap-2 pt-2 border-t border-gray-100'>
                <input 
                    type="text" 
                    value={text}
                    onChange={changeEventHandler}
                    placeholder='Add a comment...'
                    className='flex-1 outline-none text-sm bg-transparent placeholder-gray-400'
                />
                {text && (
                    <button 
                        onClick={commentHandler}
                        className='text-[#3BADF8] text-sm font-semibold hover:text-[#1DA1F2] transition-colors'
                    >
                        Post
                    </button>
                )}
            </div>
        </div>

        <CommentDialog open={open} setOpen={setOpen}/>
    </div>
  )
}

export default Post