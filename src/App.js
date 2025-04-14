import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './services/api';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FolderView from './pages/FolderView';
import PhotoDetail from './pages/PhotoDetail';
import NotFound from './pages/NotFound';

// Define constants outside the component
const INACTIVE_TIMEOUT =  60 * 1000; // 5 minutes in milliseconds

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set up user activity timeout handler
  useEffect(() => {
    // Only set up inactivity monitoring when a user is logged in
    if (!user) {
      return;
    }

    let inactivityTimeout;

    const resetTimer = () => {
      // Clear any existing timeout
      if (inactivityTimeout) {
        clearTimeout(inactivityTimeout);
      }
      
      // Set new timeout
      inactivityTimeout = setTimeout(() => {
        console.log('User inactive for 5 minutes, logging out');
        authService.logout();
        setUser(null);
      }, INACTIVE_TIMEOUT);
    };

    // Initial timer setup
    resetTimer();
    
    // Setup event listeners for user activity
    const activityEvents = ['mousedown', 'keypress', 'scroll', 'touchstart'];
    
    const handleActivity = () => {
      resetTimer();
    };
    
    // Register activity event listeners
    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity);
    });
    
    // Cleanup function
    return () => {
      // Remove all event listeners
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      
      // Clear any existing timeout
      if (inactivityTimeout) {
        clearTimeout(inactivityTimeout);
      }
    };
  }, [user]); // Since INACTIVE_TIMEOUT is now defined outside, it's not needed in dependencies

  // Check for existing user session
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authService.getCurrentUser()
        .then(response => {
          if (response.data && response.data.length > 0) {
            setUser(response.data[0]);
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const PrivateRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" />;
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="app">
        <Navbar user={user} setUser={setUser} />
        <div className="container">
          <Routes>
            <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
            <Route 
              path="/" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/folder/:id" 
              element={
                <PrivateRoute>
                  <FolderView />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/photo/:id/:imageName" 
              element={
                <PrivateRoute>
                  <PhotoDetail />
                </PrivateRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
