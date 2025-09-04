import useGetUserProfile from '@/hooks/useGetUserProfile'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useDispatch, useSelector } from 'react-redux';
import { setUserProfile } from '@/redux/authSlice';
import axios from 'axios';
import { toast } from 'sonner';

const Profile =  () => {
    const params = useParams();
    const userId = params.id;
    useGetUserProfile(userId);

    const[activeTab, setActiveTab] = useState("posts");
    const {userProfile} = useSelector(store => store.auth);
    const {user} = useSelector(store => store.auth);
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
    if (userProfile && userProfile.followers) {
        setIsFollowing(userProfile.followers.includes(user._id));
    }
    }, [userProfile, user._id]);
    
    const dispatch = useDispatch();
    
    const followOrUnfollowHandler = async (userId) => {
        try {
            const res = await axios.post(`https://social-media-project-v2n6.onrender.com/api/v1/user/followorunfollow/${userId}`,{}, {withCredentials:true});
            if(res.data.success){
                toast.success(res.data.message);
                setIsFollowing(!isFollowing);
                dispatch(setUserProfile({
                    ...userProfile,
                    followers: res.data.user.followers,
                  }));                  
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Failed to update follow state");
        }
    }

    // const selectedUserPosts = posts.filter((post) => post.author._id === userProfile._id);
    // console.log("🚀Rocket ~ selectedUserPosts:", selectedUserPosts)
    
  return (
    <div className="min-h-screen pb-16 lg:pb-0">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8">
            {/* Profile Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-4 sm:mt-8 lg:mt-12">
                <div className="p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
                        {/* Profile Picture */}
                        <div className="flex-shrink-0">
                            <Avatar className="h-24 w-24 sm:h-32 sm:w-32 lg:h-40 lg:w-40 shadow-lg">
                                <AvatarImage src={userProfile?.profilePicture} />
                                <AvatarFallback className="text-2xl sm:text-3xl lg:text-4xl">
                                    {userProfile?.username ? userProfile.username.charAt(0).toUpperCase() : "."}
                                </AvatarFallback>
                            </Avatar>
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1 text-center sm:text-left">
                            <div className="mb-4">
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                                    {userProfile?.username || "Username"}
                                </h1>
                                <p className="text-gray-600 text-sm sm:text-base">
                                    {userProfile?.bio || "No bio available"}
                                </p>
                            </div>

                            {/* Stats */}
                            <div className="flex justify-center sm:justify-start gap-6 sm:gap-8 mb-6">
                                <div className="text-center">
                                    <div className="text-lg sm:text-xl font-bold text-gray-900">{userProfile?.posts?.length || 0}</div>
                                    <div className="text-sm text-gray-600">Posts</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg sm:text-xl font-bold text-gray-900">{userProfile?.followers?.length || 0}</div>
                                    <div className="text-sm text-gray-600">Followers</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg sm:text-xl font-bold text-gray-900">{userProfile?.followings?.length || 0}</div>
                                    <div className="text-sm text-gray-600">Following</div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                {userProfile && (
                                    <>
                                        {userProfile._id === user._id ? (
                                            <Link to="/profile/edit">
                                                <button className="px-6 py-2 sm:py-3 rounded-lg border font-semibold bg-gray-100 hover:bg-gray-200 transition text-sm sm:text-base shadow-sm cursor-pointer">
                                                    Edit Profile
                                                </button>
                                            </Link>
                                        ) : (
                                            <>
                                                {isFollowing ? (
                                                    <button onClick={()=>followOrUnfollowHandler(userProfile._id)} className="px-6 py-2 sm:py-3 rounded-lg border font-semibold bg-gray-100 hover:bg-gray-200 transition text-sm sm:text-base shadow-sm">
                                                        Unfollow
                                                    </button>
                                                ) : (
                                                    <button onClick={()=>followOrUnfollowHandler(userProfile._id)} className="px-6 py-2 sm:py-3 rounded-lg border font-semibold bg-blue-500 text-white hover:bg-blue-600 transition text-sm sm:text-base shadow-sm">
                                                        Follow
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Posts Grid */}
            <div className="mt-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
                    <div className="flex justify-center gap-4">
                        <h2
                            className={`text-lg sm:text-xl mb-6 cursor-pointer ${
                            activeTab === "posts" ? "font-bold text-black" : "font-medium text-gray-500"
                            }`}
                            onClick={() => setActiveTab("posts")}
                        >
                            Posts
                        </h2>
                    </div>
                    {activeTab === "posts" ? (
                    userProfile?.posts && userProfile.posts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-2 lg:gap-4">
                            {[...userProfile.posts].reverse().map((post) => (
                                <div 
                                    key={post._id} 
                                    className="relative group aspect-square overflow-hidden bg-gray-100 rounded-lg cursor-pointer"
                                >
                                    <img 
                                        src={post.image} 
                                        alt={`Post by ${userProfile.username}`}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    
                                    {/* Hover overlay with post info */}
                                    <div className="absolute inset-0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center">
                                            <div className="flex items-center justify-center gap-4 text-sm font-medium">
                                                <div className="flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                                    </svg>
                                                    <span>{post.likes?.length || 0}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                                                    </svg>
                                                    <span>{post.comments?.length || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-gray-500 text-sm sm:text-base">
                                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                </svg>
                                <p className="text-lg font-medium text-gray-900 mb-2">No posts yet</p>
                                <p className="text-gray-500">When you share photos and videos, they'll appear on your profile.</p>
                            </div>
                        </div>
                    )
                    ) : (
                    userProfile?.bookmarks && userProfile?.bookmarks.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-2 lg:gap-4">
                            {userProfile.posts.map((post) => (
                                <div 
                                    key={post._id} 
                                    className="relative group aspect-square overflow-hidden bg-gray-100 rounded-lg cursor-pointer"
                                >
                                    <img 
                                        src={post.image} 
                                        alt={`Post by ${userProfile.username}`}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    
                                    {/* Hover overlay with post info */}
                                    <div className="absolute inset-0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center">
                                            <div className="flex items-center justify-center gap-4 text-sm font-medium">
                                                <div className="flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                                    </svg>
                                                    <span>{post.likes?.length || 0}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                                                    </svg>
                                                    <span>{post.comments?.length || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-gray-500 text-sm sm:text-base">
                                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                </svg>
                                <p className="text-lg font-medium text-gray-900 mb-2">No saved posts yet</p>
                                <p className="text-gray-500">When you save, they'll appear on your profile.</p>
                            </div>
                        </div>
                    )
                    )}

                </div>
            </div>
            
        </div>
    </div>
  )
}

export default Profile