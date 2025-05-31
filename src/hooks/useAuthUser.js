import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAuthUser } from '../lib/api'
import useLogout from './useLogout'

const useAuthUser = () => {
   const authUser = useQuery({
    queryKey : ["authUser"],
    queryFn : getAuthUser,
    retry : false,
    
   });

   const { logout } = useLogout();

   return {
   isLoading : authUser.isLoading,
   authUser : authUser.data?.user || null,
   logout
   }
}

export default useAuthUser
