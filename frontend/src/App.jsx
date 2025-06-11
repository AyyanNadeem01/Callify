import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import Onboarding from './pages/Onboarding.jsx'
import ChatPage from './pages/ChatPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import NotificationPage from './pages/NotificationPage.jsx'
// import CallPage from './pages/CallPage.jsx' // Add this import
import { Toaster } from 'react-hot-toast'
import PageLoader from './components/PageLoader.jsx'
import useAuthUser from './hooks/useAuthUser.js'
const App = () => {

  const { isLoading, user:authUser } = useAuthUser();
  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.onboarded;

  console.log('Auth state:', { authUser, isLoading }); // Debug log
  
  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <PageLoader />
    );
  }

  return (
    <div className='h-screen' data-theme="forest">
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated
              ? (isOnboarded ? <HomePage /> : <Navigate to="/onboarding" replace />)
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/signup"
          element={!isAuthenticated ? <SignUpPage /> : <Navigate to="/" replace />}
        />

        <Route
          path="/onboarding"
          element={
            isAuthenticated
              ? (!isOnboarded ? <Onboarding /> : <Navigate to="/" replace />)
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/chat"
          element={isAuthenticated ? <ChatPage /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/login"
          element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />}
        />

        <Route
          path="/notifications"
          element={isAuthenticated ? <NotificationPage /> : <Navigate to="/login" replace />}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App