import React, { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios';
import SearchedUsers from './SearchedUsers';

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
        }
    }
  return (
    <div>
        <div className='flex flex-col gap-4'>
        <Input
            type="text"
            placeholder="Search"
            className="w-2xl mx-auto"
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
        ></Input>
        <Button className='w-2xl mx-auto' onClick={searchHandler}>Search</Button>
        </div>
        <div className="flex flex-col gap-4">
            {users.map((user)=>(
                <SearchedUsers key={user._id} user={user}/>
            ))}
        </div>
    </div>
  )
}

export default SearchPage