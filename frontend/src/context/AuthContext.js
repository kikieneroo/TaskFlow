// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        // Read from localStorage on component mount
        const token = localStorage.getItem('authToken');
        const role = localStorage.getItem('userRole');

        if (token && role) {
            // Ideally, validate the token here
            setIsAuthenticated(true);
            setUserRole(role);
        }
    }, []);

    const login = (role, token) => {
        setIsAuthenticated(true);
        setUserRole(role);
        localStorage.setItem('authToken', token); // Store token
        localStorage.setItem('userRole', role);  // Store user role
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUserRole(null);
        localStorage.removeItem('authToken');  // Remove token
        localStorage.removeItem('userRole');   // Remove role
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => React.useContext(AuthContext);
