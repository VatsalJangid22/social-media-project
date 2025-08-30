import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { readFileAsDataURL } from '@/lib/utils';
import { Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/redux/postSlice';

const CreatePost = ({open, setOpen, user}) => {
    const imgRef = useRef();
    const [file, setFile] = useState("");
    const [caption, setCaption] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const [loading, setLoading] = useState(false);
    const {posts} = useSelector(store => store.post)

    const dispatch = useDispatch();

    const fileChangeHandler = async (e) =>  {
        const file = e.target.files?.[0];
        
        if(file){
            setFile(file);
            const dataUrl = await readFileAsDataURL(file);
            setImagePreview(dataUrl);
        }
    }

    const createPostHandler = async (e) => {
        const formData = new FormData();
        formData.append("caption", caption)
        if(imagePreview){
            formData.append("image", file)
        }
        try {
            setLoading(true);
            const res = await axios.post("https://social-media-project-v2n6.onrender.com/api/v1/post/addPost", formData, {
                headers: {
                "Content-Type":"multipart/form-data"
                },
                withCredentials:true,
            })
            if(res.data.success){
                dispatch(setPosts([ res.data.post, ...posts]))
                toast.success(res.data.message);
                setOpen(false);
                // Reset form
                setCaption("");
                setImagePreview("");
                setFile("");
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
        finally{
            setLoading(false);
        }
    }

    const handleClose = () => {
        setOpen(false);
        setCaption("");
        setImagePreview("");
        setFile("");
    }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-md w-[95vw] max-h-[90vh] overflow-y-auto custom-scrollbar-hide p-0">
            <DialogHeader className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Create new post</h2>
                <button 
                    onClick={handleClose}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X size={20} />
                </button>
            </DialogHeader>
            
            <div className="p-4 space-y-4">
                {/* User Info */}
                <div className='flex gap-3 items-center'>
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.profilePicture} />
                        <AvatarFallback>{user?.username ? user.username.charAt(0).toUpperCase() : "."}</AvatarFallback>
                    </Avatar>

                    <div>
                        <h3 className='font-semibold text-sm text-gray-900'>{user?.username}</h3>
                        <span className='text-gray-600 text-xs'>{user?.bio || "No bio"}</span>
                    </div>
                </div>

                {/* Caption Input */}
                <div>
                    <Textarea 
                        value={caption} 
                        onChange={(e) => setCaption(e.target.value)} 
                        className="min-h-[100px] resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500" 
                        placeholder="Write a caption..."
                    />
                </div>

                {/* Image Preview */}
                {imagePreview && (
                    <div className="relative">
                        <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className='w-full h-64 object-cover rounded-lg border border-gray-200'
                        />
                        <button
                            onClick={() => {
                                setImagePreview("");
                                setFile("");
                            }}
                            className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

                {/* File Input */}
                <input 
                    ref={imgRef} 
                    type="file" 
                    accept="image/*"
                    className='hidden' 
                    onChange={fileChangeHandler}
                />

                {/* Action Buttons */}
                <div className="space-y-3">
                    <Button 
                        onClick={() => imgRef.current.click()} 
                        variant="outline"
                        className="w-full"
                    >
                        Select Image
                    </Button>
                    
                    {imagePreview && (
                        <Button 
                            onClick={createPostHandler}
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className='animate-spin h-4 w-4 mr-2'/>
                                    Creating post...
                                </>
                            ) : (
                                'Share Post'
                            )}
                        </Button>
                    )}
                </div>
            </div>
        </DialogContent>
    </Dialog>
  )
}

export default CreatePost