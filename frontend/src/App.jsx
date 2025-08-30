import Signup from './components/Signup'
import Login from './components/Login'
import Home from './components/Home'
import MainLayout from './components/MainLayout'
import {createBrowserRouter , RouterProvider} from "react-router-dom"
import Profile from './components/Profile'
import EditProfile from './components/EditProfile'
import ChatPage from './components/ChatPage'
import {io} from "socket.io-client";
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSocket } from './redux/socketSlice'
import { setOnlineUsers } from './redux/chatSlice'
import { setLikeNotification } from './redux/rtnSlice'
import ProtectedRoute from './components/ProtectedRoute'

const browserRouter = createBrowserRouter([
    {
        path: "/",
        element: <ProtectedRoute><MainLayout/></ProtectedRoute>,
        children:[
            {
            path:"/",
            element:<ProtectedRoute><Home/></ProtectedRoute>
            },
            {
            path:"/profile/:id",
            element:<ProtectedRoute><Profile/></ProtectedRoute>
            },
            {
            path:"/profile/edit",
            element:<ProtectedRoute><EditProfile/></ProtectedRoute>
            },
            {
            path:"/chat",
            element:<ProtectedRoute><ChatPage/></ProtectedRoute>
            }
        ]
    },
    {
        path: "/signup",
        element: <Signup/>
    },
    {
        path: "/login",
        element: <Login/>
    }
])

function App() {

    const {user} = useSelector(store => store.auth);

    const {socket} = useSelector(store => store.socketio);

    const dispatch = useDispatch();

    useEffect(() => {
        if(user){
            const socketio = io("https://social-media-project-v2n6.onrender.com", {
                query:{
                    userId: user._id,
                },
                transports:["websocket"]
            })
            dispatch(setSocket(socketio));

            socketio.on("getOnlineUsers", (onlineUsers) => {
                dispatch(setOnlineUsers(onlineUsers));
            })

            socketio.on("notification", (notification) => {
                dispatch(setLikeNotification(notification));
            })

            return () => {
                socketio.close();
                dispatch(setSocket(null));
            }
        }
        else if(socket){
            socket.close();
            dispatch(setSocket(null));
        }
    },[user, dispatch]);

  return (
    <>
      <RouterProvider router={browserRouter}/>
    </>
  )
}

export default App
