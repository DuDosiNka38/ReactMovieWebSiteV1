import React, { FC } from 'react'
import { IUser } from '../types/types'

interface userItemProps{
    user: IUser
}

const UserItem: FC<userItemProps> = function(user) {
  return (
    <div>
  <h1>{user.user.id}.  {user.user.name}</h1> 
  <h1>{user.user.email}</h1>
    </div>
  )
}

export default UserItem