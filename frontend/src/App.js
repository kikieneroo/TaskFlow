import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import Home from './pages/Home';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import TaskReport from './components/TaskReport';
import Leaderboard from './pages/Leaderboard';
import PointsHistory from './pages/PointsHistory';
//import Badges from './pages/Badges';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || null); // Manage access token

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setIsAuthenticated(false);
        setUserRole(null);
        setAccessToken(null);
    };

    useEffect(() => {
        if (accessToken) {
            setIsAuthenticated(true);  // User is authenticated
        }
    }, [accessToken]); // Re-run whenever accessToken changes
    
    return (
      <AuthProvider>
        <Router>
            <Navbar
                isAuthenticated={isAuthenticated}
                userRole={userRole}
                logout={logout}
            />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route
                    path="/login"
                    element={
                        <Login
                            setUserRole={setUserRole}   // Pass setUserRole to handle role after login
                            setIsAuthenticated={setIsAuthenticated} // Pass setIsAuthenticated to handle login state
                        />
                    }
                />
                <Route path="/register" element={<Register />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/user" element={<UserDashboard />} />
                <Route path="/admin/tasks" element={<TaskList />} />
                <Route path="/admin/users" element={<UserList />} />
                <Route path="/admin/add-user" element={<UserForm />} />
                <Route path="/admin/points-history" element={<PointsHistory  />} />
                <Route path="/admin/leaderboard" element={<Leaderboard />} />
                <Route path="/user/leaderboard" element={<Leaderboard />} />
                <Route path="/user/points-history" element={<PointsHistory  />} />
                <Route path="/task-report" element={<TaskReport />} />
                <Route
                    path="/admin/create-task"
                    element={<TaskForm accessToken={accessToken} />}  // Pass accessToken to TaskForm
                />
            </Routes>
        </Router>
      </AuthProvider>
    );
}

export default App;
