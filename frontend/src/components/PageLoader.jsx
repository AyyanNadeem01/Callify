import React from 'react'
import { LoaderIcon } from 'lucide-react'
const PageLoader = () => {
  return (
  <div className="min-h-screen flex items-center justify-center">
    <LoaderIcon className="w-12 h-12 animate-spin text-primary" />
    <span className="ml-2 text-lg text-gray-700">Loading...</span>  
  </div>
  )
}

export default PageLoader
