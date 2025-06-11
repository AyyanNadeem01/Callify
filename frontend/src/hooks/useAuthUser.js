import React from 'react'
import { useQuery } from '@tanstack/react-query'                    
import { getAuthUser } from '../lib/api.js';
const useAuthUser = () => {
    const authUser= useQuery({
        queryKey: ['authUser'],
        queryFn: getAuthUser,
        retry: false,
        // Add these options to handle authentication properly
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5, // 5 minutes
      });
      return {isLoading: authUser.isLoading, user: authUser.data?.user}
}

export default useAuthUser
