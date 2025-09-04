import React, { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios';
import SearchedUsers from './SearchedUsers';
import { toast } from 'sonner';

const SearchPage = () => {
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);

    const searchHandler = async () => {
        try {
            const res = await axios.get(`https://social-media-project-v2n6.onrender.com/api/v1/user/search?q=${search}`, {withCredentials:true});
            if(res.data.success){
                setUsers(res.data.users);
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Search failed");
        }
    }
  return (
    <div className='max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-6'>
        <div className='flex flex-col gap-3 sm:gap-4'>
          <Input
              type="text"
              placeholder="Search"
              className="w-full"
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
          />
          <Button className='w-full' onClick={searchHandler}>Search</Button>
        </div>
        <div className="flex flex-col gap-3 sm:gap-4 mt-4">
            {users.map((user)=>(
                <SearchedUsers key={user._id} user={user}/>
            ))}
        </div>
    </div>
  )
}

export default SearchPage