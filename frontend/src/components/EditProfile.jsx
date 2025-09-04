import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from './ui/select';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { setAuthUser } from '@/redux/authSlice';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {

    const {user} = useSelector(store => store.auth);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState({
        profilePicture:user?.profilePicture,
        bio:user?.bio,
        gender:user?.gender
    });
    // console.log("🚀Rocket ~ input:", input)

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
        setInput({ ...input, profilePicture: file });
    }
    };


    const selectChangeHandler = (value) => {
        setInput({...input, gender:value});
    }

    const editProfileHandler = async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append("bio", input.bio);
        formData.append("gender", input.gender);
        if(input.profilePicture){
            formData.append("profilePicture", input.profilePicture)
        }

        try {
            const res = await axios.post(`https://social-media-project-v2n6.onrender.com/api/v1/user/profile/edit`, formData , {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                withCredentials: true
            });
            if(res.data.success){
                const updatedUser = {
                    ...user,
                    profilePicture:res.data.user?.profilePicture,
                    bio:res.data.user?.bio,
                    gender:res.data.user?.gender
                }
                dispatch(setAuthUser(updatedUser));
                navigate(`/profile/${user._id}`);
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Failed to update profile");
        }
    }

  return (
    <div className='flex justify-center items-center px-3 sm:px-6 lg:px-8 py-6 gap-6 flex-col'>
        <div className='flex flex-col gap-6 w-full max-w-3xl'>
            <h1 className='font-bold text-2xl'>Edit Profile</h1>
            <div className='flex flex-col md:flex-row bg-gray-100 rounded-md border border-gray-200'>
            <div className='md:mr-6 flex flex-col items-center p-4'>
                <Avatar className="h-24 w-24 sm:h-32 sm:w-32 lg:h-40 lg:w-40 shadow-lg mb-4">
                    <AvatarImage src={
                    input.profilePicture
                        ? input.profilePicture instanceof File
                        ? URL.createObjectURL(input.profilePicture)
                        : input.profilePicture
                        : ""
                    } />
                    <AvatarFallback className="text-2xl sm:text-3xl lg:text-4xl">
                        {user?.username ? user.username.charAt(0).toUpperCase() : "."}
                    </AvatarFallback>
                </Avatar>
                {/* Hidden file input */}
                <input
                    type="file"
                    accept="image/*"
                    onChange={fileChangeHandler}
                    id="profile-upload"
                    className="hidden"
                />

                {/* Button triggers the file input */}
                <Button 
                    type="button" 
                    onClick={() => document.getElementById("profile-upload").click()}
                    className="cursor-pointer"
                >
                    Update profile picture
                </Button>
            </div>
            <div className='md:ml-6 md:mr-6 flex justify-center items-center flex-col p-6 md:p-12 text-center md:text-left'>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    {user?.username || "Username"}
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">
                    {user?.bio || "No bio available"}
                </p>
            </div>
        </div>
        <div className='flex flex-col pt-6 w-full max-w-3xl'>
            <span className='font-bold mb-2'>Bio</span>
            <Textarea
            value={input.bio || ""}
            onChange={(e) => setInput({...input, bio: e.target.value})}
            className='w-full focus-visible:ring-transparent'
            placeholder="Add or update your bio..."
            />
        </div>
        <div className='flex flex-col w-full max-w-3xl'>
            <span className='font-bold mb-2'>Gender</span>
            <Select value={input.gender} onValueChange={selectChangeHandler}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
            </SelectContent>
            </Select>
        </div>
        <div className='flex flex-col w-full max-w-3xl'>
            {
                loading ? (<Button className="cursor-pointer bg-[#0095F6] hover:bg-[#0087f6]" disabled ><Loader2 className='h-4 w-4 animate-spin'/>Please wait</Button>) : (<Button onClick={editProfileHandler} className="cursor-pointer bg-[#0095F6] hover:bg-[#0087f6]" >Submit</Button>)
            }
        </div>
        </div>
    </div>
  )
}

export default EditProfile