import { setMessages } from "@/redux/chatSlice";
import { setPosts } from "@/redux/postSlice";
import axios from "axios"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

const useGetAllMessages = (id) => {
    const {selectedUser} = useSelector(store => store.auth);
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchAllMessages = async() => {
            try {
                const res = await axios.get(`http://localhost:7000/api/v1/message/all/${id}`, {withCredentials:true})
                if(res.data.success){
                    // console.log(res.data);
                    dispatch(setMessages(res.data.messages));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllMessages();
    },[selectedUser]);  
}

export default useGetAllMessages;