import React, { FC } from 'react'
import  {IUser} from '../types/types'
import UserItem from './userItem'


interface UserListPorps{
  user: IUser[]
}

const userList: FC<UserListPorps>=function({user}){
  return (
    <div>
        {user.map(user => 
            <UserItem key={user.id} user={user}/> 
            )}

    </div>
  )
}

export default userList