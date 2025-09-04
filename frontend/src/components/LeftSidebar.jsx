import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search } from 'lucide-react'
import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import namelogoImg from '../assets/images/name-logo.png'
import { toast } from 'sonner'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice'
import CreatePost from './CreatePost'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'
import store, { persistor, resetStore } from '@/redux/store'

const LeftSidebar = () => {

    const navigate = useNavigate();

    const {user} = useSelector(store=>store.auth);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const {likeNotification} = useSelector(store => store.rtn);

    const sidebarItems = [
        {icon:<Home/>, text:"Home"},
        {icon:<Search/>, text:"Search"},
        {icon:null, text:"Notification"},
        {icon:<MessageCircle/>, text:"Message"},
        {icon:<PlusSquare/>, text:"Add Post"},
        {icon:<Avatar className="h-6 w-6">
                <AvatarImage src={user?.profilePicture} />
                <AvatarFallback>{user?.username ? user.username.charAt(0).toUpperCase() : "."}</AvatarFallback>
            </Avatar>, 
            text:"Profile"},
        {icon:<LogOut/>, text:"Logout"}
    ]

    const logoutHandler = async () => {
        try {
            const res = await axios.get("https://social-media-project-v2n6.onrender.com/api/v1/user/logout" , {withCredentials:true});
            if(res.data.success){
                store.dispatch(resetStore());
                await persistor.purge();
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Logout failed");
        }
    }

    const sidebarHandler = (textType) => {
        if(textType === "Logout") logoutHandler();
        if(textType === "Add Post") setOpen(true);
        if(textType === "Profile") navigate(`/profile/${user._id}`);
        if(textType === "Home") navigate("/");
        if(textType === "Message") navigate("/chat");
    }

  return (
    <div className='fixed top-0 left-0 h-screen w-[60px] xl:w-[240px] border-r border-gray-300 bg-white flex flex-col'>
        <div>
            <div className="w-12 xl:w-36 overflow-hidden flex items-center justify-center m-auto">
                <img
                    src={namelogoImg}
                    alt="Logo"
                    className="w-full"
                    style={{ objectFit: "cover" }}
                />
            </div>
        </div>
        <div>
            {
                sidebarItems.map((item, index) => (
                    item.text === "Notification" ? (
                        <Popover key={index}>
                            <PopoverTrigger asChild>
                                <div
                                    className='flex items-center gap-3 hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3 justify-center xl:justify-start'
                                >
                                    {/* Heart icon with notification count */}
                                    <div className="relative">
                                        <Heart className="h-6 w-6" />
                                        {likeNotification.length > 0 && (
                                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                                                {likeNotification.length}
                                            </span>
                                        )}
                                    </div>
                                    <span className="hidden xl:inline">{item.text}</span>
                                </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-64 p-4 rounded-lg shadow-lg bg-white">
                                <h3 className="font-semibold mb-2">Notifications</h3>
                                {likeNotification.length === 0 ? (
                                    <p className="text-gray-500 text-sm">No new notifications</p>
                                ) : (
                                    <div className="flex flex-col gap-3 max-h-60 overflow-y-auto">
                                        {likeNotification.map((notification) => (
                                            <div key={notification.userId} className="flex items-center gap-2 p-2 rounded hover:bg-gray-50">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={notification?.userDetails?.profilePicture} />
                                                    <AvatarFallback>
                                                        {notification?.userDetails?.username ? notification?.userDetails.username.charAt(0).toUpperCase() : "."}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm">
                                                    <span className="font-medium">{notification?.userDetails?.username}</span> liked your post
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </PopoverContent>
                        </Popover>
                    ) : (
                        <div
                            onClick={() => sidebarHandler(item.text)}
                            key={index}
                            className='flex items-center gap-3 hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3 justify-center xl:justify-start'
                        >
                            {item.icon}
                            <span className="hidden xl:inline">{item.text}</span>
                        </div>
                    )
                ))
            }
        </div>
        <CreatePost open={open} setOpen={setOpen} user={user}/>
    </div>
  )
}

export default LeftSidebar