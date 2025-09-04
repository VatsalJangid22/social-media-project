import { setMessages } from "@/redux/chatSlice";
import { setPosts } from "@/redux/postSlice";
import axios from "axios"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner";

const useGetAllMessages = (id) => {
    const {selectedUser} = useSelector(store => store.auth);
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchAllMessages = async() => {
            try {
                const res = await axios.get(`https://social-media-project-v2n6.onrender.com/api/v1/message/all/${id}`, {withCredentials:true})
                if(res.data.success){
                    // console.log(res.data);
                    dispatch(setMessages(res.data.messages));
                }
            } catch (error) {
                console.log(error);
                toast.error(error?.response?.data?.message || "Failed to load messages");
            }
        }
        fetchAllMessages();
    },[selectedUser]);  
}

export default useGetAllMessages;