import { setUserProfile } from "@/redux/authSlice";
// import { setPosts } from "@/redux/postSlice";
import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { toast } from "sonner";

const useGetUserProfile = (userId) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchUserProfile = async() => {
            try {
                const res = await axios.get(`https://social-media-project-v2n6.onrender.com/api/v1/user/${userId}/profile`, {withCredentials:true})
                if(res.data.success){
                    console.log(res.data);
                    dispatch(setUserProfile(res.data.user));
                }
            } catch (error) {
                console.log(error);
                toast.error(error?.response?.data?.message || "Failed to load profile");
            }
        }
        fetchUserProfile();
    },[userId])
}

export default useGetUserProfile;